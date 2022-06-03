package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.dto.StandardCodesetSourceDTO;
import org.lamisplus.modules.base.domain.entities.StandardCodesetSource;
import org.lamisplus.modules.base.domain.repositories.StandardCodesetSourceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class StandardCodesetSourceService {
    private final StandardCodesetSourceRepository standardCodesetSourceRepository;
    public static final int UN_ARCHIVED = 0;
    public static final int ARCHIVED = 1;


    public List<StandardCodesetSourceDTO> getAllStandardCodesetSource() {
        return this.toStandardCodesetSourceDTOList(standardCodesetSourceRepository.findAllByArchivedOrderByIdDesc(UN_ARCHIVED));
    }

    public StandardCodesetSource save(StandardCodesetSourceDTO standardCodesetSourceDTO) {
        Optional<StandardCodesetSource> standardCodesetSourceOptional = standardCodesetSourceRepository.findByIdAndAndArchived(standardCodesetSourceDTO.getId(), UN_ARCHIVED);
        if (standardCodesetSourceOptional.isPresent()) throw new RecordExistException(StandardCodesetSource.class, "Id", standardCodesetSourceDTO.getId() + "");
        final StandardCodesetSource standardCodesetSource = this.toStandardCodesetSource(standardCodesetSourceDTO);

        standardCodesetSource.setArchived(UN_ARCHIVED);
        return standardCodesetSourceRepository.save(standardCodesetSource);
    }

    public StandardCodesetSourceDTO getStandardCodesetSourceById(Long id) {
        Optional<StandardCodesetSource> standardCodesetSourceOptional = standardCodesetSourceRepository.findByIdAndAndArchived(id, UN_ARCHIVED);
        if (!standardCodesetSourceOptional.isPresent()) throw new EntityNotFoundException(StandardCodesetSource.class, "Id", id + "");

        return this.toStandardCodesetSourceDTO(standardCodesetSourceOptional.get());
    }

    public StandardCodesetSource update(Long id, StandardCodesetSourceDTO standardCodesetSourceDTO) {
        Optional<StandardCodesetSource> standardCodesetSourceOptional = standardCodesetSourceRepository.findByIdAndAndArchived(standardCodesetSourceDTO.getId(), UN_ARCHIVED);
        if (standardCodesetSourceOptional.isPresent()) throw new EntityNotFoundException(StandardCodesetSource.class, "Id", id + "");
        final StandardCodesetSource standardCodesetSource = this.toStandardCodesetSource(standardCodesetSourceDTO);

        standardCodesetSource.setId(id);
        standardCodesetSource.setArchived(UN_ARCHIVED);
        return standardCodesetSourceRepository.save(standardCodesetSource);
    }

    public Integer delete(Long id) {
        Optional<StandardCodesetSource> standardCodesetSourceOptional = standardCodesetSourceRepository.findByIdAndAndArchived(id, UN_ARCHIVED);
        if (!standardCodesetSourceOptional.isPresent()) throw new EntityNotFoundException(StandardCodesetSource.class, "Id", id + "");
        StandardCodesetSource standardCodesetSource = standardCodesetSourceOptional.get();
        standardCodesetSource.setArchived(UN_ARCHIVED);
        standardCodesetSourceRepository.save(standardCodesetSource);

        return ARCHIVED;
    }

    public StandardCodesetSourceDTO toStandardCodesetSourceDTO(StandardCodesetSource standardCodesetSource) {
        if ( standardCodesetSource == null ) {
            return null;
        }

        StandardCodesetSourceDTO standardCodesetSourceDTO = new StandardCodesetSourceDTO();

        standardCodesetSourceDTO.setId( standardCodesetSource.getId() );
        standardCodesetSourceDTO.setName( standardCodesetSource.getName() );
        standardCodesetSourceDTO.setDescription( standardCodesetSource.getDescription() );

        return standardCodesetSourceDTO;
    }

    public StandardCodesetSource toStandardCodesetSource(StandardCodesetSourceDTO standardCodesetSourceDTO) {
        if ( standardCodesetSourceDTO == null ) {
            return null;
        }

        StandardCodesetSource standardCodesetSource = new StandardCodesetSource();

        standardCodesetSource.setId( standardCodesetSourceDTO.getId() );
        standardCodesetSource.setName( standardCodesetSourceDTO.getName() );
        standardCodesetSource.setDescription( standardCodesetSourceDTO.getDescription() );

        return standardCodesetSource;
    }

    public List<StandardCodesetSourceDTO> toStandardCodesetSourceDTOList(List<StandardCodesetSource> standardCodesetSource) {
        if ( standardCodesetSource == null ) {
            return null;
        }

        List<StandardCodesetSourceDTO> list = new ArrayList<StandardCodesetSourceDTO>( standardCodesetSource.size() );
        for ( StandardCodesetSource standardCodesetSource1 : standardCodesetSource ) {
            list.add( toStandardCodesetSourceDTO( standardCodesetSource1 ) );
        }

        return list;
    }
}
