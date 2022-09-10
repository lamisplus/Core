package org.lamisplus.modules.base.controller;

import lombok.RequiredArgsConstructor;
import org.lamisplus.modules.base.domain.entities.Permission;
import org.lamisplus.modules.base.domain.repositories.PermissionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class PermissionController {
    private final PermissionRepository permissionRepository;

    //Versioning through URI Path
    private final String BASE_URL_VERSION_ONE = "/api/v1/permissions";

    @GetMapping(BASE_URL_VERSION_ONE)
    @PreAuthorize("hasAnyAuthority('admin_write', 'admin_read', 'admin_delete', 'all_permission')")
    public ResponseEntity<List<Permission>> getAll() {
        return ResponseEntity.ok(this.permissionRepository.findAllByArchived(0));
    }


    @PostMapping(BASE_URL_VERSION_ONE)
    @PreAuthorize("hasAnyAuthority('admin_write', 'admin_read', 'admin_delete', 'all_permission')")
    public ResponseEntity<List<Permission>> save(@RequestBody List<Permission> permissions) {
        return ResponseEntity.ok(this.permissionRepository.saveAll(permissions));
    }
}
