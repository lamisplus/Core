package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.dto.StandardCodesetDTO;
import org.lamisplus.modules.base.domain.entities.StandardCodeset;
import org.lamisplus.modules.base.domain.repositories.StandardCodesetRepository;
import org.lamisplus.modules.base.util.Constants;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class StandardCodesetService {
    private final StandardCodesetRepository standardCodesetRepository;
    public static final int UN_ARCHIVED = 0;
    public static final int ARCHIVED = 1;

    public List<StandardCodesetDTO> getAllStandardCodeset() {
        return this.toStandardCodesetDTOList(standardCodesetRepository.findAllByArchivedOrderByIdDesc(UN_ARCHIVED));
    }

    public StandardCodeset save(StandardCodesetDTO standardCodesetDTO) {
        Optional<StandardCodeset> standardCodesetOptional = standardCodesetRepository.findByIdAndAndArchived(standardCodesetDTO.getId(), UN_ARCHIVED);
        if (standardCodesetOptional.isPresent()) throw new RecordExistException(StandardCodeset.class, "Id", standardCodesetDTO.getId() + "");
        final StandardCodeset standardCodeset = this.toStandardCodeset(standardCodesetDTO);

        standardCodeset.setArchived(UN_ARCHIVED);
        return standardCodesetRepository.save(standardCodeset);
    }

    public StandardCodesetDTO getStandardCodesetById(Long id) {
        Optional<StandardCodeset> standardCodesetOptional = standardCodesetRepository.findByIdAndAndArchived(id, UN_ARCHIVED);
        if (!standardCodesetOptional.isPresent()) throw new EntityNotFoundException(StandardCodeset.class, "Id", id + "");

        return this.toStandardCodesetDTO(standardCodesetOptional.get());
    }

    public StandardCodesetDTO getStandardCodesetByCode(String code) {
        Optional<StandardCodeset> standardCodesetOptional = standardCodesetRepository.findByCodeAndAndArchived(code, UN_ARCHIVED);
        if (!standardCodesetOptional.isPresent()) throw new EntityNotFoundException(StandardCodeset.class, "Id", code + "");

        return this.toStandardCodesetDTO(standardCodesetOptional.get());
    }


    //TODO: Working in progress...
    public StandardCodesetDTO getStandardCodesetByApplicationCodesetId(Long applicationCodesetId) {

        /*Optional<StandardCodeset> standardCodesetOptional = standardCodesetRepository.findByCodeAndAndArchived(code, UN_ARCHIVED);
        if (!standardCodesetOptional.isPresent()) throw new EntityNotFoundException(StandardCodeset.class, "Id", code + "");

        return standardCodesetMapper.toStandardCodesetDTO(standardCodesetOptional.get());*/
        return null;
    }

    public List<StandardCodesetDTO> getAllStandardCodesetByStandardCodesetSourceId(Long standardCodesetSourceId) {

        return this.toStandardCodesetDTOList(standardCodesetRepository.
                findAllByStandardCodesetSourceIdAndArchived(standardCodesetSourceId, UN_ARCHIVED));
    }

    public StandardCodeset update(Long id, StandardCodesetDTO standardCodesetDTO) {
        Optional<StandardCodeset> standardCodesetOptional = standardCodesetRepository.findByIdAndAndArchived(standardCodesetDTO.getId(), UN_ARCHIVED);
        if (standardCodesetOptional.isPresent()) throw new EntityNotFoundException(StandardCodeset.class, "Id", id + "");
        final StandardCodeset standardCodeset = this.toStandardCodeset(standardCodesetDTO);
        standardCodeset.setId(id);
        standardCodeset.setArchived(UN_ARCHIVED);

        return standardCodesetRepository.save(standardCodeset);
    }

    public Integer delete(Long id) {
        Optional<StandardCodeset> standardCodesetOptional = standardCodesetRepository.findByIdAndAndArchived(id, UN_ARCHIVED);
        if (!standardCodesetOptional.isPresent()) throw new EntityNotFoundException(StandardCodeset.class, "Id", id + "");
        StandardCodeset standardCodeset = standardCodesetOptional.get();
        standardCodeset.setArchived(ARCHIVED);
        standardCodesetRepository.save(standardCodeset);

        return ARCHIVED;
    }

    public StandardCodesetDTO toStandardCodesetDTO(StandardCodeset standardCodeset) {
        if ( standardCodeset == null ) {
            return null;
        }

        StandardCodesetDTO standardCodesetDTO = new StandardCodesetDTO();

        standardCodesetDTO.setId( standardCodeset.getId() );
        standardCodesetDTO.setCode( standardCodeset.getCode() );
        standardCodesetDTO.setDescription( standardCodeset.getDescription() );
        standardCodesetDTO.setStandardCodesetSourceId( standardCodeset.getStandardCodesetSourceId() );

        return standardCodesetDTO;
    }

    public StandardCodeset toStandardCodeset(StandardCodesetDTO standardCodesetDTO) {
        if ( standardCodesetDTO == null ) {
            return null;
        }

        StandardCodeset standardCodeset = new StandardCodeset();

        standardCodeset.setId( standardCodesetDTO.getId() );
        standardCodeset.setCode( standardCodesetDTO.getCode() );
        standardCodeset.setDescription( standardCodesetDTO.getDescription() );
        standardCodeset.setStandardCodesetSourceId( standardCodesetDTO.getStandardCodesetSourceId() );

        return standardCodeset;
    }

    public List<StandardCodesetDTO> toStandardCodesetDTOList(List<StandardCodeset> standardCodesets) {
        if ( standardCodesets == null ) {
            return null;
        }

        List<StandardCodesetDTO> list = new ArrayList<StandardCodesetDTO>( standardCodesets.size() );
        for ( StandardCodeset standardCodeset : standardCodesets ) {
            list.add( toStandardCodesetDTO( standardCodeset ) );
        }
        return list;
    }
}
