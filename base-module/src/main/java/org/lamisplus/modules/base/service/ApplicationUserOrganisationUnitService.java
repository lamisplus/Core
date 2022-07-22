package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.domain.dto.ApplicationUserOrganisationUnitDTO;
import org.lamisplus.modules.base.domain.entities.ApplicationCodeSet;
import org.lamisplus.modules.base.domain.entities.ApplicationUserOrganisationUnit;
import org.lamisplus.modules.base.domain.mapper.ApplicationUserOrganisationUnitMapper;
import org.lamisplus.modules.base.domain.repositories.ApplicationUserOrganisationUnitRepository;
import org.lamisplus.modules.base.util.Constants;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class ApplicationUserOrganisationUnitService {
    private final ApplicationUserOrganisationUnitRepository applicationUserOrganisationUnitRepository;
    private final ApplicationUserOrganisationUnitMapper applicationUserOrganisationUnitMapper;
    private final UserService userService;
    private final OrganisationUnitService organisationUnitService;
    private final Constants.ArchiveStatus constant;

    public List<ApplicationUserOrganisationUnit> save(Set<ApplicationUserOrganisationUnitDTO> applicationUserOrganisationUnitDTO1) {
        applicationUserOrganisationUnitDTO1.forEach(applicationUserOrganisationUnitDTO -> {
            organisationUnitService.getOrganizationUnit(applicationUserOrganisationUnitDTO.getOrganisationUnitId());
            userService.getUserById(applicationUserOrganisationUnitDTO.getApplicationUserId());
            applicationUserOrganisationUnitRepository.findAllByApplicationUserIdAndArchived(applicationUserOrganisationUnitDTO.getApplicationUserId(), constant.UN_ARCHIVED)
                    .forEach(applicationUserOrganisationUnit -> {
                        applicationUserOrganisationUnitRepository.deleteById(applicationUserOrganisationUnit.getId());
                    });
        });
        List<ApplicationUserOrganisationUnitDTO> applicationUserOrganisationUnitDTOS = applicationUserOrganisationUnitDTO1
                .stream().collect(Collectors.toList());
        List<ApplicationUserOrganisationUnit> applicationUserOrganisationUnits = applicationUserOrganisationUnitRepository
                .saveAll(applicationUserOrganisationUnitMapper
                        .toApplicationUserOrganisationUnitList(applicationUserOrganisationUnitDTOS));
        return applicationUserOrganisationUnitRepository.saveAll(applicationUserOrganisationUnits);
    }

    public ApplicationUserOrganisationUnit update(Long id, ApplicationUserOrganisationUnit applicationUserOrganisationUnit) {
        applicationUserOrganisationUnitRepository.findByIdAndArchived(id, constant.UN_ARCHIVED)
                .orElseThrow(() -> new EntityNotFoundException(ApplicationUserOrganisationUnit.class, "Id", id +""));
        applicationUserOrganisationUnit.setId(id);
        return applicationUserOrganisationUnitRepository.save(applicationUserOrganisationUnit);
    }

    public ApplicationUserOrganisationUnit getApplicationUserOrganisationUnit(Long id){
        return applicationUserOrganisationUnitRepository.findByIdAndArchived(id, constant.UN_ARCHIVED)
                .orElseThrow(() -> new EntityNotFoundException(ApplicationUserOrganisationUnit.class, "Id", id +""));
    }

    public List<ApplicationUserOrganisationUnit> getAllApplicationUserOrganisationUnit() {
        return applicationUserOrganisationUnitRepository.findAllByArchived(constant.UN_ARCHIVED);
    }

    public Optional<ApplicationUserOrganisationUnit> getApplicationUserOrganisationUnitByUserIdAndOrganisationUnitId(Long applicationUserId, Long organisationUnitId){
        return applicationUserOrganisationUnitRepository.findOneByApplicationUserIdAndOrganisationUnitIdAndArchived(applicationUserId, organisationUnitId, constant.UN_ARCHIVED);
    }

    public void delete(Long id) {
        ApplicationUserOrganisationUnit applicationUserOrganisationUnit =  applicationUserOrganisationUnitRepository.findByIdAndArchived(id, constant.UN_ARCHIVED)
                .orElseThrow(() -> new EntityNotFoundException(ApplicationUserOrganisationUnit.class, "Id", id +""));
            applicationUserOrganisationUnitRepository.delete(applicationUserOrganisationUnit);

    }
}
