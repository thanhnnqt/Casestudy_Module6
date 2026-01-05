package org.example.case_study_module_6.config;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class VnpayConfig {
    @Value("${vnpay.tmn-code}")
    public static String VNP_TMN_CODE;
    @Value("${vnpay.hash-secret}")
    public static String VNP_HASH_SECRET;
    @Value("${vnpay.pay-url}")
    public static String VNP_PAY_URL;
    @Value("${vnpay.return-url}")
    public static String VNP_RETURN_URL;
    @Value("${vnpay.ipn-url}")
    public static String VNP_IPN_URL;
    // Setters for static injection
    @Value("${vnpay.tmn-code}")
    public void setVnpTmnCode(String v) { VNP_TMN_CODE = (v != null) ? v.trim() : null; }
    @Value("${vnpay.hash-secret}")
    public void setVnpHashSecret(String v) { VNP_HASH_SECRET = (v != null) ? v.trim() : null; }
    @Value("${vnpay.pay-url}")
    public void setVnpPayUrl(String v) { VNP_PAY_URL = (v != null) ? v.trim() : null; }
    @Value("${vnpay.return-url}")
    public void setVnpReturnUrl(String v) { VNP_RETURN_URL = (v != null) ? v.trim() : null; }
    @Value("${vnpay.ipn-url}")
    public void setVnpIpnUrl(String v) { VNP_IPN_URL = (v != null) ? v.trim() : null; }
}