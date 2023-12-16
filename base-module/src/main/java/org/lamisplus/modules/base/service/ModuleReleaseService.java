package org.lamisplus.modules.base.service;

import org.lamisplus.modules.base.domain.dto.ModuleReleaseDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ModuleReleaseService {
    ModuleReleaseDto createModuleRelease(ModuleReleaseDto moduleReleaseDto);
    ModuleReleaseDto updateModuleRelease(Long id, ModuleReleaseDto moduleReleaseDto);
    ModuleReleaseDto getModuleRelease(Long id);
    List<ModuleReleaseDto> getLatestModuleReleases();

    List<ModuleReleaseDto> checkAndReturnUpdatedModuleReleases(List<ModuleReleaseDto> moduleReleaseDtos);

    String deleteModuleRelease(Long id);

}
