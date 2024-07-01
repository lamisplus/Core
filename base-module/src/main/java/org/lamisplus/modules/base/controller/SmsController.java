package org.lamisplus.modules.base.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
//import org.nomisng.domain.dto.SchoolResponseDTO;
import org.lamisplus.modules.base.domain.dto.NotificationDTO;
import org.lamisplus.modules.base.domain.dto.SmsDTO;
import org.lamisplus.modules.base.domain.entities.SMSOutput;
import org.lamisplus.modules.base.domain.repositories.SmsRepository;
import org.lamisplus.modules.base.service.SmsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestBody;

import java.io.IOException;
import java.net.URISyntaxException;
import java.time.LocalDate;
import java.util.List;
import java.util.concurrent.ExecutionException;


@RestController
@RequestMapping("/api/v1/sms")
@RequiredArgsConstructor
@Slf4j
public class SmsController {
    @Autowired
    SmsRepository smsRepository;
    private final SmsService smsService;


    @GetMapping(value = "/sms-history", produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<SmsDTO>> getSms () throws ExecutionException, InterruptedException {
        return ResponseEntity.ok(smsService.getSmsHistory());
    }


//    @PostMapping("/send-bulk-sms")
////    @PreAuthorize("hasAnyAuthority('admin_write', 'all_permission')")
//    public ResponseEntity<Boolean> sendBulkSms(@RequestBody SmsDTO smsDTO) {
//
//        SMSOutput smsOutput = new SMSOutput();
//        smsOutput.phoneNumbers = smsDTO.getPhoneNumbers();
//        smsOutput.message = smsDTO.getMessage();
//        smsOutput.messageType= smsDTO.getMessageType();
//        smsOutput.beneficiaryIds = smsDTO.getBeneficiaryIds();
//        smsOutput.timeStamp = LocalDate.now();
//
//        if(smsService.SendBulkSms(smsDTO.getSenderID(), smsOutput.phoneNumbers, smsDTO.getMessage())) {
//            return new ResponseEntity<>(true, HttpStatus.OK);
//        }else{
//            return new ResponseEntity<>(false, HttpStatus.EXPECTATION_FAILED);
//        }
//    }

//    @GetMapping("/sms-history")
////    @PreAuthorize("hasAnyAuthority('general_read', 'admin_read', 'all_permission')")
//    public ResponseEntity<List<SmsDTO>> getSMSs(@PageableDefault(1000) Pageable pageable) {
//        Page<SmsDTO> page = smsService.getSmsHistory();
//        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
//
//        return ResponseEntity.ok().headers(headers).body(page.getContent());
//    }

//    @PostMapping("/send-sms")
    @PostMapping(value = "/send-sms", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<SmsDTO> createNotification (@RequestBody SmsDTO smsDTO ) {
        return ResponseEntity.ok(smsService.createSms(smsDTO));
    }
//    @PreAuthorize("hasAnyAuthority('admin_write', 'all_permission')")
//    public ResponseEntity<Response> sendSms(@RequestBody SmsDTO smsDTO) throws URISyntaxException, IOException {
//
//        SMSOutput smsOutput = new SMSOutput();
//        smsOutput.phoneNumbers = smsDTO.getPhoneNumbers();
//        smsOutput.beneficiaryIds = smsDTO.getBeneficiaryIds();
//        smsOutput.message = smsDTO.getMessage();
//        smsOutput.messageType= smsDTO.getMessageType();
//        smsOutput.timeStamp = LocalDate.now();
//
//        try {
//            Response smsServiceResponse = SmsServiceResponse("", smsDTO.getPhoneNumbers(), smsDTO.getMessage());
//            if(smsServiceResponse.isSuccessful()){
//                smsOutput.sendStatus = "Successful";
//                smsRepository.save(smsOutput);
//                return new ResponseEntity<>(smsServiceResponse, HttpStatus.OK);
//            }else {
//                smsOutput.sendStatus = "Failed";
//                smsRepository.save(smsOutput);
//                return new ResponseEntity<>(null, HttpStatus.EXPECTATION_FAILED);
//            }
//        } catch (Exception e) {
//            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
//    public static Response SmsServiceResponse(String name, String phoneNumbers, String message) throws IOException {
//        OkHttpClient client = new OkHttpClient().newBuilder()
//                .build();
//        MediaType mediaType = MediaType.parse("text/plain");
//        MultipartBody body = new MultipartBody.Builder().setType(MultipartBody.FORM)
//                .addFormDataPart("token","ol57UYbSHwG6ez182Ynt5js6mIcgnp4jaQIOrJNR7CDLpgLydd")
//                .addFormDataPart("sender","Data.FI")
//                .addFormDataPart("to",phoneNumbers)
//                .addFormDataPart("message","Hi, \n"+ message)
//                .addFormDataPart("type","0")
//                .addFormDataPart("routing","6")
//                .build();
//        Request request = new Request.Builder()
//                .url("https://app.smartsmssolutions.com/io/api/client/v1/sms/")
//                .method("POST", body)
//                .build();
//        return client.newCall(request).execute();
//    }
}
