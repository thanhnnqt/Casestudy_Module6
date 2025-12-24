// 1. SỬA PACKAGE: Thêm .impl vào cuối cho khớp với thư mục
package org.example.case_study_module_6.service.impl;

import org.example.case_study_module_6.dto.BookingRequestDTO;
import org.example.case_study_module_6.entity.*;

// 2. SỬA IMPORT: Đổi từ .entity.* thành .enums.* // (Vì trong ảnh cây thư mục của ông, các file này nằm trong folder 'enums')
import org.example.case_study_module_6.enums.*;
import org.example.case_study_module_6.enums.SeatClass; // Import thêm cái này nữa

import org.example.case_study_module_6.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class BookingService { // Nếu có implement Interface thì thêm implements IBookingService

    @Autowired
    private IFlightSeatDetailRepository flightSeatDetailRepository;
    @Autowired
    private IBookingRepository bookingRepository;
    @Autowired
    private ITicketRepository ticketRepository;
    @Autowired
    private IFlightRepository flightRepository;

    // --- HÀM BÁN VÉ TẠI QUẦY ---
    @Transactional(rollbackFor = Exception.class)
    public Booking createBookingAtCounter(Long flightId, SeatClass seatClass, int quantity, String customerName, String customerEmail) throws Exception {

        // 1. Tìm thông tin hạng ghế
        FlightSeatDetail seatDetail = flightSeatDetailRepository.findByFlightIdAndSeatClass(flightId, seatClass)
                .orElseThrow(() -> new Exception("Không tìm thấy hạng ghế này!"));

        // 2. Kiểm tra số lượng
        if (seatDetail.getAvailableSeats() < quantity) {
            throw new Exception("Chỉ còn lại " + seatDetail.getAvailableSeats() + " ghế, không đủ bán " + quantity + " vé.");
        }

        // 3. Trừ số ghế trong kho (DB)
        seatDetail.setAvailableSeats(seatDetail.getAvailableSeats() - quantity);
        flightSeatDetailRepository.save(seatDetail);

        // 4. Tạo Booking (Đơn hàng)
        Booking booking = new Booking();
        booking.setBookingDate(LocalDateTime.now());
        booking.setFlight(seatDetail.getFlight());
        booking.setBookingCode("VN-" + System.currentTimeMillis());
        booking.setTotalAmount(seatDetail.getPrice().multiply(java.math.BigDecimal.valueOf(quantity)));

        // Set các trạng thái (Sử dụng Enum chuẩn)
        booking.setStatus(BookingStatus.PAID);          // Đã hoàn tất
        booking.setPaymentStatus(PaymentStatus.PAID);   // Đã thanh toán tiền
        booking.setPaymentMethod(PaymentMethod.CASH);   // Tiền mặt
        booking.setChannel(Channel.OFFLINE);            // Bán tại quầy
        booking.setContactName(customerName);   // Lưu tên khách vào đây thì ra Dashboard mới thấy
        booking.setContactEmail(customerEmail);
        // Lưu Booking trước để lấy ID
        Booking savedBooking = bookingRepository.save(booking);

        // 5. Sinh vé và Mã ghế (A1, A2...)
        long currentSold = ticketRepository.countByFlightIdAndSeatClass(flightId, seatClass);

        String prefix = "A";
        if (seatClass == SeatClass.BUSINESS) prefix = "B";
        if (seatClass == SeatClass.FIRST_CLASS) prefix = "C"; // Sửa lại logic so sánh Enum chuẩn

        List<Ticket> tickets = new ArrayList<>();
        for (int i = 1; i <= quantity; i++) {
            Ticket ticket = new Ticket();
            ticket.setBooking(savedBooking);
            ticket.setFlight(seatDetail.getFlight());
            ticket.setSeatClass(seatClass);
            ticket.setPrice(seatDetail.getPrice());
            ticket.setPassengerName(customerName);
            ticket.setSeatNumber(prefix + (currentSold + i));

            // --- THÊM ĐOẠN NÀY ---
            // 1. Sinh mã vé ngẫu nhiên (để không bị trùng)
            ticket.setTicketNumber("TIC-" + System.currentTimeMillis() + i);

            // 2. Set trạng thái vé (BOOKED)
            // Nếu ông dùng Enum: ticket.setStatus(TicketStatus.BOOKED);
            // Nếu dùng String: ticket.setStatus("BOOKED");
            ticket.setStatus(TicketStatus.BOOKED);
            // ---------------------

            tickets.add(ticket);
        }

        ticketRepository.saveAll(tickets);

        return savedBooking;
    }

    // --- Các hàm phụ trợ khác ---
    public List<Booking> findAll() {
        // Sắp xếp theo ID giảm dần (Cái nào mới tạo ID to hơn sẽ lên đầu)
        return bookingRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
    }

    public Booking createBooking(BookingRequestDTO request) { return null; }
    public Booking updateStatus(Long id, String status) { return null; }
}