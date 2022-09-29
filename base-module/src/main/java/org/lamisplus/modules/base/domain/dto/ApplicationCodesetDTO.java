package org.lamisplus.modules.base.domain.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
@Builder
@AllArgsConstructor
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

    public ApplicationCodesetDTO(){
    }

    public ApplicationCodesetDTO(Long id, String display, String code, String codesetGroup, String version){
        this.id = id;
        this.display = display;
        this.code = code;
        this.codesetGroup = codesetGroup;
        this.version = version;
    }
}
