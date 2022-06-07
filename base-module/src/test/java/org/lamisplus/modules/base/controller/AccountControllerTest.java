package org.lamisplus.modules.base.controller;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.lamisplus.modules.base.domain.dto.UserDTO;
import org.lamisplus.modules.base.domain.entities.Role;
import org.lamisplus.modules.base.domain.entities.User;
import org.lamisplus.modules.base.domain.mapper.UserMapper;
import org.lamisplus.modules.base.domain.repositories.ApplicationUserOrganisationUnitRepository;
import org.lamisplus.modules.base.domain.repositories.RoleRepository;
import org.lamisplus.modules.base.domain.repositories.UserRepository;
import org.lamisplus.modules.base.service.UserService;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.mockito.Mockito.*;

public class AccountControllerTest {
    @Mock
    RoleRepository roleRepository;
    @Mock
    UserMapper userMapper;
    @Mock
    UserRepository userRepository;
    @Mock
    UserService userService;
    @Mock
    ApplicationUserOrganisationUnitRepository applicationUserOrganisationUnitRepository;
    @InjectMocks
    AccountController accountController;

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testGetAccount() throws Exception {
        when(userService.getUserWithRoles()).thenReturn(null);

        UserDTO result = accountController.getAccount(null);
        Assert.assertEquals(new UserDTO(new User("userName", "password")), result);
    }

    @Test
    public void testGetAccountRoles() throws Exception {
        when(roleRepository.findAllByArchived(anyInt())).thenReturn(Arrays.<Role>asList(new Role("name")));
        when(userMapper.rolessFromStrings(any())).thenReturn(new HashSet<Role>(Arrays.asList(new Role("name"))));
        when(userService.getUserWithRoles()).thenReturn(null);

        List<Role> result = accountController.getAccountRoles(null);
        Assert.assertEquals(new HashSet<Role>(Arrays.asList(new Role("name"))), result);
    }
}

