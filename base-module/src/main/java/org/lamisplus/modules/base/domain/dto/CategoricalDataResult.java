package org.lamisplus.modules.base.domain.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CategoricalDataResult {
    private SeriesDTO series;
    private List<String> categories;
}
