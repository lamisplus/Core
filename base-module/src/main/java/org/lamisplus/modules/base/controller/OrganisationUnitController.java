package org.lamisplus.modules.base.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.domain.dto.OrganisationUnitDTO;
import org.lamisplus.modules.base.domain.entities.OrganisationUnit;
import org.lamisplus.modules.base.service.OrganisationUnitService;
import org.lamisplus.modules.base.util.PaginationUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.util.List;

@RestController
@Slf4j
@RequiredArgsConstructor
public class OrganisationUnitController {

    private final OrganisationUnitService organisationUnitService;

    //Versioning through URI Path
    private final String BASE_URL_VERSION_ONE = "/api/v1/organisation-units";

    @PostMapping(BASE_URL_VERSION_ONE + "/v2")
    @PreAuthorize("hasAnyAuthority('admin_write', 'admin_read', 'admin_delete', 'all_permission')")
    public ResponseEntity<List<OrganisationUnit>> save(@RequestParam Long parentOrganisationUnitId, @RequestParam Long organisationUnitLevelId,
                                                       @Valid @RequestBody List<OrganisationUnitDTO> organisationUnitDTOS) {
        return ResponseEntity.ok(organisationUnitService.save(parentOrganisationUnitId, organisationUnitLevelId, organisationUnitDTOS));
    }

    @PutMapping(BASE_URL_VERSION_ONE + "/v2/{id}")
    @PreAuthorize("hasAnyAuthority('admin_write', 'admin_read', 'admin_delete', 'all_permission')")
    public ResponseEntity<OrganisationUnit> update(@PathVariable Long id, @RequestBody OrganisationUnitDTO organisationUnitDTO) {
        return ResponseEntity.ok(organisationUnitService.update(id, organisationUnitDTO));
    }

    @GetMapping(BASE_URL_VERSION_ONE + "/v2/{id}")
    @PreAuthorize("hasAnyAuthority('admin_write', 'admin_read', 'admin_delete','user', 'all_permission')")
    public ResponseEntity<OrganisationUnit> getOrganizationUnit(@PathVariable Long id) {
        return ResponseEntity.ok(organisationUnitService.getOrganizationUnit(id));
    }

    @GetMapping(BASE_URL_VERSION_ONE + "/v2")
    @PreAuthorize("hasAnyAuthority('admin_write', 'admin_read', 'admin_delete','user', 'all_permission')")
    public ResponseEntity<List<OrganisationUnit>> getAllOrganizationUnit(@PageableDefault(value = 100) Pageable pageable) {

        Page page = organisationUnitService.getAllOrganizationUnit(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return new ResponseEntity<>(organisationUnitService.getAllOrganizationUnit(page), headers, HttpStatus.OK);
    }

    @GetMapping (BASE_URL_VERSION_ONE + "/parent-organisation-units/{id}")
    @PreAuthorize("hasAnyAuthority('admin_write', 'admin_read', 'admin_delete','user', 'all_permission')")
    public  ResponseEntity<List<OrganisationUnit>>  getOrganisationUnitByParentOrganisationUnitId(@PathVariable Long id) {
        return ResponseEntity.ok(this.organisationUnitService.getOrganisationUnitByParentOrganisationUnitId(id));
    }

//    @GetMapping (BASE_URL_VERSION_ONE + "/parent-organisation-units-assigned/{id}")
//    @PreAuthorize("hasAnyAuthority('admin_write', 'admin_read', 'admin_delete','user', 'all_permission')")
//    public  ResponseEntity<List<OrganisationUnit>>  getOrganisationUnitByParentOrganisationUnitIdAssigned(@PathVariable Long id) {
//        return ResponseEntity.ok(this.organisationUnitService.getOrganisationUnitByParentOrganisationUnitIdAssigned(id));
//    }

    /*@GetMapping ("/parent-organisation-units/{id}/organisation-units-level/{lid}")
    public  ResponseEntity<List<OrganisationUnit>>  getOrganisationUnitByParentOrganisationUnitIdAndOrganisationUnitLevelId(
            @PathVariable Long id, @PathVariable Long lid) {
        return ResponseEntity.ok(this.organisationUnitService.getOrganisationUnitByParentOrganisationUnitIdAndOrganisationUnitLevelId(id, lid));
    }*/

    @GetMapping (BASE_URL_VERSION_ONE + "/parent-organisation-units/{id}/organisation-units-level/{lid}/hierarchy")
    @PreAuthorize("hasAnyAuthority('admin_write', 'admin_read', 'admin_delete','user', 'all_permission')")
    public  ResponseEntity<List<OrganisationUnitDTO>>  getOrganisationUnitSubsetByParentOrganisationUnitIdAndOrganisationUnitLevelId(
            @PathVariable Long id, @PathVariable Long lid) {
        return ResponseEntity.ok(this.organisationUnitService.
                getOrganisationUnitSubsetByParentOrganisationUnitIdAndOrganisationUnitLevelId(id, lid));
    }

    @DeleteMapping(BASE_URL_VERSION_ONE + "/{id}")
    @PreAuthorize("hasAnyAuthority('admin_write', 'admin_read', 'admin_delete', 'all_permission')")
    public ResponseEntity<Integer> delete(@PathVariable Long id) {
        return ResponseEntity.ok(organisationUnitService.delete(id));
    }

    /*//For updating organisation unit from excel
    @GetMapping ("/organisation-unit-levels/test")
    public  ResponseEntity<List>  getAll() {
        return ResponseEntity.ok(this.organisationUnitService.getAll());
    }*/
}
