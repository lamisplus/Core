package org.lamisplus.modules.base.domain.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
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
    @JsonProperty("xAxis")
    private Object xAxis;
    @JsonProperty("yAxis")
    private Object yAxis;
    private List<SeriesDTO> series;
}
