package org.lamisplus.modules.base.domain.dto;

import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Builder
public class ChartDTO implements Serializable {
    private String indicatorName;
    private String type;
    private String tableName;
    private String description;
    private String displayName;
    private String icon;
    private Integer position;

}
