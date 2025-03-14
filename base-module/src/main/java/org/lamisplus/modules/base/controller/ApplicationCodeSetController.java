package org.lamisplus.modules.base.controller;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.domain.dto.ApplicationCodesetDTO;
import org.lamisplus.modules.base.domain.entities.ApplicationCodeSet;
import org.lamisplus.modules.base.service.ApplicationCodesetService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.IOException;
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
    public ResponseEntity<List<ApplicationCodeSet>> getApplicationCodeByCodeSetGroup(@PathVariable String codesetGroup) {
        return ResponseEntity.ok(this.applicationCodesetService.getApplicationCodeByCodeSetGroup(codesetGroup));
    }

    @GetMapping(BASE_URL_VERSION_ONE+ "/v2")
    @PreAuthorize("hasAnyAuthority('admin_write', 'admin_read', 'admin_delete','user', 'all_permission')")
    public ResponseEntity<List<ApplicationCodesetDTO>> getAllApplicationCodesets() {
        return ResponseEntity.ok(this.applicationCodesetService.getAllApplicationCodeset());
    }

    @GetMapping(BASE_URL_VERSION_ONE+ "/{code}")
    @PreAuthorize("hasAnyAuthority('admin_write', 'admin_read', 'admin_delete','user', 'all_permission')")
    public ResponseEntity<List<ApplicationCodesetDTO>> getAllApplicationCodeSets(@PathVariable String code) {
        return ResponseEntity.ok(this.applicationCodesetService.getAllApplicationCodeSets(code));
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

    @GetMapping(value = BASE_URL_VERSION_ONE + "/exportFile", produces = "application/json; charset=UTF-8")
    public void exportCodesetFile(HttpServletResponse response, @RequestParam("fileType") String fileType) throws IOException {
        response.addHeader("Content-Disposition", "attachment; filename=Application-Codeset." + fileType);
        if (fileType.equalsIgnoreCase("csv")) {
            response.setContentType("text/csv");
            response.setCharacterEncoding("UTF-8");
            applicationCodesetService.getApplicationCodeSetsAsCsv(response.getWriter());

        } else if (fileType.equalsIgnoreCase("json")) {
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.setHeader("Content-Type", "application/octet-stream");
            applicationCodesetService.getApplicationCodeSetsFile(response.getOutputStream(), fileType);

        }
    }

    @PostMapping(BASE_URL_VERSION_ONE + "/import")
    public ResponseEntity<String> uploadCodesetFile(@RequestParam("file") MultipartFile file,
                                                    @RequestParam(value = "fileType") String fileType) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Please select a file to upload.");
        }

        if (fileType == null || fileType.isEmpty()) {
            throw new IllegalArgumentException("Please select a file type to upload.");
        }

        try {
            List<ApplicationCodesetDTO> codesetDTOList = applicationCodesetService.readFileData(file, fileType);
            List<ApplicationCodesetDTO> savedCodesets = applicationCodesetService.saveCodesets(codesetDTOList);

            return new ResponseEntity<>("File uploaded and codesets saved successfully.", HttpStatus.OK);
        } catch (IOException e) {
            throw new RuntimeException("Error occurred while processing the file: " + e.getMessage());
        }
    }
}
