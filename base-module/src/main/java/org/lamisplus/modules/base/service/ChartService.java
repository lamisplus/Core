package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.domain.dto.ChartDTO;
import org.lamisplus.modules.base.domain.dto.ChartQueryDTO;
import org.lamisplus.modules.base.domain.dto.ChartValueDTO;
import org.lamisplus.modules.base.domain.entities.Chart;
import org.lamisplus.modules.base.domain.entities.User;
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
import org.springframework.cache.annotation.Cacheable;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class ChartService {
    private final ChartRepository chartRepository;
    private final ModuleService moduleService;
    private final DataSource dataSource;
    private final UserService userService;

    /**
     * Get indicator names and types by location
     * @param location the location to filter by
     * @return list of ChartDTO containing indicator name and type
     */
    @Cacheable("core")
    public List<ChartDTO> getIndicatorNameAndTypeByLocation(String location) {
        Set<ChartDTO> chartDTOSet = new HashSet<>();
        for(String moduleName : moduleService.getActiveModuleNames()) {
            Set<ChartDTO> allCharts = getAllChart(moduleName.toLowerCase() + "_chart", location);
            LOG.info("Charts: {}", allCharts.size());
            chartDTOSet.addAll(allCharts);
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
                .map(result -> ChartDTO.builder()
                        .indicatorName((String) result[0])
                        .type((String) result[1])
                        .tableName((String) result[3])
                        .description((String) result[4])
                        .displayName((String) result[5])
                        .icon((String) result[3])
                        .position((Integer) result[7])
                        .build())
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
       if (tableExists(tableName) == false){
           return new HashSet<>();
       }

        String query = String.format("SELECT indicator_name, type, description, display_name, icon, position" +
                " FROM %s WHERE location='%s' AND archived = 0 ", tableName, location);
        Set<ChartDTO> chartDTOS = new HashSet<>();
        Connection conn = null;
        try {
            conn = dataSource.getConnection();
            Statement stmt = conn.createStatement(java.sql.ResultSet.TYPE_FORWARD_ONLY,
                    java.sql.ResultSet.CONCUR_READ_ONLY);
            ResultSet resultSet = stmt.executeQuery(query);
            while (resultSet.next()) {
                ChartDTO chartDTO = ChartDTO.builder()
                        .indicatorName(resultSet.getString(1))
                        .type(resultSet.getString(2))
                        .tableName(tableName)
                        .description(resultSet.getString(3))
                        .displayName(resultSet.getString(4))
                        .icon(resultSet.getString(5))
                        .position(resultSet.getInt(6))
                        .build();
                chartDTOS.add(chartDTO);
            }
        } catch (SQLException e) {
            logSQLExceptions("SQL Exception while getting chartDTOS result set {}", e);
        } finally {
            if (conn != null) {
                try {
                    conn.close();
                } catch (SQLException e) {
                    logSQLExceptions("Exception while closing chartDTOS {}", e);
                }
            }
        }
        return chartDTOS;
    }

    private boolean tableExists(String tableName) {

        boolean tableExists = chartRepository.tableExists(tableName);
        LOG.info("TableName Exists: {}: {}", tableName, tableExists);
        return tableExists;
    }

    /**
     * Get chart Value For Dashboard display
     * @param tableName the name of the table
     * @return list of ChartDTO containing indicator name and type
     */
    @Cacheable("core")
    public ChartValueDTO getChartValueForDashboard(String tableName, String indicatorName, Long facilityId) {
        return getChartValue(indicatorName, getChartQuery(tableName, indicatorName).getQuery(), facilityId);
    }

    /**
     * Get charts values
     * @param tableName the table name
     * @param indicatorName the indicatorName of the chart
     */
    private ChartQueryDTO getChartQuery(String tableName, String indicatorName) {
        String query = String.format("SELECT query FROM %s " +
                "WHERE indicator_name='%s' AND archived=0 LIMIT 1", tableName, indicatorName);
        ChartQueryDTO chartQueryDTO = new ChartQueryDTO();
        Connection conn = null;
        try {
            conn = dataSource.getConnection();
            Statement stmt = conn.createStatement(java.sql.ResultSet.TYPE_FORWARD_ONLY,
                    java.sql.ResultSet.CONCUR_READ_ONLY);
            ResultSet resultSet = stmt.executeQuery(query);
            if (resultSet.next()) {
                chartQueryDTO = ChartQueryDTO.builder()
                        .indicatorName(indicatorName)
                        .query(resultSet.getString(1))
                        .build();
                return chartQueryDTO;
            }
        } catch (SQLException e) {
            logSQLExceptions("SQL Exception while getting chartQueryDTOS result set {}", e);
        } finally {
            if (conn != null) {
                try {
                    conn.close();
                } catch (SQLException e) {
                    logSQLExceptions("SQL Exception while closing chartQueryDTOS connection {}", e);
                }
            }
        }
        return chartQueryDTO;
    }

    /**
     * Get charts value by indicatorName and query
     * @param query the table name
     */
    private ChartValueDTO getChartValue(String indicatorName, String query, Long facilityId) {
        query = query.replace("?facilityId", facilityId.toString());
        ChartValueDTO chartValueDTO = new ChartValueDTO();
        Connection conn = null;
        try {
            conn = dataSource.getConnection();
            Statement stmt = conn.createStatement(java.sql.ResultSet.TYPE_FORWARD_ONLY,
                    java.sql.ResultSet.CONCUR_READ_ONLY);
            ResultSet resultSet = stmt.executeQuery(query);
            if (resultSet.next()) {
                chartValueDTO = ChartValueDTO.builder()
                        .value(resultSet.getString(1))
                        .indicatorName(indicatorName)
                        .build();
                return chartValueDTO;
            }
        } catch (SQLException e) {
            logSQLExceptions("SQL Exception while getting chartValueDTOS result set {}", e);

        } finally {
            if (conn != null) {
                try {
                    conn.close();
                } catch (SQLException e) {
                    logSQLExceptions("Exception while closing chartValueDTOS {}", e);
                }
            }
        }
        return chartValueDTO;
    }

    /**
     * Logging SQL Exceptions
     * @param message - the error message
     * @param sqlException - the sql exception
     */
    private void logSQLExceptions(String message, SQLException sqlException){
        LOG.info(message, sqlException.getMessage());
    }

    /**
     * get facility id of current login user, to be used for the cron job
     * @return  Long - the facility id
     */
    public Long getFacilityId(){
        return userService.getCurrentLoggedInUser().map(User::getCurrentOrganisationUnitId).orElse(null);
    }

}