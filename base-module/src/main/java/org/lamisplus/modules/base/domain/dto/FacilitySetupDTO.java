package org.lamisplus.modules.base.domain.dto;

import lombok.Data;
@Data
public class FacilitySetupDTO
{
    private String applicationUserId;
    private String targetGroup;
    private Long [] organisationUnitId;
}
