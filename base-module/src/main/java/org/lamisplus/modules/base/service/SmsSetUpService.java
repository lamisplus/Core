package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.domain.dto.SmsSetupDTO;
import org.lamisplus.modules.base.domain.entities.SmsSetup;
import org.lamisplus.modules.base.domain.repositories.SmsSetupRepository;
import org.lamisplus.modules.base.security.SecurityUtils;
import org.springframework.beans.BeanUtils;

import org.springframework.stereotype.Service;
import reactor.util.UUIDUtils;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class SmsSetUpService {

    private final CurrentUserOrganizationUnitService currentUserOrganizationUnitService;
    private final SmsSetupRepository smsSetupRepository;
    static final Long UN_ARCHIVED = 0L;
    static final Integer ARCHIVED = 1;

        public SmsSetupDTO createSmsSetUp (SmsSetupDTO smsSetupDTO) {
        SmsSetup smsSetup = new SmsSetup();
                Boolean setupExists = smsSetupRepository.messageSetupExists(smsSetupDTO.getMessageCategory(), UN_ARCHIVED);
                if(setupExists){
                   smsSetup.setSenderID(smsSetupDTO.getSenderID());
                   smsSetup.setFrequency(smsSetupDTO.getFrequency());
                   smsSetup.setMessageCategory(smsSetupDTO.getMessageCategory());
                   smsSetup.setMessageBody(smsSetupDTO.getMessageBody());
                   smsSetup.setDateModified(LocalDateTime.now());
                   smsSetup.setModifiedBy(SecurityUtils.getCurrentUserLogin().orElse(null));
                    return smsSetupDTO;
//                    throw new RuntimeException("Message Category already exists in the database: " + smsSetupDTO.getMessageCategory());
                }
            BeanUtils.copyProperties(smsSetupDTO, smsSetup);
            smsSetup.setUuid(UUIDUtils.random().toString());
            smsSetup.setFacilityId(currentUserOrganizationUnitService.getCurrentUserOrganization());
            return convertSmsSetupToDto(smsSetupRepository.save(smsSetup));
        }

    private SmsSetupDTO convertSmsSetupToDto(SmsSetup smsSetup) {
        return SmsSetupDTO.builder()
                .id(smsSetup.getId())
                .senderID(smsSetup.getSenderID())
                .frequency(smsSetup.getFrequency())
                .messageBody(smsSetup.getMessageBody())
                .messageCategory(smsSetup.getMessageCategory())
                .facilityId(smsSetup.getFacilityId())
                .build();
    }

    public String deleteSmsSetup(Long id){
        SmsSetup smsSetup = smsSetupRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(SmsSetup.class, "id", String.valueOf(id)));
        smsSetup.setArchived(ARCHIVED);
        smsSetup.setDateModified(LocalDateTime.now());
        smsSetup.setModifiedBy(SecurityUtils.getCurrentUserLogin().orElse(null));
        smsSetupRepository.save(smsSetup);
            return "Successfully deleted Sms Setup";
        }

    public SmsSetupDTO updateNotification (Long id, SmsSetupDTO smsSetupDTO){
        SmsSetup existingRecord = smsSetupRepository.findById(id)
                .orElseThrow(()-> new EntityNotFoundException(SmsSetup.class, "id", String.valueOf((id))));
        existingRecord.setSenderID(smsSetupDTO.getSenderID());
        existingRecord.setFrequency(smsSetupDTO.getFrequency());
        existingRecord.setMessageCategory(smsSetupDTO.getMessageCategory());
        existingRecord.setMessageBody(smsSetupDTO.getMessageBody());
        existingRecord.setDateModified(LocalDateTime.now());
        existingRecord.setModifiedBy(SecurityUtils.getCurrentUserLogin().orElse(null));
        return smsSetupDTO;
    }
}
