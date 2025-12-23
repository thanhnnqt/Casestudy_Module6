package org.example.case_study_module_6.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.case_study_module_6.entity.Booking;
import org.example.case_study_module_6.entity.Flight;
import org.example.case_study_module_6.entity.Ticket;
import org.example.case_study_module_6.enums.BookingStatus;
import org.example.case_study_module_6.enums.Channel;
import org.example.case_study_module_6.enums.TicketStatus;
import org.example.case_study_module_6.repository.IBookingRepository;
import org.example.case_study_module_6.repository.IFlightRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookingService {


    private final IBookingRepository bookingRepository;

    private final IFlightRepository flightRepository; // Cần cái này để check chuyến bay

    @Transactional
    public Booking createBooking(Booking bookingRequest, Long flightId) {
        // 1. Sinh mã Booking Code ngẫu nhiên (Ví dụ: PNR-123456)
        bookingRequest.setBookingCode("PNR-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase());

        // 2. Set thời gian và trạng thái mặc định
        bookingRequest.setBookingDate(LocalDateTime.now());
        bookingRequest.setStatus(BookingStatus.PENDING); // Mới đặt thì là Pending
        bookingRequest.setChannel(Channel.ONLINE); // Mặc định là Online

        // 3. Xử lý danh sách vé & Tính tiền
        BigDecimal total = BigDecimal.ZERO;

        // Lấy thông tin chuyến bay (Giả sử tất cả vé trong booking này đi cùng 1 chuyến)
        Flight flight = flightRepository.findById(flightId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chuyến bay!"));

        if (bookingRequest.getTickets() != null) {
            for (Ticket ticket : bookingRequest.getTickets()) {
                // Link vé với booking
                ticket.setBooking(bookingRequest);

                // Link vé với chuyến bay
                ticket.setFlight(flight);

                // Sinh mã vé riêng
                ticket.setTicketNumber("TKT-" + UUID.randomUUID().toString().substring(0, 8));
                ticket.setStatus(TicketStatus.BOOKED);

                // Cộng dồn tiền
                if (ticket.getPrice() != null) {
                    total = total.add(ticket.getPrice());
                }
            }
        }

        bookingRequest.setTotalAmount(total);

        // 4. Lưu tất cả xuống DB
        return bookingRepository.save(bookingRequest);
    }

    public List<Booking> findAll() {
        return bookingRepository.findAll();
    }
}