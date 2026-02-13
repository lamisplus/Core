package org.lamisplus.modules.base.security;

import org.lamisplus.modules.base.domain.entities.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

public class UserPrincipal implements UserDetails {

    private final User user;
    private final Collection<? extends GrantedAuthority> authorities;

    public UserPrincipal(User user) {
        this.user = user;
        // Store ROLE NAMES as the Spring Security authorities.
        // Permission resolution happens server-side via RolePermissionCacheService
        // on every authenticated API request — not here at login time.
        // This keeps the JWT auth claim small ("Super Admin,RDE") and free of
        // internal permission names.
        String[] roleNames = user.getRole().stream()
                .map(role -> role.getName())
                .toArray(String[]::new);
        this.authorities = AuthorityUtils.createAuthorityList(roleNames);
    }

    public User getUser() {
        return user;
    }

    /** Role names already in memory — no DB call needed. */
    public List<String> getRoleNames() {
        return user.getRole().stream()
                .map(role -> role.getName())
                .collect(Collectors.toList());
    }

    public String getFullName() {
        return user.getFirstName() + " " + user.getLastName();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getUserName();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
