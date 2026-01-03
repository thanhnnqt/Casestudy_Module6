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
            Mac mac = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKey =
                    new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            mac.init(secretKey);

            byte[] rawHmac = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));

            StringBuilder hex = new StringBuilder(rawHmac.length * 2);
            for (byte b : rawHmac) {
                hex.append(String.format("%02x", b));
            }
            return hex.toString();

        } catch (Exception e) {
            throw new RuntimeException("Failed to calculate HmacSHA512", e);
        }
    }

    /* ================= SORT PARAMS ================= */
    public static Map<String, String> sortParams(Map<String, String> params) {
        return new TreeMap<>(params); // A → Z
    }

    /* ================= BUILD HASH DATA (NO ENCODE) ================= */
    public static String buildHashData(Map<String, String> params) {
        StringBuilder sb = new StringBuilder();
        for (Map.Entry<String, String> e : params.entrySet()) {
            if (e.getValue() != null && !e.getValue().isEmpty()) {
                sb.append(e.getKey())
                        .append("=")
                        .append(e.getValue())
                        .append("&");
            }
        }
        sb.setLength(sb.length() - 1); // remove last &
        return sb.toString();
    }

    /* ================= BUILD QUERY STRING (ENCODE) ================= */
    public static String buildQueryString(Map<String, String> params) {
        StringBuilder query = new StringBuilder();
        try {
            for (Map.Entry<String, String> e : params.entrySet()) {
                if (e.getValue() != null && !e.getValue().isEmpty()) {
                    query.append(URLEncoder.encode(e.getKey(), StandardCharsets.UTF_8))
                            .append("=")
                            .append(
                                    URLEncoder.encode(e.getValue(), StandardCharsets.UTF_8)
                                            .replace("+", "%20")
                            )
                            .append("&");
                }
            }
            query.setLength(query.length() - 1); // remove last &
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
        return query.toString();
    }

    /* ================= VERIFY CALLBACK SIGNATURE ================= */
    public static boolean verifySignature(Map<String, String> params, String secretKey) {
        String vnpSecureHash = params.remove("vnp_SecureHash");
        params.remove("vnp_SecureHashType");

        Map<String, String> sortedParams = sortParams(params);
        String hashData = buildHashData(sortedParams);
        String calculatedHash = hmacSHA512(secretKey, hashData);

        return calculatedHash.equalsIgnoreCase(vnpSecureHash);
    }

    /* ================= GENERATE TXN REF ================= */
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
