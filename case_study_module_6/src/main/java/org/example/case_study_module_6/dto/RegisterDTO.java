package org.example.case_study_module_6.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Data
public class RegisterDTO {

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không đúng định dạng")
    @Size(max = 40, message = "Email tối đa 40 ký tự")
    private String email;

    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 8, max = 20, message = "Mật khẩu từ 8-20 ký tự")
    @Pattern(
            regexp = "^(?=.*[A-Z])(?=.*\\d).*$",
            message = "Mật khẩu phải có ít nhất 1 chữ hoa và 1 số"
    )
    private String password;

    @NotBlank(message = "Xác nhận mật khẩu không được để trống")
    private String confirmPassword;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(
            regexp = "^(\\+84|0)[0-9]{9}$",
            message = "Số điện thoại Việt Nam không hợp lệ"
    )
    private String phone;

    @NotBlank(message = "Họ tên không được để trống")
    @Size(min = 10, max = 50, message = "Họ tên từ 10 đến 50 ký tự")
    private String fullName;

    @NotNull(message = "Ngày sinh không được để trống")
    @DateTimeFormat(pattern = "dd/MM/yyyy")
    private LocalDate birthDate;

    @Size(max = 250, message = "Địa chỉ tối đa 250 ký tự")
    private String address;

    @NotBlank(message = "Giới tính không được để trống")
    private String gender;

    @NotBlank(message = "CMND/Hộ chiếu không được để trống")
    @Pattern(
            regexp = "^\\d{12}$",
            message = "CMND phải đủ 12 chữ số"
    )
    private String identityNumber;

    @NotBlank(message = "Quốc tịch không được để trống")
    private String nationality;
}
