package org.lamisplus.modules.base.domain.repositories;

import org.lamisplus.modules.base.domain.dto.ChartDTO;
import org.lamisplus.modules.base.domain.entities.Chart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface ChartRepository extends JpaRepository<Chart, String> {

    @Query("SELECT c.indicatorName, c.type FROM Chart c WHERE c.location = :location")
    List<ChartDTO> findIndicatorNameAndTypeByLocation(@Param("location") String location);

    // Alternative native query approach
    @Query(value = "SELECT indicator_name, type, table_name, description, display_name, icon, position FROM chart WHERE location = :location", nativeQuery = true)
    List<Object[]> findIndicatorNameAndTypeByLocationNative(@Param("location") String location);

    @Query(value = "SELECT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = ?1)", nativeQuery = true)
    boolean tableExists(String tableName);

    @Query(value = "SELECT * FROM chart WHERE indicator_name = ?1 LIMIT 1", nativeQuery = true)
    Optional<Chart> findOneByIndicatorName(String indicatorName);

    void deleteByIndicatorName(String indicatorName);

    @Query(value = "SELECT * FROM chart WHERE location = ?1 ", nativeQuery = true)
    Set<Chart> getAllChartsByLocation(String location);

    @Query(value = "SELECT * FROM chart WHERE location = ?1 AND module in (SELECT m.name FROM base_module m WHERE m.active = true) AND archived = 0", nativeQuery = true)
    Set<Chart> getAllActiveChartsByLocation(String location);

    @Query(value = "SELECT query FROM chart WHERE indicator_name = ?1 ", nativeQuery = true)
    String getChartQuery(String indicatorName);

    @Query(value = "SELECT * FROM chart WHERE indicator_name=?1 ", nativeQuery = true)
    Optional<Chart> findByIndicatorName(String indicatorName);
}
