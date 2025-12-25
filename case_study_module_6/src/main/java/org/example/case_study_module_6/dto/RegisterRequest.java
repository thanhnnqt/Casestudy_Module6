package org.example.case_study_module_6.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import org.example.case_study_module_6.entity.Customer;

import java.time.LocalDate;

@Getter
@Setter
public class RegisterRequest {

    @NotBlank(message = "Username không được để trống")
    @Size(min = 4, message = "Username tối thiểu 4 ký tự")
    private String username;

    @Size(min = 6, message = "Mật khẩu tối thiểu 6 ký tự")
    private String password;

    @NotBlank(message = "Họ tên không được để trống")
    private String fullName;

    @Past(message = "Ngày sinh không hợp lệ")
    private LocalDate dateOfBirth;

    private Customer.Gender gender;

    @Pattern(regexp = "^0\\d{9}$", message = "Số điện thoại không hợp lệ")
    private String phoneNumber;

    @Pattern(regexp = "^(\\d{9}|\\d{12})$", message = "CCCD không hợp lệ")
    private String identityCard;

    @Email(message = "Email không hợp lệ")
    private String email;

    private String address;
}
