package org.example.case_study_module_6.util;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;
import jakarta.servlet.http.HttpServletRequest;

public class VnpayUtil {

    /* ================= HMAC SHA512 ================= */
    public static String hmacSHA512(String key, String data) {
        try {
            Mac hmac = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKey =
                    new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            hmac.init(secretKey);
            byte[] bytes = hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));

            StringBuilder hash = new StringBuilder();
            for (byte b : bytes) {
                hash.append(String.format("%02x", b));
            }
            return hash.toString();
        } catch (Exception e) {
            throw new RuntimeException("Error while hashing HmacSHA512", e);
        }
    }

    /* ================= BUILD QUERY STRING ================= */
    public static String buildQueryString(Map<String, String> params) {
        StringBuilder query = new StringBuilder();
        try {
            for (Map.Entry<String, String> entry : params.entrySet()) {
                query.append(URLEncoder.encode(entry.getKey(), StandardCharsets.UTF_8))
                        .append("=")
                        .append(URLEncoder.encode(entry.getValue(), StandardCharsets.UTF_8))
                        .append("&");
            }
            // remove last &
            query.deleteCharAt(query.length() - 1);
        } catch (Exception e) {
            throw new RuntimeException("Error while building query string", e);
        }
        return query.toString();
    }

    /* ================= SORT PARAMS ================= */
    public static Map<String, String> sortParams(Map<String, String> params) {
        return new TreeMap<>(params);
    }

    /* ================= VERIFY CALLBACK SIGNATURE ================= */
    public static boolean verifySignature(
            Map<String, String> params,
            String secretKey
    ) {
        String vnpSecureHash = params.remove("vnp_SecureHash");
        params.remove("vnp_SecureHashType");

        Map<String, String> sortedParams = sortParams(params);
        String data = buildQueryString(sortedParams);

        String calculatedHash = hmacSHA512(secretKey, data);
        return calculatedHash.equalsIgnoreCase(vnpSecureHash);
    }

    /* ================= GENERATE RANDOM TXN REF ================= */
    public static String generateTxnRef() {
        return UUID.randomUUID().toString().replace("-", "");
    }

    /* ================= GET CLIENT IP ================= */
    public static String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-FORWARDED-FOR");
        if (ip == null || ip.isEmpty()) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }
}
