package org.lamisplus.modules.base.controller;

import lombok.RequiredArgsConstructor;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.domain.dto.UserDTO;
import org.lamisplus.modules.base.domain.entities.ApplicationUserOrganisationUnit;
import org.lamisplus.modules.base.domain.entities.Role;
import org.lamisplus.modules.base.domain.entities.User;
import org.lamisplus.modules.base.domain.mapper.UserMapper;
import org.lamisplus.modules.base.domain.repositories.ApplicationUserOrganisationUnitRepository;
import org.lamisplus.modules.base.domain.repositories.RoleRepository;
import org.lamisplus.modules.base.domain.repositories.UserRepository;
import org.lamisplus.modules.base.security.SecurityUtils;
import org.lamisplus.modules.base.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.TreeSet;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AccountController {
    private final RoleRepository roleRepository;

    private final UserMapper userMapper;

    private final UserRepository userRepository;

    private final UserService userService;

    private final ApplicationUserOrganisationUnitRepository applicationUserOrganisationUnitRepository;

    @GetMapping("/account")
    public UserDTO getAccount(Principal principal){

        Optional<User> optionalUser = userService.getUserWithRoles();
        if(optionalUser.isPresent()){
            User user = optionalUser.get();

            if(user.getCurrentOrganisationUnitId() == null && !user.getApplicationUserOrganisationUnits().isEmpty()){
                for (ApplicationUserOrganisationUnit applicationUserOrganisationUnit : user.getApplicationUserOrganisationUnits()) {
                    user.setCurrentOrganisationUnitId(applicationUserOrganisationUnit.getOrganisationUnitId());
                    userRepository.save(user);
                    break;
                }
            } else if(user.getCurrentOrganisationUnitId() != null && user.getApplicationUserOrganisationUnits().isEmpty()){
                ApplicationUserOrganisationUnit applicationUserOrganisationUnit = new ApplicationUserOrganisationUnit();
                applicationUserOrganisationUnit.setApplicationUserId(user.getId());
                applicationUserOrganisationUnit.setOrganisationUnitId(user.getCurrentOrganisationUnitId());
                applicationUserOrganisationUnitRepository.save(applicationUserOrganisationUnit);
            }

            return userService
                    .getUserWithRoles()
                    .map(UserDTO::new)
                    .orElseThrow(() -> new EntityNotFoundException(User.class,"Name:","User"));
        } else{
            throw new EntityNotFoundException(User.class,"Name:","User");
        }
    }

    @GetMapping("/account/roles")
    public Set<Role> getAccountRoles(Principal principal){
        Optional<User> optionalUser = userService.getUserWithRoles();
        UserDTO userDTO = userService.getUserWithRoles()
                    .map(UserDTO::new)
                    .orElseThrow(() -> new EntityNotFoundException(User.class,"Name:","User"));
        if(userDTO.getPermissions().contains("all_permission")){
            return roleRepository.findAllByArchived(0).stream().map(role -> {
                role.setPermission(null);
                return role;
            }).collect(Collectors.toSet());
        } else
            return userMapper.rolessFromStrings(userDTO.getRoles());
    }
}
