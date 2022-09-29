package org.lamisplus.modules.base.service;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.dto.ApplicationCodesetDTO;
import org.lamisplus.modules.base.domain.entities.ApplicationCodeSet;
import org.lamisplus.modules.base.domain.repositories.ApplicationCodesetRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class ApplicationCodesetService {

    private final ApplicationCodesetRepository applicationCodesetRepository;

        static final int UN_ARCHIVED = 0;
        static final int ARCHIVED = 1;
    public List<ApplicationCodesetDTO> getAllApplicationCodeset(){

        return applicationCodesetRepository.findAllByArchivedNotOrderByIdAsc(ARCHIVED)
                .stream ()
                .map (this::convertApplicationCodeSetToDto)
                .collect(Collectors.toList());
    }

    public ApplicationCodeSet save(ApplicationCodesetDTO applicationCodesetDTO){
        Optional<ApplicationCodeSet> applicationCodeSetOptional = applicationCodesetRepository.findByDisplayAndCodesetGroupAndArchived(applicationCodesetDTO.getDisplay(),
                applicationCodesetDTO.getCodesetGroup(), UN_ARCHIVED);
        if (applicationCodeSetOptional.isPresent()) {
            throw new RecordExistException(ApplicationCodeSet.class,"Display:",applicationCodesetDTO.getDisplay());
        }

        final ApplicationCodeSet applicationCodeset = convertApplicationCodeDtoSet (applicationCodesetDTO);
        applicationCodeset.setCode(UUID.randomUUID().toString());
        applicationCodeset.setArchived(UN_ARCHIVED);
        String code = applicationCodeset.getCodesetGroup()+"_"+applicationCodeset.getDisplay();
        applicationCodeset.setCode(code.toUpperCase());

        return applicationCodesetRepository.save(applicationCodeset);
    }

    public List<ApplicationCodesetDTO> getApplicationCodeByCodeSetGroup(String codeSetGroup){
        return applicationCodesetRepository.findAllByCodesetGroupAndArchivedOrderByIdAsc(codeSetGroup, UN_ARCHIVED);
    }

    public ApplicationCodesetDTO getApplicationCodeSet(Long id){
        final ApplicationCodeSet applicationCodeset = applicationCodesetRepository.findByIdAndArchived(id, UN_ARCHIVED)
                .orElseThrow(() -> new EntityNotFoundException(ApplicationCodeSet.class,"Display:",id+""));

        return  convertApplicationCodeSetToDto(applicationCodeset);
    }

    public ApplicationCodeSet update(Long id, ApplicationCodesetDTO applicationCodesetDTO){
        applicationCodesetRepository.findByIdAndArchivedNot(id, ARCHIVED)
                .orElseThrow(() -> new EntityNotFoundException(ApplicationCodeSet.class,"Display:",id+""));

        final ApplicationCodeSet applicationCodeset = convertApplicationCodeDtoSet (applicationCodesetDTO);
        applicationCodeset.setId(id);
        if(applicationCodeset.getArchived() == null) {
            //deactivate the codeset, 1 is archived, 0 is unarchived, 2 is deactivate
            applicationCodeset.setArchived(UN_ARCHIVED);
        }
        return applicationCodesetRepository.save(applicationCodeset);
    }

    public void delete(Long id){
        ApplicationCodeSet applicationCodeset = applicationCodesetRepository.findByIdAndArchived(id,UN_ARCHIVED)
                .orElseThrow(() -> new EntityNotFoundException(ApplicationCodeSet.class,"Display:",id+""));
        applicationCodeset.setArchived(ARCHIVED);
    }

    public Boolean exist(String display, String codeSetGroup){
        return applicationCodesetRepository.existsByDisplayAndCodesetGroup(display, codeSetGroup);
    }

    public  ApplicationCodesetDTO convertApplicationCodeSetToDto(ApplicationCodeSet applicationCodeSet){
      return   ApplicationCodesetDTO.builder ()
                .code (applicationCodeSet.getCode ())
                .codesetGroup (applicationCodeSet.getCodesetGroup ())
                .id (applicationCodeSet.getId ())
                .display (applicationCodeSet.getDisplay ())
                .language (applicationCodeSet.getLanguage ())
                .build ();
    }

    public  ApplicationCodeSet convertApplicationCodeDtoSet(ApplicationCodesetDTO applicationCodesetDTO){
        ApplicationCodeSet applicationCodeSet = new ApplicationCodeSet ();
        applicationCodeSet.setCode (applicationCodesetDTO.getCode ());
        applicationCodeSet  .setCodesetGroup (applicationCodesetDTO.getCodesetGroup ());
        applicationCodeSet  .setId (applicationCodesetDTO.getId ());
        applicationCodeSet  .setDisplay (applicationCodesetDTO.getDisplay ());
        applicationCodeSet  .setLanguage (applicationCodesetDTO.getLanguage ());
       return applicationCodeSet;
    }

    public List<ApplicationCodesetDTO> getAllApplicationCodeSets(String code) {
        List<ApplicationCodeSet> applicationCodeSet = applicationCodesetRepository.findAllByCodeAndArchived(code, UN_ARCHIVED);
        if(applicationCodeSet.isEmpty()) throw new EntityNotFoundException(ApplicationCodeSet.class,"Code:",code+"");
        return applicationCodeSet.stream()
                .map(applicationCodeSet1 -> convertApplicationCodeSetToDto(applicationCodeSet1))
                .collect(Collectors.toList());
    }
}
