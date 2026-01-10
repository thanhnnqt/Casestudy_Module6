package org.example.case_study_module_6.service;

import org.example.case_study_module_6.entity.Booking;

public interface IEmailService {
    void sendVerificationEmail(String to, String link);
    void send(String to, String subject, String content);
    void sendBookingSuccessEmail(Booking booking);
}
