package org.lamisplus.modules.base.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.domain.dto.NotificationDTO;
import org.lamisplus.modules.base.domain.dto.SmsSetupDTO;
import org.lamisplus.modules.base.domain.entities.SmsSetup;
import org.lamisplus.modules.base.domain.repositories.SmsSetupRepository;
import org.lamisplus.modules.base.security.SecurityUtils;
import org.lamisplus.modules.base.service.SmsSetUpService;
import org.lamisplus.modules.base.util.PaginationUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/sms-setup")
@RequiredArgsConstructor
@Slf4j
public class SmsSetupController {
    @Autowired
    SmsSetupRepository smsSetupRepository;
    private final SmsSetUpService smsSetUpService;


    @PostMapping(value = "", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<SmsSetupDTO> createNotification (@RequestBody SmsSetupDTO smsSetupDTO ) {
        return ResponseEntity.ok(smsSetUpService.createSmsSetUp(smsSetupDTO));
    }

    @DeleteMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> deleteNotificationById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(smsSetUpService.deleteSmsSetup(id));
    }


    @GetMapping("/all-setups")
//    @PreAuthorize("hasAnyAuthority('general_read', 'admin_read', 'all_permission')")
    public ResponseEntity<List<SmsSetup>> getAllSmsSetups(@PageableDefault(1000) Pageable pageable) {
        Page<SmsSetup> page = smsSetupRepository.findAllNotArchivedOrderByIdDesc(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);

        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }



    @PutMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<SmsSetupDTO> updateNotification(@PathVariable("id") Long id, @RequestBody SmsSetupDTO smsSetupDTO ) {
        return ResponseEntity.ok(smsSetUpService.updateNotification(id, smsSetupDTO));
    }

}
