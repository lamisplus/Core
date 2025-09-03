package org.lamisplus.modules.base.domain.dto;

import lombok.Data;

@Data
public class ChartRequestDto {
    private String type;
    private String module;
    private String location;
    private String description;
    private String displayName;
    private String icon;
    private Integer position;
//    private String query;


}
