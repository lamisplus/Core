package org.lamisplus.modules.base.domain.entities;

import lombok.*;
import org.lamisplus.modules.base.domain.dto.ModuleReleaseDto;
import org.springframework.data.domain.Persistable;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.LocalDate;

@EqualsAndHashCode(callSuper = true)
@Data
@Builder
@Table(name = "module_releases", uniqueConstraints = {
        @UniqueConstraint(name = "unique_name_and_version_constraint", columnNames = {"name", "current_version"})})
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class ModuleRelease extends BaseEntity {
    //    @Id
    //    @GeneratedValue(strategy = GenerationType.IDENTITY)
    //    private Long id;

    @NotNull
    private String name;

    @NotNull
    @Column(name = "current_version")
    private String currentVersion;

    @Column(name = "previous_version")
    private String previousVersion;

    @Column(name = "release_notes")
    private String releaseNotes;
    @Column(name = "url")
    private String url;

    @NotNull
    @Column(name = "release_date")
    private LocalDate releaseDate;

    public static ModuleRelease createFrom (ModuleReleaseDto moduleReleaseDto) {
        return ModuleRelease.builder()
                .name(moduleReleaseDto.getName())
                .currentVersion(moduleReleaseDto.getCurrentVersion())
                .previousVersion(moduleReleaseDto.getPreviousVersion())
                .url(moduleReleaseDto.getUrl())
                .releaseNotes(moduleReleaseDto.getReleaseNotes())
                .releaseDate(moduleReleaseDto.getReleaseDate())
                .build();
    }

}
