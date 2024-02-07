package org.lamisplus.modules.base.service;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.dto.ApplicationCodesetDTO;
import org.lamisplus.modules.base.domain.entities.ApplicationCodeSet;
import org.lamisplus.modules.base.domain.repositories.ApplicationCodesetRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Writer;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;
//import org.apache.commons.csv.CSVFormat;
//import org.apache.commons.csv.CSVPrinter;
import org.springframework.web.multipart.MultipartFile;

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

        //the sql - update base_application_codeset
        //set code = REPLACE(REPLACE(TRIM(UPPER(codeset_group || '_' || display)), '/', ''), ' ', '_')
        final ApplicationCodeSet applicationCodeset = convertApplicationCodeDtoSet (applicationCodesetDTO);
        applicationCodeset.setCode(UUID.randomUUID().toString());
        applicationCodeset.setArchived(UN_ARCHIVED);
        String code = applicationCodeset.getCodesetGroup()+"_"+applicationCodeset.getDisplay();
        code = code.replace("/", "_").replace(" ", "_");
        //code = code.replaceAll("[\\p{Punct}&&[^_]]+|^_+|\\p{Punct}+(?=_|$)", "_");
        applicationCodeset.setCode(code.toUpperCase().trim());

        return applicationCodesetRepository.save(applicationCodeset);
    }

    public List<ApplicationCodeSet> getApplicationCodeByCodeSetGroup(String codeSetGroup){
        return applicationCodesetRepository
                .findAllByCodesetGroupAndArchivedOrderByIdAsc(codeSetGroup, UN_ARCHIVED)
                .stream().filter(distinctByKey(ApplicationCodeSet::getDisplay))
                .collect(Collectors.toList());
    }

    static <T> Predicate<T> distinctByKey(Function<? super T, ?> keyExtractor) {
        Set<Object> seen = ConcurrentHashMap.newKeySet();
        return t -> seen.add(keyExtractor.apply(t));
    }

    public ApplicationCodesetDTO getApplicationCodeset(Long id){
        final ApplicationCodeSet applicationCodeset = applicationCodesetRepository.findByIdAndArchived(id, UN_ARCHIVED)
                .orElseThrow(() -> new EntityNotFoundException(ApplicationCodeSet.class,"Display:",id+""));

        return  convertApplicationCodeSetToDto(applicationCodeset);
    }

    public ApplicationCodeSet update(Long id, ApplicationCodesetDTO applicationCodesetDTO){
        ApplicationCodeSet applicationCodeSetOld = applicationCodesetRepository.findByIdAndArchivedNot(id, ARCHIVED)
                .orElseThrow(() -> new EntityNotFoundException(ApplicationCodeSet.class,"Display:",id+""));

        final ApplicationCodeSet applicationCodeset = convertApplicationCodeDtoSet (applicationCodesetDTO);
        applicationCodeset.setId(id);
        applicationCodeset.setCode(applicationCodeSetOld.getCode());
        if(applicationCodeset.getArchived() == null) {
            //deactivate the codeset, 1 is archived, 0 is unarchived, 2 is deactivated
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
                .version (applicationCodeSet.getVersion ())
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
                .map(this::convertApplicationCodeSetToDto)
                .collect(Collectors.toList());
    }

    public void getApplicationCodeSetsAsCsv(Writer writer) {
        List<ApplicationCodeSet> applicationCodeSets =
        applicationCodesetRepository.findAllByArchivedNotOrderByIdAsc(ARCHIVED);
        try {

            CSVPrinter printer = new CSVPrinter(writer, CSVFormat.DEFAULT);
            printer.printRecord("id", "code", "version", "codeset_group",
                    "display", "language", "archived", "created_by",
                    "date_created", "modified_by", "date_modified"
            );
            for (ApplicationCodeSet applicationCodeSet : applicationCodeSets) {
                printer.printRecord(
                        applicationCodeSet.getId(),
                        applicationCodeSet.getCode(),
                        applicationCodeSet.getVersion(),
                        applicationCodeSet.getCodesetGroup(),
                        applicationCodeSet.getDisplay(),
                        applicationCodeSet.getLanguage(),
                        applicationCodeSet.getArchived(),
                        applicationCodeSet.getDateCreated(),
                        applicationCodeSet.getCreatedBy(),
                        applicationCodeSet.getDateModified(),
                        applicationCodeSet.getModifiedBy()
                );
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Transactional
    public List<ApplicationCodesetDTO> readCsv(MultipartFile file) throws IOException {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            return reader.lines()
                    .skip(1) // Skip header
                    .map(line -> {
                        String[] fields = line.split(",");
                        ApplicationCodesetDTO appCode = new ApplicationCodesetDTO();
                        appCode.setId(Long.parseLong(fields[0]));
                        appCode.setCode(fields[1]);
                        appCode.setVersion(fields[2]);
                        appCode.setCodesetGroup(fields[3]);
                        appCode.setDisplay(fields[4]);
                        appCode.setLanguage(fields[5]);
//                        appCode.setArchived(Integer.parseInt(fields[6]));
                        return appCode;
                    })
                    .collect(Collectors.toList());
        }
    }

        //working correctively
    @Transactional
    public List<ApplicationCodesetDTO> saveCodesets(List<ApplicationCodesetDTO> codesetDTOList) {
        List<ApplicationCodeSet> savedCodesets = new ArrayList<>();

        for (ApplicationCodesetDTO dto : codesetDTOList) {
            // This checks if the code with the same code exists
            Optional<ApplicationCodeSet> existingCode = applicationCodesetRepository.findByCode(dto.getCode());

            if (existingCode.isPresent()) {
                // Update existing application Code set
                ApplicationCodeSet existingAppCode = existingCode.get();
                existingAppCode.setVersion(dto.getVersion());
                existingAppCode.setCodesetGroup(dto.getCodesetGroup());
                existingAppCode.setDisplay(dto.getDisplay());
                existingAppCode.setLanguage(dto.getLanguage());
//                existingAppCode.setArchived(dto.getArchived());
                savedCodesets.add(applicationCodesetRepository.save(existingAppCode));
            } else {
                // add new application code set when is not existing
                ApplicationCodeSet newAppCode = new ApplicationCodeSet();
                newAppCode.setCode(dto.getCode());
                newAppCode.setVersion(dto.getVersion());
                newAppCode.setCodesetGroup(dto.getCodesetGroup());
                newAppCode.setDisplay(dto.getDisplay());
                newAppCode.setLanguage(dto.getLanguage());
//                newAppCode.setArchived(dto.getArchived());
                savedCodesets.add(applicationCodesetRepository.save(newAppCode));
                savedCodesets.size();
            }
        }

        // Transform the saved entities back to DTOs and return the list
        return savedCodesets.stream()
                .map(appCode -> ApplicationCodesetDTO.builder()
                        .id(appCode.getId())
                        .code(appCode.getCode())
                        .version(appCode.getVersion())
                        .codesetGroup(appCode.getCodesetGroup())
                        .display(appCode.getDisplay())
                        .language(appCode.getLanguage())
//                        .archived(appCode.getArchived())
                        .build())
                .collect(Collectors.toList());
    }
}
