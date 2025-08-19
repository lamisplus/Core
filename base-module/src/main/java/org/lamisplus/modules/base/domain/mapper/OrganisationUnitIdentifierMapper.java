package org.lamisplus.modules.base.domain.mapper;

import org.lamisplus.modules.base.domain.dto.OrganisationUnitIdentifierDto;
import org.lamisplus.modules.base.domain.entities.OrganisationUnitIdentifier;
import org.springframework.stereotype.Service;

@Service
public class OrganisationUnitIdentifierMapper {

    public OrganisationUnitIdentifierDto identifierToDto(OrganisationUnitIdentifier identifier) {

        OrganisationUnitIdentifierDto dto = new OrganisationUnitIdentifierDto();
        dto.setCode(identifier.getCode());
        dto.setId(identifier.getId());
        dto.setName(identifier.getName());
        dto.setOrganisationUnitId(dto.getOrganisationUnitId());
        dto.setDisplay(identifier.getName() + " (" + identifier.getCode() + ")");
        return dto;
    }

}
