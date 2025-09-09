package org.lamisplus.modules.base.controller;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.domain.dto.*;
import org.lamisplus.modules.base.service.ChartService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

import static org.reflections.Reflections.log;

@Slf4j
@RestController
@RequestMapping("/api/v1/charts")
@RequiredArgsConstructor
public class ChartController {

    private final ChartService chartService;

//    /**
//     * Get indicator names and types by location
//     *
//     * @param location the location to filter by (required request parameter)
//     * @return list of ChartDTO containing indicator name and type
//     */
//    @GetMapping("/indicators")
//    public ResponseEntity<List<ChartDTO>> getIndicatorsByLocation(
//            @RequestParam("location") String location) {
//
//        if (location == null || location.trim().isEmpty()) {
//            return ResponseEntity.badRequest().build();
//        }
//
//        List<ChartDTO> charts = chartService.getIndicatorNameAndTypeByLocation(location);
//
//        if (charts.isEmpty()) {
//            return ResponseEntity.ok(new ArrayList<>());
//        }
//
//        return ResponseEntity.ok(charts);
//    }

    /**
     * Get indicator names and types by location
     *
     * @param location the location to filter by (required request parameter)
     * @return list of ChartDTO containing indicator name and type
     */
    @GetMapping("/indicators")
    public ResponseEntity<List<ChartDTO>> getIndicatorsByLocationAndModuleName(
            @RequestParam("location") String location) {

        if (location == null || location.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        List<ChartDTO> charts = chartService.getIndicatorNameAndTypeByLocation(location);

        if (charts.isEmpty()) {
            return ResponseEntity.ok(new ArrayList<>());
        }

        return ResponseEntity.ok(charts);
    }

    /**
     * Get all chart values for dashboard
//     * @param tableName the table name (required request parameter)
     * @param indicatorName the indicator name (required request parameter)
     * @return list of ChartValueDTO for dashboard display
     */
    @GetMapping("/dashboard/values")
    public ResponseEntity<ChartValueDTO> getAllChartValuesForDashboard(
//            @RequestParam("tableName") String tableName,
            @RequestParam("indicatorName") String indicatorName,
            @RequestParam("facilityId")Long facilityId) {

        // Validate input parameters
//        if (tableName == null || tableName.trim().isEmpty()) {
//            return ResponseEntity.badRequest().build();
//        }

        if (indicatorName == null || indicatorName.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        try {
//            ChartValueDTO chartValue = chartService.getChartValueForDashboard(tableName, indicatorName, facilityId);
            ChartValueDTO chartValue = chartService.getChartValueForDashboard(indicatorName, facilityId);

            if (chartValue == null) {
                return ResponseEntity.noContent().build();
            }

            return ResponseEntity.ok(chartValue);

        } catch (Exception e) {
            // Log the exception
            LOG.info("Exception getting chart values for dashboard {}", e.getMessage());
            //TODO: correct this
            return ResponseEntity.noContent().build();
        }
    }



    @PutMapping("/update-chart")
    public ResponseEntity<ChartDTO> updateChart(@RequestParam("indicatorName") String indicatorName, @RequestBody ChartRequestDto chartRequestDto){
        return ResponseEntity.ok(chartService.updateChart(indicatorName, chartRequestDto));
    }

    @DeleteMapping("/delete-chart")
    public ResponseEntity<String> deleteChart(@RequestParam("indicatorName") String indicatorName){
        chartService.deleteChart(indicatorName);
        return ResponseEntity.ok("Chart deleted successfully.");
    }

    @PostMapping("/import-charts")
    public ResponseEntity<String> importCharts(@RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Please select a file to upload.");
        }
        try{
            List<ChartDTO> importedChartData = chartService.importChartData(file);
            chartService.saveCharts(importedChartData);

            return ResponseEntity.ok("Charts saved successfully.");
        }catch (Exception e){
            LOG.info("Error importing charts: {}", e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @GetMapping(value = "/export-charts", produces = "application/json; charset=UTF-8")
    public void exportCharts(HttpServletResponse response) throws IOException {
        response.addHeader("Content-Disposition", "attachment; filename=Charts.json");
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Content-Type", "application/octet-stream");
        chartService.getChartsFile(response.getOutputStream());
    }






    /**
     * Get chart data for visualization
     */
    @GetMapping("/data")
    public ResponseEntity<ChartValueDTO<ChartConfigDTO>> getChartData(
            @RequestParam("indicatorName") String indicatorName,
            @RequestParam(value = "facilityId", required = false) Long facilityId) {

        try {
            ChartValueDTO<ChartConfigDTO> chartData = chartService.getChartData(indicatorName, facilityId);
            return ResponseEntity.ok(chartData);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();

        } catch (Exception e) {
            // Build error response using Java 8 compatible methods
            Map<String, Object> errorTitleMap = new HashMap<>();
            errorTitleMap.put("text", "Error");

            SeriesDTO errorSeries = SeriesDTO.builder()
                    .name("Error")
                    .data("Failed to execute chart query: " + e.getMessage())
                    .build();

            List<SeriesDTO> errorSeriesList = new ArrayList<>();
            errorSeriesList.add(errorSeries);

            ChartConfigDTO errorConfig = ChartConfigDTO.builder()
                    .title(errorTitleMap)
                    .series(errorSeriesList)
                    .build();

            ChartValueDTO<ChartConfigDTO> response = ChartValueDTO.<ChartConfigDTO>builder()
                    .indicatorName(indicatorName)
                    .value(errorConfig)
                    .build();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }




}