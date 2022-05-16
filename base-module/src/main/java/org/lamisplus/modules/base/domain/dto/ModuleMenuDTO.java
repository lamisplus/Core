package org.lamisplus.modules.base.domain.dto;

import lombok.Data;

import javax.validation.constraints.NotNull;
import java.util.List;

@Data
public class ModuleMenuDTO {

    private Long moduleId;

    private String moduleName;

    List<MenuDTO> menuDTOS;
}
