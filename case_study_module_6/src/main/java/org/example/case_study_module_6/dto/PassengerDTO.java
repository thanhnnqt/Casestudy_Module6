package org.example.case_study_module_6.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class PassengerDTO {
    private String fullName;
    private String seatClass;
}