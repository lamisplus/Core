package org.lamisplus.modules.base.controller;

import lombok.RequiredArgsConstructor;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.vm.ManagedUserVM;
import org.lamisplus.modules.base.domain.dto.FacilitySetupDTO;
import org.lamisplus.modules.base.domain.dto.ManagementDto;
import org.lamisplus.modules.base.domain.dto.UserDTO;
import org.lamisplus.modules.base.domain.entities.Role;
import org.lamisplus.modules.base.domain.entities.User;
import org.lamisplus.modules.base.domain.repositories.RoleRepository;
import org.lamisplus.modules.base.domain.repositories.UserRepository;
import org.lamisplus.modules.base.service.UserService;
import org.lamisplus.modules.base.util.PaginationUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.util.HashSet;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final SessionRegistry sessionRegistry;

    //Versioning through URI Path
    private final String BASE_URL_VERSION_ONE = "/api/v1/users";


    @GetMapping(BASE_URL_VERSION_ONE + "/{id}")
    @PreAuthorize("hasAnyAuthority('admin_write', 'admin_read', 'admin_delete','user', 'all_permission')")
    public ResponseEntity<UserDTO> get(@PathVariable Long id) {
        return ResponseEntity.ok(userRepository.findById(id).map(UserDTO::new).get());
    }

    @PostMapping(BASE_URL_VERSION_ONE + "/{id}/roles")
    @PreAuthorize("hasAnyAuthority('admin_write', 'admin_read', 'admin_delete', 'all_permission')")
    public ResponseEntity<Object[]> updateRoles(@Valid @RequestBody List<Role> roles, @PathVariable Long id) throws Exception {
        try {
            User user = userRepository.findById(id).get();
            HashSet rolesSet = new HashSet<>();
            Role roleToAdd = new Role();
            for(Role r : roles){
                // add roles by either id or name
                if(r.getName() != null ) {
                    roleToAdd = roleRepository.findByName(r.getName()).get();
                } else if(r.getId() != null ){
                    roleToAdd = roleRepository.findById(r.getId()).get();
                } else {
                    ResponseEntity.badRequest();
                    return null;
                }
                rolesSet.add(roleToAdd);
            }
            user.setRole(rolesSet);
            userService.update(id, user);
            return ResponseEntity.ok(user.getRole().toArray());
        } catch (Exception e) {
            throw e;
        }
    }


    /*@PostMapping("/organisationUnit/{id}")
    public ResponseEntity<UserDTO> getAllUsers(@PathVariable Long id) {
        UserDTO userDTO = userService
                .getUserWithRoles()
                .map(UserDTO::new)
                .orElseThrow(() -> new EntityNotFoundException(User.class, "Not Found", ""));
        return ResponseEntity.ok(userService.changeOrganisationUnit(id, userDTO));
    }*/

    @GetMapping("/logged-in/count")
    public Integer getNumberOfLoggedInUsers() {
        final List<Object> allPrincipals = sessionRegistry.getAllPrincipals();
        return  allPrincipals.size();
    }



    @PostMapping(BASE_URL_VERSION_ONE)
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyAuthority('admin_write', 'admin_read', 'admin_delete', 'all_permission')")
    public void save(@Valid @RequestBody ManagedUserVM managedUserVM) {
        //Check Password Length
        userService.save(managedUserVM, managedUserVM.getPassword());
    }

    @PutMapping(BASE_URL_VERSION_ONE + "/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyAuthority('admin_write', 'admin_read', 'admin_delete', 'user','all_permission')")
    public void update(@PathVariable Long id, @Valid @RequestBody ManagedUserVM managedUserVM) {
        userService.update(id, managedUserVM, managedUserVM.getPassword());
    }

    @DeleteMapping(BASE_URL_VERSION_ONE + "/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyAuthority('admin_write', 'admin_read', 'admin_delete','all_permission')")
    public void update(@PathVariable Long id) {
        userService.delete(id);
    }

//    @GetMapping(BASE_URL_VERSION_ONE)
//    public ResponseEntity<List<UserDTO>> getAllUsers(Pageable pageable) {
//        final Page<UserDTO> page = userService.getAllManagedUsers(pageable);
//        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
//        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
//    }
    @GetMapping(BASE_URL_VERSION_ONE)
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        final List<UserDTO> page = userService.getAllManagedUsers();
//        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return new ResponseEntity<>(page, HttpStatus.OK);
    }

    @PostMapping(BASE_URL_VERSION_ONE + "/organisationUnit/{id}")
    public ResponseEntity<UserDTO> switchOrganisationUnit(@PathVariable Long id) {
        return ResponseEntity.ok(userService.changeOrganisationUnit(id));
    }

    @GetMapping(BASE_URL_VERSION_ONE +"/configure/app")
    public boolean isLamisPlusConfigured() {
        return userService.isLamisPlusConfigured();
    }
    @PostMapping(BASE_URL_VERSION_ONE +"/facility/setup")
    public FacilitySetupDTO facilitySetup(@RequestBody FacilitySetupDTO facilitySetupDTO) {
        return userService.facilitySetup(facilitySetupDTO);
    }
}
