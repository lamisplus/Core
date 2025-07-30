package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import org.lamisplus.modules.base.domain.dto.ChartDTO;
import org.lamisplus.modules.base.domain.entities.Chart;
import org.lamisplus.modules.base.domain.repositories.ChartRepository;
import org.lamisplus.modules.base.module.ModuleService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChartService {

    private final ChartRepository chartRepository;
    private final ModuleService moduleService;

    /**
     * Get indicator names and types by location
     * @param location the location to filter by
     * @return list of ChartDTO containing indicator name and type
     */
    public List<ChartDTO> getIndicatorNameAndTypeByLocation(String location) {
        return chartRepository.findIndicatorNameAndTypeByLocation(location);
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
}