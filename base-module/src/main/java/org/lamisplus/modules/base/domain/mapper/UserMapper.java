package org.lamisplus.modules.base.domain.mapper;

import org.lamisplus.modules.base.domain.dto.UserDTO;
import org.lamisplus.modules.base.domain.entities.Role;
import org.lamisplus.modules.base.domain.entities.User;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserMapper {

    public List<UserDTO> usersToUserDTOs(List<User> users) {
        return users.stream().filter(Objects::nonNull).map(this::userToUserDTO).collect(Collectors.toList());
    }
    public UserDTO userToUserDTO(User user) {
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

    private Set<Role> rolessFromStrings(Set<String> rolesAsString) {
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
