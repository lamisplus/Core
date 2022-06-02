package org.lamisplus.modules.base.domain.dto;

import lombok.Data;

@Data
public class StandardCodesetDTO {

    private Long id;

    private String code;

    private String description;

    private Long standardCodesetSourceId;

}
