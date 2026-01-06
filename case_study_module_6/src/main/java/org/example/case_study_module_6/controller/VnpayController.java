package org.example.case_study_module_6.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.example.case_study_module_6.config.VnpayConfig;
import org.example.case_study_module_6.dto.PaymentRequest; // Tạo DTO này nếu chưa có
import org.example.case_study_module_6.enums.BookingStatus;
import org.example.case_study_module_6.service.IVnpayService;
import org.example.case_study_module_6.service.impl.BookingService;
import org.example.case_study_module_6.util.VnpayUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:5173")
public class VnpayController {
    private final IVnpayService vnpayService;
    private final BookingService bookingService;
    public VnpayController(IVnpayService vnpayService, BookingService bookingService) {
        this.vnpayService = vnpayService;
        this.bookingService = bookingService;
    }
    // API tạo link thanh toán
    @PostMapping("/create-payment-url")
    public ResponseEntity<?> createPaymentUrl(@RequestBody Map<String, Object> req, HttpServletRequest request) {
        // Có thể nhận vào object PaymentRequest hoặc Map
        // Parse 'amount' safely (handle Integer, Double, String)
        Object amountObj = req.get("amount");
        Long amount;
        if (amountObj instanceof Number) {
            amount = ((Number) amountObj).longValue();
        } else {
             try {
                amount = Long.parseLong(amountObj.toString());
            } catch (NumberFormatException e) {
                amount = (long) Double.parseDouble(amountObj.toString());
            }
        }
        
        String bookingCode = req.get("bookingCode").toString();

        String url = vnpayService.createPaymentUrl(amount, bookingCode, request);
        return ResponseEntity.ok(Map.of("url", url));
    }
    // API Callback xử lý kết quả
    @GetMapping("/callback")
    public ResponseEntity<?> callback(HttpServletRequest request) {
        Map<String, String> params = new HashMap<>();
        request.getParameterMap().forEach((k, v) -> params.put(k, v[0]));

        System.out.println(">>> VNPAY Callback Params: " + params);

        // 1. Verify Signature
        boolean isValidHash = VnpayUtil.verifySignature(params, VnpayConfig.VNP_HASH_SECRET);
        System.out.println(">>> VNPAY Hash Verification: " + isValidHash);

        if (!isValidHash) {
            return ResponseEntity.badRequest().body(Map.of("code", "97", "message", "Invalid Signature"));
        }

        // 2. Lấy thông tin
        String txnRef = params.get("vnp_TxnRef");
        // Tách bookingCode (loại bỏ timestamp nếu có)
        String bookingCode = txnRef.contains("_") ? txnRef.substring(0, txnRef.lastIndexOf("_")) : txnRef;
        String responseCode = params.get("vnp_ResponseCode");
        String transactionNo = params.get("vnp_TransactionNo");

        System.out.println(">>> TxnRef: " + txnRef + " | BookingCode: " + bookingCode + " | ResponseCode: " + responseCode + " | TransNo: " + transactionNo);

        // 3. Cập nhật trạng thái Booking
        try {
            if ("00".equals(responseCode)) {
                bookingService.updateStatusByCode(bookingCode, BookingStatus.PAID, transactionNo);
                System.out.println(">>> Booking status updated to PAID for code: " + bookingCode);
                return ResponseEntity.ok(Map.of("code", "00", "message", "Success", "bookingCode", bookingCode));
            } else {
                bookingService.updateStatusByCode(bookingCode, BookingStatus.FAILED, null);
                System.out.println(">>> Booking status updated to FAILED for code: " + bookingCode);
                return ResponseEntity.ok(Map.of("code", responseCode, "message", "Transaction Failed"));
            }
        } catch (Exception e) {
            System.err.println(">>> Error updating booking status: " + e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of("code", "99", "message", e.getMessage()));
        }
    }

    // API Test Config (Debug Only)
    @GetMapping("/test-config")
    public ResponseEntity<?> testConfig() {
        Map<String, String> config = new HashMap<>();
        config.put("VNP_TMN_CODE", VnpayConfig.VNP_TMN_CODE);
        config.put("VNP_HASH_SECRET_LENGTH", String.valueOf(VnpayConfig.VNP_HASH_SECRET != null ? VnpayConfig.VNP_HASH_SECRET.length() : 0));
        
        if (VnpayConfig.VNP_HASH_SECRET != null && VnpayConfig.VNP_HASH_SECRET.length() > 6) {
           config.put("VNP_HASH_SECRET_START", VnpayConfig.VNP_HASH_SECRET.substring(0, 3));
           config.put("VNP_HASH_SECRET_END", VnpayConfig.VNP_HASH_SECRET.substring(VnpayConfig.VNP_HASH_SECRET.length() - 3));
        }
        
        config.put("VNP_PAY_URL", VnpayConfig.VNP_PAY_URL);
        return ResponseEntity.ok(config);
    }
}