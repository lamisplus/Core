package org.lamisplus.modules.base.domain.dto;

import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class ChartValueDTO<T> implements Serializable {
    private String indicatorName;
    private T value;
}
