package org.example.case_study_module_6.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class RegisterRequest {

    // ===== ACCOUNT =====
    private String username;
    private String email;
    private String password;

    // ===== CUSTOMER =====
    private String fullName;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateOfBirth;
    private String gender;      // Nam | Nữ | Khác
    private String phoneNumber;
    private String identityCard;
    private String address;
}