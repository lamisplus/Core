package org.lamisplus.modules.base.domain.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.codehaus.jackson.annotate.JsonIgnore;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NotificationDTO {

    private Long id;
    private String period;
    private String indicator;
    @JsonIgnore
    private String uuid;
    @JsonIgnore
    private Long facilityId;

}
