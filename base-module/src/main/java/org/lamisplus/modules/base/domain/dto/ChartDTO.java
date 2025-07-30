package org.lamisplus.modules.base.domain.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Builder
public class ChartDTO {
    private String indicatorName;
    private String type;
    private String tableName;
    private String description;
    private String displayName;
    private String icon;

}
