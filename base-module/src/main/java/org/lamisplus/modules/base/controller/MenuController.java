package org.lamisplus.modules.base.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.domain.dto.MenuDTO;
import org.lamisplus.modules.base.domain.entities.Menu;
import org.lamisplus.modules.base.service.MenuService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@Slf4j
@RequiredArgsConstructor
public class MenuController {
    private final MenuService menuService;
    //Versioning through URI Path
    private final String BASE_URL_VERSION_ONE = "/api/v1/menus";

    /*@PutMapping("/modules/{id}")
    public ResponseEntity<List<Menu>> update(@PathVariable Long id, @RequestBody ModuleMenuDTO moduleMenuDTO) {
        return ResponseEntity.ok(this.menuService.update(id, moduleMenuDTO));
    }*/

    @GetMapping(BASE_URL_VERSION_ONE)
    @PreAuthorize("hasAnyAuthority('admin_write', 'admin_read', 'admin_delete','user', 'all_permission')")
    public ResponseEntity<List<MenuDTO>> getAllMenus(@RequestParam(required = false, defaultValue = "false") Boolean withChild) {
        return ResponseEntity.ok(this.menuService.getAllMenus(withChild));
    }

    @GetMapping(BASE_URL_VERSION_ONE+"/parent/{id}")
    @PreAuthorize("hasAnyAuthority('admin_write', 'admin_read', 'admin_delete','user', 'all_permission')")
    public ResponseEntity<List<MenuDTO>> getAllMenusByParentId(@PathVariable Integer id) {
        return ResponseEntity.ok(this.menuService.getAllMenusByParentId(id));
    }

    @PutMapping(BASE_URL_VERSION_ONE+"/{id}")
    @PreAuthorize("hasAnyAuthority('admin_write', 'admin_read', 'admin_delete', 'all_permission')")
    public ResponseEntity<Menu> update(@PathVariable Long id, @Valid @RequestBody MenuDTO menuDTO) {
        return ResponseEntity.ok(this.menuService.update(id, menuDTO));
    }

    @DeleteMapping(BASE_URL_VERSION_ONE+"/{id}")
    @PreAuthorize("hasAnyAuthority('admin_write', 'admin_read', 'admin_delete', 'all_permission')")
    public void delete(@PathVariable Long id) {
        this.menuService.delete(id);
    }

    @PostMapping(BASE_URL_VERSION_ONE)
    @PreAuthorize("hasAnyAuthority('admin_write', 'admin_read', 'admin_delete', 'all_permission')")
    public ResponseEntity<Menu> save(@Valid @RequestBody MenuDTO menuDTO, @RequestParam(required = false, defaultValue = "true") Boolean isModule) {
        return ResponseEntity.ok(this.menuService.save(menuDTO, isModule));
    }
}
