package org.example.case_study_module_6.service;

import jakarta.servlet.http.HttpServletRequest;

public interface IVnpayService {
    String createPaymentUrl(Long amount, String bookingCode, HttpServletRequest request);
}
