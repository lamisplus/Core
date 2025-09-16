package org.lamisplus.modules.base.domain.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TimeSeriesResult {
    private List<SeriesDTO> seriesList;
    private List<String> categories;
}
