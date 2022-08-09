package org.lamisplus.modules.base.domain.dto;

import lombok.Data;

@Data
public class OrganisationUnitExtraction {
    private String organisationUnitName;
    private Long organisationUnitId;
    private String parentOrganisationUnitName;
    private String parentParentOrganisationUnitName;
    //state
    private Long parentOrganisationUnitId;
    //lga
    private Long parentParentOrganisationUnitId;
    private String description;
    private String datimId;
}