package org.lamisplus.modules.base.controller;

import com.esotericsoftware.minlog.Log;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.domain.dto.UserDTO;
import org.lamisplus.modules.base.domain.entities.*;
import org.lamisplus.modules.base.domain.mapper.UserMapper;
import org.lamisplus.modules.base.domain.repositories.ApplicationUserOrganisationUnitRepository;
import org.lamisplus.modules.base.domain.repositories.RoleRepository;
import org.lamisplus.modules.base.domain.repositories.UserRepository;
import org.lamisplus.modules.base.security.SecurityUtils;
import org.lamisplus.modules.base.service.OrganisationUnitService;
import org.lamisplus.modules.base.service.UserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.TreeSet;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class AccountController {
    private final RoleRepository roleRepository;

    private final UserMapper userMapper;

    private final UserRepository userRepository;

    private final UserService userService;

    private final OrganisationUnitService organisationUnitService;

    private final ApplicationUserOrganisationUnitRepository applicationUserOrganisationUnitRepository;

    //Versioning through URI Path
    private final String BASE_URL_VERSION_ONE = "/api/v1";



    @GetMapping(BASE_URL_VERSION_ONE + "/account")
    public UserDTO getAccount(Principal principal){
        Optional<User> optionalUser = userService.getUserWithRoles();
        if(optionalUser.isPresent()){
            User user = optionalUser.get();

            if(user.getCurrentOrganisationUnitId() == null && !user.getApplicationUserOrganisationUnits().isEmpty()){
                for (ApplicationUserOrganisationUnit applicationUserOrganisationUnit : user.getApplicationUserOrganisationUnits()) {
                    Long facilityId = applicationUserOrganisationUnit.getOrganisationUnitId();
                    user.setCurrentOrganisationUnitId(facilityId);
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
                    .map(this::getUserDTOWithDatimCode)
                    .orElseThrow(() -> new EntityNotFoundException(User.class,"Name:","User"));
        } else{
            throw new EntityNotFoundException(User.class,"Name:","User");
        }
    }

    @NotNull
    private UserDTO getUserDTOWithDatimCode(UserDTO userDTO) {
        Log.info("I am in to the modification");
        OrganisationUnit organizationUnit = organisationUnitService.getOrganizationUnit(userDTO.getCurrentOrganisationUnitId());
        Optional<OrganisationUnitIdentifier> datimId = organizationUnit.getOrganisationUnitIdentifiers()
                .stream()
                .filter(o -> o.getName().equals("DATIM_ID"))
                .findFirst();
        datimId.ifPresent(organisationUnitIdentifier -> userDTO.setDatimCode(organisationUnitIdentifier.getCode()));
        return userDTO;
    }

    @GetMapping(BASE_URL_VERSION_ONE + "/account/roles")
    @PreAuthorize("hasAnyAuthority('admin_write', 'admin_read', 'admin_delete','user', 'all_permission')")
    public List<Role> getAccountRoles(Principal principal){
        Optional<User> optionalUser = userService.getUserWithRoles();
        UserDTO userDTO = userService.getUserWithRoles()
                    .map(UserDTO::new)
                    .orElseThrow(() -> new EntityNotFoundException(User.class,"Name:","User"));
        if(userDTO.getPermissions().contains("all_permission")){
            return roleRepository.findAllByArchived(0);
        } else
            return roleRepository.findAllInRolesNames(userDTO.getRoles());
    }
}
