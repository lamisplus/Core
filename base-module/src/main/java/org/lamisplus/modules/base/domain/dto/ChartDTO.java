package org.lamisplus.modules.base.domain.dto;

import lombok.*;
import org.lamisplus.modules.base.domain.entities.Chart;

import javax.persistence.Column;
import javax.persistence.Id;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Builder
public class ChartDTO implements Serializable {
    private String indicatorName;
    private String type;
//    private String tableName;
    private String description;
    private String displayName;
    private String module;
    private String icon;
    private Integer position;
    private Integer archived;
    private UUID id;
    private String location;
    private String query;
    private LocalDateTime createdDate;
    private String createdBy;
    private LocalDateTime lastModifiedDate;
    private String lastModifiedBy;
    private String xAxisField;
    private String yAxisField;
    private String seriesNameField;

    public static ChartDTO fromEntity(Chart chart){

        return ChartDTO.builder()
                .id(chart.getId())
                .indicatorName(chart.getIndicatorName())
                .description(chart.getDescription())
                .displayName(chart.getDisplayName())
                .module(chart.getModule())
                .location(chart.getLocation())
                .type(chart.getType())
                .icon(chart.getIcon())
                .query(chart.getQuery())
                .createdDate(chart.getCreatedDate())
                .createdBy(chart.getCreatedBy())
                .lastModifiedDate(chart.getLastModifiedDate())
                .lastModifiedBy(chart.getLastModifiedBy())
                .archived(chart.getArchived())
                .position(chart.getPosition())
                .xAxisField(chart.getXAxisField())
                .yAxisField(chart.getYAxisField())
                .seriesNameField(chart.getSeriesNameField())
                .build();
    }

    public static ChartDTO fromEntitySafe(Chart chart){

        return ChartDTO.builder()
                .id(chart.getId())
                .indicatorName(chart.getIndicatorName())
                .description(chart.getDescription())
                .displayName(chart.getDisplayName())
                .module(chart.getModule())
                .location(chart.getLocation())
                .type(chart.getType())
                .icon(chart.getIcon())
                .createdDate(chart.getCreatedDate())
                .createdBy(chart.getCreatedBy())
                .lastModifiedDate(chart.getLastModifiedDate())
                .lastModifiedBy(chart.getLastModifiedBy())
                .archived(chart.getArchived())
                .position(chart.getPosition())
                .xAxisField(chart.getXAxisField())
                .yAxisField(chart.getYAxisField())
                .seriesNameField(chart.getSeriesNameField())
                .build();
    }



}
