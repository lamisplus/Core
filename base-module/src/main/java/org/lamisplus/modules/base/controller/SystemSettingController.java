package org.lamisplus.modules.base.controller;


import lombok.RequiredArgsConstructor;
import org.lamisplus.modules.base.domain.entities.SystemSettings;
import org.lamisplus.modules.base.service.SystemSettingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/system-settings")
public class SystemSettingController {

    private final SystemSettingService systemSettingService;

    @GetMapping("/{key}")
    public ResponseEntity<SystemSettings> getSystemSetting(@PathVariable String key) {
        return ResponseEntity.ok(systemSettingService.getSystemSetting(key));
    }

    @GetMapping
    public ResponseEntity<List<SystemSettings>> getAllSystemSettings() {
        return ResponseEntity.ok(systemSettingService.getAllSystemSettings());
    }

    @PutMapping("/{key}")
    public ResponseEntity<SystemSettings> updateSystemSetting(@PathVariable String key, @RequestBody SystemSettings request) {
        return ResponseEntity.ok(systemSettingService.updateSystemSetting(key, request));
    }

    @GetMapping("/export-csv")
    public void downloadCSV(HttpServletResponse response) throws IOException {
        response.setContentType("text/csv");
        response.addHeader("Content-Disposition", "attachment; filename=\"system_settings.csv\"");
        systemSettingService.exportSystemSettingAsCSV(response.getWriter());
    }

    @PostMapping("/import-csv")
    public ResponseEntity<Object> importCSV(@RequestParam("file") MultipartFile file) throws IOException {
        Object response = systemSettingService.importSystemSettingAsCSV(file);
        return ResponseEntity.ok(response);
    }

}
