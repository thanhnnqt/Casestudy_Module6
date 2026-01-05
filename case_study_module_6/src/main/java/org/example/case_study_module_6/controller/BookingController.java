package org.example.case_study_module_6.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.example.case_study_module_6.dto.BookingRequestDTO;
import org.example.case_study_module_6.dto.OnlineBookingRequest;
import org.example.case_study_module_6.entity.Account;
import org.example.case_study_module_6.entity.Booking;
import org.example.case_study_module_6.service.impl.AccountService;
import org.example.case_study_module_6.service.impl.BookingService;
import org.example.case_study_module_6.service.impl.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class BookingController {

    private final BookingService bookingService;
    private final JwtService jwtService;
    private final AccountService accountService;

    // 0. Lấy lịch sử của tôi
    @GetMapping("/my-history")
    public ResponseEntity<?> getMyHistory(HttpServletRequest request) {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Chưa đăng nhập");
            }
            String token = authHeader.substring(7);
            String username = jwtService.getUsernameFromToken(token);
            var accountOpt = accountService.findByUsername(username);

            if (accountOpt.isPresent()) {
                Long accountId = accountOpt.get().getId();
                List<Booking> bookings = bookingService.findHistoryByAccountId(accountId);
                if (bookings.isEmpty()) {
                    bookings = bookingService.findHistoryByEmail(username);
                }
                return ResponseEntity.ok(bookings);
            }
            return ResponseEntity.badRequest().body("Không tìm thấy tài khoản");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi: " + e.getMessage());
        }
    }

    // 1. Lấy danh sách booking
    @GetMapping
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'ADMIN')")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.findAll());
    }

    // 2. Cập nhật trạng thái
    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'ADMIN')")
    public ResponseEntity<?> updateBookingStatus(@PathVariable Long id, @RequestParam String newStatus) {
        try {
            return ResponseEntity.ok(bookingService.updateStatus(id, newStatus));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    // 3. Xóa vé
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'ADMIN')")
    public ResponseEntity<?> deleteBooking(@PathVariable Long id) {
        try {
            bookingService.deleteBooking(id);
            return ResponseEntity.ok("Deleted");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 4. Update thông tin vé
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'ADMIN')")
    public ResponseEntity<?> updateBookingInfo(@PathVariable Long id, @RequestBody BookingRequestDTO request) {
        try {
            return ResponseEntity.ok(bookingService.updateBookingInfo(id, request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 5. ĐẶT VÉ ONLINE
    @PostMapping("/online")
    public ResponseEntity<?> createOnlineBooking(@RequestBody OnlineBookingRequest req, HttpServletRequest request) {
        try {
            String authHeader = request.getHeader("Authorization");
            Account currentUser = null;
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                String username = jwtService.getUsernameFromToken(token);
                currentUser = accountService.findByUsername(username).orElse(null);
            }
            Booking booking = bookingService.createOnlineBooking(req, currentUser);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    // ==========================================
    // 🔥 6. BÁN VÉ TẠI QUẦY (FIX LỖI)
    // Sửa CounterBookingRequest -> BookingRequestDTO để khớp với Service
    // ==========================================
    @PostMapping("/sell-at-counter")
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'ADMIN')")
    public ResponseEntity<?> createCounterBooking(@RequestBody BookingRequestDTO request) {
        try {
            Booking booking = bookingService.createBookingAtCounter(request);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Lỗi bán vé: " + e.getMessage());
        }
    }
}