package org.lamisplus.modules.base.service;

import com.sun.net.httpserver.HttpsServer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.json.JSONObject;
import org.lamisplus.modules.base.domain.dto.PhoneNumbersDto;
import org.lamisplus.modules.base.domain.dto.SmsDTO;
import org.lamisplus.modules.base.domain.entities.SMSOutput;
import org.lamisplus.modules.base.domain.entities.SmsSetup;
import org.lamisplus.modules.base.domain.repositories.SmsRepository;
import org.lamisplus.modules.base.domain.repositories.SmsSetupRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.*;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;



@Slf4j
@Service
@RequiredArgsConstructor
public class SmsService {

    private final CurrentUserOrganizationService currentUserOrganizationService;
    private final SmsRepository smsRepository;
    private final SmsSetupRepository smsSetupRepository;
    private final InternetConnectivityService internetConnectivityService;


    @Scheduled(cron = "0 0 0 * * *")
    public void runDailyTask() {
        if (internetConnectivityService.isInternetAvailable()) {
            // Run your daily task here
            sendDrugRefillReminderSms7DaysPrior();
            sendDrugRefillReminderSms30DaysPrior();
            SendDrugRefillReminderSms1DayPrior();
            System.out.println("Running daily task with internet connectivity");
        } else {
            System.out.println("No internet connectivity, skipping daily task");
        }
    }





//    private final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();

//    public void start() {
//        scheduler.scheduleWithFixedDelay(() -> {
//            try {
//                SendDrugRefillReminderSms7DaysPrior();
//            } catch (Exception e) {
//                // Handle exception
//            }
//        }, 0, 1, TimeUnit.DAYS);
//    }
    static final String DUE_IN_7_DAYS = "'7 days'";
    static final String WEEKLY = "Weekly";
    static final String DUE_IN_30_DAYS = "'30 days'";
    static final String MONTHLY = "Monthly";
    static final String DUE_IN_1_DAYS = "'1 days'";
    static final String DAILY = "Daily";
//    boolean SendBulkSms(String from,String to, String message);
//    void SendDrugRefillReminderSms7DaysPrior();
//    void SendDrugRefillReminderSms1DayPrior();
    public SmsDTO createSms(SmsDTO smsDTO) {
        SMSOutput smsOutput = new SMSOutput();
        try {
            Response smsServiceResponse = SmsServiceResponse("", smsDTO.getPhoneNumbers(), smsDTO.getMessage());
            LOG.info("show passed params, {} ",  smsDTO.getMessage() );
            if(smsServiceResponse.isSuccessful()){
                BeanUtils.copyProperties(smsDTO, smsOutput);
                smsOutput.setSendStatus("Successful");
                smsOutput.setTimeStamp(LocalDate.now());
                return convertSmsToDto(smsRepository.save(smsOutput));
            }else {
                BeanUtils.copyProperties(smsDTO, smsOutput);
                smsOutput.setSendStatus("Failed");
                smsOutput.setTimeStamp(LocalDate.now());
                return convertSmsToDto(smsRepository.save(smsOutput));
            }
        } catch (Exception e) {
            throw new RuntimeException("Internet Connection errOr", e);
        }
    }


    private SmsDTO convertSmsToDto(SMSOutput smsOutput) {
        return SmsDTO.builder()
                .patientId(smsOutput.getPatientId())
                .message(smsOutput.getMessage())
                .messageType(smsOutput.getMessageType())
                .notificationCount(smsOutput.getNotification_count())
                .phoneNumbers(smsOutput.getPhoneNumbers())
                .sendStatus(smsOutput.getSendStatus())
                .senderId(smsOutput.getSenderId())
                .timeStamp(smsOutput.getTimeStamp())
                .build();
    }

    public List<SmsDTO> getSmsHistory (){
        List<SMSOutput>  smsOutputs =  smsRepository.findAllOrderByIdDesc();
        return smsOutputs.stream()
                .map(this::convertSmsToDto).collect(Collectors.toList());
    }


    //Auto Run Services from one click!
//    public void checkInternetConnectivity() {
//        try {
//            URL url = new URL("http://www.google.com");
//            URLConnection connection = url.openConnection();
//            connection.connect();
//            System.out.println("Internet Connected");
//        } catch (Exception e) {
//            System.out.println("Sorry, No Internet Connection");
//        }
//    }
    //TODO: write a query to pull client phone number in refill days

    public void sendDrugRefillReminderSms7DaysPrior() {
        try {
            LOG.info("Sending Drug Refill Reminder Sms to Clients due in 7 Days...");
            LocalDate today = LocalDate.now();
            LocalDate aWeekFromToday = today.plusDays(7);
            DateTimeFormatter dTF = DateTimeFormatter.ofPattern("dd-MMM-yyyy");
            String date = dTF.format(aWeekFromToday);
            String notificationCount = "First";
            Long facilityId = currentUserOrganizationService.getCurrentUserOrganization();
            // Check if bulk sms has been sent today for this message category;
            Boolean messageSentPerDateAndPerSmsCategory = smsRepository.messageSentPerDateAndPerSmsCategory("ARV Refill Reminder Message", today, notificationCount);
            if (!messageSentPerDateAndPerSmsCategory) {
                String senderID = "(link unavailable)";

                System.out.println("checkout string paramater***********"+DUE_IN_7_DAYS );

                // Call the getPhoneNumbersDueIn method here
                // DAILY
//                Optional<SmsSetup> dailyFrequency = smsRepository.findByFrequency(DAILY);
//                if (dailyFrequency.isPresent()) {
//                    List<PhoneNumbersDto> values = smsRepository.getPhoneNumbersDueIn(facilityId, DUE_IN_1_DAYS);
//                    System.out.println("checkout string paramater***********" + DUE_IN_1_DAYS);
//                }
//
//                // WEEKLY
//                Optional<SmsSetup> weeklyFrequency = smsRepository.findByFrequency(WEEKLY);
//                if (weeklyFrequency.isPresent()) {
//                    List<PhoneNumbersDto> weeklyValues = smsRepository.getPhoneNumbersDueIn(facilityId, DUE_IN_7_DAYS);
//                    System.out.println("checkout string paramater***********" + DUE_IN_7_DAYS);
//                }
//
//                // MONTHLY
//                Optional<SmsSetup> monthlyFrequency = smsRepository.findByFrequency(MONTHLY);
//                if (monthlyFrequency.isPresent()) {
//                    List<PhoneNumbersDto> monthlyValues = smsRepository.getPhoneNumbersDueIn(facilityId, MONTHLY);
//                    System.out.println("checkout string paramater***********" + MONTHLY);
//                }

//                Optional<SmsSetup> dailyFrequency = smsRepository.findByFrequency(DAILY);
//                if (dailyFrequency.isPresent()) {
//                    List<PhoneNumbersDto> values = smsRepository.getPhoneNumbersDueIn(facilityId, DUE_IN_1_DAYS);
//                    System.out.println("checkout string paramater***********" + DUE_IN_1_DAYS);
//                }
                List<PhoneNumbersDto> values = smsRepository.getPhoneNumbers7DueIn(facilityId);

                String phoneNumbers = values.stream()
                        .map(PhoneNumbersDto::getPhoneNumbers) // extract the phone number from each dto
                        .collect(Collectors.joining(", "));
                System.out.println("Second Method Sout oooooooo" + phoneNumbers);

                String message = "Dear Caregiver, \n " + "Your child/ward is due for drug-refill appointment on {$date$}.\n" + "Please ensure adherence. Thank you.";
                String messageType = "ARV Refill Reminder Message";
                Optional<SmsSetup> smsSetup = smsSetupRepository.findByMessageCategory("ARV Refill Reminder Message", WEEKLY);
                if (smsSetup.isPresent()) {
                    message = smsSetup.get().messageBody;
                    senderID = smsSetup.get().senderID;
                    System.out.println("Inside 7 Days" +message);
                }
                if (phoneNumbers != null) {
                    SmsDTO smsDTO = new SmsDTO();
                    smsDTO.setPhoneNumbers(phoneNumbers);
//                    smsDTO.setPatientId(patientIds);
                    smsDTO.setMessage(message.replace("{$date$}", date));
                    smsDTO.setMessageType(messageType);
                    smsDTO.setNotificationCount(notificationCount);
                    smsDTO.setSenderId(senderID);
                    sendSms(smsDTO);
                } else {
                    LOG.info("No pending Bulk SMS to send.");
                }
            }
        } catch (Exception ignored) {
        }
    }


    public void sendDrugRefillReminderSms30DaysPrior() {
        try {
            LOG.info("Sending Drug Refill Reminder Sms to Clients due in 30 Days...");
            LocalDate today = LocalDate.now();
            LocalDate aWeekFromToday = today.plusDays(30);
            DateTimeFormatter dTF = DateTimeFormatter.ofPattern("dd-MMM-yyyy");
            String date = dTF.format(aWeekFromToday);
            String notificationCount = "First";
            Long facilityId = currentUserOrganizationService.getCurrentUserOrganization();
            // Check if bulk sms has been sent today for this message category;
            Boolean messageSentPerDateAndPerSmsCategory = smsRepository.messageSentPerDateAndPerSmsCategory("ARV Refill Reminder Message", today, notificationCount);
            if (!messageSentPerDateAndPerSmsCategory) {
                String senderID = "(link unavailable)";

                System.out.println("checkout string paramater***********"+DUE_IN_30_DAYS );


//                Optional<SmsSetup> dailyFrequency = smsRepository.findByFrequency(MONTHLY);
//                if (dailyFrequency.isPresent()) {
//                    List<PhoneNumbersDto> values = smsRepository.getPhoneNumbers30DueIn(facilityId);
//                    System.out.println("checkout string paramater***********" + DUE_IN_30_DAYS);
//                }
                List<PhoneNumbersDto> values = smsRepository.getPhoneNumbers30DueIn(facilityId);

                String phoneNumbers = values.stream()
                        .map(PhoneNumbersDto::getPhoneNumbers) // extract the phone number from each dto
                        .collect(Collectors.joining(", "));
                System.out.println("Second Method Sout oooooooo" + phoneNumbers);

                String message = "Dear Caregiver, \n " + "Your child/ward is due for drug-refill appointment on {$date$}.\n" + "Please ensure adherence. Thank you.";
                String messageType = "ARV Refill Reminder Message";
                Optional<SmsSetup> smsSetup = smsSetupRepository.findByMessageCategory("ARV Refill Reminder Message", MONTHLY);
                if (smsSetup.isPresent()) {
                    message = smsSetup.get().messageBody;
                    senderID = smsSetup.get().senderID;
                    System.out.println("Inside 30 Days" +message);
                }
                if (phoneNumbers != null) {
                    SmsDTO smsDTO = new SmsDTO();
                    smsDTO.setPhoneNumbers(phoneNumbers);
//                    smsDTO.setPatientId(patientIds);
                    smsDTO.setMessage(message.replace("{$date$}", date));
                    smsDTO.setMessageType(messageType);
                    smsDTO.setNotificationCount(notificationCount);
                    smsDTO.setSenderId(senderID);
                    sendSms(smsDTO);
                } else {
                    LOG.info("No pending Bulk SMS to send.");
                }
            }
        } catch (Exception ignored) {
        }
    }


    public void SendDrugRefillReminderSms1DayPrior() {
        try {
            LOG.info("Sending Drug Refill Reminder Sms to Clients due in 1 Days...");
            LocalDate today = LocalDate.now();
            LocalDate aWeekFromToday = today.plusDays(1);
            DateTimeFormatter dTF = DateTimeFormatter.ofPattern("dd-MMM-yyyy");
            String date = dTF.format(aWeekFromToday);
            String notificationCount = "First";
            Long facilityId = currentUserOrganizationService.getCurrentUserOrganization();
            // Check if bulk sms has been sent today for this message category;
            Boolean messageSentPerDateAndPerSmsCategory = smsRepository.messageSentPerDateAndPerSmsCategory("ARV Refill Reminder Message", today, notificationCount);
            if (!messageSentPerDateAndPerSmsCategory) {
                String senderID = "(link unavailable)";

                System.out.println("checkout string paramater***********"+DUE_IN_1_DAYS );


//                Optional<SmsSetup> dailyFrequency = smsRepository.findByFrequency(DAILY);
//                if (dailyFrequency.isPresent()) {
//                    List<PhoneNumbersDto> values = smsRepository.getPhoneNumbers1DueIn(facilityId);
//                    System.out.println("checkout string paramater***********" + DUE_IN_1_DAYS);
//                }
                List<PhoneNumbersDto> values = smsRepository.getPhoneNumbers1DueIn(facilityId);

                String phoneNumbers = values.stream()
                        .map(PhoneNumbersDto::getPhoneNumbers) // extract the phone number from each dto
                        .collect(Collectors.joining(", "));
                System.out.println("Second Method Sout oooooooo" + phoneNumbers);

                String message = "Dear Caregiver, \n " + "Your child/ward is due for drug-refill appointment on {$date$}.\n" + "Please ensure adherence. Thank you.";
                String messageType = "ARV Refill Reminder Message";
                Optional<SmsSetup> smsSetup = smsSetupRepository.findByMessageCategory("ARV Refill Reminder Message", DAILY);
                if (smsSetup.isPresent()) {
                    message = smsSetup.get().messageBody;
                    senderID = smsSetup.get().senderID;
                    System.out.println("Inside 1 Days" +message);
                }
                if (phoneNumbers != null) {
                    SmsDTO smsDTO = new SmsDTO();
                    smsDTO.setPhoneNumbers(phoneNumbers);
//                    smsDTO.setPatientId(patientIds);
                    smsDTO.setMessage(message.replace("{$date$}", date));
                    smsDTO.setMessageType(messageType);
                    smsDTO.setNotificationCount(notificationCount);
                    smsDTO.setSenderId(senderID);
                    sendSms(smsDTO);
                } else {
                    LOG.info("No pending Bulk SMS to send.");
                }
            }
        } catch (Exception ignored) {
        }
    }

//    public void sendDrugRefillReminderSms7DaysPrior() {
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
////                String[] values = getPhoneNumbersAndBeneficiaryIDsDueIn("7 days");
//                String[] values = smsRepository.getPhoneNumbersDueIn(currentUserOrganizationService.getCurrentUserOrganization(), DUE_IN_7_DAYS);
//                LOG.info("************************ DUE IN 7 day ooooooooo ", values);
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
//                    smsDTO.setPatientId(beneficiaryIDs);
//                    smsDTO.setMessage(message.replace("{$date$}",date));
//                    smsDTO.setMessageType(messageType);
//                    smsDTO.setNotificationCount(notificationCount);
//                    smsDTO.setSenderId(senderID);
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

    public boolean SendBulkSms(String sender,String recipients, String message){
        try {
            LOG.info("Sending bulk sms to recipients...");
            LocalDate today = LocalDate.now();
            String notificationCount = "NA";

            if (recipients != null) {
                SmsDTO smsDTO = new SmsDTO();
                smsDTO.setPhoneNumbers(recipients);
                smsDTO.setPatientId("NA");
                smsDTO.setMessage(message);
                smsDTO.setMessageType("Bulk SMS");
                smsDTO.setNotificationCount(notificationCount);
                smsDTO.setSenderId(sender);
                sendSms(smsDTO);
            } else {
                LOG.info("No pending Bulk SMS to send.");
            }
            return true;
        }
        catch (Exception ignored){
            return false;
        }
    }



    public void sendSms(SmsDTO smsDTO) {

        SMSOutput smsOutput = new SMSOutput();
        smsOutput.phoneNumbers = smsDTO.getPhoneNumbers();
        smsOutput.patientId = smsDTO.getPatientId();
        smsOutput.message = smsDTO.getMessage();
        smsOutput.messageType= smsDTO.getMessageType();
        smsOutput.notification_count= smsDTO.getNotificationCount();
        smsOutput.senderId= smsDTO.getSenderId();
        smsOutput.timeStamp = LocalDate.now();

        try {
            SMSOutput smsServiceResponse = SmsServiceResponse2  (smsDTO.getSenderId(), smsDTO.getPhoneNumbers(), smsDTO.getMessage());
            if(smsServiceResponse.Code!=0 && smsServiceResponse.Code==1000){
                smsOutput.sendStatus = "Successful";
                smsOutput.Code = smsServiceResponse.Code;
                smsOutput.Sms_pages = smsServiceResponse.Sms_pages;
                smsOutput.All_numbers = smsServiceResponse.All_numbers;
                smsOutput.Comment= smsServiceResponse.Comment;
                smsOutput.error = smsServiceResponse.error;
                smsOutput.Basic_successful = smsServiceResponse.Basic_successful;
                smsOutput.Basic_units = smsServiceResponse.Basic_units;
                smsOutput.Corp_successful= smsServiceResponse.Corp_successful;
                smsOutput.Corp_units = smsServiceResponse.Corp_units;
                smsOutput.Failed= smsServiceResponse.Failed;
                smsOutput.Insufficient_unit= smsServiceResponse.Insufficient_unit;
                smsOutput.Invalid= smsServiceResponse.Invalid;
                smsOutput.Simserver_successful = smsServiceResponse.Simserver_successful;
                smsOutput.Successful= smsServiceResponse.Successful;
                smsOutput.Units_before= smsServiceResponse.Units_before;
                smsOutput.Units_used= smsServiceResponse.Units_used;

                smsRepository.save(smsOutput);
                LOG.info("Sending Bulk SMS completed");
            }else {
                smsOutput.sendStatus = "Failed";

                smsOutput.Code = smsServiceResponse.Code;
                smsOutput.Comment= smsServiceResponse.Comment;
                smsOutput.error = smsServiceResponse.error;

                smsRepository.save(smsOutput);
                LOG.info("Sending Bulk SMS failed");
            }
        } catch (Exception e) {
            LOG.info("Error Sending Bulk SMS");
        }
    }



    public static SMSOutput SmsServiceResponse2(String sender, String phone, String message) {
        SMSOutput sot = new SMSOutput();
        String responseInString = "";

        try {
            URL url = new URL("https://smartsmssolutions.com/api/json.php");
            url = new URL("https://app.smartsmssolutions.com/io/api/client/v1/sms/");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setDoOutput(true);

            String data = URLEncoder.encode("sender", "UTF-8") + "=" + URLEncoder.encode(sender, "UTF-8") +
                    "&" + URLEncoder.encode("to", "UTF-8") + "=" + URLEncoder.encode(phone, "UTF-8") +
                    "&" + URLEncoder.encode("message", "UTF-8") + "=" + URLEncoder.encode(message, "UTF-8") +
                    "&" + URLEncoder.encode("type", "UTF-8") + "=" + URLEncoder.encode("0", "UTF-8") +
                    "&" + URLEncoder.encode("routing", "UTF-8") + "=" + URLEncoder.encode("2", "UTF-8") +
                    "&" + URLEncoder.encode("token", "UTF-8") + "=" + URLEncoder.encode("ol57UYbSHwG6ez182Ynt5js6mIcgnp4jaQIOrJNR7CDLpgLydd", "UTF-8");

            try (OutputStreamWriter wr = new OutputStreamWriter(conn.getOutputStream())) {
                wr.write(data);
                wr.flush();
            }

            BufferedReader rd = new BufferedReader(new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8));
            String line;
            StringBuilder result = new StringBuilder();
            while ((line = rd.readLine()) != null) {
                result.append(line);
            }
            rd.close();
            responseInString = result.toString();
            JSONObject jsonObj = new JSONObject(responseInString);
            if(jsonObj.has("all_numbers")) {
                sot.All_numbers = jsonObj.getString("all_numbers");
                sot.Basic_successful = jsonObj.getString("basic_successful");
                sot.Basic_units = jsonObj.getInt("basic_units");
                sot.Code = jsonObj.getInt("code");
                sot.Sms_pages = jsonObj.getInt("sms_pages");
                sot.Corp_units = jsonObj.getInt("corp_units");
                sot.Units_used = jsonObj.getString("units_used");
                sot.Comment = jsonObj.getString("comment");
                sot.Corp_successful = jsonObj.getString("corp_successful");
                sot.error = jsonObj.getBoolean("error");
                sot.Failed = jsonObj.getString("failed");
                sot.Insufficient_unit = jsonObj.getString("insufficient_unit");
                sot.Invalid = jsonObj.getString("invalid");
                sot.Simserver_successful = jsonObj.getString("simserver_successful");
                sot.Successful = jsonObj.getString("successful");
                sot.Units_before = jsonObj.getString("units_before");
            }else{
                sot.Code = jsonObj.getInt("code");
                sot.Comment = jsonObj.getString("comment");
                sot.error = jsonObj.getBoolean("error");
            }

            // SMSOutput sot = parseResponse(responseInString); // Implement this method
        } catch (Exception e) {
            responseInString = e.getMessage();
        }

        return sot;
    }


    public static Response SmsServiceResponse(String name, String phoneNumbers, String message) throws IOException {
        LOG.info("got into smsServiceResponse{}",  message);
        OkHttpClient client = new OkHttpClient().newBuilder()
                .build();
        MediaType mediaType = MediaType.parse("text/plain");
        MultipartBody body = new MultipartBody.Builder().setType(MultipartBody.FORM)
                .addFormDataPart("token","ol57UYbSHwG6ez182Ynt5js6mIcgnp4jaQIOrJNR7CDLpgLydd")
                .addFormDataPart("sender","Data.FI")
                .addFormDataPart("to",phoneNumbers)
                .addFormDataPart("message","Hi, \n"+ message)
                .addFormDataPart("type","0")
                .addFormDataPart("routing","6")
                .build();
        Request request = new Request.Builder()
                .url("https://app.smartsmssolutions.com/io/api/client/v1/sms/")
                .method("POST", body)
                .build();
        return client.newCall(request).execute();
    }

}
