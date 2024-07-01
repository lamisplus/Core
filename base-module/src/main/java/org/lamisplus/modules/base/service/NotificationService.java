package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.IllegalTypeException;
import org.lamisplus.modules.base.domain.dto.AppointmentProjectionDto;
import org.lamisplus.modules.base.domain.dto.NotificationDTO;
import org.lamisplus.modules.base.domain.entities.Notification;
import org.lamisplus.modules.base.domain.repositories.NotificationRepository;
import org.lamisplus.modules.base.security.SecurityUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import reactor.util.UUIDUtils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final CurrentUserOrganizationUnitService currentUserOrganizationUnitService;

    static final int UN_ARCHIVED = 0;

    public NotificationDTO createOrUpdateNotification(NotificationDTO notificationDTO) {
        Notification notification = new Notification();
        Optional<Notification> existingIndicator = notificationRepository.findIndicatorByFacilityIdAndIndicator(notificationDTO.getIndicator(), notificationDTO.getPeriod());

        if (existingIndicator.isPresent()) {
            notification.setIndicator(notificationDTO.getIndicator());
            notification.setPeriod(notificationDTO.getPeriod());
            notification.setDateModified(LocalDateTime.now());
            notification.setModifiedBy(SecurityUtils.getCurrentUserLogin().orElse(null));
            return  notificationDTO;
//            throw new RuntimeException("Indicator already exists in the database: " + notification.getIndicator());
        }
        LOG.info("Heere is for new Notifivaitiion {}" ,existingIndicator);
        BeanUtils.copyProperties(notificationDTO, notification);
        notification.setUuid(UUIDUtils.random().toString());
        notification.setFacilityId(currentUserOrganizationUnitService.getCurrentUserOrganization());
        return convertNotificationToDto(notificationRepository.save(notification));
    }

    private NotificationDTO convertNotificationToDto(Notification notification) {
        return NotificationDTO.builder()
                .id(notification.getId())
                .period(notification.getPeriod())
                .uuid(notification.getUuid())
                .indicator(notification.getIndicator())
                .facilityId(notification.getFacilityId())
                .build();
    }


    public String deleteNotification(Long id) {
        Notification notification = notificationRepository
                .findById(id)
                .orElseThrow(() -> new EntityNotFoundException(Notification.class, "id", String.valueOf(id)));
        notification.setArchived(1);
        notificationRepository.save(notification);
        return "successfully deleted";
    }

    public NotificationDTO updateNotification (Long id, NotificationDTO notificationDTO){
        Notification existingRecord = notificationRepository.findById(id)
                .orElseThrow(()-> new EntityNotFoundException(Notification.class, "id", String.valueOf((id))));
                existingRecord.setIndicator(notificationDTO.getIndicator());
                existingRecord.setPeriod(notificationDTO.getPeriod());
                Notification saveNotification = notificationRepository.save(existingRecord);
                return notificationDTO;
    }

    public List<NotificationDTO> getAllNotification (Long facilityId){
        try {
            List<Notification> nofitications = notificationRepository.getAllByfacilityIdAndArchived(facilityId, UN_ARCHIVED);

            LOG.info("get all notification {}", nofitications);
            return nofitications.stream()
                    .filter(notification -> notification.getArchived() == 0)
                    .map(this::convertNotificationToDto).collect(Collectors.toList());
        } catch (Exception e) {
            throw new IllegalTypeException(String.class, "Error: ", "An error occurred while fetching notifications.");
        }
    }

    public List<AppointmentProjectionDto> getAppointmentCategory(Long facilityId) {
//        facilityId = currentUserOrganizationService.getCurrentUserOrganization();
        try {
            List<String> facilityPeriods = notificationRepository.getPeriodAndIndicatorFromDatabase(facilityId);
            if (!facilityPeriods.isEmpty()){
                for (String each : facilityPeriods) {
                    switch(each) {
                        case "Daily":
                            return notificationRepository.getTodaysAppointment(facilityId);
                        case "Weekly":
                            return notificationRepository.getWeeklyAppointments(facilityId);
                        case "Monthly":
                            return notificationRepository.getMonthlyAppointments(facilityId);
                        default:
                            return new ArrayList<>();
                    }
                }
            }
            return new ArrayList<>();

        } catch (Exception e) {
            LOG.error("This is the error {}", e.getCause().toString());
            throw new IllegalTypeException(String.class, "Error: ", "An error occurred while fetching appointments.");
        }
    }

}
