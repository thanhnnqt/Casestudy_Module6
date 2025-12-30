package org.example.case_study_module_6.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.example.case_study_module_6.dto.PaymentRequest;
import org.example.case_study_module_6.service.IVnpayService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
public class VnpayController {

    private final IVnpayService vnpayService;

    public VnpayController(IVnpayService vnpayService) {
        this.vnpayService = vnpayService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createPayment(@RequestBody PaymentRequest req) {
        String url = vnpayService.createPaymentUrl(
                req.getAmount(),
                req.getOrderInfo()
        );
        return ResponseEntity.ok(url);
    }

    @GetMapping("/callback")
    public ResponseEntity<?> vnpayCallback(HttpServletRequest request) {
        // verify chữ ký
        // cập nhật trạng thái đơn hàng
        return ResponseEntity.ok("SUCCESS");
    }
}
