package org.lamisplus.modules.base.domain.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "chart", schema = "public")
public class Chart {

    @Column(name = "id", unique = true)
    private UUID id;

    @Id
    @Column(name = "indicator_name", nullable = false)
    private String indicatorName;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "location", nullable = false)
    private String location;

    @Column(name = "type", nullable = false)
    private String type;

    @Column(name = "icon", nullable = false)
    private String icon;

    @Column(name = "query", nullable = false, length = 5000)
    private String query;

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
}