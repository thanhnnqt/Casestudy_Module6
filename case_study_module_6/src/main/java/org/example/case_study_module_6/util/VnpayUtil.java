package org.example.case_study_module_6.util;

import jakarta.servlet.http.HttpServletRequest;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

public class VnpayUtil {
    // 1. HMAC SHA512
    public static String hmacSHA512(String key, String data) {
        try {
            if (key == null || data == null) throw new NullPointerException();
            Mac mac = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            mac.init(secretKey);
            byte[] rawHmac = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder(rawHmac.length * 2);
            for (byte b : rawHmac) hex.append(String.format("%02x", b));
            return hex.toString().toUpperCase();
        } catch (Exception e) {
            throw new RuntimeException("Failed to calculate HmacSHA512", e);
        }
    }
    // 2. Build Query String (Chuẩn RFC 3986)
    public static String buildQueryString(Map<String, String> params) {
        StringBuilder query = new StringBuilder();
        try {
            for (Map.Entry<String, String> e : params.entrySet()) {
                if (e.getValue() != null && !e.getValue().isEmpty()) {
                    query.append(URLEncoder.encode(e.getKey(), StandardCharsets.UTF_8.toString()))
                            .append("=")
                            .append(URLEncoder.encode(e.getValue(), StandardCharsets.UTF_8.toString())
                                    .replace("+", "%20")) // Strict RFC 3986
                            .append("&");
                }
            }
            if (query.length() > 0) query.setLength(query.length() - 1);
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
        return query.toString();
    }
    // 3. Build Hash Data (V2.1.0: Values MUST be URL Encoded)
    public static String buildHashData(Map<String, String> params) {
        StringBuilder sb = new StringBuilder();
        try {
            for (Map.Entry<String, String> e : params.entrySet()) {
                if (e.getValue() != null && !e.getValue().isEmpty()) {
                    sb.append(URLEncoder.encode(e.getKey(), StandardCharsets.UTF_8.toString()))
                            .append("=")
                            .append(URLEncoder.encode(e.getValue(), StandardCharsets.UTF_8.toString())
                                    .replace("+", "%20")) // Strict RFC 3986
                            .append("&");
                }
            }
            if (sb.length() > 0) sb.setLength(sb.length() - 1);
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
        return sb.toString();
    }
    // 4. Verify Signature
    public static boolean verifySignature(Map<String, String> params, String secretKey) {
        String vnpSecureHash = params.get("vnp_SecureHash");
        if (vnpSecureHash == null) return false;

        Map<String, String> verifyParams = new TreeMap<>(params);
        verifyParams.remove("vnp_SecureHash");
        verifyParams.remove("vnp_SecureHashType");

        String hashData = buildHashData(verifyParams);
        String calculatedHash = hmacSHA512(secretKey, hashData);
        return calculatedHash.equalsIgnoreCase(vnpSecureHash);
    }

    // 5. Sort Params
    public static Map<String, String> sortParams(Map<String, String> params) {
        return new TreeMap<>(params);
    }
    // 6. Get Client IP
    public static String getClientIp(HttpServletRequest request) {
        return "127.0.0.1"; // Hardcode cho Sandbox để tránh lỗi IP
    }
}