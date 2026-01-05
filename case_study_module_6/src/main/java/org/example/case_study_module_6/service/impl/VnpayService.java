package org.example.case_study_module_6.service.impl;
import jakarta.servlet.http.HttpServletRequest;
import org.example.case_study_module_6.config.VnpayConfig;
import org.example.case_study_module_6.service.IVnpayService; // Tạo interface này nếu chưa có
import org.example.case_study_module_6.util.VnpayUtil;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.*;
@Service
public class VnpayService implements IVnpayService {
    @Override
    public String createPaymentUrl(Long amount, String bookingCode, HttpServletRequest request) {
        Map<String, String> params = new HashMap<>();
        // Sanitize txnRef + Add timestamp để đảm bảo unique mỗi lần thanh toán
        String txnRef = bookingCode.replaceAll("[^a-zA-Z0-9]", "") + "_" + System.currentTimeMillis();
        
        // --- XỬ LÝ THỜI GIAN (UPDATE: Remove Force 2025) ---
        Calendar cal = Calendar.getInstance(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        
        // TRỪ LÙI 5 PHÚT để tránh lỗi "Future Date" nếu giờ máy tính nhanh hơn giờ Server VNPay
        cal.add(Calendar.MINUTE, -5);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
        sdf.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        params.put("vnp_Version", "2.1.0");
        params.put("vnp_Command", "pay");
        params.put("vnp_TmnCode", VnpayConfig.VNP_TMN_CODE);
        params.put("vnp_Amount", String.valueOf(amount * 100)); // x100 theo quy định VNPay
        params.put("vnp_CurrCode", "VND");
        params.put("vnp_TxnRef", txnRef);
        params.put("vnp_OrderInfo", "Thanh_toan_booking_" + txnRef);
        params.put("vnp_OrderType", "other");
        params.put("vnp_Locale", "vn");
        params.put("vnp_ReturnUrl", VnpayConfig.VNP_RETURN_URL);
        params.put("vnp_IpAddr", "127.0.0.1");
        params.put("vnp_CreateDate", sdf.format(cal.getTime()));

        // Expire date (15 phút)
        Calendar expireCal = (Calendar) cal.clone();
        expireCal.add(Calendar.MINUTE, 15);
        params.put("vnp_ExpireDate", sdf.format(expireCal.getTime()));
        // Build URL
        Map<String, String> sortedParams = VnpayUtil.sortParams(params);
        String hashData = VnpayUtil.buildHashData(sortedParams);
        String secureHash = VnpayUtil.hmacSHA512(VnpayConfig.VNP_HASH_SECRET, hashData);
        String queryString = VnpayUtil.buildQueryString(sortedParams);

        String finalUrl = VnpayConfig.VNP_PAY_URL + "?" + queryString + "&vnp_SecureHash=" + secureHash + "&vnp_SecureHashType=HmacSHA512";
        
        System.out.println("------------------------------------------------");
        System.out.println("RAW HASH DATA: " + hashData);
        System.out.println("SECURE HASH  : " + secureHash);
        System.out.println("VNPAY URL    : " + finalUrl);
        System.out.println("------------------------------------------------");
        
        return finalUrl;
    }
}