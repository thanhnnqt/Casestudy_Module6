package org.example.case_study_module_6.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDTO {
    @NotBlank(message = "Vui lòng nhập mã của nhân viên!")
    @Pattern(regexp = "^NV[1-9]$", message = "Vui lòng nhập đúng định dạng mã nhân viên(NV-001)!")
    private String employeeCode;
    @NotBlank(message = "Vui lòng nhập họ và tên của nhân viên!")
    @Pattern(regexp = "^[A-Z][a-z]+(\\s[A-Z][a-z]+)+$", message = "Vui lòng nhập tên đúng định dạng(Nguyen Van A)!")
    private String fullName;
    @NotBlank(message = "Vui lòng nhập địa chỉ của nhân viên!")
    private String address;
    @NotBlank(message = "Vui lòng nhập số điện thoại của nhân viên!")
    @Pattern(regexp = "^0([35789])[0-9]{8}$")
    @Size(max = 10, min = 10, message = "Số điện thoại phải đủ 10 chữ số!")
    private String phoneNumber;
    @NotBlank(message = "Vui lòng nhập email của nhân viên!")
    @Email(message = "Vui lòng nhập đúng định dạng email(example@gmail.com)!")
    private String email;
    @NotNull(message = "Vui lòng nhập ngày sinh của nhân viên!")
    @Past(message = "Ngày sinh không hợp lệ, vui lòng nhập lại!")
    private LocalDate DOB;
    @NotNull(message = "Vui lòng nhập giới tính!")
    private String gender;
    private String userName;
    private String password;
}
