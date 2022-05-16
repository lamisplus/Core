package org.lamisplus.modules.base.controller;//package org.lamisplus.modules.base.controller;
//
//import org.lamisplus.modules.base.BaseApplication;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//@RequestMapping("/api/restart")
//public class RestartController {
//
//    @GetMapping
//    @PreAuthorize("hasAnyAuthority('Super Admin','Facility Admin', 'Admin', 'Data Clerk', 'DEC', 'M&E Officer')")
//    public void restart() {
//        BaseApplication.restart();
//    }
//}
