package org.lamisplus.modules.base.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PageDTO implements Serializable {
    private long totalRecords;
    private int pageNumber;
    private int pageSize;
    private int totalPages;
    private List records = new ArrayList<>();
}
