package org.lamisplus.modules.base.domain.repositories;

import org.lamisplus.modules.base.domain.dto.AppointmentProjectionDto;
import org.lamisplus.modules.base.domain.entities.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    Notification findByFacilityIdAndIndicator(Long facilityId, String indicator);

//    List<Notification> getAllByOrganisationUnitAndArchived (Long OrganisationUnit, int archived);

//    List<Notification> getAllByNotificationAndFacilityId(Long facilityId, int archived);

    Optional<Notification> findById(Long id);

    @Query(value = "SELECT id FROM base_application_notification_config WHERE id = ?1 AND archived = ?2", nativeQuery = true)
    Optional<Notification> findByIdAndArchived(Long id, int archived);

    @Query(value = "SELECT id, indicator, period FROM base_application_notification_config WHERE indicator = ?1 AND period =?2 AND archived = 0", nativeQuery = true)
//    Boolean findIndicatorByFacilityIdAndIndicator(String indicator, String period);
    Optional<Notification> findIndicatorByFacilityIdAndIndicator(String indicator, String period);

    List<Notification> getAllByfacilityIdAndArchived(Long facilityId, int archived);


    @Query(value = "SELECT period from base_application_notification_config WHERE facility_id = ?1 AND archived = 0", nativeQuery = true)
    String getPeriodAndIndicatorFromDatabase (Long facilityId);


    @Query(value = "SELECT  p.uuid, surname, first_name AS firstName, hospital_number AS hospitalNumber, sex, \n" +
            "CAST(EXTRACT(YEAR FROM AGE(NOW(), date_of_birth)) AS INTEGER) AS age, pharm.regimen,\n" +
            "pharm.lastVisit, pharm.refill_period AS refillPeriod, pharm.appointmentDate, COUNT(*) OVER () AS totalCount\n" +
            "FROM \n" +
            "patient_person p\n" +
            "INNER JOIN (\n" +
            "SELECT DISTINCT ON (hap.person_uuid)\n" +
            "    hap.person_uuid,\n" +
            "    hap.visit_date AS lastVisit,\n" +
            "    hap.next_appointment AS appointmentDate,\n" +
            "    hap.refill_period,\n" +
            "\textra->'regimens'->0->>'name' AS regimen,\n" +
            "\tROW_NUMBER() OVER (PARTITION BY person_uuid ORDER BY hap.visit_date DESC) AS rn\n" +
            "FROM\n" +
            "    hiv_art_pharmacy hap\n" +
            "WHERE\n" +
            "    hap.archived = 0 AND hap.next_appointment = CAST (NOW() AS DATE)\n" +
            ") pharm ON pharm.person_uuid = p.uuid \n" +
            "WHERE p.facility_id = ?1 AND pharm.appointmentDate = CAST(NOW() AS DATE)", nativeQuery = true)
    List<AppointmentProjectionDto> getTodaysAppointment(Long facilityId);


    @Query(value = "SELECT  p.uuid, surname, first_name AS firstName, hospital_number AS hospitalNumber, sex, \n" +
            "CAST(EXTRACT(YEAR FROM AGE(NOW(), date_of_birth)) AS INTEGER) AS age, pharm.regimen,\n" +
            "pharm.lastVisit, pharm.refill_period AS refillPeriod, pharm.appointmentDate, COUNT(*) OVER () AS totalCount\n" +
            "FROM \n" +
            "patient_person p\n" +
            "INNER JOIN (\n" +
            "SELECT DISTINCT ON (hap.person_uuid)\n" +
            "    hap.person_uuid,\n" +
            "    hap.visit_date AS lastVisit,\n" +
            "    hap.next_appointment AS appointmentDate,\n" +
            "    hap.refill_period,\n" +
            "\textra->'regimens'->0->>'name' AS regimen,\n" +
            "\tROW_NUMBER() OVER (PARTITION BY person_uuid ORDER BY hap.visit_date DESC) AS rn\n" +
            "FROM\n" +
            "    hiv_art_pharmacy hap\n" +
            "WHERE\n" +
            "    hap.archived = 0 AND hap.next_appointment >= date_trunc('week', CURRENT_DATE) \n" +
            "\tAND hap.next_appointment < date_trunc('week', CURRENT_DATE) + INTERVAL '7 days'\n" +
            ") pharm ON pharm.person_uuid = p.uuid \n" +
            "WHERE pharm.appointmentDate >= date_trunc('week', CURRENT_DATE) \n" +
            "AND  pharm.appointmentDate < date_trunc('week', CURRENT_DATE) + INTERVAL '7 days'\n" +
            "AND  p.facility_id = ?1", nativeQuery = true)
    List<AppointmentProjectionDto> getWeeklyAppointments (Long facilityId);

    @Query(value = "SELECT hospital_number AS hospitalNumber, surname, first_name AS firstName,  sex, \n" +
            "CAST(EXTRACT(YEAR FROM AGE(NOW(), date_of_birth)) AS INTEGER) AS age, pharm.regimen,\n" +
            "pharm.lastVisit, pharm.refill_period AS refillPeriod, pharm.appointmentDate, COUNT(*) OVER () AS totalCount\n" +
            "FROM \n" +
            "patient_person p\n" +
            "INNER JOIN (\n" +
            "SELECT DISTINCT ON (hap.person_uuid)\n" +
            "    hap.person_uuid,\n" +
            "    hap.visit_date AS lastVisit,\n" +
            "    hap.next_appointment AS appointmentDate,\n" +
            "    hap.refill_period,\n" +
            "\textra->'regimens'->0->>'name' AS regimen,\n" +
            "\tROW_NUMBER() OVER (PARTITION BY person_uuid ORDER BY hap.visit_date DESC) AS rn\n" +
            "FROM\n" +
            "    hiv_art_pharmacy hap\n" +
            "WHERE\n" +
            "    hap.archived = 0 AND hap.next_appointment >= date_trunc('month', CURRENT_DATE) \n" +
            "    AND hap.next_appointment < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'\n" +
            ") pharm ON pharm.person_uuid = p.uuid \n" +
            "WHERE pharm.appointmentDate >= date_trunc('month', CURRENT_DATE) \n" +
            "AND  pharm.appointmentDate < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'\n" +
            "AND  p.facility_id = ?1", nativeQuery = true)
//    List<AppointmentProjectionDto> getMonthlyAppointments (Long facilityId);
    List<AppointmentProjectionDto> getMonthlyAppointments(Long facilityId);

}
