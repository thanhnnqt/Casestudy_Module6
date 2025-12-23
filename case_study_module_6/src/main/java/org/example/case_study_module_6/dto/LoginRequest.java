package org.example.case_study_module_6.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String identifier;
    private String password;
}
