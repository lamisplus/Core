package org.lamisplus.modules.base.domain.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class ChartDTO {
    private String indicatorName;
    private String type;
    private String tableName;
}
