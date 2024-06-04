package org.nomisng.domain.dto;

import lombok.AllArgsConstructor;
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
public class SmsDTO {
    @NotNull(message = "Sender ID is required")
    private String senderID;
    @NotNull(message = "Phone number(s) is required")
    private String phoneNumbers;
    @NotNull(message = "Unique ID(s) is required")
    public String beneficiaryIds;
    private String message;
    private String messageType;
    private String sendStatus;
    private LocalDate timeStamp;
    private String notificationCount;

}
