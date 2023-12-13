package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.dto.ApplicationUserOrganisationUnitDTO;
import org.lamisplus.modules.base.domain.dto.FacilitySetupDTO;
import org.lamisplus.modules.base.domain.dto.ManagementDto;
import org.lamisplus.modules.base.domain.dto.UserDTO;
import org.lamisplus.modules.base.domain.entities.ApplicationUserOrganisationUnit;
import org.lamisplus.modules.base.domain.entities.OrganisationUnit;
import org.lamisplus.modules.base.domain.entities.Role;
import org.lamisplus.modules.base.domain.entities.User;
import org.lamisplus.modules.base.domain.mapper.UserMapper;
import org.lamisplus.modules.base.domain.repositories.ApplicationUserOrganisationUnitRepository;
import org.lamisplus.modules.base.domain.repositories.OrganisationUnitRepository;
import org.lamisplus.modules.base.domain.repositories.RoleRepository;
import org.lamisplus.modules.base.domain.repositories.UserRepository;
import org.lamisplus.modules.base.security.RolesConstants;
import org.lamisplus.modules.base.security.SecurityUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

import static org.lamisplus.modules.base.util.Constants.ArchiveStatus.ARCHIVED;


@Service
@Transactional
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;

    private final OrganisationUnitRepository organisationUnitRepository;

    private final ApplicationUserOrganisationUnitRepository applicationUserOrganisationUnitRepository;

    //private final ApplicationUserOrganisationUnitService applicationUserOrganisationUnitService;
    private static final int ARCHIVED = 1;
    private final UserMapper userMapper;

    @Transactional
    public Optional<User> getUserWithAuthoritiesByUsername(String userName) {
        return userRepository.findOneWithRoleByUserName(userName);
    }

    @Transactional(readOnly = true)
    public Optional<User> getUserWithRoles() {
        return SecurityUtils.getCurrentUserLogin().flatMap(userRepository::findOneWithRoleByUserName);
    }

    public User save(UserDTO userDTO, String password) {
        Optional<User> optionalUser = userRepository.findOneByUserName(userDTO.getUserName());
        optionalUser.ifPresent(existingUser -> {
                    throw new RecordExistException(User.class, "Name", userDTO.getUserName());
        });
        return this.registerOrUpdateUser(userDTO, password, true);
    }

    public User registerOrUpdateUser(UserDTO userDTO, String password, Boolean updatePassword){
        User newUser = new User();
        if(userDTO.getId() != null){
            newUser.setId(userDTO.getId());
        }
        //if update password then encode new password else just use old password
        String encryptedPassword = updatePassword ? passwordEncoder.encode(password) : password;

        newUser.setUserName(userDTO.getUserName());
        newUser.setEmail(userDTO.getEmail());
        newUser.setPhoneNumber(userDTO.getPhoneNumber());
        newUser.setGender(userDTO.getGender());

        //newUser.setTargetGroup(getUserWithRoles().get().getTargetGroup());

        newUser.setPassword(encryptedPassword);
        newUser.setFirstName(userDTO.getFirstName());
        newUser.setLastName(userDTO.getLastName());
        newUser.setDesignation(userDTO.getDesignation());

        userDTO.setApplicationUserOrganisationUnits(null);
        if(!userDTO.getFacilityIds().isEmpty()) {
            newUser.setCurrentOrganisationUnitId(userDTO
                    .getFacilityIds().stream().findFirst().get());
        }else if(userDTO.getCurrentOrganisationUnitId() != null) {
            newUser.setCurrentOrganisationUnitId(newUser.getCurrentOrganisationUnitId());
        } else {
            newUser.setCurrentOrganisationUnitId(getUserWithRoles().get().getCurrentOrganisationUnitId());
        }

        if (userDTO.getDetails() != null) {
            newUser.setDetails(userDTO.getDetails());
        }

        if (userDTO.getRoles() == null || userDTO.getRoles().isEmpty()) {
            Set<Role> roles = new HashSet<>();
            Role role = roleRepository.findAll().stream()
                    .filter(name -> RolesConstants.USER.equals(name.getName()))
                    .findAny()
                    .orElse(null);
            if (role != null)
                roles.add(role);
            newUser.setRole(roles);
        } else {
            newUser.setRole(getRolesFromStringSet(userDTO.getRoles()));
        }
        User user = userRepository.save(newUser);
        if(!userDTO.getFacilityIds().isEmpty()) {
            applicationUserOrganisationUnitRepository.saveAll(userDTO.getFacilityIds().stream().map(facilityId->{
                ApplicationUserOrganisationUnit orgUser = new ApplicationUserOrganisationUnit();
                orgUser.setOrganisationUnitId(facilityId);
                orgUser.setApplicationUserId(user.getId());
                return orgUser;
            }).collect(Collectors.toList()));

        }
        return newUser;
    }

    public User update(Long id, UserDTO userDTO, String password){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(User.class, "id", ""+id));
        userDTO.setId(id);
        if(!StringUtils.isEmpty(password)){
            return this.registerOrUpdateUser(userDTO, password, true);
        }
        return this.registerOrUpdateUser(userDTO, user.getPassword(), false);
    }

    public void delete(Long id){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(User.class, "id", ""+id));
        user.setArchived(ARCHIVED);
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public Page<UserDTO> getAllManagedUsers(Pageable pageable) {
        return userRepository.findAllByArchived(pageable, 0).map(UserDTO::new);
    }

    public User update(Long id, User user) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (!optionalUser.isPresent()) throw new EntityNotFoundException(User.class, "Id", id + "");
        user.setId(id);
        return userRepository.save(user);
    }

    private HashSet<Role> getRolesFromStringSet(Set<String> roles) {
        HashSet roleSet = new HashSet<>();
        Role roleToAdd = new Role();
        for (String r : roles) {
            // add roles by either id or name
            if (null != r) {
                roleToAdd = roleRepository.findByName(r).get();
                if (null == roleToAdd && NumberUtils.isParsable(r))
                    roleToAdd = roleRepository.findById(Long.valueOf(r)).get();
            } else {
                ResponseEntity.badRequest();
                return null;
            }
            roleSet.add(roleToAdd);
        }
        return roleSet;
    }

    @Transactional
    public List<UserDTO> getAllUserByRole(Long roleId) {
        HashSet<Role> roles = new HashSet<>();
        Optional<Role> role = roleRepository.findById(roleId);
        roles.add(role.get());

        return userMapper.usersToUserDTOs(userRepository.findAllByRoleIn(roles));
    }

    public UserDTO changeOrganisationUnit(Long organisationUnitId) {
        User user = this.getUserWithRoles().get();

        boolean found = false;
        for (ApplicationUserOrganisationUnit applicationUserOrganisationUnit : user.getApplicationUserOrganisationUnits()) {
            Long orgUnitId = applicationUserOrganisationUnit.getOrganisationUnitId();
            if (organisationUnitId.longValue() == orgUnitId.longValue()) {
                found = true;
                break;
            }
        }
        if (!found) {
            throw new EntityNotFoundException(User.class, "OrganisationUnit Id", organisationUnitId + "");
        }
        user.setCurrentOrganisationUnitId(organisationUnitId);
        user = userRepository.save(user);
        return userMapper.userToUserDTO(user);
    }

    public UserDTO getUserById(Long id){
        return userMapper.userToUserDTO(userRepository.findById(id).orElseThrow(()-> new EntityNotFoundException(User.class, "Id", id + "")));
    }

    public boolean isLamisPlusConfigured() {
        String loginInUser = SecurityUtils.getCurrentUserLogin().orElse(null);
        User user=new User();
        if(loginInUser != null) {
            user = userRepository.findOneByUserName(loginInUser).orElse(new User());
        }
        return user.getCurrentOrganisationUnitId() == null;
    }

    public FacilitySetupDTO facilitySetup(FacilitySetupDTO facilitySetupDTO)
    {
        Long [] ogrId = facilitySetupDTO.getOrganisationUnitId();
        User user = userRepository.findOneByUserName(facilitySetupDTO.getApplicationUserId())
                .orElseThrow(()-> new EntityNotFoundException(User.class, "Username", String.valueOf(facilitySetupDTO.getApplicationUserId())));
        List<ApplicationUserOrganisationUnit> applicationUserOrganisationUnits = new ArrayList<>();
        for(int i=0; i <ogrId.length; i++ ){
            Long orgId = ogrId[i];
            organisationUnitRepository.findById(orgId)
                    .orElseThrow(()-> new EntityNotFoundException(OrganisationUnit.class, "Id", String.valueOf(orgId)));
            ApplicationUserOrganisationUnit appUserOrg = new ApplicationUserOrganisationUnit();
            appUserOrg.setApplicationUserId(user.getId());
            appUserOrg.setOrganisationUnitId(orgId);
            applicationUserOrganisationUnits.add(appUserOrg);
        }
         applicationUserOrganisationUnitRepository.saveAll(applicationUserOrganisationUnits);

        return facilitySetupDTO;
    }

    public void creatUser(ApplicationUserOrganisationUnitDTO applicationUserOrganisationUnitDTO) {
        applicationUserOrganisationUnitRepository
                .save(this.toApplicationUserOrganisationUnit(applicationUserOrganisationUnitDTO));
    }

    private ApplicationUserOrganisationUnit toApplicationUserOrganisationUnit(ApplicationUserOrganisationUnitDTO applicationUserOrganisationUnitDTO) {
        if ( applicationUserOrganisationUnitDTO == null ) {
            return null;
        }

        ApplicationUserOrganisationUnit applicationUserOrganisationUnit = new ApplicationUserOrganisationUnit();

        applicationUserOrganisationUnit.setId( applicationUserOrganisationUnitDTO.getId() );
        applicationUserOrganisationUnit.setApplicationUserId( applicationUserOrganisationUnitDTO.getApplicationUserId() );
        applicationUserOrganisationUnit.setOrganisationUnitId( applicationUserOrganisationUnitDTO.getOrganisationUnitId() );

        return applicationUserOrganisationUnit;
    }
}
