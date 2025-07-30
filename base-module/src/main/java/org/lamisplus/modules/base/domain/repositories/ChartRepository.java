package org.lamisplus.modules.base.domain.repositories;

import org.lamisplus.modules.base.domain.dto.ChartDTO;
import org.lamisplus.modules.base.domain.entities.Chart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChartRepository extends JpaRepository<Chart, String> {

    @Query("SELECT c.indicatorName, c.type FROM Chart c WHERE c.location = :location")
    List<ChartDTO> findIndicatorNameAndTypeByLocation(@Param("location") String location);

    // Alternative native query approach
    @Query(value = "SELECT indicator_name, type, table_name, description, display_name, icon FROM chart WHERE location = :location", nativeQuery = true)
    List<Object[]> findIndicatorNameAndTypeByLocationNative(@Param("location") String location);
}
