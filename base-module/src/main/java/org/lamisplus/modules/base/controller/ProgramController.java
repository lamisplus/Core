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
@Slf4j
@RequiredArgsConstructor
public class ProgramController {
    private final ProgramService programService;

    //Versioning through URI Path
    private final String BASE_URL_VERSION_ONE = "/api/v1/programs";

    @GetMapping(BASE_URL_VERSION_ONE)
    public ResponseEntity<List<Program>> getAllModulePrograms() {
        return ResponseEntity.ok(programService.getAllModulePrograms());
    }
}
