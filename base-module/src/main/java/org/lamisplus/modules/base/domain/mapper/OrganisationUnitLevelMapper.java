package org.lamisplus.modules.base.domain.mapper;

import org.lamisplus.modules.base.domain.dto.OrganisationUnitLevelDTO;
import org.lamisplus.modules.base.domain.entities.OrganisationUnitLevel;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface OrganisationUnitLevelMapper {
    OrganisationUnitLevelDTO toOrganisationUnitLevelDTO(OrganisationUnitLevel organisationUnitLevel);

    OrganisationUnitLevel toOrganisationUnitLevel(OrganisationUnitLevelDTO organisationUnitLevelDTO);

    List<OrganisationUnitLevelDTO> toOrganisationUnitLevelDTOList(List<OrganisationUnitLevel> organisationUnitLevels);
}
