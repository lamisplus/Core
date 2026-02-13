package org.lamisplus.modules.base.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.service.RolePermissionCacheService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.*;
import java.util.stream.Collectors;

@Component
@Slf4j
public class TokenProvider {

    private final Logger log = LoggerFactory.getLogger(TokenProvider.class);

    private static final String AUTHORITIES_KEY = "auth";
    private static final String DEFAULT_USER_AUTHORITY = "user";

    @Value("${jwt.base64-secret}")
    private String secret;

    @Value("${jwt.token-validity-in-milli-seconds}")
    private long tokenValidityInMilliseconds;

    @Value("${jwt.token-validity-in-milli-seconds-for-remember-me}")
    private long tokenValidityInMillisecondsForRememberMe;

    /**
     * Injected lazily to avoid circular-dependency issues during startup.
     * TokenProvider is used by security filters (very early in the chain);
     * RolePermissionCacheService depends only on RoleRepository, so there is
     * no real cycle — but lazy injection keeps the startup order clean.
     */
    @Autowired
    private RolePermissionCacheService rolePermissionCacheService;

    /**
     * Creates a signed JWT that stores the user's ROLE NAMES in the "auth" claim.
     *
     * Role names are short (e.g. "Super Admin,RDE") — small token, minimal bandwidth,
     * and no internal permission names are exposed to clients.
     *
     * Permissions are resolved server-side on each request via a cache
     * (see getAuthentication()). No DB call is made here beyond what Spring Security
     * already did in UserDetailService.loadUserByUsername() to authenticate the user.
     *
     * The principal in the Authentication object is a UserPrincipal, which already
     * holds the user's roles in memory from the login query — so getRoleNames() is free.
     */
    public String createToken(Authentication authentication, boolean rememberMe) {
        // UserPrincipal.getAuthorities() now returns ROLE NAMES (e.g. "Super Admin", "RDE").
        // No instanceof check needed — role names are always in getAuthorities().
        String roleNames = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));
        if (roleNames.isEmpty()) {
            roleNames = DEFAULT_USER_AUTHORITY;
        }

        // Include the user's display name if the principal exposes it.
        // UserPrincipal.getFullName() is safe — roles and names are loaded by the
        // JPQL query in UserDetailService.loadUserByUsername() before this point.
        String fullName = "";
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserPrincipal) {
            fullName = ((UserPrincipal) principal).getFullName();
        }

        JwtBuilder builder = Jwts.builder()
                .setSubject(authentication.getName())
                .claim(AUTHORITIES_KEY, roleNames)
                .signWith(this.getSigningKey(), SignatureAlgorithm.HS512)
                .setExpiration(this.setExpirationDate(rememberMe));

        if (!fullName.isEmpty()) {
            builder.claim("name", fullName);
        }

        return builder.compact();
    }

    /**
     * Converts a validated JWT token into a Spring Security Authentication object.
     *
     * The "auth" claim contains ROLE NAMES (small, no sensitive exposure).
     * Permissions are looked up per-role from RolePermissionCacheService.
     *
     * On a cache hit (every request after the first per role): ZERO DB queries.
     * On a cache miss (first request after startup or after a role update): ONE
     * DB query per unique role name, loaded with a single SELECT + JOIN via
     * @EntityGraph on RoleRepository.findByName().
     */
    public Authentication getAuthentication(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(this.getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        // Read role names from the token (small, tamper-proof — signed with HS512)
        String roleNamesStr = claims.get(AUTHORITIES_KEY, String.class);

        // Resolve permissions for each role through the cache
        Collection<? extends GrantedAuthority> authorities = Arrays
                .stream(roleNamesStr.split(","))
                .map(String::trim)
                .filter(r -> !r.isEmpty())
                .flatMap(roleName -> rolePermissionCacheService.getPermissionsForRole(roleName).stream())
                .distinct()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());

        // Fallback: if no permissions resolved, grant the base "user" authority
        if (authorities.isEmpty()) {
            authorities = Collections.singletonList(new SimpleGrantedAuthority(DEFAULT_USER_AUTHORITY));
        }

        User principal = new User(claims.getSubject(), "", authorities);
        return new UsernamePasswordAuthenticationToken(principal, token, authorities);
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(this.getSigningKey()).build().parseClaimsJws(authToken);
            return true;
        } catch (MalformedJwtException e) {
            log.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            log.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.error("JWT claims string is empty: {}", e.getMessage());
        }
        return false;
    }

    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(this.secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private Date setExpirationDate(Boolean rememberMe) {
        long now = (new Date()).getTime();
        if (rememberMe) {
            return new Date(now + this.tokenValidityInMillisecondsForRememberMe);
        }
        return new Date(now + this.tokenValidityInMilliseconds);
    }
}
