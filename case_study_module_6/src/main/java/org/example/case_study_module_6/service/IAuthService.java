package org.example.case_study_module_6.service;

public interface IAuthService {
    void forgotPassword(String email);
    void resetPassword(String token, String newPassword);
    void changePassword(String username, String oldPassword, String newPassword);
}
