package org.example.case_study_module_6.dto;

import lombok.Data;
import org.example.case_study_module_6.entity.Customer;

import java.time.LocalDate;

@Data
public class CustomerUpdateRequest {
    private String fullName;
    private String phoneNumber;
    private String identityCard;
    private Customer.Gender gender;
    private LocalDate dateOfBirth;
    private String address;
}
