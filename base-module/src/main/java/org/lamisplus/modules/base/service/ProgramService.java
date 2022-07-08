package org.lamisplus.modules.base.service;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.domain.entities.Program;
import org.lamisplus.modules.base.domain.repositories.ProgramRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class ProgramService {
    private final ProgramRepository programRepository;

    public List<Program> getAllModulePrograms() {
        return programRepository.findAll();
    }
}
