package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.IllegalTypeException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.dto.OrganisationUnitLevelDTO;
import org.lamisplus.modules.base.domain.entities.OrganisationUnit;
import org.lamisplus.modules.base.domain.entities.OrganisationUnitLevel;
import org.lamisplus.modules.base.domain.repositories.OrganisationUnitLevelRepository;
import org.lamisplus.modules.base.domain.repositories.OrganisationUnitRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.lamisplus.modules.base.util.Constants.ArchiveStatus.UN_ARCHIVED;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class OrganisationUnitLevelService {
    private final OrganisationUnitLevelRepository organisationUnitLevelRepository;
    private final OrganisationUnitRepository organisationUnitRepository;
    private final OrganisationUnitService organisationUnitService;


    public OrganisationUnitLevelDTO save(OrganisationUnitLevelDTO organisationUnitLevelDTO) {
        Optional<OrganisationUnitLevel> organizationOptional = organisationUnitLevelRepository.findByNameAndArchived (organisationUnitLevelDTO.getName (), UN_ARCHIVED);
        if (organizationOptional.isPresent ())
            throw new RecordExistException (OrganisationUnitLevel.class, "Name", organisationUnitLevelDTO.getName () + "");

        OrganisationUnitLevel organisationUnitLevel = organisationUnitLevelRepository.findByIdAndArchived (
                organisationUnitLevelDTO.getParentOrganisationUnitLevelId (),
                UN_ARCHIVED).orElseThrow (
                () -> new EntityNotFoundException (
                        OrganisationUnitLevel.class,
                        "ParentOrganisationUnitLevel",
                        organisationUnitLevelDTO.getParentOrganisationUnitLevelId () + ""));

        //if has no subset is 0 while has subset is 1
        if (organisationUnitLevel.getStatus () == 0) {
            throw new IllegalTypeException (OrganisationUnitLevel.class, "ParentOrganisationUnitLevel", "cannot have subset");
        }

        organisationUnitLevel = toOrganisationUnitLevel (organisationUnitLevelDTO);
        organisationUnitLevel.setArchived (UN_ARCHIVED);
        organisationUnitLevelRepository.save (organisationUnitLevel);
        return toOrganisationUnitLevelDTO (organisationUnitLevel);
    }

    public OrganisationUnitLevelDTO update(Long id, OrganisationUnitLevelDTO organisationUnitLevelDTO) {
        organisationUnitLevelRepository.findByIdAndArchived (id, UN_ARCHIVED)
                .orElseThrow (() -> new EntityNotFoundException (OrganisationUnitLevel.class, "Id", id + ""));
        OrganisationUnitLevel organisationUnitLevel = toOrganisationUnitLevel (organisationUnitLevelDTO);
        organisationUnitLevel.setId (id);
        organisationUnitLevel.setArchived (UN_ARCHIVED);
        organisationUnitLevelRepository.save (organisationUnitLevel);
        return toOrganisationUnitLevelDTO (organisationUnitLevel);
    }

    /*public Integer delete(Long id) {
        Optional<OrganisationUnitLevel> organizationOptional = organisationUnitLevelRepository.findByIdAndArchived(id, UN_ARCHIVED);
        if (!organizationOptional.isPresent())throw new EntityNotFoundException(OrganisationUnitLevel.class, "Id", id +"");
        return organizationOptional.get().getArchived();
    }*/

    public OrganisationUnitLevelDTO getOrganizationUnitLevel(Long id) {
        OrganisationUnitLevel organisationUnitLevel = organisationUnitLevelRepository.findByIdAndArchived (id, UN_ARCHIVED)
                .orElseThrow (() -> new EntityNotFoundException (OrganisationUnitLevel.class, "Id", id + ""));
        return toOrganisationUnitLevelDTO (organisationUnitLevel);
    }

    public List<OrganisationUnitLevelDTO> getAllOrganizationUnitLevel(Integer status) {
        if (status != null && status < 2) {
            return
                    organisationUnitLevelRepository.findAllByStatusAndArchivedOrderByIdAsc (status, UN_ARCHIVED)
                            .stream ().map (this::toOrganisationUnitLevelDTO).collect (Collectors.toList ());
        }
        return organisationUnitLevelRepository.findAllByArchivedOrderByIdAsc (UN_ARCHIVED)
                .stream ()
                .map (this::toOrganisationUnitLevelDTO).collect (Collectors.toList ());
    }

    public List<OrganisationUnit> getAllOrganisationUnitsByOrganizationUnitLevel(Long id) {
        organisationUnitLevelRepository.findByIdAndArchived (id, UN_ARCHIVED)
                .orElseThrow (() -> new EntityNotFoundException (OrganisationUnitLevel.class, "Id", id + ""));
        return organisationUnitRepository.findByOrganisationsByLevelAndArchived (id, UN_ARCHIVED)
                .stream ()
                .map (organisationUnit -> organisationUnitService.findOrganisationUnits (organisationUnit, organisationUnit.getId ()))
                .collect (Collectors.toList ());
    }

    public List<OrganisationUnit> getAllParentOrganisationUnitsByOrganizationUnitLevel(Long id) {
        OrganisationUnitLevel organisationUnitLevel = organisationUnitLevelRepository.findByIdAndArchived (id, UN_ARCHIVED)
                .orElseThrow (() -> new EntityNotFoundException (OrganisationUnitLevel.class, "Id", id + ""));

        if (organisationUnitLevel.getParentOrganisationUnitLevelId () == null || organisationUnitLevel.getParentOrganisationUnitLevelId () == 0) {
            throw new EntityNotFoundException (OrganisationUnitLevel.class, organisationUnitLevel.getName (), "has no parent");
        }
        return organisationUnitRepository.findByOrganisationsByLevelAndArchived (organisationUnitLevel.getParentOrganisationUnitLevelId (), UN_ARCHIVED)
                .stream ()
                .map (organisationUnit -> organisationUnitService.findOrganisationUnits (organisationUnit, organisationUnit.getId ()))
                .collect (Collectors.toList ());
    }


    public OrganisationUnitLevelDTO toOrganisationUnitLevelDTO(OrganisationUnitLevel organisationUnitLevel) {
        if (organisationUnitLevel == null) {
            return null;
        }

        OrganisationUnitLevelDTO organisationUnitLevelDTO = new OrganisationUnitLevelDTO ();

        organisationUnitLevelDTO.setId (organisationUnitLevel.getId ());
        organisationUnitLevelDTO.setName (organisationUnitLevel.getName ());
        organisationUnitLevelDTO.setDescription (organisationUnitLevel.getDescription ());
        organisationUnitLevelDTO.setStatus (organisationUnitLevel.getStatus ());
        organisationUnitLevelDTO.setParentOrganisationUnitLevelId (organisationUnitLevel.getParentOrganisationUnitLevelId ());

        return organisationUnitLevelDTO;
    }


    public OrganisationUnitLevel toOrganisationUnitLevel(OrganisationUnitLevelDTO organisationUnitLevelDTO) {
        if (organisationUnitLevelDTO == null) {
            return null;
        }

        OrganisationUnitLevel organisationUnitLevel = new OrganisationUnitLevel ();

        organisationUnitLevel.setId (organisationUnitLevelDTO.getId ());
        organisationUnitLevel.setName (organisationUnitLevelDTO.getName ());
        organisationUnitLevel.setDescription (organisationUnitLevelDTO.getDescription ());
        organisationUnitLevel.setStatus (organisationUnitLevelDTO.getStatus ());
        organisationUnitLevel.setParentOrganisationUnitLevelId (organisationUnitLevelDTO.getParentOrganisationUnitLevelId ());

        return organisationUnitLevel;
    }

}
