package org.lamisplus.modules.base.domain.mapper;

import org.lamisplus.modules.base.domain.dto.MenuDTO;
import org.lamisplus.modules.base.domain.entities.Menu;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface MenuMapper {
    Menu toMenu(MenuDTO menuDTO);

    MenuDTO toMenuDTO(Menu menu);

    List<MenuDTO> toMenuDTOList(List<Menu> menus);
}
