package org.lamisplus.modules.base.service;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVPrinter;
import org.apache.commons.csv.CSVRecord;
import org.lamisplus.modules.base.domain.entities.SystemSettings;
import org.lamisplus.modules.base.domain.repositories.SystemSettingsRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import java.io.*;
import java.util.ArrayList;
import java.util.List;


@Service
@Slf4j
@RequiredArgsConstructor
public class SystemSettingService {


    private final SystemSettingsRepository systemSettingsRepository;


    public SystemSettings updateSystemSetting(String key, SystemSettings request) {
        SystemSettings systemSettings = systemSettingsRepository.findByKey(key)
                .orElseThrow(() -> new EntityNotFoundException("System setting " + key + " not found"));


        systemSettings.setValue(request.getValue());
        systemSettings.setDescription(request.getDescription());

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
            printer.printRecord("key","value", "description");

                for (SystemSettings setting : settings) {
                    printer.printRecord(setting.getKey(),setting.getValue(), setting.getDescription());
                }
            } catch (IOException e) {
                throw new RuntimeException("Error generating CSV file", e);
            }
    }


    @Transactional
    public Object importSystemSettingAsCSV(MultipartFile file) throws IOException {

        List<SystemSettings> systemSettingsList = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT.withHeader());
            for (CSVRecord csvRecord : csvParser) {
                if (systemSettingsRepository.findByKey(csvRecord.get("key")).isPresent()){
                    SystemSettings systemSetting = new SystemSettings();
                    systemSetting.setKey(csvRecord.get("key"));
                    systemSetting.setValue(csvRecord.get("value"));
                    systemSetting.setDescription(csvRecord.get("description"));
                    systemSettingsList.add(systemSetting);
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
            throw e;
        }

        return systemSettingsRepository.saveAll(systemSettingsList);

    }




}
