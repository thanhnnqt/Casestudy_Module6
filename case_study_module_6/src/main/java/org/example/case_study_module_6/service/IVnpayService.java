package org.example.case_study_module_6.service;

public interface IVnpayService {
    String createPaymentUrl(Long amount, String orderInfo);
}
