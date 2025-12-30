package org.example.case_study_module_6.config;

import org.springframework.context.annotation.Configuration;

@Configuration
public class VnpayConfig {
    public static final String VNP_TMN_CODE = "KTO3S2NR";
    public static final String VNP_HASH_SECRET = "R9YURBRPRI5XXLL4JCJA5W39X9O63UEI";
    public static final String VNP_PAY_URL = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    public static final String VNP_RETURN_URL = "http://localhost:5173/payment-result";
}
