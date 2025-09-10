package org.lamisplus.modules.base.service;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.domain.dto.ChartDTO;
import org.lamisplus.modules.base.domain.dto.ChartQueryDTO;
import org.lamisplus.modules.base.domain.dto.ChartRequestDto;
import org.lamisplus.modules.base.domain.dto.ChartValueDTO;
import org.lamisplus.modules.base.domain.entities.Chart;
import org.lamisplus.modules.base.domain.entities.User;
import org.lamisplus.modules.base.domain.repositories.ChartRepository;
import org.lamisplus.modules.base.module.ModuleService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.sql.DataSource;
import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class ChartService {
    private final ChartRepository chartRepository;
    private final ModuleService moduleService;
    private final DataSource dataSource;
    private final UserService userService;
    private final ObjectMapper objectMapper;

//    /**
//     * Get indicator names and types by location
//     * @param location the location to filter by
//     * @return list of ChartDTO containing indicator name and type
//     */
//    @Cacheable("core")
//    public List<ChartDTO> getIndicatorNameAndTypeByLocation(String location) {
//        Set<ChartDTO> chartDTOSet = new HashSet<>();
//        for(String moduleName : moduleService.getActiveModuleNames()) {
//            Set<ChartDTO> allCharts = getAllChart(moduleName.toLowerCase() + "_chart", location);
//            chartDTOSet.addAll(allCharts);
//        }
//        return new ArrayList<>(chartDTOSet);
//    }

    /**
     * Get indicator names and types by location
     * @param location the location to filter by
     * @return list of ChartDTO containing indicator name and type
     */
    @Cacheable("core")
    public List<ChartDTO> getIndicatorNameAndTypeByLocation(String location) {
        return chartRepository.getAllChartsByLocation(location)
                .stream().map(ChartDTO::fromEntity)
                .collect(Collectors.toList());
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
//                        .tableName((String) result[3])
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
     * Get all charts
     * @return list of all Charts as DTOs
     */
    public List<ChartDTO> getAllChartsAsList() {
        return chartRepository.findAll().stream().map(ChartDTO::fromEntitySafe).collect(Collectors.toList());
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
     * Update chart by indicator name
     * @param indicatorName the indicator name (primary key)
     */
    public ChartDTO updateChart(String indicatorName, ChartRequestDto chartRequestDto) {
        Chart foundChart = chartRepository.findOneByIndicatorName(indicatorName)
                .orElseThrow(() -> new IllegalArgumentException("No chart found for indicator name provided"));

        foundChart.setLocation(chartRequestDto.getLocation());
        foundChart.setPosition(chartRequestDto.getPosition());
        foundChart.setType(chartRequestDto.getType());
        foundChart.setModule(chartRequestDto.getModule());
        foundChart.setIcon(chartRequestDto.getIcon());
        foundChart.setDescription(chartRequestDto.getDescription());
        foundChart.setDisplayName(chartRequestDto.getDisplayName());
        foundChart.setPosition(chartRequestDto.getPosition());

        return ChartDTO.fromEntity(chartRepository.save(foundChart));
    }

    /**
     * Delete chart by indicator name
     * @param indicatorName the indicator name (primary key)
     */
    public void deleteChart(String indicatorName) {
        chartRepository.deleteByIndicatorName(indicatorName);
    }

    /**
     * Get get all charts
     * @param tableName the table name
     * @param location the of the chart
     */
    private Set<ChartDTO> getAllChart(String tableName, String location) {
       if (!tableExists(tableName)){
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
//                        .tableName(tableName)
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
        return tableExists;
    }

    /**
     * Get chart Value For Dashboard display
     * @param indicatorName the name of the table
     * @param facilityId the id of the facility
     * @return list of ChartDTO containing indicator name and type
     */
    @Cacheable("core")
//    public ChartValueDTO getChartValueForDashboard(String tableName, String indicatorName, Long facilityId) {
    public ChartValueDTO getChartValueForDashboard(String indicatorName, Long facilityId) {
//        return getChartValue(indicatorName, getChartQuery(tableName, indicatorName).getQuery(), facilityId);
        return getChartValue(indicatorName, chartRepository.getChartQuery(indicatorName), facilityId);
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

    @Transactional
    public List<ChartDTO> importChartData(MultipartFile file) throws IOException {
        LOG.info("Importing chart datafrom file.");
        List<ChartDTO> listOfCodesets = new ArrayList<>();

        try {
            listOfCodesets = Arrays.asList(objectMapper.readValue(
                    file.getInputStream(), ChartDTO[].class));
        } catch (JsonMappingException | JsonParseException e) {
            throw new RuntimeException("An error occurred while processing file.", e);
        }
        return listOfCodesets;
    }

    @Transactional
    public List<ChartDTO> saveCharts(List<ChartDTO> chartDtos) {
        List<Chart> chartsToBeSaved = new ArrayList<>();

        for (ChartDTO dto : chartDtos) {
            // This checks if the code with the same code exists
            Optional<Chart> existing = chartRepository.findOneByIndicatorName(dto.getIndicatorName());

            if (existing.isPresent()) {
                // Update existing chart
                Chart existingChart = existing.get();
//                existingChart.setId(dto.getId());
                createChartFromDtoAndAddToList(chartsToBeSaved, dto, existingChart);
            } else {
                // add new chart when is not existing
                Chart newChart = new Chart();
                createChartFromDtoAndAddToList(chartsToBeSaved, dto, newChart);
            }
        }

        List<Chart> savedCharts =
                chartRepository.saveAll(chartsToBeSaved);
        // Transform the saved entities back to DTOs and return the list
        return savedCharts.stream()
                .map(ChartDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public void getChartsFile(OutputStream outputStream) {
        LOG.info("Exporting charts file.");

        List<Chart> charts =
                chartRepository.findAll();
        List<ChartDTO> dtos = charts.stream()
                .map(ChartDTO::fromEntity)
                .collect(Collectors.toList());
        try (OutputStreamWriter writer = new OutputStreamWriter(outputStream, StandardCharsets.UTF_8)) {
            objectMapper.enable(SerializationFeature.INDENT_OUTPUT);
            objectMapper.writeValue(writer, dtos);
            outputStream.close();
        } catch (Exception e) {
            LOG.error("Error occurred while writing file: {}", e.getMessage());
        }
    }

    private void createChartFromDtoAndAddToList(List<Chart> chartsToBeSaved, ChartDTO dto, Chart newChart) {
        newChart.setIndicatorName(dto.getIndicatorName());
        newChart.setDescription(dto.getDescription());
        newChart.setDisplayName(dto.getDisplayName());
        newChart.setModule(dto.getModule());
        newChart.setLocation(dto.getLocation());
        newChart.setType(dto.getType());
        newChart.setIcon(dto.getIcon());
        newChart.setQuery(dto.getQuery());
        newChart.setCreatedDate(dto.getCreatedDate());
        newChart.setCreatedBy(dto.getCreatedBy());
        newChart.setLastModifiedDate(dto.getLastModifiedDate());
        newChart.setLastModifiedBy(dto.getLastModifiedBy());
        newChart.setArchived(dto.getArchived());
        newChart.setPosition(dto.getPosition());
        chartsToBeSaved.add(newChart);
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