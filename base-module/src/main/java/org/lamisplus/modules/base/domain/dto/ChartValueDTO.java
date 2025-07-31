package org.lamisplus.modules.base.domain.dto;

import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class ChartValueDTO implements Serializable {
    private String indicatorName;
    private String value;
}
