package org.lamisplus.modules.base.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.domain.dto.StandardCodesetDTO;
import org.lamisplus.modules.base.domain.entities.StandardCodeset;
import org.lamisplus.modules.base.service.StandardCodesetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
@RequiredArgsConstructor
public class StandardCodesetController {
    private final StandardCodesetService standardCodesetService;
    //Versioning through URI Path
    private final String BASE_URL_VERSION_ONE = "/api/v1/standard-codesets";

    @GetMapping(BASE_URL_VERSION_ONE)
    public ResponseEntity<List<StandardCodesetDTO>> getAllStandardCodeset() {
        return ResponseEntity.ok(this.standardCodesetService.getAllStandardCodeset());
    }

    @GetMapping(BASE_URL_VERSION_ONE + "/standard-codeset-source/{id}")
    public ResponseEntity<List<StandardCodesetDTO>> getAllStandardCodesetByStandardCodesetSourceId(@PathVariable Long id) {
        return ResponseEntity.ok(standardCodesetService.getAllStandardCodesetByStandardCodesetSourceId(id));
    }

    @GetMapping(BASE_URL_VERSION_ONE + "/{id}")
    public ResponseEntity<StandardCodesetDTO> getStandardCodesetById(@PathVariable Long id) {
        return ResponseEntity.ok(standardCodesetService.getStandardCodesetById(id));
    }

    @GetMapping(BASE_URL_VERSION_ONE + "/code/{code}")
    public ResponseEntity<StandardCodesetDTO> getStandardCodesetByCode(@PathVariable String code) {
        return ResponseEntity.ok(standardCodesetService.getStandardCodesetByCode(code));
    }

    @GetMapping(BASE_URL_VERSION_ONE + "/application-codeset/{id}")
    public ResponseEntity<StandardCodesetDTO> getStandardCodesetByApplicationCodesetId(@PathVariable Long id) {
        return ResponseEntity.ok(standardCodesetService.getStandardCodesetByApplicationCodesetId(id));
    }

    @PostMapping(BASE_URL_VERSION_ONE)
    public ResponseEntity<StandardCodeset> save(@RequestBody StandardCodesetDTO standardCodesetDTO) {
        return ResponseEntity.ok(standardCodesetService.save(standardCodesetDTO));
    }

    @PutMapping(BASE_URL_VERSION_ONE + "/{id}")
    public ResponseEntity<StandardCodeset> update(@PathVariable Long id, @RequestBody StandardCodesetDTO standardCodesetDTO) {
        return ResponseEntity.ok(this.standardCodesetService.update(id, standardCodesetDTO));
    }

    @DeleteMapping(BASE_URL_VERSION_ONE + "/{id}")
    public ResponseEntity<Integer> delete(@PathVariable Long id) {
        return ResponseEntity.ok(this.standardCodesetService.delete(id));
    }
}
