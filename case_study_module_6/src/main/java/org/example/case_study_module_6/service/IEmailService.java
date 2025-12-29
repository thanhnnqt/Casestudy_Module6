package org.example.case_study_module_6.service;

public interface IEmailService {
    void sendVerificationEmail(String to, String link);
    void send(String to, String subject, String content);
}
