package org.lamisplus.modules.base.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SmsSetupDTO {

    private Long id;
    @NotNull(message = "Sender ID is required")
    private String senderID;
    @NotNull(message = "Message Category is required")
    private String messageCategory;
    @NotNull(message = "Message Body is required")
    private String messageBody;
    @NotNull(message = "Frequency is required")
    private String frequency;
    private Long facilityId;
    private String uuid;

}
