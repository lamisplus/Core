package org.lamisplus.modules.base.controller;

import lombok.RequiredArgsConstructor;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.domain.dto.UserDTO;
import org.lamisplus.modules.base.domain.entities.ApplicationUserOrganisationUnit;
import org.lamisplus.modules.base.domain.entities.User;
import org.lamisplus.modules.base.domain.repositories.ApplicationUserOrganisationUnitRepository;
import org.lamisplus.modules.base.domain.repositories.UserRepository;
import org.lamisplus.modules.base.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AccountController {
    private static class AccountResourceException extends RuntimeException {
        private AccountResourceException(String message) {
            super(message);
        }
    }

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
}
