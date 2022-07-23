package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.domain.dto.ApplicationUserOrganisationUnitDTO;
import org.lamisplus.modules.base.domain.entities.ApplicationUserOrganisationUnit;
import org.lamisplus.modules.base.domain.repositories.ApplicationUserOrganisationUnitRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class ApplicationUserOrganisationUnitService {
    private final ApplicationUserOrganisationUnitRepository applicationUserOrganisationUnitRepository;
    private final UserService userService;
    private final OrganisationUnitService organisationUnitService;
    private static final int UN_ARCHIVED = 0;
    private static final int ARCHIVED = 1;
    public List<ApplicationUserOrganisationUnit> save(Set<ApplicationUserOrganisationUnitDTO> applicationUserOrganisationUnitDTO1) {
        applicationUserOrganisationUnitDTO1.forEach(applicationUserOrganisationUnitDTO -> {
            organisationUnitService.getOrganizationUnit(applicationUserOrganisationUnitDTO.getOrganisationUnitId());
            userService.getUserById(applicationUserOrganisationUnitDTO.getApplicationUserId());
            applicationUserOrganisationUnitRepository.findAllByApplicationUserIdAndArchived(applicationUserOrganisationUnitDTO.getApplicationUserId(), UN_ARCHIVED)
                    .forEach(applicationUserOrganisationUnit -> applicationUserOrganisationUnitRepository.deleteById(applicationUserOrganisationUnit.getId()));
        });
        List<ApplicationUserOrganisationUnitDTO> applicationUserOrganisationUnitDTOS = new ArrayList<>(applicationUserOrganisationUnitDTO1);
        List<ApplicationUserOrganisationUnit> applicationUserOrganisationUnits = applicationUserOrganisationUnitRepository
                .saveAll(this.toApplicationUserOrganisationUnitList(applicationUserOrganisationUnitDTOS));
        return applicationUserOrganisationUnitRepository.saveAll(applicationUserOrganisationUnits);
    }
    public ApplicationUserOrganisationUnit update(Long id, ApplicationUserOrganisationUnit applicationUserOrganisationUnit) {
        applicationUserOrganisationUnitRepository.findByIdAndArchived(id, UN_ARCHIVED)
                .orElseThrow(() -> new EntityNotFoundException(ApplicationUserOrganisationUnit.class, "Id", id +""));
        applicationUserOrganisationUnit.setId(id);
        return applicationUserOrganisationUnitRepository.save(applicationUserOrganisationUnit);
    }
    public ApplicationUserOrganisationUnit getApplicationUserOrganisationUnit(Long id){
        return applicationUserOrganisationUnitRepository.findByIdAndArchived(id, UN_ARCHIVED)
                .orElseThrow(() -> new EntityNotFoundException(ApplicationUserOrganisationUnit.class, "Id", id +""));
    }
    public List<ApplicationUserOrganisationUnit> getAllApplicationUserOrganisationUnit() {
        return applicationUserOrganisationUnitRepository.findAllByArchived(UN_ARCHIVED);
    }
    public Optional<ApplicationUserOrganisationUnit> getApplicationUserOrganisationUnitByUserIdAndOrganisationUnitId(Long applicationUserId, Long organisationUnitId){
        return applicationUserOrganisationUnitRepository.findOneByApplicationUserIdAndOrganisationUnitIdAndArchived(applicationUserId, organisationUnitId, UN_ARCHIVED);
    }
    public void delete(Long id) {
        ApplicationUserOrganisationUnit applicationUserOrganisationUnit =  applicationUserOrganisationUnitRepository.findByIdAndArchived(id, UN_ARCHIVED)
                .orElseThrow(() -> new EntityNotFoundException(ApplicationUserOrganisationUnit.class, "Id", id +""));
            applicationUserOrganisationUnitRepository.delete(applicationUserOrganisationUnit);

    }
    public ApplicationUserOrganisationUnit toApplicationUserOrganisationUnit(ApplicationUserOrganisationUnitDTO applicationUserOrganisationUnitDTO) {
        if ( applicationUserOrganisationUnitDTO == null ) {
            return null;
        }

        ApplicationUserOrganisationUnit applicationUserOrganisationUnit = new ApplicationUserOrganisationUnit();

        applicationUserOrganisationUnit.setId( applicationUserOrganisationUnitDTO.getId() );
        applicationUserOrganisationUnit.setApplicationUserId( applicationUserOrganisationUnitDTO.getApplicationUserId() );
        applicationUserOrganisationUnit.setOrganisationUnitId( applicationUserOrganisationUnitDTO.getOrganisationUnitId() );

        return applicationUserOrganisationUnit;
    }
    public ApplicationUserOrganisationUnitDTO toApplicationUserOrganisationUnitDTO(ApplicationUserOrganisationUnit applicationUserOrganisationUnit) {
        if ( applicationUserOrganisationUnit == null ) {
            return null;
        }

        ApplicationUserOrganisationUnitDTO applicationUserOrganisationUnitDTO = new ApplicationUserOrganisationUnitDTO();

        applicationUserOrganisationUnitDTO.setId( applicationUserOrganisationUnit.getId() );
        applicationUserOrganisationUnitDTO.setApplicationUserId( applicationUserOrganisationUnit.getApplicationUserId() );
        applicationUserOrganisationUnitDTO.setOrganisationUnitId( applicationUserOrganisationUnit.getOrganisationUnitId() );

        return applicationUserOrganisationUnitDTO;
    }
    public List<ApplicationUserOrganisationUnit> toApplicationUserOrganisationUnitList(List<ApplicationUserOrganisationUnitDTO> applicationUserOrganisationUnitDTOS) {
        if ( applicationUserOrganisationUnitDTOS == null ) {
            return null;
        }

        List<ApplicationUserOrganisationUnit> list = new ArrayList<>(applicationUserOrganisationUnitDTOS.size());
        for ( ApplicationUserOrganisationUnitDTO applicationUserOrganisationUnitDTO : applicationUserOrganisationUnitDTOS ) {
            list.add( toApplicationUserOrganisationUnit( applicationUserOrganisationUnitDTO ) );
        }

        return list;
    }
}
