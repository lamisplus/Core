package org.lamisplus.modules.base.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.domain.dto.StandardCodesetSourceDTO;
import org.lamisplus.modules.base.domain.entities.StandardCodesetSource;
import org.lamisplus.modules.base.service.StandardCodesetSourceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
@RequiredArgsConstructor
public class StandardCodesetSourceController {
    private final StandardCodesetSourceService standardCodesetSourceService;

    //Versioning through URI Path
    private final String BASE_URL_VERSION_ONE = "/api/v1/standard-codeset-sources";

    @GetMapping(BASE_URL_VERSION_ONE)
    public ResponseEntity<List<StandardCodesetSourceDTO>> getAllStandardCodesetSource() {
        return ResponseEntity.ok(standardCodesetSourceService.getAllStandardCodesetSource());
    }

    @GetMapping(BASE_URL_VERSION_ONE + "/{id}")
    public ResponseEntity<StandardCodesetSourceDTO> getStandardCodesetSourceById(@PathVariable Long id) {
        return ResponseEntity.ok(standardCodesetSourceService.getStandardCodesetSourceById(id));
    }

    @PostMapping(BASE_URL_VERSION_ONE)
    public ResponseEntity<StandardCodesetSource> save(@RequestBody StandardCodesetSourceDTO standardCodesetSourceDTO) {
        return ResponseEntity.ok(standardCodesetSourceService.save(standardCodesetSourceDTO));
    }

    @PutMapping(BASE_URL_VERSION_ONE + "/{id}")
    public ResponseEntity<StandardCodesetSource> update(@PathVariable Long id, @RequestBody StandardCodesetSourceDTO standardCodesetSourceDTO) {
        return ResponseEntity.ok(standardCodesetSourceService.update(id, standardCodesetSourceDTO));
    }

    @DeleteMapping(BASE_URL_VERSION_ONE + "/{id}")
    public ResponseEntity<Integer> delete(@PathVariable Long id) {
        return ResponseEntity.ok(standardCodesetSourceService.delete(id));
    }
}
