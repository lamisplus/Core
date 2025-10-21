package org.lamisplus.modules.base.domain.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.lamisplus.modules.base.domain.dto.ChartDTO;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.persistence.Table;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "chart", schema = "public")
public class Chart {

    @Column(name = "id", unique = true)
    private UUID id;

    @Id
    @Column(name = "indicator_name", nullable = false)
    private String indicatorName;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "display_name", nullable = false)
    private String displayName;

    @Column(name = "location", nullable = false)
    private String location;

    @Column(name = "type", nullable = false)
    private String type;

    @Column(name = "icon", nullable = false)
    private String icon;

    @Column(name = "query", nullable = false, length = 5000)
    private String query;

    @Column(name = "module", nullable = false)
    private String module;

    @Column(name = "created_date")
    private LocalDateTime createdDate;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "last_modified_date")
    private LocalDateTime lastModifiedDate;

    @Column(name = "last_modified_by")
    private String lastModifiedBy;

    @Column(name = "archived")
    private Integer archived;

    @Column(name = "position")
    private Integer position;

    //added fields

    @Column(name = "x_axis_field")
    private String xAxisField;

    @Column(name = "y_axis_field")
    private String yAxisField;

    @Column(name = "series_name_field")
    private String seriesNameField;

    @PrePersist
    void setIdIfNull(){
        if (this.id == null){
            this.id = UUID.randomUUID();
        }
    }


    public static Chart fromDto(ChartDTO chartDTO){
        return Chart.builder()
                .id(chartDTO.getId())
                .indicatorName(chartDTO.getIndicatorName())
                .displayName(chartDTO.getDisplayName())
                .module(chartDTO.getModule())
                .description(chartDTO.getDescription())
                .location(chartDTO.getLocation())
                .type(chartDTO.getType())
                .icon(chartDTO.getIcon())
                .query(chartDTO.getQuery())
                .module(chartDTO.getModule())
                .createdDate(chartDTO.getCreatedDate())
                .createdBy(chartDTO.getCreatedBy())
                .lastModifiedDate(chartDTO.getLastModifiedDate())
                .lastModifiedBy(chartDTO.getLastModifiedBy())
                .archived(chartDTO.getArchived())
                .position(chartDTO.getPosition())
                .build();
    }
}