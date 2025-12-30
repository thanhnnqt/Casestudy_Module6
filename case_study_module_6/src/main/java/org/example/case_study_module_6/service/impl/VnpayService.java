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
        String createDate = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());

        /* ================= REQUIRED PARAMS ================= */
        params.put("vnp_Version", "2.1.0");
        params.put("vnp_Command", "pay");
        params.put("vnp_TmnCode", VnpayConfig.VNP_TMN_CODE);
        params.put("vnp_Amount", String.valueOf(amount * 100)); // VNPay x100
        params.put("vnp_CurrCode", "VND");
        params.put("vnp_TxnRef", txnRef);
        params.put("vnp_OrderInfo", orderInfo);
        params.put("vnp_OrderType", "other");
        params.put("vnp_Locale", "vn");
        params.put("vnp_ReturnUrl", VnpayConfig.VNP_RETURN_URL);
        params.put("vnp_IpAddr", "127.0.0.1");
        params.put("vnp_CreateDate", createDate);

        /* ================= OPTIONAL ================= */
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.MINUTE, 15);
        String expireDate =
                new SimpleDateFormat("yyyyMMddHHmmss").format(cal.getTime());
        params.put("vnp_ExpireDate", expireDate);

        /* ================= SIGN ================= */
        Map<String, String> sortedParams = VnpayUtil.sortParams(params);
        String queryString = VnpayUtil.buildQueryString(sortedParams);
        String secureHash =
                VnpayUtil.hmacSHA512(VnpayConfig.VNP_HASH_SECRET, queryString);

        return VnpayConfig.VNP_PAY_URL
                + "?"
                + queryString
                + "&vnp_SecureHash="
                + secureHash;
    }
}
