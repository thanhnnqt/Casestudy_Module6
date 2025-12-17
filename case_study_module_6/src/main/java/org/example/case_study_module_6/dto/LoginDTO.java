package org.example.case_study_module_6.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginDTO {

    @NotBlank(message = "Tài khoản hoặc email không được để trống")
    private String usernameOrEmail;

    @NotBlank(message = "Mật khẩu không được để trống")
    private String password;
}
