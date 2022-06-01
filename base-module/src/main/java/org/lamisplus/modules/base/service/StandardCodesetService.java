package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.dto.StandardCodesetDTO;
import org.lamisplus.modules.base.domain.entities.StandardCodeset;
import org.lamisplus.modules.base.domain.mapper.StandardCodesetMapper;
import org.lamisplus.modules.base.domain.repositories.StandardCodesetRepository;
import org.lamisplus.modules.base.util.Constants;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;


@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class StandardCodesetService {
    private final StandardCodesetRepository standardCodesetRepository;
    private final StandardCodesetMapper standardCodesetMapper;
    private final Constants.ArchiveStatus constant;

    public List<StandardCodesetDTO> getAllStandardCodeset() {
        return standardCodesetMapper.toStandardCodesetDTOList(standardCodesetRepository.findAllByArchivedOrderByIdDesc(constant.UN_ARCHIVED));
    }

    public StandardCodeset save(StandardCodesetDTO standardCodesetDTO) {
        Optional<StandardCodeset> standardCodesetOptional = standardCodesetRepository.findByIdAndAndArchived(standardCodesetDTO.getId(), constant.UN_ARCHIVED);
        if (standardCodesetOptional.isPresent()) throw new RecordExistException(StandardCodeset.class, "Id", standardCodesetDTO.getId() + "");
        final StandardCodeset standardCodeset = standardCodesetMapper.toStandardCodeset(standardCodesetDTO);

        standardCodeset.setArchived(constant.UN_ARCHIVED);
        return standardCodesetRepository.save(standardCodeset);
    }

    public StandardCodesetDTO getStandardCodesetById(Long id) {
        Optional<StandardCodeset> standardCodesetOptional = standardCodesetRepository.findByIdAndAndArchived(id, constant.UN_ARCHIVED);
        if (!standardCodesetOptional.isPresent()) throw new EntityNotFoundException(StandardCodeset.class, "Id", id + "");

        return standardCodesetMapper.toStandardCodesetDTO(standardCodesetOptional.get());
    }

    public StandardCodesetDTO getStandardCodesetByCode(String code) {
        Optional<StandardCodeset> standardCodesetOptional = standardCodesetRepository.findByCodeAndAndArchived(code, constant.UN_ARCHIVED);
        if (!standardCodesetOptional.isPresent()) throw new EntityNotFoundException(StandardCodeset.class, "Id", code + "");

        return standardCodesetMapper.toStandardCodesetDTO(standardCodesetOptional.get());
    }


    //TODO: Working in progress...
    public StandardCodesetDTO getStandardCodesetByApplicationCodesetId(Long applicationCodesetId) {

        /*Optional<StandardCodeset> standardCodesetOptional = standardCodesetRepository.findByCodeAndAndArchived(code, UN_ARCHIVED);
        if (!standardCodesetOptional.isPresent()) throw new EntityNotFoundException(StandardCodeset.class, "Id", code + "");

        return standardCodesetMapper.toStandardCodesetDTO(standardCodesetOptional.get());*/
        return null;
    }

    public List<StandardCodesetDTO> getAllStandardCodesetByStandardCodesetSourceId(Long standardCodesetSourceId) {

        return standardCodesetMapper.toStandardCodesetDTOList(standardCodesetRepository.
                findAllByStandardCodesetSourceIdAndArchived(standardCodesetSourceId, constant.UN_ARCHIVED));
    }

    public StandardCodeset update(Long id, StandardCodesetDTO standardCodesetDTO) {
        Optional<StandardCodeset> standardCodesetOptional = standardCodesetRepository.findByIdAndAndArchived(standardCodesetDTO.getId(), constant.UN_ARCHIVED);
        if (standardCodesetOptional.isPresent()) throw new EntityNotFoundException(StandardCodeset.class, "Id", id + "");
        final StandardCodeset standardCodeset = standardCodesetMapper.toStandardCodeset(standardCodesetDTO);
        standardCodeset.setId(id);
        standardCodeset.setArchived(constant.UN_ARCHIVED);

        return standardCodesetRepository.save(standardCodeset);
    }

    public Integer delete(Long id) {
        Optional<StandardCodeset> standardCodesetOptional = standardCodesetRepository.findByIdAndAndArchived(id, constant.UN_ARCHIVED);
        if (!standardCodesetOptional.isPresent()) throw new EntityNotFoundException(StandardCodeset.class, "Id", id + "");
        StandardCodeset standardCodeset = standardCodesetOptional.get();
        standardCodeset.setArchived(constant.ARCHIVED);
        standardCodesetRepository.save(standardCodeset);

        return constant.ARCHIVED;
    }
}
