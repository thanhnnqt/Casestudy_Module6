package org.example.case_study_module_6.config;

import org.springframework.context.annotation.Configuration;

@Configuration
public class VnpayConfig {
    public static final String VNP_TMN_CODE = "X6K83D36";
    public static final String VNP_HASH_SECRET = "VF2JAJMLU1D5TKVHF9Y70HU5UT56WM3Z";
    public static final String VNP_PAY_URL = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    public static final String VNP_RETURN_URL = "http://127.0.0.1/payment-result";
    public static final String VNP_IPN_URL = "http://localhost:8080/api/payment/callback";
}
