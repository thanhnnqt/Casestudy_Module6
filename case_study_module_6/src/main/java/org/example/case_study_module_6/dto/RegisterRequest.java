package org.example.case_study_module_6.dto;

import lombok.Data;

@Data
public class RegisterRequest {

    // ❌ Không bắt client gửi cũng được
    // nếu bạn muốn backend tự sinh thì bỏ field này
    private String customerCode;

    private String username;
    private String password;

    private String fullName;
    private String email;
    private String phoneNumber;
    private String address;
}
