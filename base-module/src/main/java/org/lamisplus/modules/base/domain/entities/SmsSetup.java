package org.lamisplus.modules.base.domain.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.lamisplus.modules.base.security.SecurityUtils;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "base_application_sms_config")
public class SmsSetup {

    @Id
    @Column(name = "id", updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sender_id")
    @NotNull(message = "Sender ID is required")
    public String senderID;

    @Column(name = "message_category")
    @NotNull(message = "Message Category is required")
    public String messageCategory;

    @Column(name = "message_body")
    @NotNull(message = "Message Body is required")
    public String messageBody;

    @NotNull(message = "Frequency is required")
    public String frequency;

    @Column(name = "facility_id")
    @NotNull
    public Long facilityId;

    @CreatedBy
    @Column(name = "created_by", nullable = false, updatable = false)
    public String createdBy = SecurityUtils.getCurrentUserLogin().orElse(null);

    @CreatedDate
    @Column(name = "date_created", nullable = false, updatable = false)
    public LocalDateTime dateCreated = LocalDateTime.now();

    @LastModifiedBy
    @Column(name = "modified_by")
    public String modifiedBy = SecurityUtils.getCurrentUserLogin().orElse(null);

    @LastModifiedDate
    @Column(name = "date_modified")
    public LocalDateTime dateModified = LocalDateTime.now();

    @Column(name = "archived")
    public Integer archived = 0;

    @Column(name = "uuid")
    private String uuid;

    //private UUID uid;
}
