package org.lamisplus.modules.base.domain.mapper;

import org.lamisplus.modules.base.domain.dto.OrganisationUnitDTO;
import org.lamisplus.modules.base.domain.entities.OrganisationUnit;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface OrganisationUnitMapper {
    OrganisationUnit toOrganisationUnit(OrganisationUnitDTO organisationUnitDTO);

    OrganisationUnitDTO toOrganisationUnitDTO(OrganisationUnit organisationUnit);

    List<OrganisationUnitDTO> toOrganisationUnitDTOList(List<OrganisationUnit> organisationUnits);
}
