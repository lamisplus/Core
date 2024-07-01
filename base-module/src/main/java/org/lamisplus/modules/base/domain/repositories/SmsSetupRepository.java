package org.lamisplus.modules.base.domain.repositories;

import org.lamisplus.modules.base.domain.entities.SmsSetup;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.Optional;

public interface SmsSetupRepository extends JpaRepository<SmsSetup, Long> {
    @Query(value = "SELECT CASE WHEN COUNT(d) > 0 THEN TRUE ELSE FALSE END FROM base_application_sms_config d " +
            "WHERE d.message_category = ?1 and archived = ?2 ", nativeQuery = true)
    Boolean messageSetupExists(String message_category, Long archived);

    @Query(value = "SELECT * FROM base_application_sms_config order by id desc", nativeQuery = true)
    Page<SmsSetup> findAllOrderByIdDesc(Pageable pageable);
    @Query(value = "SELECT * FROM base_application_sms_config where archived = 0 order by id desc", nativeQuery = true)
    Page<SmsSetup> findAllNotArchivedOrderByIdDesc(Pageable pageable);

    @Query(value = "SELECT * FROM base_application_sms_config where message_category = ?1 AND frequency = ?2 and archived = 0 limit 1", nativeQuery = true)
    Optional<SmsSetup> findByMessageCategory(String messageCategory, String frequency);

}
