package org.lamisplus.modules.base.domain.repositories;

import org.lamisplus.modules.base.domain.entities.ModuleRelease;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ModuleReleaseRepository extends JpaRepository<ModuleRelease, Long> {
    @Query(value = "SELECT t.*" +
            "FROM module_releases t\n" +
            "JOIN (\n" +
            "    SELECT name, MAX(release_date) AS max_date\n" +
            "    FROM module_releases\n" +
            "    GROUP BY name\n" +
            ") latest_dates ON t.name = latest_dates.name AND t.release_date = latest_dates.max_date;\n", nativeQuery = true)
    List<ModuleRelease> getLatestModuleReleases();
}
