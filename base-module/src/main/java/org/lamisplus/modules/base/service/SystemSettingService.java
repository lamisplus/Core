package org.lamisplus.modules.base.service;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.lamisplus.modules.base.domain.dto.SystemSettingDto;
import org.lamisplus.modules.base.domain.entities.SystemSettings;
import org.lamisplus.modules.base.domain.repositories.SystemSettingsRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import java.io.*;
import java.util.List;
import java.util.stream.Collectors;


@Service
@Slf4j
@RequiredArgsConstructor
public class SystemSettingService {


    private final SystemSettingsRepository systemSettingsRepository;


    public SystemSettings updateSystemSetting(String key, SystemSettingDto request) {
        SystemSettings systemSettings = systemSettingsRepository.findByKey(key)
                .orElseThrow(() -> new EntityNotFoundException("System setting " + key + " not found"));


        systemSettings.setValue(request.getValue());

        systemSettingsRepository.save(systemSettings);

        return systemSettings;

    }


    public SystemSettings getSystemSetting(String key) {
        SystemSettings systemSettings = systemSettingsRepository.findByKey(key)
                .orElseThrow(() -> new EntityNotFoundException("System setting " + key + " not found"));

        return systemSettings;
    }

    public List<SystemSettings> getAllSystemSettings() {
        return systemSettingsRepository.findAll();
    }

    public void exportSystemSettingAsCSV(PrintWriter writer) {

            List<SystemSettings> settings = systemSettingsRepository.findAll();

        try {
            CSVPrinter printer = new CSVPrinter(writer, CSVFormat.DEFAULT);
            printer.printRecord("Key","Value");

                for (SystemSettings setting : settings) {
                    printer.printRecord(setting.getKey(),setting.getValue());
                }
            } catch (IOException e) {
                throw new RuntimeException("Error generating CSV file", e);
            }
    }


    @Transactional
    public Object importSystemSettingAsCSV(MultipartFile file) {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            List<SystemSettings> settings = reader.lines()
                    .skip(1)
                    .map(line -> {
                        String[] fields = line.split(",");
                        SystemSettings systemSettings = new SystemSettings();
                        systemSettings.setKey(fields[0].trim());
                        systemSettings.setValue(fields[1].trim());
                        return systemSettings;
                    })
                    .collect(Collectors.toList());


            systemSettingsRepository.saveAll(settings);


            return "System settings imported successfully";

        } catch (IOException e) {
            throw new RuntimeException("Error importing CSV file", e);
        }

    }




}
