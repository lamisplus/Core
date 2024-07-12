package org.lamisplus.modules.base.domain.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.lamisplus.modules.base.domain.entities.ApplicationCodeSet;

import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Data
@Builder
//@AllArgsConstructor
public class ApplicationCodesetDTO {
    private Long id;

    @NotBlank(message = "codesetGroup is mandatory")
    private String codesetGroup;

    @NotBlank(message = "language is mandatory")
    private String language;

    @NotBlank(message = "display is mandatory")
    private String display;

    @NotBlank(message = "version is mandatory")
    private String version;

    private String code;

    private Integer archived;
    private String dateModified;
    private String dateCreated;
    private String createdBy;
    private String modifiedBy;

    public ApplicationCodesetDTO(){
    }


    public ApplicationCodesetDTO(Long id, String codesetGroup, String language, String display, String version, String code, Integer archived, String dateModified, String dateCreated, String createdBy, String modifiedBy) {
        this.id = id;
        this.codesetGroup = codesetGroup;
        this.language = language;
        this.display = display;
        this.version = version;
        this.code = code;
        this.archived = archived;
        this.dateModified = dateModified;
        this.dateCreated = dateCreated;
        this.createdBy = createdBy;
        this.modifiedBy = modifiedBy;
    }

    public static ApplicationCodesetDTO fromEntity(ApplicationCodeSet applicationCodeSet){
        return ApplicationCodesetDTO.builder()
                .id(applicationCodeSet.getId())
                .codesetGroup(applicationCodeSet.getCodesetGroup())
                .language(applicationCodeSet.getLanguage())
                .display(applicationCodeSet.getDisplay())
                .version(applicationCodeSet.getVersion())
                .code(applicationCodeSet.getCode())
                .archived(applicationCodeSet.getArchived())
                .createdBy(applicationCodeSet.getCreatedBy())
                .dateCreated(applicationCodeSet.getDateCreated()!= null ? applicationCodeSet.getDateCreated().toString() : "")
                .modifiedBy(applicationCodeSet.getModifiedBy())
                .dateModified(applicationCodeSet.getDateModified()!= null ? applicationCodeSet.getDateModified().toString(): "")
                .build();
    }
}
