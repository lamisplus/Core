package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.domain.dto.ChartDTO;
import org.lamisplus.modules.base.domain.entities.Chart;
import org.lamisplus.modules.base.domain.repositories.ChartRepository;
import org.lamisplus.modules.base.module.ModuleService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class ChartService {
    private final ChartRepository chartRepository;
    private final ModuleService moduleService;
    private final DataSource dataSource;

    /**
     * Get indicator names and types by location
     * @param location the location to filter by
     * @return list of ChartDTO containing indicator name and type
     */
    public List<ChartDTO> getIndicatorNameAndTypeByLocation(String location) {
        Set<ChartDTO> chartDTOSet = new HashSet<>();
        for(String moduleName : moduleService.getActiveModuleNames()) {
            chartDTOSet.addAll(getAllChart(moduleName.toLowerCase() + "_chart", location));
        }
        return new ArrayList<>(chartDTOSet);
    }

    /**
     * Alternative method using native query
     * @param location the location to filter by
     * @return list of ChartDTO containing indicator name and type
     */
    public List<ChartDTO> getIndicatorNameAndTypeByLocationNative(String location) {
        List<Object[]> results = chartRepository.findIndicatorNameAndTypeByLocationNative(location);
        return results.stream()
                .map(result -> new ChartDTO((String) result[0], (String) result[1]))
                .collect(Collectors.toList());
    }

    /**
     * Get all charts
     * @return list of all Chart entities
     */
    public List<Chart> getAllCharts() {
        return chartRepository.findAll();
    }

    /**
     * Get chart by indicator name
     * @param indicatorName the indicator name (primary key)
     * @return Chart entity or null if not found
     */
    public Chart getChartByIndicatorName(String indicatorName) {
        return chartRepository.findById(indicatorName).orElse(null);
    }

    /**
     * Save or update a chart
     * @param chart the chart to save
     * @return saved Chart entity
     */
    public Chart saveChart(Chart chart) {
        return chartRepository.save(chart);
    }

    /**
     * Delete chart by indicator name
     * @param indicatorName the indicator name (primary key)
     */
    public void deleteChart(String indicatorName) {
        chartRepository.deleteById(indicatorName);
    }

    /**
     * Delete get all charts
     * @param tableName the table name
     * @param location the of the chart
     */
    private Set<ChartDTO> getAllChart(String tableName, String location) {
        String query = String.format("SELECT indicator_name, type FROM %s WHERE location='%s'", tableName, location);
        Set<ChartDTO> chartDTOS = new HashSet<>();
        Connection conn = null;
        try {
            conn = dataSource.getConnection();
            Statement stmt = conn.createStatement(java.sql.ResultSet.TYPE_FORWARD_ONLY,
                    java.sql.ResultSet.CONCUR_READ_ONLY);
            ResultSet resultSet = stmt.executeQuery(query);
            while (resultSet.next()) {
                chartDTOS.add(new ChartDTO(resultSet.getString(1), resultSet.getString(2)));
            }
        } catch (SQLException e) {
            LOG.debug("SQL Exception while getting result set is {}", e.getMessage());
        } finally {
            if (conn != null) {
                try {
                    conn.close();
                } catch (SQLException e) {
                    LOG.debug("Exception while closing connection is {}", e.getMessage());
                }
            }
        }
        return chartDTOS;
    }
}