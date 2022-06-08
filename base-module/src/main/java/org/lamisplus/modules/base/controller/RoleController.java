package org.lamisplus.modules.base.controller;

import lombok.RequiredArgsConstructor;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.domain.dto.RoleDTO;
import org.lamisplus.modules.base.domain.dto.UserDTO;
import org.lamisplus.modules.base.domain.entities.Role;
import org.lamisplus.modules.base.domain.repositories.RoleRepository;
import org.lamisplus.modules.base.service.RoleService;
import org.lamisplus.modules.base.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

import static org.lamisplus.modules.base.util.Constants.ArchiveStatus.ARCHIVED;
import static org.lamisplus.modules.base.util.Constants.ArchiveStatus.UN_ARCHIVED;

@RestController
@RequiredArgsConstructor
public class RoleController {
    private final RoleService roleService;
    private final RoleRepository roleRepository;
    private final UserService userService;

    //Versioning through URI Path
    private final String BASE_URL_VERSION_ONE = "/api/v1/roles";


    @GetMapping(BASE_URL_VERSION_ONE + "/v2/{id}")
    public ResponseEntity<Role> getById(@PathVariable Long id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(()-> new EntityNotFoundException(Role.class, "id", ""+id));

        return ResponseEntity.ok(role);
    }

    @GetMapping(BASE_URL_VERSION_ONE)
    public ResponseEntity<List<Role>> getAll() {
        List<Role> roles = roleRepository.findAllByArchived(UN_ARCHIVED);
        return ResponseEntity.ok(roles);
    }

    @PostMapping(BASE_URL_VERSION_ONE)
    @ResponseStatus(HttpStatus.CREATED)
    public void save(@Valid @RequestBody RoleDTO roleDTO) throws Exception {
        roleService.save(roleDTO);
    }

    @PutMapping(BASE_URL_VERSION_ONE + "/{id}")
    public ResponseEntity<Role> update(@Valid @RequestBody RoleDTO role, @PathVariable Long id) {
        try {
            Role updatedRole = new Role();
            if (!role.getPermissions().isEmpty()){
                updatedRole = roleService.updatePermissions(id, role.getPermissions());
            }
            if (role.getName() != null){
                updatedRole = roleService.updateName(id, role.getName());
            }
            if(!role.getMenus().isEmpty()){
                updatedRole = roleService.updateMenus(id, role.getMenus());
            }
            return ResponseEntity.ok(updatedRole);
        } catch (Exception e) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST);
        }
        return null;
    }

    @DeleteMapping(BASE_URL_VERSION_ONE + "/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteRole(@PathVariable Long id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(()-> new EntityNotFoundException(Role.class, "id", ""+id));
        role.setArchived(ARCHIVED);
        try {
            roleRepository.save(role);
        } catch (Exception e) {
            throw e;
        }
    }

    @GetMapping(BASE_URL_VERSION_ONE + "/v2/{id}/users")
    public ResponseEntity<List<UserDTO>> getAllUserByRole(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getAllUserByRole(id));
    }
}
