package org.lamisplus.modules.base.domain.entities;


import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.lamisplus.modules.base.security.SecurityUtils;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor(force = true)
//@RequiredArgsConstructor
@Table(name = "base_application_notification_config")
public class Notification {

    @Id
    @Column(name = "id", updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "period", nullable = false)
    private String period;

    @NotBlank
    @NonNull
    @Column(name = "indicator")
    private String indicator;

    @Column(name = "uuid")
    private String uuid;

    @Basic
    @Column(name = "archived")
    @NonNull
    private Integer archived = 0;

    @Column(name = "created_by", nullable = false, updatable = false)
    @JsonIgnore
    @ToString.Exclude
    private String createdBy = SecurityUtils.getCurrentUserLogin().orElse(null);

    @Column(name = "date_created", nullable = false, updatable = false)
    @JsonIgnore
    @ToString.Exclude
    private LocalDateTime dateCreated = LocalDateTime.now();

    @Column(name = "modified_by")
    @JsonIgnore
    @ToString.Exclude
    private String modifiedBy = SecurityUtils.getCurrentUserLogin().orElse(null);

    @Column(name = "date_modified")
    @JsonIgnore
    @ToString.Exclude
    private LocalDateTime dateModified = LocalDateTime.now();


    @Column(name = "facility_id")
    @JsonIgnore
    @ToString.Exclude
    private Long facilityId;

}
