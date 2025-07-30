package org.lamisplus.modules.base.controller;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.domain.dto.ChartDTO;
import org.lamisplus.modules.base.domain.dto.ChartValueDTO;
import org.lamisplus.modules.base.service.ChartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/charts")
@RequiredArgsConstructor
public class ChartController {

    private final ChartService chartService;

    /**
     * Get indicator names and types by location
     *
     * @param location the location to filter by (required request parameter)
     * @return list of ChartDTO containing indicator name and type
     */
    @GetMapping("/indicators")
    public ResponseEntity<List<ChartDTO>> getIndicatorsByLocation(
            @RequestParam("location") String location) {

        if (location == null || location.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        List<ChartDTO> charts = chartService.getIndicatorNameAndTypeByLocation(location);

        if (charts.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(charts);
    }

    /**
     * Get all chart values for dashboard
     * @param tableName the table name (required request parameter)
     * @param indicatorName the indicator name (required request parameter)
     * @return list of ChartValueDTO for dashboard display
     */
    @GetMapping("/dashboard/values")
    public ResponseEntity<List<ChartValueDTO>> getAllChartValuesForDashboard(
            @RequestParam("tableName") String tableName,
            @RequestParam("indicatorName") String indicatorName) {

        // Validate input parameters
        if (tableName == null || tableName.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        if (indicatorName == null || indicatorName.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        try {
            List<ChartValueDTO> chartValues = chartService.getAllChartValuesForDashboard(tableName, indicatorName);

            if (chartValues.isEmpty()) {
                return ResponseEntity.noContent().build();
            }

            return ResponseEntity.ok(chartValues);

        } catch (Exception e) {
            // Log the exception
            LOG.info("Error getting chart values for dashboard {}", e);
            //TODO: correct this
            return ResponseEntity.noContent().build();
        }
    }

}