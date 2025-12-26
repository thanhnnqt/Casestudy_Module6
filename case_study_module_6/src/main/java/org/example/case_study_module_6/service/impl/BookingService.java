package org.example.case_study_module_6.service.impl;

import org.example.case_study_module_6.dto.BookingRequestDTO;
import org.example.case_study_module_6.dto.CounterBookingRequest;
import org.example.case_study_module_6.dto.PassengerDTO;
import org.example.case_study_module_6.entity.*;
import org.example.case_study_module_6.enums.*;
import org.example.case_study_module_6.enums.SeatClass;
import org.example.case_study_module_6.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired private IFlightSeatDetailRepository flightSeatDetailRepository;
    @Autowired private IBookingRepository bookingRepository;
    @Autowired private ITicketRepository ticketRepository;
    @Autowired private IFlightRepository flightRepository;

    // =========================================================================
    // 1. HÀM BÁN VÉ TẠI QUẦY (COUNTER)
    // =========================================================================
    @Transactional(rollbackFor = Exception.class)
    public Booking createBookingAtCounter(CounterBookingRequest request) throws Exception {
        List<PassengerDTO> passengerList = request.getPassengers();
        int quantity = passengerList.size();

        SeatClass seatClass = SeatClass.valueOf(request.getSeatClass());
        FlightSeatDetail seatDetail = flightSeatDetailRepository.findByFlightIdAndSeatClass(request.getFlightId(), seatClass)
                .orElseThrow(() -> new Exception("Không tìm thấy hạng ghế này!"));

        if (seatDetail.getAvailableSeats() < quantity) {
            throw new Exception("Chỉ còn lại " + seatDetail.getAvailableSeats() + " ghế.");
        }

        seatDetail.setAvailableSeats(seatDetail.getAvailableSeats() - quantity);
        flightSeatDetailRepository.save(seatDetail);

        Booking booking = new Booking();
        booking.setBookingDate(LocalDateTime.now());
        booking.setFlight(seatDetail.getFlight());
        booking.setBookingCode("VN-" + System.currentTimeMillis());
        booking.setTotalAmount(seatDetail.getPrice().multiply(BigDecimal.valueOf(quantity)));

        booking.setStatus(BookingStatus.PAID);
        booking.setPaymentStatus(PaymentStatus.PAID);
        booking.setPaymentMethod(PaymentMethod.CASH);
        booking.setChannel(Channel.OFFLINE);
        booking.setTripType(TripType.ONE_WAY);

        booking.setContactName(request.getContactName());
        booking.setContactEmail(request.getContactEmail());
        booking.setContactPhone(request.getContactPhone());

        Booking savedBooking = bookingRepository.save(booking);

        // Logic xếp ghế: Lấy số lượng đã bán để tính tiếp
        long currentSold = ticketRepository.countByFlightIdAndSeatClass(request.getFlightId(), seatClass);
        String prefix = getSeatPrefix(seatClass); // Dùng hàm helper mới

        List<Ticket> tickets = new ArrayList<>();
        for (int i = 0; i < quantity; i++) {
            PassengerDTO p = passengerList.get(i);
            Ticket ticket = new Ticket();
            ticket.setBooking(savedBooking);
            ticket.setFlight(seatDetail.getFlight());
            ticket.setSeatClass(seatClass);
            ticket.setPrice(seatDetail.getPrice());
            ticket.setPassengerName(p.getFullName());

            // Tính số ghế: Prefix + (Số cũ + i + 1)
            ticket.setSeatNumber(prefix + (currentSold + i + 1));

            ticket.setTicketNumber("TIC-" + System.currentTimeMillis() + i);
            ticket.setStatus(TicketStatus.BOOKED);
            tickets.add(ticket);
        }
        ticketRepository.saveAll(tickets);
        return savedBooking;
    }

    // =========================================================================
    // 2. HÀM BÁN VÉ ONLINE (Đã sửa: Tự động xếp ghế A, B, C)
    // =========================================================================
    @Transactional(rollbackFor = Exception.class)
    public Booking createBooking(BookingRequestDTO request) {
        // --- BƯỚC 1: Tìm chuyến bay ĐI ---
        Flight outboundFlight = flightRepository.findById(request.getFlightId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chuyến bay đi!"));

        // --- BƯỚC 2: Tìm chuyến bay VỀ (Nếu là Khứ hồi) ---
        Flight inboundFlight = null;
        if (request.getTripType() == TripType.ROUND_TRIP && request.getReturnFlightId() != null) {
            inboundFlight = flightRepository.findById(request.getReturnFlightId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy chuyến bay về!"));
        }

        // --- BƯỚC 3: Lấy hạng ghế ---
        SeatClass classOut = SeatClass.valueOf(request.getSeatClassOut());
        SeatClass classIn = (inboundFlight != null && request.getSeatClassIn() != null)
                ? SeatClass.valueOf(request.getSeatClassIn())
                : null;

        // --- BƯỚC 4: Tạo Booking ---
        Booking booking = new Booking();
        booking.setBookingCode("WEB-" + System.currentTimeMillis());
        booking.setBookingDate(LocalDateTime.now());
        booking.setStatus(BookingStatus.PENDING);
        booking.setPaymentStatus(PaymentStatus.UNPAID);
        booking.setChannel(Channel.ONLINE);
        booking.setPaymentMethod(PaymentMethod.CASH);
        booking.setContactName(request.getContactName());
        booking.setContactPhone(request.getContactPhone());
        booking.setContactEmail(request.getContactEmail());
        booking.setFlight(outboundFlight);
        booking.setReturnFlight(inboundFlight);
        booking.setTripType(request.getTripType());

        // --- BƯỚC 5: Tạo Vé & Tính tiền & Xếp ghế ---
        BigDecimal totalAmount = BigDecimal.ZERO;
        List<Ticket> tickets = new ArrayList<>();

        // A. XỬ LÝ CHIỀU ĐI
        if (request.getPassengersOut() != null) {
            // Lấy số lượng vé đã bán của hạng này trên chuyến đi để bắt đầu đếm
            long currentSoldOut = ticketRepository.countByFlightIdAndSeatClass(outboundFlight.getId(), classOut);
            String prefixOut = getSeatPrefix(classOut);

            for (int i = 0; i < request.getPassengersOut().size(); i++) {
                PassengerDTO p = request.getPassengersOut().get(i);

                // Tính số ghế: A1, A2...
                String seatNum = prefixOut + (currentSoldOut + i + 1);

                Ticket ticketOut = createSingleTicket(booking, outboundFlight, p.getFullName(), classOut, seatNum);
                tickets.add(ticketOut);
                totalAmount = totalAmount.add(ticketOut.getPrice());

                decreaseSeatQuantity(outboundFlight.getId(), classOut, 1);
            }
        }

        // B. XỬ LÝ CHIỀU VỀ
        if (inboundFlight != null && classIn != null && request.getPassengersIn() != null) {
            // Lấy số lượng vé đã bán của hạng này trên chuyến về
            long currentSoldIn = ticketRepository.countByFlightIdAndSeatClass(inboundFlight.getId(), classIn);
            String prefixIn = getSeatPrefix(classIn);

            for (int i = 0; i < request.getPassengersIn().size(); i++) {
                PassengerDTO p = request.getPassengersIn().get(i);

                // Tính số ghế
                String seatNum = prefixIn + (currentSoldIn + i + 1);

                Ticket ticketIn = createSingleTicket(booking, inboundFlight, p.getFullName(), classIn, seatNum);
                tickets.add(ticketIn);
                totalAmount = totalAmount.add(ticketIn.getPrice());

                decreaseSeatQuantity(inboundFlight.getId(), classIn, 1);
            }
        }

        booking.setTotalAmount(totalAmount);

        // --- BƯỚC 6: Lưu xuống DB ---
        Booking savedBooking = bookingRepository.save(booking);
        for (Ticket t : tickets) {
            t.setBooking(savedBooking);
        }
        ticketRepository.saveAll(tickets);

        return savedBooking;
    }

    // =========================================================================
    // 3. CÁC HÀM PHỤ TRỢ (HELPER)
    // =========================================================================

    // Update: Thêm tham số seatNumber vào hàm tạo vé
    private Ticket createSingleTicket(Booking booking, Flight flight, String passengerName, SeatClass seatClass, String seatNumber) {
        Ticket ticket = new Ticket();
        ticket.setBooking(booking);
        ticket.setFlight(flight);
        ticket.setPassengerName(passengerName);
        ticket.setSeatClass(seatClass);
        ticket.setStatus(TicketStatus.BOOKED);
        ticket.setTicketNumber("T-" + System.nanoTime());

        BigDecimal price = getPriceFromFlight(flight, seatClass);
        ticket.setPrice(price);

        // Gán số ghế đã tính toán (Không để null nữa)
        ticket.setSeatNumber(seatNumber);

        return ticket;
    }

    // Hàm mới: Xác định Prefix dựa trên hạng ghế
    private String getSeatPrefix(SeatClass seatClass) {
        if (seatClass == null) return "A";
        switch (seatClass) {
            case BUSINESS:
                return "B";
            // Nếu ông có thêm hạng FIRST_CLASS trong Enum thì bỏ comment dòng dưới
            // case FIRST_CLASS: return "C";
            case ECONOMY:
            default:
                return "A";
        }
    }

    private BigDecimal getPriceFromFlight(Flight flight, SeatClass seatClass) {
        return flight.getSeatDetails().stream()
                .filter(s -> s.getSeatClass() == seatClass)
                .findFirst()
                .map(FlightSeatDetail::getPrice)
                .orElse(BigDecimal.ZERO);
    }

    private void decreaseSeatQuantity(Long flightId, SeatClass seatClass, int quantity) {
        Optional<FlightSeatDetail> seatDetailOpt = flightSeatDetailRepository.findByFlightIdAndSeatClass(flightId, seatClass);
        if (seatDetailOpt.isPresent()) {
            FlightSeatDetail seatDetail = seatDetailOpt.get();
            if (seatDetail.getAvailableSeats() >= quantity) {
                seatDetail.setAvailableSeats(seatDetail.getAvailableSeats() - quantity);
                flightSeatDetailRepository.save(seatDetail);
            } else {
                throw new RuntimeException("Hết ghế hạng " + seatClass + " cho chuyến bay " + flightId);
            }
        }
    }

    public List<Booking> findAll() {
        return bookingRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
    }

    public Booking updateStatus(Long id, String newStatus) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Booking ID: " + id));
        try {
            BookingStatus status = BookingStatus.valueOf(newStatus);
            booking.setStatus(status);
            if (status == BookingStatus.PAID) {
                booking.setPaymentStatus(PaymentStatus.PAID);
            }
            return bookingRepository.save(booking);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Trạng thái không hợp lệ: " + newStatus);
        }
    }
}