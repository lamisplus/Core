package org.lamisplus.modules.base.controller;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.domain.dto.ApplicationCodesetDTO;
import org.lamisplus.modules.base.domain.entities.ApplicationCodeSet;
import org.lamisplus.modules.base.service.ApplicationCodesetService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@Slf4j
@RequiredArgsConstructor
public class ApplicationCodeSetController {
    private final ApplicationCodesetService applicationCodesetService;

    //Versioning through URI Path
    private final String BASE_URL_VERSION_ONE = "/api/v1/application-codesets";

    @GetMapping(BASE_URL_VERSION_ONE +"/v2/{codesetGroup}")
    @PreAuthorize("hasAnyAuthority('admin_write', 'admin_read', 'admin_delete','user', 'all_permission')")
    public ResponseEntity<List<ApplicationCodesetDTO>> getApplicationCodeByCodeSetGroup(@PathVariable String codesetGroup) {
        return ResponseEntity.ok(this.applicationCodesetService.getApplicationCodeByCodesetGroup(codesetGroup));
    }

    @GetMapping(BASE_URL_VERSION_ONE+ "/v2")
    @PreAuthorize("hasAnyAuthority('admin_write', 'admin_read', 'admin_delete','user', 'all_permission')")
    public ResponseEntity<List<ApplicationCodesetDTO>> getAllApplicationCodesets() {
        return ResponseEntity.ok(this.applicationCodesetService.getAllApplicationCodeset());
    }

    @PostMapping(BASE_URL_VERSION_ONE+ "/v2")
    @PreAuthorize("hasAnyAuthority('admin_write', 'admin_read', 'admin_delete', 'all_permission')")
    public ResponseEntity<ApplicationCodeSet> save(@Valid @RequestBody ApplicationCodesetDTO applicationCodesetDTO) {
        return ResponseEntity.ok(applicationCodesetService.save(applicationCodesetDTO));

    }

    @PutMapping(BASE_URL_VERSION_ONE + "/v2/{id}")
    @PreAuthorize("hasAnyAuthority('admin_write', 'admin_read', 'admin_delete', 'all_permission')")
    public ResponseEntity<ApplicationCodeSet> update(@PathVariable Long id, @Valid @RequestBody ApplicationCodesetDTO applicationCodesetDTO) {
        return ResponseEntity.ok(applicationCodesetService.update(id, applicationCodesetDTO));

    }

    @DeleteMapping(BASE_URL_VERSION_ONE + "/v2/{id}")
    @PreAuthorize("hasAnyAuthority('admin_write', 'admin_read', 'admin_delete', 'all_permission')")
    public void delete(@PathVariable Long id) {
        this.applicationCodesetService.delete(id);
    }
}
