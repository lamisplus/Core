package org.lamisplus.modules.base.domain.dto;

import lombok.Data;

@Data
public class OrganisationUnitIdentifierDto {
    private Long id;
    private Long organisationUnitId;
    private String code;
    private String name;
    private String display;
}