//package org.lamisplus.modules.base.controller;
//
//
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.lamisplus.modules.base.service.CurrentUserOrganizationService;
//import org.springframework.http.MediaType;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@Slf4j
//@RestController
//@RequiredArgsConstructor
//@RequestMapping("api/v1/patient-flag")
//public class PatientFlagController {
//
//    private final PatientFlagService patientFlagService;
//    private final CurrentUserOrganizationService currentUserOrganizationService;
//
//    @PostMapping(value = "",  produces = MediaType.APPLICATION_JSON_VALUE)
//    public ResponseEntity<PatientFlagDto> createPatientFlag (@RequestBody PatientFlagDto patientFlagDto) {
//        return ResponseEntity.ok(patientFlagService.createPatientFlag(patientFlagDto));
//    }
//
//    @DeleteMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
//    public ResponseEntity<String> deletePatientFlag (@PathVariable("id") Long id) {
//        return ResponseEntity.ok(patientFlagService.deleteFlag(id));
//    }
//}
