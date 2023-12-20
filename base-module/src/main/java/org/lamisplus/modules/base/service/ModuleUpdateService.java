package org.lamisplus.modules.base.service;

import org.lamisplus.modules.base.domain.entities.Module;
import org.lamisplus.modules.base.module.ModuleResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ModuleUpdateService {
    List<Module> checkForUpdates();

}
