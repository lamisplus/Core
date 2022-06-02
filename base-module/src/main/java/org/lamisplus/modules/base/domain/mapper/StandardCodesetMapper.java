package org.lamisplus.modules.base.domain.mapper;

import org.lamisplus.modules.base.domain.dto.StandardCodesetDTO;
import org.lamisplus.modules.base.domain.entities.StandardCodeset;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface StandardCodesetMapper {
    StandardCodesetDTO toStandardCodesetDTO(StandardCodeset standardCodeset);
    StandardCodeset toStandardCodeset(StandardCodesetDTO standardCodesetDTO);
    List<StandardCodesetDTO> toStandardCodesetDTOList(List<StandardCodeset> standardCodesets);


}
