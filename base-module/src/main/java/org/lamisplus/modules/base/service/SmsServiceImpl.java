//package org.lamisplus.modules.base.service;
//
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.json.JSONObject;
////import org.lamisplus.modules.base.domain.dto.SchoolResponseDTO;SchoolResponseDTO
//import org.lamisplus.modules.base.domain.dto.SmsDTO;
//import org.lamisplus.modules.base.domain.entities.OrganisationUnit;
//import org.lamisplus.modules.base.domain.entities.SMSOutput;
////import org.lamisplus.modules.base.domain.entities.School;
//import org.lamisplus.modules.base.domain.entities.SmsSetup;
//import org.lamisplus.modules.base.domain.repositories.SmsRepository;
//import org.lamisplus.modules.base.domain.repositories.SmsSetupRepository;
//import org.lamisplus.modules.base.service.SmsService;
////import org.lamisplus.modules.base.util.ConstantUtility;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.PageImpl;
//import org.springframework.data.domain.Pageable;
//import org.springframework.jdbc.core.JdbcTemplate;
//import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
//import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
//import org.springframework.stereotype.Service;
//
//import java.io.BufferedReader;
//import java.io.InputStreamReader;
//import java.io.OutputStreamWriter;
//import java.net.HttpURLConnection;
//import java.net.URL;
//import java.net.URLEncoder;
//import java.nio.charset.StandardCharsets;
//import java.time.LocalDate;
//import java.time.format.DateTimeFormatter;
//import java.util.ArrayList;
//import java.util.List;
//import java.util.Objects;
//import java.util.Optional;
//import java.util.concurrent.atomic.AtomicReference;
//
//@Slf4j
//@Service
//@RequiredArgsConstructor
//public class SmsServiceImpl implements SmsService {
//
//
//    private final String DUEIN7DAYS= '7 days'
//    @Autowired
//    SmsRepository smsRepository;
//    @Autowired
//    SmsSetupRepository smsSetupRepository;
//    @Override
//    public void SendDrugRefillReminderSms7DaysPrior() {
//        try {
//            LOG.info("Sending Drug Refill Reminder Sms to Clients due in 7 Days...");
//
//            LocalDate today = LocalDate.now();
//            LocalDate aWeekFromToday = today.plusDays(7);
//            DateTimeFormatter dTF = DateTimeFormatter.ofPattern("dd-MMM-yyyy");
//            String date = dTF.format(aWeekFromToday);
//            String notificationCount = "First";
//
//
//            //Check if bulk sms has been sent today for this message category;
//            Boolean messageSentPerDateAndPerSmsCategory = smsRepository.messageSentPerDateAndPerSmsCategory("ARV Refill Reminder Message", today, notificationCount);
//            if (!messageSentPerDateAndPerSmsCategory) {
//                String senderID = "Data.FI";
//                String[] values = getPhoneNumbersAndBeneficiaryIDsDueIn("7 days");
//                String phoneNumbers = values[0];
//                String beneficiaryIDs = values[1];
//                String message = "Dear Caregiver, \n " +
//                        "Your child/ward is due for drug-refill appointment on {$date$}.\n" +
//                        "Please ensure adherence. Thank you.",
//                        messageType = "ARV Refill Reminder Message";
//
//                Optional<SmsSetup> smsSetup = smsSetupRepository.findByMessageCategory("ARV Refill Reminder Message");
//                if(smsSetup.isPresent()) {
//                    message = smsSetup.get().messageBody;
//                    senderID = smsSetup.get().senderID;
//                }
//
//                if (phoneNumbers != null) {
//                    SmsDTO smsDTO = new SmsDTO();
//                    smsDTO.setPhoneNumbers(phoneNumbers);
//                    smsDTO.setBeneficiaryIds(beneficiaryIDs);
//                    smsDTO.setMessage(message.replace("{$date$}",date));
//                    smsDTO.setMessageType(messageType);
//                    smsDTO.setNotificationCount(notificationCount);
//                    smsDTO.setSenderID(senderID);
//                    sendSms(smsDTO);
//                } else {
//                    LOG.info("No pending Bulk SMS to send.");
//                }
//            }
//        }catch (Exception ignored){
//        }
//    }
//    public void SendDrugRefillReminderSms1DayPrior(){
//        try {
//            LOG.info("Sending Drug Refill Reminder Sms to Clients due tomorrow...");
//            LocalDate today = LocalDate.now();
//            LocalDate aDayFromToday = today.plusDays(1);
//            String notificationCount = "Second";
//
//            //Check if bulk sms has been sent today for this message category;
//            Boolean messageSentPerDateAndPerSmsCategory = smsRepository.messageSentPerDateAndPerSmsCategory("ARV Refill Reminder Message", today, notificationCount);
//            if (!messageSentPerDateAndPerSmsCategory) {
//                String senderID = "Data.FI";
//                String[] values = getPhoneNumbersAndBeneficiaryIDsDueIn("1 day");
//                String phoneNumbers = values[0];
//                String beneficiaryIDs = values[1];
//                String message = "Dear Caregiver, \n " +
//                        "Your child/ward is due for drug-refill appointment tomorrow\n" +
//                        "Please ensure adherence. Thank you.",
//                        messageType = "ARV Refill Reminder Message";
//
//                Optional<SmsSetup> smsSetup = smsSetupRepository.findByMessageCategory("ARV Refill Reminder Message");
//                if(smsSetup.isPresent()) {
//                    message = smsSetup.get().messageBody;
//                    senderID = smsSetup.get().senderID;
//                }
//
//                if (phoneNumbers != null) {
//                    SmsDTO smsDTO = new SmsDTO();
//                    smsDTO.setPhoneNumbers(phoneNumbers);
//                    smsDTO.setBeneficiaryIds(beneficiaryIDs);
//                    smsDTO.setMessage(message.replace("{$date$}","tomorrow"));
//                    smsDTO.setMessageType(messageType);
//                    smsDTO.setNotificationCount(notificationCount);
//                    smsDTO.setSenderID(senderID);
//                    sendSms(smsDTO);
//                } else {
//                    LOG.info("No pending Bulk SMS to send.");
//                }
//            }
//        }
//        catch (Exception ignored){
//        }
//    }
//    public boolean SendBulkSms(String sender,String recipients, String message){
//        try {
//            LOG.info("Sending bulk sms to recipients...");
//            LocalDate today = LocalDate.now();
//            String notificationCount = "NA";
//
//                if (recipients != null) {
//                    SmsDTO smsDTO = new SmsDTO();
//                    smsDTO.setPhoneNumbers(recipients);
//                    smsDTO.setBeneficiaryIds("NA");
//                    smsDTO.setMessage(message);
//                    smsDTO.setMessageType("Bulk SMS");
//                    smsDTO.setNotificationCount(notificationCount);
//                    smsDTO.setSenderID(sender);
//                    sendSms(smsDTO);
//                } else {
//                    LOG.info("No pending Bulk SMS to send.");
//                }
//                return true;
//        }
//        catch (Exception ignored){
//            return false;
//        }
//    }
//
//
////    @Override
////    public Page<SmsDTO> getSmsHistory(Pageable pageable) {
////        List<SmsDTO> responseDTOs = new ArrayList<>();
////
//////        Page<SMSOutput> smsList = smsRepository.findAll(pageable);
////        Page<SMSOutput> smsList = smsRepository.findAllOrderByIdDesc(pageable);
////
////        for (SMSOutput smsOutput : smsList) {
////            SmsDTO dto = new SmsDTO();
////            dto.setMessage(smsOutput.message) ;
////            dto.setPhoneNumbers(smsOutput.phoneNumbers);
////            dto.setTimeStamp(smsOutput.timeStamp);
////            dto.setMessageType(smsOutput.messageType);
////            dto.setSendStatus(smsOutput.sendStatus);
////            dto.setBeneficiaryIds(smsOutput.beneficiaryIds);
////            dto.setNotificationCount(smsOutput.notification_count);
////            responseDTOs.add(dto);
////        }
////
////        return new PageImpl<>(responseDTOs,pageable, responseDTOs.size());
////    }
//
//
//
//    private final NamedParameterJdbcTemplate primaryJdbcTemplate;
//    private final JdbcTemplate thirdJdbcTemplate;
//    private  String[] getPhoneNumbersAndBeneficiaryIDsDueIn(String days){
//        String []vals = new String[2];
//        String sql = "SELECT distinct\tstring_agg(mobile_Phone_Number, ',') AS Phone_Numbers, string_agg(household_member_id, ',') AS Beneficiary_IDs from\n" +
//                "(\n" +
//                "\tselect hm.details->'caregiver'->'details'->>'mobilePhoneNumber'mobile_Phone_Number, e.household_member_id::text household_member_id, \n" +
//                "\tfd.data->>'appointmentDate' appointment_Date, ((fd.data->>'appointmentDate')::date - INTERVAL '7 days')curr_date\n" +
//                "\tfrom form_data fd \n" +
//                "\tjoin encounter e on fd.encounter_id = e.id\n" +
//                "\tjoin household_member hm on e.household_member_id = hm.id\n" +
//                "\twhere (fd.data->>'appointmentDate'  is not null and fd.data->>'appointmentDate' !='')\n" +
//                "\tand (hm.details->'caregiver'->'details'->>'mobilePhoneNumber' is not null and hm.details->'caregiver'->'details'->>'mobilePhoneNumber'!='')\n" +
//                "\tand ((fd.data->>'appointmentDate')::date - INTERVAL '"+days+"') = current_date\n" +
//                ")sub0";
//        MapSqlParameterSource mapper = new MapSqlParameterSource();
////        mapper.addValue("current_date", currentDate);
//        AtomicReference<String> phoneNumbers = new AtomicReference<>();
//        AtomicReference<String> beneficiaryIDs = new AtomicReference<>();
//        primaryJdbcTemplate.query(sql, mapper, rs -> {
//            phoneNumbers.set(rs.getString("Phone_Numbers"));
//            beneficiaryIDs.set(rs.getString("Beneficiary_IDs"));
//        });
//        vals[0] = phoneNumbers.get();
//        vals[1] = beneficiaryIDs.get();
//
//        return vals;
//    }
//    public void sendSms(SmsDTO smsDTO) {
//
//        SMSOutput smsOutput = new SMSOutput();
//        smsOutput.phoneNumbers = smsDTO.getPhoneNumbers();
//        smsOutput.beneficiaryIds = smsDTO.getBeneficiaryIds();
//        smsOutput.message = smsDTO.getMessage();
//        smsOutput.messageType= smsDTO.getMessageType();
//        smsOutput.notification_count= smsDTO.getNotificationCount();
//        smsOutput.senderId= smsDTO.getSenderID();
//        smsOutput.timeStamp = LocalDate.now();
//
//        try {
//            SMSOutput smsServiceResponse = SmsServiceResponse2  (smsDTO.getSenderID(), smsDTO.getPhoneNumbers(), smsDTO.getMessage());
//            if(smsServiceResponse.Code!=0 && smsServiceResponse.Code==1000){
//                smsOutput.sendStatus = "Successful";
//                smsOutput.Code = smsServiceResponse.Code;
//                smsOutput.Sms_pages = smsServiceResponse.Sms_pages;
//                smsOutput.All_numbers = smsServiceResponse.All_numbers;
//                smsOutput.Comment= smsServiceResponse.Comment;
//                smsOutput.error = smsServiceResponse.error;
//                smsOutput.Basic_successful = smsServiceResponse.Basic_successful;
//                smsOutput.Basic_units = smsServiceResponse.Basic_units;
//                smsOutput.Corp_successful= smsServiceResponse.Corp_successful;
//                smsOutput.Corp_units = smsServiceResponse.Corp_units;
//                smsOutput.Failed= smsServiceResponse.Failed;
//                smsOutput.Insufficient_unit= smsServiceResponse.Insufficient_unit;
//                smsOutput.Invalid= smsServiceResponse.Invalid;
//                smsOutput.Simserver_successful = smsServiceResponse.Simserver_successful;
//                smsOutput.Successful= smsServiceResponse.Successful;
//                smsOutput.Units_before= smsServiceResponse.Units_before;
//                smsOutput.Units_used= smsServiceResponse.Units_used;
//
//                smsRepository.save(smsOutput);
//                LOG.info("Sending Bulk SMS completed");
//            }else {
//                smsOutput.sendStatus = "Failed";
//
//                smsOutput.Code = smsServiceResponse.Code;
//                smsOutput.Comment= smsServiceResponse.Comment;
//                smsOutput.error = smsServiceResponse.error;
//
//                smsRepository.save(smsOutput);
//                LOG.info("Sending Bulk SMS failed");
//            }
//        } catch (Exception e) {
//            LOG.info("Error Sending Bulk SMS");
//        }
//    }
//
//    public static SMSOutput SmsServiceResponse2(String sender, String phone, String message) {
//        SMSOutput sot = new SMSOutput();
//        String responseInString = "";
//
//        try {
//            URL url = new URL("https://smartsmssolutions.com/api/json.php");
//            url = new URL("https://app.smartsmssolutions.com/io/api/client/v1/sms/");
//            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
//            conn.setRequestMethod("POST");
//            conn.setDoOutput(true);
//
//            String data = URLEncoder.encode("sender", "UTF-8") + "=" + URLEncoder.encode(sender, "UTF-8") +
//                    "&" + URLEncoder.encode("to", "UTF-8") + "=" + URLEncoder.encode(phone, "UTF-8") +
//                    "&" + URLEncoder.encode("message", "UTF-8") + "=" + URLEncoder.encode(message, "UTF-8") +
//                    "&" + URLEncoder.encode("type", "UTF-8") + "=" + URLEncoder.encode("0", "UTF-8") +
//                    "&" + URLEncoder.encode("routing", "UTF-8") + "=" + URLEncoder.encode("2", "UTF-8") +
//                    "&" + URLEncoder.encode("token", "UTF-8") + "=" + URLEncoder.encode("ol57UYbSHwG6ez182Ynt5js6mIcgnp4jaQIOrJNR7CDLpgLydd", "UTF-8");
//
//            try (OutputStreamWriter wr = new OutputStreamWriter(conn.getOutputStream())) {
//                wr.write(data);
//                wr.flush();
//            }
//
//            BufferedReader rd = new BufferedReader(new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8));
//            String line;
//            StringBuilder result = new StringBuilder();
//            while ((line = rd.readLine()) != null) {
//                result.append(line);
//            }
//            rd.close();
//            responseInString = result.toString();
//            JSONObject jsonObj = new JSONObject(responseInString);
//            if(jsonObj.has("all_numbers")) {
//                sot.All_numbers = jsonObj.getString("all_numbers");
//                sot.Basic_successful = jsonObj.getString("basic_successful");
//                sot.Basic_units = jsonObj.getInt("basic_units");
//                sot.Code = jsonObj.getInt("code");
//                sot.Sms_pages = jsonObj.getInt("sms_pages");
//                sot.Corp_units = jsonObj.getInt("corp_units");
//                sot.Units_used = jsonObj.getString("units_used");
//                sot.Comment = jsonObj.getString("comment");
//                sot.Corp_successful = jsonObj.getString("corp_successful");
//                sot.error = jsonObj.getBoolean("error");
//                sot.Failed = jsonObj.getString("failed");
//                sot.Insufficient_unit = jsonObj.getString("insufficient_unit");
//                sot.Invalid = jsonObj.getString("invalid");
//                sot.Simserver_successful = jsonObj.getString("simserver_successful");
//                sot.Successful = jsonObj.getString("successful");
//                sot.Units_before = jsonObj.getString("units_before");
//            }else{
//                sot.Code = jsonObj.getInt("code");
//                sot.Comment = jsonObj.getString("comment");
//                sot.error = jsonObj.getBoolean("error");
//            }
//
//            // SMSOutput sot = parseResponse(responseInString); // Implement this method
//        } catch (Exception e) {
//            responseInString = e.getMessage();
//        }
//
//        return sot;
//    }
//}
