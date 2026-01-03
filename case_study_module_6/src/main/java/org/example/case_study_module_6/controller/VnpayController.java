package org.example.case_study_module_6.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.example.case_study_module_6.config.VnpayConfig;
import org.example.case_study_module_6.dto.PaymentRequest;
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
public class VnpayController {

    private final IVnpayService vnpayService;
    private final BookingService bookingService;

    public VnpayController(IVnpayService vnpayService, BookingService bookingService) {
        this.vnpayService = vnpayService;
        this.bookingService = bookingService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createPayment(@RequestBody PaymentRequest req) {
        String url = vnpayService.createPaymentUrl(
                req.getAmount(),
                req.getBookingCode()
        );
        return ResponseEntity.ok(Map.of("paymentUrl", url));
    }

    @GetMapping("/callback")
    public ResponseEntity<?> vnpayCallback(HttpServletRequest request) {

        Map<String, String> params = new HashMap<>();
        request.getParameterMap().forEach(
                (k, v) -> params.put(k, v[0])
        );

        boolean valid = VnpayUtil.verifySignature(
                new HashMap<>(params),
                VnpayConfig.VNP_HASH_SECRET
        );

        if (!valid) {
            return ResponseEntity.badRequest().body("INVALID SIGNATURE");
        }

        String bookingCode = params.get("vnp_TxnRef");
        String responseCode = params.get("vnp_ResponseCode");

        if ("00".equals(responseCode)) {
            bookingService.updateStatusByCode(
                    bookingCode,
                    BookingStatus.PAID
            );
        } else {
            bookingService.updateStatusByCode(
                    bookingCode,
                    BookingStatus.FAILED
            );
        }

        return ResponseEntity.ok("OK");
    }

}
