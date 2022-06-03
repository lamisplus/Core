package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.dto.MenuDTO;
import org.lamisplus.modules.base.domain.dto.ModuleMenuDTO;
import org.lamisplus.modules.base.domain.entities.Menu;
import org.lamisplus.modules.base.domain.entities.Module;
import org.lamisplus.modules.base.domain.repositories.MenuRepository;
import org.lamisplus.modules.base.domain.repositories.ModuleRepository;
import org.lamisplus.modules.base.domain.repositories.RoleMenuRepository;
import org.lamisplus.modules.base.domain.repositories.RoleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

import static org.lamisplus.modules.base.util.Constants.ArchiveStatus.UN_ARCHIVED;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class MenuService {
    private final MenuRepository menuRepository;
    private final ModuleRepository moduleRepository;
    private final UserService userService;


    public List<Menu> updateModuleMenu(Long moduleId, ModuleMenuDTO moduleMenuDTO) {
        Module module = moduleRepository.findById(moduleId).orElseThrow(()-> new EntityNotFoundException(Module.class, "id", ""+moduleId));
        List<Menu> menus = new ArrayList<>();

        menuRepository.deleteByModuleId(moduleId);
        moduleMenuDTO.getMenuDTOS().forEach(menuDTO -> {
            if(menuDTO.getId() != null){
                menuRepository.deleteById(menuDTO.getId());
            }
            Menu menu =  toMenu(menuDTO);
            menu.setModule(module);
            menus.add(menu);
        });
        return menuRepository.saveAll(menus);
    }

    public List<MenuDTO> getAllMenus(Boolean withChild) {
        if(withChild) {
            return menuRepository.findAllByArchivedOrderByPositionAsc(UN_ARCHIVED).stream().
                    map(menu -> {
                        MenuDTO menuDTO = toMenuDTO(menu, null);
                        Menu parent = menu.getParent();
                        if (parent != null) menuDTO.setParentName(parent.getName());
                        return menuDTO;
                    }).sorted(Comparator.comparingInt(MenuDTO::getPosition))
                    .collect(Collectors.toList());
        }
        Set<Menu> menus = filterMenuByCurrentUser();
        return menuRepository.findAllByArchivedAndParentIdOrderByPositionAsc(UN_ARCHIVED, null).stream().
                map(menu -> {
                    MenuDTO menuDTO = toMenuDTO(menu, menus);
                    /*if(menuDTO == null){
                        return null;
                    }*/
                    Menu parent = menu.getParent();
                    if (parent != null) menuDTO.setParentName(parent.getName());
                    return menuDTO;
                })
                .filter(menuDTO -> menuDTO.getId() != null)
                .sorted(Comparator.comparingInt(MenuDTO::getPosition))
                .collect(Collectors.toList());
    }
    private Set<Menu> filterMenuByCurrentUser() {
        TreeSet<Menu> menus = new TreeSet<>();
        userService.getUserWithRoles().ifPresent(user -> {
            user.getRole().forEach(role -> {
                role.getMenu().forEach(menu -> {
                    //if(menu.getParent() == null) {
                        menus.add(menu);
                    //}
                });
            });
        });
        return menus;
    }

    public List<MenuDTO> getAllMenusByParentId(Integer parentId) {
        if(parentId == 0) parentId = null;
        return menuRepository.findAllByArchivedAndParentIdOrderByIdDesc(UN_ARCHIVED, parentId).stream().
                map(menu -> {
                    MenuDTO menuDTO =  toMenuDTO(menu, null);
                    Menu parent = menu.getParent();
                    if(parent != null)menuDTO.setParentName(parent.getName());
                    return menuDTO;
                }).collect(Collectors.toList());
    }



    public void delete(Long id){
        Menu menu = menuRepository.findById(id).orElseThrow(()-> new EntityNotFoundException(Menu.class, "id", ""+id));
        if(!menu.getSubs().isEmpty()){
            throw new RecordExistException(Menu.class, "Sub menus ", "This has sub menus reassign or delete them");
        }
        menuRepository.delete(menu);
    }

    public Menu update(Long id, MenuDTO menuDTO){
        menuRepository.findById(id).orElseThrow(()-> new EntityNotFoundException(Menu.class, "id", ""+id));
        if(menuDTO.getParentId() != null) {
            if (menuDTO.getId() == Long.valueOf(menuDTO.getParentId())) {
                throw new RecordExistException(Menu.class, "Menu", "Same as Parent");
            }
        }
        Menu menu = toMenu(menuDTO);
        menu.setId(id);
        return menuRepository.save(menu);
    }

    public Menu save(MenuDTO menuDTO, Boolean isModule){

        menuRepository.findByNameAndParentId(menuDTO.getName(), menuDTO.getParentId()).ifPresent(menu -> {
            throw new EntityNotFoundException(Module.class, "parent with name already exist", "" + menuDTO.getName());
        });

        if(isModule) {
            if(menuDTO.getModuleId() == null){
                throw new EntityNotFoundException(Module.class, "moduleId", "" + "moduleId is null");
            }
            moduleRepository.findById(menuDTO.getModuleId()).orElseThrow(() -> new EntityNotFoundException(Module.class, "moduleId", "" + menuDTO.getModuleId()));
        }

        menuRepository.findByName(menuDTO.getName()).ifPresent(menu -> {
            throw new RecordExistException(Menu.class, "Menu ", menu.getName() +"");
        });

        //menuDTO.setModuleId(null);
        Menu menu = toMenu(menuDTO);
        menu.setId(null);
        return menuRepository.save(menu);
    }



    public Menu toMenu(MenuDTO menuDTO) {
        if ( menuDTO == null ) {
            return null;
        }

        Menu menu = new Menu();
        menu.setId( menuDTO.getId() );
        menu.setName( menuDTO.getName() );
        menu.setState( menuDTO.getState() );
        menu.setType( menuDTO.getType() );
        menu.setLevel( menuDTO.getLevel() );
        menu.setPosition( menuDTO.getPosition() );
        menu.setIcon( menuDTO.getIcon() );
        menu.setTooltip( menuDTO.getTooltip() );
        menu.setBreadcrumb( menuDTO.getBreadcrumb() );
        menu.setUrl( menuDTO.getUrl() );
        menu.setDisabled( menuDTO.getDisabled() );
        Set<String> set = menuDTO.getAuthorities();
        if ( set != null ) {
            menu.setAuthorities( new HashSet<String>( set ) );
        }
        menu.setModuleId( menuDTO.getModuleId() );
        menu.setParentId( menuDTO.getParentId() );
        Set<Menu> set1 = menuDTO.getSubs();
        if ( set1 != null ) {
            menu.setSubs( new HashSet<Menu>( set1 ) );
        }

        return menu;
    }

    public MenuDTO toMenuDTO(Menu menu, Set<Menu> menus) {
        if ( menu == null ) {
            return null;
        }

        MenuDTO menuDTO = new MenuDTO();

        menuDTO.setId( menu.getId() );
        menuDTO.setName( menu.getName() );
        menuDTO.setState( menu.getState() );
        menuDTO.setLevel( menu.getLevel() );
        menuDTO.setPosition( menu.getPosition() );
        menuDTO.setIcon( menu.getIcon() );
        menuDTO.setTooltip( menu.getTooltip() );
        menuDTO.setBreadcrumb( menu.getBreadcrumb() );
        menuDTO.setUrl( menu.getUrl() );
        menuDTO.setDisabled( menu.getDisabled() );
        Set<String> set = menu.getAuthorities();
        if ( set != null ) {
            menuDTO.setAuthorities( new HashSet<String>( set ) );
        }
        menuDTO.setParentId( menu.getParentId() );
        menuDTO.setModuleId( menu.getModuleId() );
        menuDTO.setType( menu.getType() );
        Set<Menu> menuSet = new HashSet<>();

        boolean found = false;
        if(menus != null && !menus.isEmpty()) {
            for (Menu menu1 : menus) {
                menu.getSubs().forEach(menu2 -> {
                    if (menu2.getId() == menu1.getId()) {
                        menuSet.add(menu2);
                    }
                });
                if (menu1.getId() == menu.getId()) {
                    found = true;
                }
            }
        }
        if(found){
            menuDTO.setSubs(menuSet);
            return menuDTO;
        }
        return new MenuDTO();
    }
}
