package org.lamisplus.modules.base.domain.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class ChartQueryDTO {
    private String indicatorName;
    private String query;
}
