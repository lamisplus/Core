package org.lamisplus.modules.base.domain.dto;

import lombok.Builder;
import lombok.Data;
import org.lamisplus.modules.base.domain.entities.ModuleRelease;

import java.time.LocalDate;

@Data
@Builder
public class ModuleReleaseDto {
    private Long id;

    private String name;

    private String currentVersion;

    private String previousVersion;

    private String releaseNotes;

    private String url;

    private LocalDate releaseDate;

    public static ModuleReleaseDto createFrom (ModuleRelease moduleRelease){
        return ModuleReleaseDto.builder()
                .id(moduleRelease.getId())
                .name(moduleRelease.getName())
                .url(moduleRelease.getUrl())
                .currentVersion(moduleRelease.getCurrentVersion())
                .previousVersion(moduleRelease.getPreviousVersion())
                .releaseNotes(moduleRelease.getReleaseNotes())
                .releaseDate(moduleRelease.getReleaseDate())
                .build();
    }
}
