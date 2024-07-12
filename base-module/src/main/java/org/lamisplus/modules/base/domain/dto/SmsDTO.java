package org.lamisplus.modules.base.domain.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SmsDTO {
//    @NotNull(message = "Sender ID is required")
    private String senderId;
    @NotNull(message = "Phone number(s) is required")
    private String phoneNumbers;
    @NotNull(message = "Unique ID(s) is required")
    public String patientId;
    private String message;
    private String messageType;
//    @JsonIgnore
    private String sendStatus;
//    @JsonIgnore
    private LocalDate timeStamp;
//    @JsonIgnore
    private String notificationCount;

}
