package org.lamisplus.modules.base.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.lamisplus.modules.base.domain.entities.Permission;
import org.lamisplus.modules.base.domain.entities.Role;
import org.lamisplus.modules.base.domain.repositories.RoleRepository;
import org.lamisplus.modules.base.domain.repositories.UserRepository;
import org.lamisplus.modules.base.service.UserService;
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
import java.util.stream.Stream;

@Component
@Slf4j
public class TokenProvider {
    private final Logger log = LoggerFactory.getLogger(TokenProvider.class);
    private static final String AUTHORITIES_KEY = "auth";

    @Autowired
    private RoleRepository roleRepository;

    @Value("${jwt.base64-secret}")
    private String secret;

    @Value("${jwt.token-validity-in-milli-seconds}")
    private long tokenValidityInMilliseconds;

    @Value("${jwt.token-validity-in-milli-seconds-for-remember-me}")
    private long tokenValidityInMillisecondsForRememberMe;

    @Autowired
    UserRepository userRepository;


    public String createToken(Authentication authentication, UserService userService, boolean rememberMe) {
        //String authorities = authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.joining(","));

        long now = (new Date()).getTime();
        Date validity;
        if (rememberMe) {
            validity = new Date(now + this.tokenValidityInMillisecondsForRememberMe);
        } else {
            validity = new Date(now + this.tokenValidityInMilliseconds);
        }
        org.lamisplus.modules.base.domain.entities.User user = userService.getUserWithRoles().get();
        //getting & adding user details to token
        String name = user.getFirstName() + " " +
                userService.getUserWithRoles().get().getLastName();

        String authorities = user.getRole().stream().map(Role::getName).collect(Collectors.joining(","));

        return Jwts
                .builder()
                .setSubject(authentication.getName())
                .claim(AUTHORITIES_KEY, authorities)
                .claim("name", name)
                //.claim("role", role)
                .signWith(this.getSigningKey(), SignatureAlgorithm.HS512)
                .setExpiration(validity)
                .compact();
    }

    public Authentication getAuthentication(String token) {
        Claims claims = Jwts.parserBuilder().setSigningKey(this.getSigningKey()).build().parseClaimsJws(token).getBody();

        //Get all user roles
        List<Role> roles = roleRepository.findAllInRolesNames(Arrays.stream(claims.get(AUTHORITIES_KEY)
                        .toString().split(","))
                        .collect(Collectors.toSet()));
        String permits="";
        //Get all user permissions
        for (Role role : roles) {
            if(!StringUtils.isEmpty(permits)) {
                permits = permits +",";
            } else {
                permits = permits + role.getPermission().stream().map(Permission::getName).collect(Collectors.joining(","));
            }
        }
        //check if no permission then it must be an ordinary user so assign the role as user authority
        if(StringUtils.isEmpty(permits))permits = claims.get(AUTHORITIES_KEY).toString();
        //LOG.info("permits {}", permits);
        Collection<? extends GrantedAuthority> authorities = Arrays
                .stream(permits.split(","))
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
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
}
