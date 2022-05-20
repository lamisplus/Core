package org.lamisplus.modules.base.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.domain.entities.Program;
import org.lamisplus.modules.base.service.ProgramService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/program")
@Slf4j
@RequiredArgsConstructor
public class ProgramController {
    private final ProgramService programService;

    @GetMapping
    public ResponseEntity<List<Program>> getAllModulePrograms() {
        return ResponseEntity.ok(programService.getAllModulePrograms());
    }
}
