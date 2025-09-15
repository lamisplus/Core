package org.lamisplus.modules.base.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChartConfigDTO {
    private Object chart;
    private Object title;
    private Object xAxis;
    private Object yAxis;
    private List<SeriesDTO> series;

    private String chartType; // Add this field to explicitly track chart type

    // Helper method to check if it's a card
    public boolean isCard() {
        return "card".equalsIgnoreCase(chartType);
    }
}
