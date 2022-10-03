package org.lamisplus.modules.base.controller;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.domain.dto.ApplicationUserOrganisationUnitDTO;
import org.lamisplus.modules.base.domain.entities.ApplicationUserOrganisationUnit;
import org.lamisplus.modules.base.service.ApplicationUserOrganisationUnitService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@Slf4j
@RequiredArgsConstructor
public class ApplicationUserOrganisationUnitController {
    private final ApplicationUserOrganisationUnitService applicationUserOrganisationUnitService;
    private final String BASE_URL_VERSION_ONE = "/api/v1/application_user_organisation_unit";

    @GetMapping(BASE_URL_VERSION_ONE)
    @PreAuthorize("hasAnyAuthority('admin_write', 'admin_read', 'admin_delete','user', 'all_permission')")
    public ResponseEntity<List<ApplicationUserOrganisationUnit>> getAllApplicationUserOrganisationUnit() {
        return ResponseEntity.ok(applicationUserOrganisationUnitService.getAllApplicationUserOrganisationUnit());
    }

    @GetMapping(BASE_URL_VERSION_ONE + "/{id}")
    @PreAuthorize("hasAnyAuthority('admin_write', 'admin_read', 'admin_delete','user', 'all_permission')")
    public ResponseEntity<ApplicationUserOrganisationUnit> getApplicationUserOrganisationUnit(@PathVariable Long id) {
        return ResponseEntity.ok(applicationUserOrganisationUnitService.getApplicationUserOrganisationUnit(id));
    }

    @PostMapping(BASE_URL_VERSION_ONE)
    @PreAuthorize("hasAnyAuthority('admin_write', 'admin_read', 'admin_delete', 'all_permission')")
    public ResponseEntity<List<ApplicationUserOrganisationUnit>> save(@RequestBody Set<ApplicationUserOrganisationUnitDTO> applicationUserOrganisationUnitDTO) {
        return ResponseEntity.ok(applicationUserOrganisationUnitService.save(applicationUserOrganisationUnitDTO));
    }

    @PutMapping(BASE_URL_VERSION_ONE + "{id}")
    @PreAuthorize("hasAnyAuthority('admin_write', 'admin_read', 'admin_delete', 'all_permission')")
    public ResponseEntity<ApplicationUserOrganisationUnit> update(@PathVariable Long id, @RequestBody ApplicationUserOrganisationUnit applicationUserOrganisationUnit) {
        return ResponseEntity.ok(applicationUserOrganisationUnitService.update(id, applicationUserOrganisationUnit));
    }

    @DeleteMapping(BASE_URL_VERSION_ONE + "/{id}")
    @PreAuthorize("hasAnyAuthority('admin_write', 'admin_read', 'admin_delete', 'all_permission')")
    public void delete(@PathVariable Long id) {
        this.applicationUserOrganisationUnitService.delete(id);
    }
}
