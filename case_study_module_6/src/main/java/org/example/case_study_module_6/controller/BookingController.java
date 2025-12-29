package org.example.case_study_module_6.controller;

import lombok.RequiredArgsConstructor;
import org.example.case_study_module_6.dto.BookingRequestDTO;
import org.example.case_study_module_6.dto.CounterBookingRequest;
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

    // 1. Lấy danh sách booking
    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.findAll());
    }

    // 2. Đặt vé Online
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequestDTO bookingRequest) {
        try {
            return ResponseEntity.ok(bookingService.createBooking(bookingRequest));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 3. Cập nhật trạng thái (Hủy, Thanh toán...)
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateBookingStatus(@PathVariable Long id, @RequestParam String newStatus) {
        try {
            Booking updatedBooking = bookingService.updateStatus(id, newStatus);
            return ResponseEntity.ok(updatedBooking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi cập nhật: " + e.getMessage());
        }
    }

    // 4. BÁN VÉ TẠI QUẦY
    @PostMapping("/sell-at-counter")
    public ResponseEntity<?> sellAtCounter(@RequestBody CounterBookingRequest request) {
        try {
            Booking newBooking = bookingService.createBookingAtCounter(request);
            return ResponseEntity.ok(newBooking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 5. XÓA VÉ ---
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBooking(@PathVariable Long id) {
        try {
            bookingService.deleteBooking(id);
            return ResponseEntity.ok("Đã xóa vé thành công!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi xóa vé: " + e.getMessage());
        }
    }

    // 6. CẬP NHẬT THÔNG TIN (Sửa tên khách, liên hệ) ---
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBookingInfo(@PathVariable Long id, @RequestBody BookingRequestDTO request) {
        try {
            Booking updatedBooking = bookingService.updateBookingInfo(id, request);
            return ResponseEntity.ok(updatedBooking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi cập nhật: " + e.getMessage());
        }
    }
}