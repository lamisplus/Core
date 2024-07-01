package org.lamisplus.modules.base.domain.repositories;

import org.lamisplus.modules.base.domain.entities.SystemSettings;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SystemSettingsRepository extends JpaRepository<SystemSettings, String> {
    Optional<SystemSettings> findByKey(String key);

}
