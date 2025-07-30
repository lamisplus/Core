package org.lamisplus.modules.base.domain.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class ChartValueDTO {
    private String indicatorName;
    private String value;
}
