package org.lamisplus.modules.base.domain.mapper;

import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.domain.dto.UserDTO;
import org.lamisplus.modules.base.domain.entities.ApplicationUserOrganisationUnit;
import org.lamisplus.modules.base.domain.entities.OrganisationUnitIdentifier;
import org.lamisplus.modules.base.domain.entities.Role;
import org.lamisplus.modules.base.domain.entities.User;
import org.lamisplus.modules.base.domain.repositories.OrganisationUnitIdentifierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Slf4j
public class UserMapper {
    private final String DATIM_ID = "DATIM_ID";
    @Autowired
    private OrganisationUnitIdentifierRepository organisationUnitIdentifierRepository;
    public List<UserDTO> usersToUserDTOs(List<User> users) {
        return users.stream().filter(Objects::nonNull).map(this::userToUserDTO).collect(Collectors.toList());
    }
    public UserDTO userToUserDTO(User user) {
        user.getApplicationUserOrganisationUnits()
                .forEach(applicationUserOrganisationUnit -> {
                    Optional<OrganisationUnitIdentifier> organisationUnitIdentifier =
                            organisationUnitIdentifierRepository.findByOrganisationUnitIdAndIsDatimId(
                                    applicationUserOrganisationUnit.getOrganisationUnitId(),
                                    DATIM_ID
                            );
                    organisationUnitIdentifier.ifPresent(unitIdentifier -> applicationUserOrganisationUnit.setDatimId(unitIdentifier.getCode()));
                });
        return new UserDTO(user);
    }

    public List<User> userDTOsToUsers(List<UserDTO> userDTOs) {
        return userDTOs.stream().filter(Objects::nonNull).map(this::userDTOToUser).collect(Collectors.toList());
        }

    public User userDTOToUser(UserDTO userDTO) {
        if (userDTO == null) {
            return null;
        } else {
            User user = new User();
            user.setId(userDTO.getId());
            user.setUserName(userDTO.getUserName());
            Set<Role> roles = this.rolessFromStrings(userDTO.getRoles());
            user.setRole(roles);
            return user;
        }
    }

    public Set<Role> rolessFromStrings(Set<String> rolesAsString) {
        Set<Role> roles = new HashSet<>();

        if (rolesAsString != null) {
            roles = rolesAsString.stream().map(
                string -> {
                    Role auth = new Role();
                    auth.setName(string);
                    return auth;
                }).collect(Collectors.toSet());
        }
        return roles;
    }

    public User userFromId(Long id) {
        if (id == null) {
            return null;
        }
        User user = new User();
        user.setId(id);
        return user;
    }
}
