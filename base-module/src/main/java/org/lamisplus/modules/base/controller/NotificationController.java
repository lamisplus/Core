package org.lamisplus.modules.base.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.domain.dto.AppointmentProjectionDto;
import org.lamisplus.modules.base.domain.dto.NotificationDTO;
import org.lamisplus.modules.base.service.CurrentUserOrganizationService;
import org.lamisplus.modules.base.service.NotificationService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/notification")
public class NotificationController {

    private final NotificationService notificationService;
    private final CurrentUserOrganizationService organizationService;


    @PostMapping(value = "", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<NotificationDTO> createNotification (@RequestBody NotificationDTO notificationDTO ) {
        return ResponseEntity.ok(notificationService.createOrUpdateNotification(notificationDTO));
    }

    @DeleteMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> deleteNotificationById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(notificationService.deleteNotification(id));
    }

    @GetMapping(value = "/notifications", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<NotificationDTO>> getNotifications () throws ExecutionException, InterruptedException {
        Long facilityId = organizationService.getCurrentUserOrganization();
        return ResponseEntity.ok(notificationService.getAllNotification(facilityId));
    }

    @PutMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<NotificationDTO> updateNotification(@PathVariable("id") Long id, @RequestBody NotificationDTO notificationDTO ) {
        return ResponseEntity.ok(notificationService.updateNotification(id, notificationDTO));
    }

    @GetMapping(value = "/appointments", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<AppointmentProjectionDto>> getAppointments () throws ExecutionException, InterruptedException {
        Long facility = organizationService.getCurrentUserOrganization();
        return ResponseEntity.ok(notificationService.getAppointmentCategory(facility));
    }
}

