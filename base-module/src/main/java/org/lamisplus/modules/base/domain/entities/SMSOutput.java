package org.lamisplus.modules.base.domain.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "SMS_Output")
public class SMSOutput {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;
    @NotNull(message = "Phone number(s) is required")
    @Column(name = "phone_numbers")
    public String phoneNumbers;

//    @NotNull(message = "Unique ID(s) is required")
    @Column(name = "beneficiary_ids")
    public String patientId;

//    @NotNull(message = "Sender ID is required")
    @Column(name = "sender_id")
    public String senderId;

    public String message;
    @Column(name = "message_type")
    public String messageType;
    @Column(name = "send_status")
    public String sendStatus;
    @Column(name = "time_stamp")
    public LocalDate timeStamp;

    @Column(name = "successful")
    public String Successful;

    @Column(name = "basic_successful")
    public String Basic_successful ;

    @Column(name = "corp_successful")
    public String Corp_successful;

    @Column(name = "simserver_successful")
    public String Simserver_successful ;

    @Column(name = "failed")
    public String Failed ;

    @Column(name = "insufficient_unit")
    public String Insufficient_unit ;

    @Column(name = "invalid")
    public String Invalid;

    @Column(name = "all_numbers")
    public String All_numbers ;

    @Column(name = "units_used")
    public String Units_used ;

    @Column(name = "basic_units")
    public int Basic_units ;

    @Column(name = "corp_units")
    public int Corp_units ;

    @Column(name = "units_before")
    public String Units_before ;

    @Column(name = "code")
    public int Code ;

    @Column(name = "comment")
    public String Comment ;

    @Column(name = "sms_pages")
    public int Sms_pages ;

    @Column(name = "error")
    public boolean error ;

    @Column(name = "notification_count")
    public String notification_count ;

}
