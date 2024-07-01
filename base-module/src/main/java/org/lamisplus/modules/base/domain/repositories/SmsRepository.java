package org.lamisplus.modules.base.domain.repositories;

import org.lamisplus.modules.base.domain.dto.PhoneNumbersDto;
import org.lamisplus.modules.base.domain.entities.SMSOutput;
import org.lamisplus.modules.base.domain.entities.SmsSetup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface SmsRepository extends JpaRepository<SMSOutput, Long> {
    @Query(value = "SELECT CASE WHEN COUNT(d) > 0 THEN TRUE ELSE FALSE END FROM public.sms_output d " +
            "WHERE d.message_type = ?1 and time_stamp = ?2 and notification_count = ?3 and comment='Completed Successfully'", nativeQuery = true)
    Boolean messageSentPerDateAndPerSmsCategory(String message_type, LocalDate date, String notification_count );

    @Query(value = "SELECT * FROM public.sms_output order by id desc", nativeQuery = true)
    List <SMSOutput>findAllOrderByIdDesc();
//    Page<SMSOutput> findAllOrderByIdDesc(Pageable pageable);

    @Query(value = "SELECT p.contact_point->'contactPoint'->0->>'value' AS phoneNumbers\n" +
            "FROM \n" +
            "patient_person p\n" +
            "INNER JOIN (\n" +
            "SELECT DISTINCT ON (hap.person_uuid)\n" +
            "    hap.person_uuid,\n" +
            "    hap.visit_date AS lastVisit,\n" +
            "    hap.next_appointment AS appointmentDate,\n" +
            "    hap.refill_period,\n" +
            "extra->'regimens'->0->>'name' AS regimen,\n" +
            "ROW_NUMBER() OVER (PARTITION BY person_uuid ORDER BY hap.visit_date DESC) AS rn\n" +
            "FROM\n" +
            "    hiv_art_pharmacy hap\n" +
            "WHERE\n" +
            "    hap.archived = 0 AND hap.next_appointment IS NOT NULL\n" +
            ") pharm ON pharm.person_uuid = p.uuid AND rn = 1\n" +
            "WHERE p.contact_point->'contactPoint'->0->>'value' IS NOT NULL\n" +
            "AND CAST(pharm.appointmentDate AS DATE) - INTERVAL '7 days' = CAST(NOW() AS DATE)" +
            "AND p.archived = 0 AND p.facility_id = ?1", nativeQuery = true)
    List<PhoneNumbersDto> getPhoneNumbers7DueIn(Long facilityId);

    @Query(value = "SELECT p.contact_point->'contactPoint'->0->>'value' AS phoneNumbers\n" +
            "FROM \n" +
            "patient_person p\n" +
            "INNER JOIN (\n" +
            "SELECT DISTINCT ON (hap.person_uuid)\n" +
            "    hap.person_uuid,\n" +
            "    hap.visit_date AS lastVisit,\n" +
            "    hap.next_appointment AS appointmentDate,\n" +
            "    hap.refill_period,\n" +
            "extra->'regimens'->0->>'name' AS regimen,\n" +
            "ROW_NUMBER() OVER (PARTITION BY person_uuid ORDER BY hap.visit_date DESC) AS rn\n" +
            "FROM\n" +
            "    hiv_art_pharmacy hap\n" +
            "WHERE\n" +
            "    hap.archived = 0 AND hap.next_appointment IS NOT NULL\n" +
            ") pharm ON pharm.person_uuid = p.uuid AND rn = 1\n" +
            "WHERE p.contact_point->'contactPoint'->0->>'value' IS NOT NULL\n" +
            "AND CAST(pharm.appointmentDate AS DATE) - INTERVAL '30 days' = CAST(NOW() AS DATE)" +
            "AND p.archived = 0 AND p.facility_id = ?1", nativeQuery = true)
    List<PhoneNumbersDto> getPhoneNumbers30DueIn(Long facilityId);


    @Query(value = "SELECT p.contact_point->'contactPoint'->0->>'value' AS phoneNumbers\n" +
            "FROM \n" +
            "patient_person p\n" +
            "INNER JOIN (\n" +
            "SELECT DISTINCT ON (hap.person_uuid)\n" +
            "    hap.person_uuid,\n" +
            "    hap.visit_date AS lastVisit,\n" +
            "    hap.next_appointment AS appointmentDate,\n" +
            "    hap.refill_period,\n" +
            "extra->'regimens'->0->>'name' AS regimen,\n" +
            "ROW_NUMBER() OVER (PARTITION BY person_uuid ORDER BY hap.visit_date DESC) AS rn\n" +
            "FROM\n" +
            "    hiv_art_pharmacy hap\n" +
            "WHERE\n" +
            "    hap.archived = 0 AND hap.next_appointment IS NOT NULL\n" +
            ") pharm ON pharm.person_uuid = p.uuid AND rn = 1\n" +
            "WHERE p.contact_point->'contactPoint'->0->>'value' IS NOT NULL\n" +
            "AND CAST(pharm.appointmentDate AS DATE) - INTERVAL '1 days' = CAST(NOW() AS DATE)" +
            "AND p.archived = 0 AND p.facility_id = ?1", nativeQuery = true)
    List<PhoneNumbersDto> getPhoneNumbers1DueIn(Long facilityId);

    @Query(value = "SELECT * FROM base_application_sms_config where frequency = ?1 and archived = 0 limit 1", nativeQuery = true)
    Optional<SmsSetup> findByFrequency (String frequency);
}
