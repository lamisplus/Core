package org.lamisplus.modules.base.domain.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.lamisplus.modules.base.domain.dto.ApplicationCodesetDTO;

import javax.persistence.*;

@Entity
@Getter
@Setter
@EqualsAndHashCode
@RequiredArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@Table(name = "base_application_codeset")
public class ApplicationCodeSet extends Audit<String> {
    @Id
    @Column(name = "id", updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Basic
    @Column(name = "codeset_group")
    private String codesetGroup;

    @Basic
    @Column(name = "language")
    private String language;

    @Basic
    @Column(name = "display")
    private String display;

    @Basic
    @Column(name = "description")
    private String description;

    @Basic
    @Column(name = "version")
    private String version="1.0";

    @Basic
    @Column(name = "code", updatable = false)
    private String code;

    @Basic
    @Column(name = "archived") //1 is archived, 0 is unarchived, 2 is deactivate
    private Integer archived=0;

    @Basic
    @Column(name = "alt_code")
    private String altCode;

    public static ApplicationCodeSet fromDto(ApplicationCodesetDTO dto) {
        return ApplicationCodeSet.builder()
                .id(dto.getId())
                .code(dto.getCode())
                .altCode(dto.getAltCode())
                .version(dto.getVersion())
                .codesetGroup(dto.getCodesetGroup())
                .display(dto.getDisplay())
                .description(dto.getDescription())
                .language(dto.getLanguage())
                .archived(dto.getArchived())
                .build();
    }
}
