package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import org.lamisplus.modules.base.domain.repositories.RoleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RolePermissionCacheService {

    private static final Logger log = LoggerFactory.getLogger(RolePermissionCacheService.class);

    private final RoleRepository roleRepository;

    /**
     * In-memory cache: roleName -> Set<permissionName>.
     *
     * ConcurrentHashMap is thread-safe and requires zero Spring cache configuration.
     * This works on every database and every deployment without any config changes.
     *
     * On a cache hit (every request after the first): ZERO DB queries.
     * On a cache miss (first request per role after startup or after eviction):
     * ONE DB query via @EntityGraph on RoleRepository.findByName().
     */
    private final ConcurrentHashMap<String, Set<String>> permissionCache = new ConcurrentHashMap<>();

    @Transactional(readOnly = true)
    public Set<String> getPermissionsForRole(String roleName) {
        return permissionCache.computeIfAbsent(roleName, this::loadFromDb);
    }

    private Set<String> loadFromDb(String roleName) {
        log.info("[CACHE MISS] Loading permissions from DB for role '{}'", roleName);
        return roleRepository.findByName(roleName)
                .map(role -> role.getPermission().stream()
                        .map(p -> p.getName())
                        .collect(Collectors.toSet()))
                .orElse(Collections.emptySet());
    }

    /**
     * Clears the entire cache.
     * Must be called after any change to role permissions so that the next
     * getAuthentication() call re-loads the updated permissions from the DB.
     */
    public void evictAll() {
        permissionCache.clear();
        log.info("[CACHE EVICT] All role_permissions cache entries cleared");
    }
}
