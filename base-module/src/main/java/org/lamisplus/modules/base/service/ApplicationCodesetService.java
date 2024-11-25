package org.lamisplus.modules.base.service;


import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVPrinter;
import org.apache.commons.csv.CSVRecord;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.dto.ApplicationCodesetDTO;
import org.lamisplus.modules.base.domain.entities.ApplicationCodeSet;
import org.lamisplus.modules.base.domain.repositories.ApplicationCodesetRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class ApplicationCodesetService {

    private final ApplicationCodesetRepository applicationCodesetRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private static final String TEMP_BASE_DIR = System.getProperty("user.dir");


        static final int UN_ARCHIVED = 0;
        static final int ARCHIVED = 1;
    public List<ApplicationCodesetDTO> getAllApplicationCodeset(){

        return applicationCodesetRepository.findAllByArchivedNotOrderByIdAsc(ARCHIVED)
                .stream ()
//                .map (this::convertApplicationCodeSetToDto)
                .map (ApplicationCodesetDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public ApplicationCodeSet save(ApplicationCodesetDTO applicationCodesetDTO){
        Optional<ApplicationCodeSet> applicationCodeSetOptional = applicationCodesetRepository.findByDisplayAndCodesetGroupAndArchived(applicationCodesetDTO.getDisplay(),
                applicationCodesetDTO.getCodesetGroup(), UN_ARCHIVED);
        if (applicationCodeSetOptional.isPresent()) {
            throw new RecordExistException(ApplicationCodeSet.class,"Display:",applicationCodesetDTO.getDisplay());
        }

        updateCodesetCode(applicationCodesetDTO);
        confirmAltCodeExists(applicationCodesetDTO);
        updateCodeSetGroup(applicationCodesetDTO);
        //the sql - update base_application_codeset
        //set code = REPLACE(REPLACE(TRIM(UPPER(codeset_group || '_' || display)), '/', ''), ' ', '_')
//        final ApplicationCodeSet applicationCodeset = convertApplicationCodeDtoSet (applicationCodesetDTO);
        final ApplicationCodeSet applicationCodeset = ApplicationCodeSet.fromDto(applicationCodesetDTO);
//        applicationCodeset.setCode(UUID.randomUUID().toString());
        applicationCodeset.setArchived(UN_ARCHIVED);

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

//        return  convertApplicationCodeSetToDto(applicationCodeset);
        return  ApplicationCodesetDTO.fromEntity(applicationCodeset);
    }

    public ApplicationCodeSet update(Long id, ApplicationCodesetDTO applicationCodesetDTO){
        ApplicationCodeSet applicationCodeSetOld = applicationCodesetRepository.findByIdAndArchivedNot(id, ARCHIVED)
                .orElseThrow(() -> new EntityNotFoundException(ApplicationCodeSet.class,"Display:",id+""));
        confirmAltCodeExists(applicationCodesetDTO);
        updateCodeSetGroup(applicationCodesetDTO);

//        final ApplicationCodeSet applicationCodeset = convertApplicationCodeDtoSet (applicationCodesetDTO);
        ApplicationCodeSet applicationCodeset = ApplicationCodeSet.fromDto(applicationCodesetDTO);
        applicationCodeset.setId(id);
        applicationCodeset.setCode(applicationCodeSetOld.getCode());
        if(applicationCodeset.getArchived() == null) {
            //deactivate the codeset, 1 is archived, 0 is unarchived, 2 is deactivated
            applicationCodeset.setArchived(UN_ARCHIVED);
        }
        ApplicationCodeSet saved = applicationCodesetRepository.save(applicationCodeset);
        return saved;
    }

    private void confirmAltCodeExists(ApplicationCodesetDTO applicationCodesetDTO) {
        String altCode  = applicationCodesetDTO.getAltCode();
        if (altCode != null){
            updateAltCode(applicationCodesetDTO);
            Optional<ApplicationCodeSet> applicationCodeSet = applicationCodesetRepository.findByCode(applicationCodesetDTO.getAltCode());
            if (!applicationCodeSet.isPresent()){
                throw new EntityNotFoundException(ApplicationCodeSet.class, "Alternate code", " not found.");
            }
        }
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
                .altCode (applicationCodeSet.getAltCode ())
                .codesetGroup (applicationCodeSet.getCodesetGroup ())
                .id (applicationCodeSet.getId ())
                .display (applicationCodeSet.getDisplay ())
                .description (applicationCodeSet.getDescription ())
                .language (applicationCodeSet.getLanguage ())
                .version (applicationCodeSet.getVersion ())
                .archived (applicationCodeSet.getArchived ())
                .build ();
    }

    public  ApplicationCodeSet convertApplicationCodeDtoSet(ApplicationCodesetDTO applicationCodesetDTO){
        ApplicationCodeSet applicationCodeSet = new ApplicationCodeSet ();
        applicationCodeSet.setCode (applicationCodesetDTO.getCode ());
        applicationCodeSet.setAltCode (applicationCodesetDTO.getAltCode ());
        applicationCodeSet  .setCodesetGroup (applicationCodesetDTO.getCodesetGroup ());
        applicationCodeSet  .setId (applicationCodesetDTO.getId ());
        applicationCodeSet  .setDisplay (applicationCodesetDTO.getDisplay ());
        applicationCodeSet  .setDescription (applicationCodesetDTO.getDescription ());
        applicationCodeSet  .setLanguage (applicationCodesetDTO.getLanguage ());
       return applicationCodeSet;
    }

    private void updateCodesetCode(ApplicationCodesetDTO applicationCodesetDTO) {
        String code = applicationCodesetDTO.getCodesetGroup()+"_"+ applicationCodesetDTO.getDisplay().trim();
        code = code.replace("/", "_").replace(" ", "_");
        applicationCodesetDTO.setCode(code.toUpperCase().trim());
    }

    private void updateCodeSetGroup(ApplicationCodesetDTO applicationCodesetDTO) {
        String codesetGroup = applicationCodesetDTO.getCodesetGroup();
        codesetGroup = codesetGroup.replace("/", "_").replace(" ", "_");
        applicationCodesetDTO.setCodesetGroup(codesetGroup.toUpperCase().trim());
    }

    private static void updateAltCode(ApplicationCodesetDTO applicationCodesetDTO) {
        String altCode = applicationCodesetDTO.getAltCode();
        altCode = altCode.replace("/", "_").replace(" ", "_");
        applicationCodesetDTO.setAltCode(altCode.toUpperCase().trim());
    }

    public List<ApplicationCodesetDTO> getAllApplicationCodeSets(String code) {
        List<ApplicationCodeSet> applicationCodeSet = applicationCodesetRepository.findAllByCodeAndArchived(code, UN_ARCHIVED);
        if(applicationCodeSet.isEmpty()) throw new EntityNotFoundException(ApplicationCodeSet.class,"Code:",code+"");
        return applicationCodeSet.stream()
//                .map(this::convertApplicationCodeSetToDto)
                .map(ApplicationCodesetDTO::fromEntity)
                .collect(Collectors.toList());
    }


    public ApplicationCodesetDTO getOneByCode(String code) {
        Optional<ApplicationCodeSet> foundCodeset = applicationCodesetRepository.findByCode(code);
        if(!foundCodeset.isPresent()) throw new EntityNotFoundException(ApplicationCodeSet.class,"Code:",code);
        return ApplicationCodesetDTO.fromEntity(foundCodeset.get());
    }

    public void getApplicationCodeSetsAsCsv(Writer writer) {
        LOG.info("Exporting application code sets to CSV");

        List<ApplicationCodeSet> applicationCodeSets =
//        applicationCodesetRepository.findAllByArchivedNotOrderByIdAsc(ARCHIVED);
        applicationCodesetRepository.findAllByOrderByIdAsc();
        try {

            CSVPrinter printer = new CSVPrinter(writer, CSVFormat.DEFAULT);
            printer.printRecord("id", "code", "alt_code", "version", "codeset_group",
                    "display", "description", "language", "archived", "date_created",
                    "created_by", "date_modified", "modified_by"
            );
            for (ApplicationCodeSet applicationCodeSet : applicationCodeSets) {
//                LOG.info("applicationCodeSet: {}", applicationCodeSet.toString());
                printer.printRecord(
                        String.valueOf(applicationCodeSet.getId()),
                        String.valueOf(applicationCodeSet.getCode()),
                        String.valueOf(applicationCodeSet.getAltCode()),
                        String.valueOf(applicationCodeSet.getVersion()),
                        String.valueOf(applicationCodeSet.getCodesetGroup()),
                        String.valueOf(applicationCodeSet.getDisplay()),
                        String.valueOf(applicationCodeSet.getDescription()),
                        String.valueOf(applicationCodeSet.getLanguage()),
                        String.valueOf(applicationCodeSet.getArchived()),
                        String.valueOf(applicationCodeSet.getDateCreated()),
                        String.valueOf(applicationCodeSet.getCreatedBy()),
                        String.valueOf(applicationCodeSet.getDateModified()),
                        String.valueOf(applicationCodeSet.getModifiedBy())
                );
            }
            writer.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void getApplicationCodeSetsFile(OutputStream outputStream, String fileType) {
        LOG.info("Exporting application code sets to {}", fileType);

        List<ApplicationCodeSet> applicationCodeSets =
                applicationCodesetRepository.findAllByOrderByIdAsc();
        List<ApplicationCodesetDTO> dtos = applicationCodeSets.stream()
                .map(ApplicationCodesetDTO::fromEntity)
                .collect(Collectors.toList());
        try (OutputStreamWriter writer = new OutputStreamWriter(outputStream, StandardCharsets.UTF_8)) {
            objectMapper.enable(SerializationFeature.INDENT_OUTPUT);
            objectMapper.writeValue(writer, dtos);
            outputStream.close();
        } catch (Exception e) {
            LOG.error("Error occurred while writing file: {}", e.getMessage());
        }
    }


    @Transactional
    public List<ApplicationCodesetDTO> readFileData(MultipartFile file, String fileType) throws IOException {
        LOG.info("Importing application codesets in {} format.", fileType);
        List<ApplicationCodesetDTO> listOfCodesets = new ArrayList<>();
        if (fileType.equalsIgnoreCase("csv")){
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
                CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT.withHeader());
                for (CSVRecord csvRecord : csvParser) {
                    ApplicationCodesetDTO appCode = new ApplicationCodesetDTO();
                    appCode.setId(Long.parseLong(csvRecord.get("id")));
                    appCode.setCode(csvRecord.get("code"));
                    appCode.setAltCode(csvRecord.get("alt_code"));
                    appCode.setVersion(csvRecord.get("version"));
                    appCode.setCodesetGroup(csvRecord.get("codeset_group"));
                    appCode.setDisplay(csvRecord.get("display"));
                    appCode.setDescription(csvRecord.get("description"));
                    appCode.setLanguage(csvRecord.get("language"));
                    appCode.setArchived(Integer.valueOf(csvRecord.get("archived")));
                    listOfCodesets.add(appCode);
                }
            } catch (IOException e) {
                throw new RuntimeException("An error occurred while processing file.", e);
            }
        } else if (fileType.equalsIgnoreCase("json")) {
            try {
                listOfCodesets = Arrays.asList(objectMapper.readValue(
                        file.getInputStream(), ApplicationCodesetDTO[].class));
            } catch (JsonMappingException | JsonParseException e) {
                throw new RuntimeException("An error occurred while processing file.", e);
            }
        }

//        createLog();
        return listOfCodesets;
    }

        //working correctively
    @Transactional
    public List<ApplicationCodesetDTO> saveCodesets(List<ApplicationCodesetDTO> codesetDTOList) {
        List<ApplicationCodeSet> codesetsToBeSaved = new ArrayList<>();

        for (ApplicationCodesetDTO dto : codesetDTOList) {
            // This checks if the code with the same code exists
            Optional<ApplicationCodeSet> existingCode = applicationCodesetRepository.findByCode(dto.getCode());

            if (existingCode.isPresent()) {
                // Update existing application Code set
                ApplicationCodeSet existingAppCodeset = existingCode.get();
                existingAppCodeset.setVersion(dto.getVersion());
                existingAppCodeset.setAltCode(dto.getAltCode());
                existingAppCodeset.setCodesetGroup(dto.getCodesetGroup());
                existingAppCodeset.setDisplay(dto.getDisplay());
                existingAppCodeset.setDescription(dto.getDescription());
                existingAppCodeset.setLanguage(dto.getLanguage());
                existingAppCodeset.setArchived(dto.getArchived());
                codesetsToBeSaved.add(applicationCodesetRepository.save(existingAppCodeset));
            } else {
                // add new application code set when is not existing
                ApplicationCodeSet newAppCodeset = new ApplicationCodeSet();
                newAppCodeset.setCode(dto.getCode());
                newAppCodeset.setAltCode(dto.getAltCode());
                newAppCodeset.setVersion(dto.getVersion());
                newAppCodeset.setCodesetGroup(dto.getCodesetGroup());
                newAppCodeset.setDisplay(dto.getDisplay());
                newAppCodeset.setDescription(dto.getDescription());
                newAppCodeset.setLanguage(dto.getLanguage());
                newAppCodeset.setArchived(dto.getArchived());
                codesetsToBeSaved.add(newAppCodeset);
                codesetsToBeSaved.size();
            }
        }

        List<ApplicationCodeSet> savedCodesets =
                applicationCodesetRepository.saveAll(codesetsToBeSaved);
        // Transform the saved entities back to DTOs and return the list
        return savedCodesets.stream()
                .map(ApplicationCodesetDTO::fromEntity)
                .collect(Collectors.toList());
    }



}
