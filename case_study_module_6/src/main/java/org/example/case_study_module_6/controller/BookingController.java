package org.example.case_study_module_6.controller;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.example.case_study_module_6.dto.BookingRequestDTO;
import org.example.case_study_module_6.dto.CounterBookingRequest;
import org.example.case_study_module_6.dto.OnlineBookingRequest;
import org.example.case_study_module_6.entity.Account;
import org.example.case_study_module_6.entity.Booking;
import org.example.case_study_module_6.service.impl.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {
    private final BookingService bookingService;
    private final org.example.case_study_module_6.service.impl.JwtService jwtService;
    private final org.example.case_study_module_6.service.impl.CustomerService customerService;
    private final org.example.case_study_module_6.service.impl.AccountService accountService;

    // 0. Lấy lịch sử của tôi (Customer)
    @GetMapping("/my-history")
    public ResponseEntity<?> getMyHistory(HttpServletRequest request) {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Chưa đăng nhập");
            }
            String token = authHeader.substring(7);

            // 1. Lấy thông tin từ Token
            String username = jwtService.getUsernameFromToken(token);
            var accountOpt = accountService.findByUsername(username);
            if (accountOpt.isPresent()) {
                // 2. Ưu tiên tìm theo Account ID (Chính xác nhất)
                Long accountId = accountOpt.get().getId();
                List<Booking> bookings = bookingService.findHistoryByAccountId(accountId);

                // 3. Nếu không thấy (có thể vé cũ chưa gán ID), tìm thêm theo Email
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

    // LƯU Ý: Không inject VnpayService ở đây để tránh lỗi vòng lặp/dependency
    // 1. Lấy danh sách booking
    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.findAll());
    }
    // 2. Cập nhật trạng thái
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateBookingStatus(@PathVariable Long id, @RequestParam String newStatus) {
        try {
            return ResponseEntity.ok(bookingService.updateStatus(id, newStatus));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }
    // 3. Xóa vé
    @DeleteMapping("/{id}")
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
    public ResponseEntity<?> updateBookingInfo(@PathVariable Long id, @RequestBody BookingRequestDTO request) {
        try {
            return ResponseEntity.ok(bookingService.updateBookingInfo(id, request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    // ==========================================
    // 🔥 5. ĐẶT VÉ ONLINE (Clean Version)
    // ==========================================
    @PostMapping("/online")
    public ResponseEntity<?> createOnlineBooking(@RequestBody OnlineBookingRequest req, HttpServletRequest request) {
        try {
            // Lấy Account đang đăng nhập từ Token
            String authHeader = request.getHeader("Authorization");
            System.out.println(">>> Auth Header: " + authHeader);
            Account currentUser = null;
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                String username = jwtService.getUsernameFromToken(token);
                currentUser = accountService.findByUsername(username).orElse(null);
                System.out.println(">>> Detected User: " + (currentUser != null ? currentUser.getUsername() : "NULL"));
            }
            // Truyền account vào service
            Booking booking = bookingService.createOnlineBooking(req, currentUser);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }
}