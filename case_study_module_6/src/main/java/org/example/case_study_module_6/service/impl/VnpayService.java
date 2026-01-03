package org.example.case_study_module_6.service.impl;

import org.example.case_study_module_6.config.VnpayConfig;
import org.example.case_study_module_6.service.IVnpayService;
import org.example.case_study_module_6.util.VnpayUtil;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class VnpayService implements IVnpayService {

    @Override
    public String createPaymentUrl(Long amount, String orderInfo) {

        Map<String, String> params = new HashMap<>();

        String txnRef = VnpayUtil.generateTxnRef();

        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
        sdf.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));

        params.put("vnp_Version", "2.1.0");
        params.put("vnp_Command", "pay");
        params.put("vnp_TmnCode", VnpayConfig.VNP_TMN_CODE);
        params.put("vnp_Amount", String.valueOf(amount * 100));
        params.put("vnp_CurrCode", "VND");
        params.put("vnp_TxnRef", txnRef);
        params.put("vnp_OrderInfo", "Thanh toan booking " + orderInfo);
        params.put("vnp_OrderType", "other");
        params.put("vnp_Locale", "vn");
        params.put("vnp_ReturnUrl", VnpayConfig.VNP_RETURN_URL);
        params.put("vnp_IpAddr", "8.8.8.8");
        params.put("vnp_CreateDate", sdf.format(new Date()));

        Calendar cal = Calendar.getInstance(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        cal.add(Calendar.MINUTE, 15);
        params.put("vnp_ExpireDate", sdf.format(cal.getTime()));

        Map<String, String> sortedParams = VnpayUtil.sortParams(params);

        String hashData = VnpayUtil.buildHashData(sortedParams);
        String secureHash = VnpayUtil.hmacSHA512(VnpayConfig.VNP_HASH_SECRET, hashData);
        String queryString = VnpayUtil.buildQueryString(sortedParams);

        String finalUrl = VnpayConfig.VNP_PAY_URL
                + "?"
                + queryString
                + "&vnp_SecureHash="
                + secureHash
                + "&vnp_SecureHashType=HmacSHA512";

        System.out.println("===== FINAL VNPAY URL =====");
        System.out.println(finalUrl);
        System.out.println("===========================");

        return finalUrl;
    }
}
