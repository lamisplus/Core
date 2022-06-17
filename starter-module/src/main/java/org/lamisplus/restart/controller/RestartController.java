package org.lamisplus.restart.controller;

import org.lamisplus.LamisPlusApplication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RestartController {

    //Versioning through URI Path
    private final String BASE_URL_VERSION_ONE = "/api/v1";

    @GetMapping(BASE_URL_VERSION_ONE + "/restart")
    @PreAuthorize("hasAnyAuthority('Super Admin','Facility Admin', 'Admin', 'Data Clerk', 'DEC', 'M&E Officer')")
    public void restart() {
        LamisPlusApplication.restart();
    }
}
