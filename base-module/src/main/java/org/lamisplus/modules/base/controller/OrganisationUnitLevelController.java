package org.lamisplus.modules.base.controller;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.domain.dto.OrganisationUnitLevelDTO;
import org.lamisplus.modules.base.domain.entities.OrganisationUnit;
import org.lamisplus.modules.base.service.OrganisationUnitLevelService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@Slf4j
@RequiredArgsConstructor
public class OrganisationUnitLevelController {
    private final OrganisationUnitLevelService organisationUnitLevelService;

    //Versioning through URI Path
    private final String BASE_URL_VERSION_ONE = "/api/v1/organisation-unit-levels";

    @PostMapping(BASE_URL_VERSION_ONE + "/v2")
    @PreAuthorize("hasAnyAuthority('admin_write', 'admin_read', 'admin_delete', 'all_permission')")
    public ResponseEntity<OrganisationUnitLevelDTO> save(@Valid @RequestBody OrganisationUnitLevelDTO organisationUnitLevelDTO) {
        return ResponseEntity.ok(organisationUnitLevelService.save(organisationUnitLevelDTO));
    }

    @PutMapping(BASE_URL_VERSION_ONE + "/v2/{id}")
    @PreAuthorize("hasAnyAuthority('admin_write', 'admin_read', 'admin_delete', 'all_permission')")
    public ResponseEntity<OrganisationUnitLevelDTO> update(@PathVariable Long id, @Valid @RequestBody OrganisationUnitLevelDTO organisationUnitLevelDTO){
        return ResponseEntity.ok(organisationUnitLevelService.update(id, organisationUnitLevelDTO));
    }

    @GetMapping(BASE_URL_VERSION_ONE + "/v2")
    @PreAuthorize("hasAnyAuthority('admin_write', 'admin_read', 'admin_delete','user', 'all_permission')")
    public ResponseEntity<List<OrganisationUnitLevelDTO>> getAllOrganizationUnitLevel(@RequestParam(required = false, defaultValue = "2") Integer status) {
        return ResponseEntity.ok(organisationUnitLevelService.getAllOrganizationUnitLevel(status));
    }

    @GetMapping(BASE_URL_VERSION_ONE + "/v2/{id}/organisation-units")
    @PreAuthorize("hasAnyAuthority('admin_write', 'admin_read', 'admin_delete','user', 'all_permission')")
    public ResponseEntity<List<OrganisationUnit>> getAllOrganisationUnitsByOrganizationUnitLevel(@PathVariable Long id) {
        return ResponseEntity.ok(organisationUnitLevelService.getAllOrganisationUnitsByOrganizationUnitLevel(id));
    }

    @GetMapping(BASE_URL_VERSION_ONE + "/v2/parent-organisation-unit-level/{id}/organisation-units")
    @PreAuthorize("hasAnyAuthority('admin_write', 'admin_read', 'admin_delete','user', 'all_permission')")
    public ResponseEntity<List<OrganisationUnit>> getAllParentOrganisationUnitsByOrganizationUnitLevel(@PathVariable Long id) {
        return ResponseEntity.ok(organisationUnitLevelService.getAllParentOrganisationUnitsByOrganizationUnitLevel(id));
    }


    @GetMapping(BASE_URL_VERSION_ONE + "/v2/{id}")
    @PreAuthorize("hasAnyAuthority('admin_write', 'admin_read', 'admin_delete','user', 'all_permission')")
    public ResponseEntity<OrganisationUnitLevelDTO> getOrganizationUnitLevel(@PathVariable Long id) {
        return ResponseEntity.ok(organisationUnitLevelService.getOrganizationUnitLevel(id));
    }

    /*@DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void delete(@PathVariable Long id) {
        organisationUnitLevelService.delete(id);
    }*/
}
