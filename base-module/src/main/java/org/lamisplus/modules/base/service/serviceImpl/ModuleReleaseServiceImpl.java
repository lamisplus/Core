package org.lamisplus.modules.base.service.serviceImpl;

import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.domain.dto.ModuleReleaseDto;
import org.lamisplus.modules.base.domain.entities.ModuleRelease;
import org.lamisplus.modules.base.domain.repositories.ModuleReleaseRepository;
import org.lamisplus.modules.base.service.ModuleReleaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
public class ModuleReleaseServiceImpl implements ModuleReleaseService {
    @Autowired
    private ModuleReleaseRepository moduleReleaseRepository;
    @Override
    public ModuleReleaseDto createModuleRelease(ModuleReleaseDto moduleReleaseDto) {
        LOG.info("Creating module release data");
        System.out.println("It is here");
        ModuleRelease moduleRelease = ModuleRelease.createFrom(moduleReleaseDto);
        ModuleRelease savedModuleRelease = moduleReleaseRepository.save(moduleRelease);

        return ModuleReleaseDto.createFrom(savedModuleRelease);
    }

    @Override
    public ModuleReleaseDto updateModuleRelease(Long id, ModuleReleaseDto moduleReleaseDto) {
        Optional<ModuleRelease> foundModuleRelease = moduleReleaseRepository.findById(id);
        if (!foundModuleRelease.isPresent()){
            throw new EntityNotFoundException(ModuleRelease.class, "ID:", ""+id);
        }
        ModuleRelease moduleRelease = foundModuleRelease.get();
        moduleRelease.setReleaseDate(moduleReleaseDto.getReleaseDate());
        moduleRelease.setReleaseNotes(moduleReleaseDto.getReleaseNotes());
        moduleRelease.setName(moduleReleaseDto.getName());
        moduleRelease.setCurrentVersion(moduleReleaseDto.getCurrentVersion());
        moduleRelease.setPreviousVersion(moduleReleaseDto.getPreviousVersion());

        ModuleRelease newSavedModuleRelease  = moduleReleaseRepository.save(moduleRelease);
        return ModuleReleaseDto.createFrom(newSavedModuleRelease);

    }

    @Override
    public ModuleReleaseDto getModuleRelease(Long id) {
        Optional<ModuleRelease> moduleRelease = moduleReleaseRepository.findById(id);
        if (!moduleRelease.isPresent()){
            throw new EntityNotFoundException(ModuleRelease.class, "ID:", ""+id);
        }
        return ModuleReleaseDto.createFrom(moduleRelease.get());
    }

    @Override
    public List<ModuleReleaseDto> getLatestModuleReleases() {
        return moduleReleaseRepository
                .getLatestModuleReleases()
                .stream().map(ModuleReleaseDto::createFrom)
                .collect(Collectors.toList());
    }

    @Override
    public List<ModuleReleaseDto> checkAndReturnUpdatedModuleReleases(List<ModuleReleaseDto> moduleReleaseDtos) {
        List<ModuleReleaseDto> toBeUpdated = new ArrayList<>();
        List<ModuleRelease> latest = moduleReleaseRepository.getLatestModuleReleases();
        Map<String, String> clientModulesMapped = moduleReleaseDtos
                .stream()
                .collect(Collectors.toMap(ModuleReleaseDto::getName, ModuleReleaseDto::getCurrentVersion));

        for (ModuleRelease item : latest) {
            // if found in the map, check before you add to list as a recommended update,
            // if not found in the client request map, add to the list as a recommended update
            if(clientModulesMapped.get(item.getName()) != null) {
                System.out.println(item);
                System.out.println(clientModulesMapped.get(item.getName()));
                int serverModuleVersion = Integer.parseInt(item.getCurrentVersion()
                        .replaceAll("\\.", "").substring(0,3));
                int clientModuleVersion = Integer.parseInt(clientModulesMapped.get(item.getName())
                        .replaceAll("\\.", "").substring(0,3));

                if(clientModuleVersion < serverModuleVersion) {
                    toBeUpdated.add(ModuleReleaseDto.createFrom(item));
                }
            } else {
                toBeUpdated.add(ModuleReleaseDto.createFrom(item));
            }
        }
        return toBeUpdated;
    }

    @Override
    public String deleteModuleRelease(Long id) {
        boolean exists = moduleReleaseRepository.existsById(id);
        if (!exists) {
            throw new EntityNotFoundException(ModuleRelease.class, "ID:", "" + id);
        }
        moduleReleaseRepository.deleteById(id);
        return "Deleted Successfully";
    }
}
