package org.lamisplus.modules.base.controller;

import org.lamisplus.modules.base.domain.dto.ModuleReleaseDto;
import org.lamisplus.modules.base.service.ModuleReleaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ModuleReleaseController {
    @Autowired
    private ModuleReleaseService moduleReleaseService;
    private final String BASE_MODULE_RELEASE_URL = "/api/v1/module-releases";
    @PostMapping(BASE_MODULE_RELEASE_URL)
    public ResponseEntity<ModuleReleaseDto> createModuleRelease(
            @RequestBody ModuleReleaseDto moduleReleaseDto) {
        return ResponseEntity.ok(moduleReleaseService.createModuleRelease(moduleReleaseDto));
    }

    @PostMapping(BASE_MODULE_RELEASE_URL+ "/check-updates")
    public ResponseEntity<List<ModuleReleaseDto>> checkForUpdates (
            @RequestBody List<ModuleReleaseDto> moduleReleaseDtos) {
        return ResponseEntity.ok(moduleReleaseService
                .checkAndReturnUpdatedModuleReleases(moduleReleaseDtos));
    }

    @GetMapping(BASE_MODULE_RELEASE_URL)
    public ResponseEntity<List<ModuleReleaseDto>> getLatestModuleReleases() {
        return ResponseEntity.ok(moduleReleaseService.getLatestModuleReleases());
    }

    @PutMapping(BASE_MODULE_RELEASE_URL + "/{id}")
    public ResponseEntity<ModuleReleaseDto> updateModuleRelease(
            @PathVariable Long id,
            @RequestBody ModuleReleaseDto moduleReleaseDto){
        return ResponseEntity.ok(
                moduleReleaseService.updateModuleRelease(id, moduleReleaseDto));
    }
    @DeleteMapping(BASE_MODULE_RELEASE_URL + "/{id}")
    public ResponseEntity<String> deleteModuleRelease(
            @PathVariable Long id){
        return ResponseEntity.ok(
                moduleReleaseService.deleteModuleRelease(id));
    }

}
