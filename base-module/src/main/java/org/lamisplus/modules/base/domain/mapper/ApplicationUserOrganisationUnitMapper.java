package org.lamisplus.modules.base.domain.mapper;


import org.lamisplus.modules.base.domain.dto.ApplicationUserOrganisationUnitDTO;
import org.lamisplus.modules.base.domain.entities.ApplicationUserOrganisationUnit;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ApplicationUserOrganisationUnitMapper {

    ApplicationUserOrganisationUnit toApplicationUserOrganisationUnit(ApplicationUserOrganisationUnitDTO applicationUserOrganisationUnitDTO);

    ApplicationUserOrganisationUnitDTO toApplicationUserOrganisationUnitDTO(ApplicationUserOrganisationUnit applicationUserOrganisationUnit);

    List<ApplicationUserOrganisationUnit> toApplicationUserOrganisationUnitList(List<ApplicationUserOrganisationUnitDTO> applicationUserOrganisationUnitDTOS);

}
