package org.lamisplus.modules.base.controller;


import lombok.RequiredArgsConstructor;
import org.lamisplus.modules.base.domain.dto.ChartDTO;
import org.lamisplus.modules.base.service.ChartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/charts")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ChartController {

    private final ChartService chartService;

    /**
     * Get indicator names and types by location
     *
     * @param location the location to filter by (required request parameter)
     * @return list of ChartDTO containing indicator name and type
     */
    @GetMapping("/indicators")
    public ResponseEntity<List<ChartDTO>> getIndicatorsByLocation(
            @RequestParam("location") String location) {

        if (location == null || location.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        List<ChartDTO> charts = chartService.getIndicatorNameAndTypeByLocation(location);

        if (charts.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(charts);
    }

}