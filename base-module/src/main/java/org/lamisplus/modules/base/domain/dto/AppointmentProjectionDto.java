package org.lamisplus.modules.base.domain.dto;

import java.time.LocalDate;

public interface AppointmentProjectionDto {


    String getHospitalNumber();
    String getSurname();

    String getFirstName();

    String getSex();

    String getAge();

    String getRegimen();

    LocalDate getLastVisit();

    Integer getRefillPeriod();

    LocalDate getAppointmentDate();

    String getCaseManagerName();

    Integer getTotalCount();

}
