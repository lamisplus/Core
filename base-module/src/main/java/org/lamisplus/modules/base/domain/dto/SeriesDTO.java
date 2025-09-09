package org.lamisplus.modules.base.domain.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SeriesDTO {
    private String name;
    private Object data;

}