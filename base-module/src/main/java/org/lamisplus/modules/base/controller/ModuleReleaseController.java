package org.lamisplus.modules.base.controller;

import lombok.RequiredArgsConstructor;
import org.lamisplus.modules.base.domain.entities.Module;
import org.lamisplus.modules.base.service.ModuleUpdateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ModuleReleaseController {
    private final ModuleUpdateService moduleUpdateService;
    private final String BASE_MODULE_RELEASE_URL = "/api/v1/module-releases";
//    @PostMapping(BASE_MODULE_RELEASE_URL)
//    public ResponseEntity<List<Module>> createModuleRelease() {
//        return ResponseEntity.ok(moduleUpdateService.checkForUpdates());
//    }
}
