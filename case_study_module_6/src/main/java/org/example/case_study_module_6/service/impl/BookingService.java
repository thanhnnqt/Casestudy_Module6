package org.example.case_study_module_6.service.impl;

import org.example.case_study_module_6.dto.*;
import org.example.case_study_module_6.entity.*;
import org.example.case_study_module_6.enums.*;
import org.example.case_study_module_6.enums.SeatClass;
import org.example.case_study_module_6.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private IFlightSeatDetailRepository flightSeatDetailRepository;
    @Autowired
    private IBookingRepository bookingRepository;
    @Autowired
    private ITicketRepository ticketRepository;
    @Autowired
    private IFlightRepository flightRepository;
    @Autowired
    private IPassengerRepository passengerRepository;

    private int calculateAge(LocalDate dob) {
        if (dob == null) return 99;
        return Period.between(dob, LocalDate.now()).getYears();
    }

    // 🔥 HÀM BÁN VÉ TẠI QUẦY (ĐA NĂNG)
    @Transactional(rollbackFor = Exception.class)
    public Booking createBookingAtCounter(BookingRequestDTO request) {
        // 1. Tìm chuyến bay
        Flight outboundFlight = flightRepository.findById(request.getFlightId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chuyến bay đi!"));

        Flight inboundFlight = null;
        if (request.getReturnFlightId() != null) {
            inboundFlight = flightRepository.findById(request.getReturnFlightId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy chuyến bay về!"));
        }

        // 2. Setup Booking
        Booking booking = new Booking();
        booking.setBookingCode("POS-" + System.currentTimeMillis());
        booking.setBookingDate(LocalDateTime.now());
        booking.setChannel(Channel.OFFLINE);
        booking.setTripType(request.getTripType()); // Nhận 1 chiều hoặc khứ hồi

        booking.setContactName(request.getContactName());
        booking.setContactPhone(request.getContactPhone());
        booking.setContactEmail(request.getContactEmail());
        booking.setFlight(outboundFlight);
        booking.setReturnFlight(inboundFlight);

        // Xử lý thanh toán
        PaymentMethod method = PaymentMethod.valueOf(request.getPaymentMethod());
        booking.setPaymentMethod(method);

        if (method == PaymentMethod.CASH || method == PaymentMethod.VNPAY) {
            booking.setStatus(BookingStatus.PAID);
            booking.setPaymentStatus(PaymentStatus.PAID);
            booking.setPaidAt(LocalDateTime.now());
        } else {
            // Nếu chọn VNPAY -> PENDING để chuyển hướng thanh toán
            booking.setStatus(BookingStatus.PENDING);
            booking.setPaymentStatus(PaymentStatus.UNPAID);
        }

        // 3. Tạo Vé
        BigDecimal totalAmount = BigDecimal.ZERO;
        List<Ticket> tickets = new ArrayList<>();
        SeatClass classOut = SeatClass.valueOf(request.getSeatClassOut());
        SeatClass classIn = (inboundFlight != null && request.getSeatClassIn() != null) ? SeatClass.valueOf(request.getSeatClassIn()) : null;

        // Chiều đi
        if (request.getPassengersOut() != null) {
            long sold = ticketRepository.countByFlightIdAndSeatClass(outboundFlight.getId(), classOut);
            String prefix = getSeatPrefix(classOut);
            BigDecimal basePrice = getPriceFromFlight(outboundFlight, classOut);

            for (int i = 0; i < request.getPassengersOut().size(); i++) {
                PassengerDTO p = request.getPassengersOut().get(i);
                BigDecimal price = basePrice;
                if (calculateAge(p.getDob()) < 5) price = basePrice.multiply(new BigDecimal("0.5"));

                Ticket t = createSingleTicket(booking, outboundFlight, p.getFullName(), classOut, prefix + (sold + i + 1));
                t.setPrice(price);
                t.setPassengerDob(p.getDob());
                // Dùng BOOKED như ông yêu cầu
                t.setStatus(TicketStatus.BOOKED);

                tickets.add(t);
                totalAmount = totalAmount.add(price);
                decreaseSeatQuantity(outboundFlight.getId(), classOut, 1);
            }
        }

        // Chiều về
        if (inboundFlight != null && request.getPassengersIn() != null) {
            long sold = ticketRepository.countByFlightIdAndSeatClass(inboundFlight.getId(), classIn);
            String prefix = getSeatPrefix(classIn);
            BigDecimal basePrice = getPriceFromFlight(inboundFlight, classIn);

            for (int i = 0; i < request.getPassengersIn().size(); i++) {
                PassengerDTO p = request.getPassengersIn().get(i);
                BigDecimal price = basePrice;
                if (calculateAge(p.getDob()) < 5) price = basePrice.multiply(new BigDecimal("0.5"));

                Ticket t = createSingleTicket(booking, inboundFlight, p.getFullName(), classIn, prefix + (sold + i + 1));
                t.setPrice(price);
                t.setPassengerDob(p.getDob());
                t.setStatus(TicketStatus.BOOKED);

                tickets.add(t);
                totalAmount = totalAmount.add(price);
                decreaseSeatQuantity(inboundFlight.getId(), classIn, 1);
            }
        }

        booking.setTotalAmount(totalAmount);

        Booking saved = bookingRepository.save(booking);
        saved.setBookingCode(String.format("POS%04d", saved.getId()));
        saved = bookingRepository.save(saved);

        for (Ticket t : tickets) t.setBooking(saved);
        ticketRepository.saveAll(tickets);

        return saved;
    }

    // CÁC HÀM PHỤ TRỢ (HELPER)
    private Ticket createSingleTicket(Booking booking, Flight flight, String passengerName, SeatClass seatClass, String seatNumber) {
        Ticket ticket = new Ticket();
        ticket.setBooking(booking);
        ticket.setFlight(flight);
        ticket.setPassengerName(passengerName);
        ticket.setSeatClass(seatClass);
        ticket.setStatus(TicketStatus.BOOKED);
        ticket.setTicketNumber("T-" + System.nanoTime());
        ticket.setPrice(getPriceFromFlight(flight, seatClass));
        ticket.setSeatNumber(seatNumber);
        return ticket;
    }

    private String getSeatPrefix(SeatClass seatClass) {
        return seatClass == SeatClass.BUSINESS ? "B" : "A";
    }

    private BigDecimal getPriceFromFlight(Flight flight, SeatClass seatClass) {
        return flight.getSeatDetails().stream().filter(s -> s.getSeatClass() == seatClass).findFirst().map(FlightSeatDetail::getPrice).orElse(BigDecimal.ZERO);
    }

    private void decreaseSeatQuantity(Long flightId, SeatClass seatClass, int quantity) {
        Optional<FlightSeatDetail> sOpt = flightSeatDetailRepository.findByFlightIdAndSeatClass(flightId, seatClass);
        if (sOpt.isPresent()) {
            FlightSeatDetail s = sOpt.get();
            if (s.getAvailableSeats() >= quantity) {
                s.setAvailableSeats(s.getAvailableSeats() - quantity);
                flightSeatDetailRepository.save(s);
            } else throw new RuntimeException("Hết ghế");
        }
    }

    public List<Booking> findAll() {
        return bookingRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
    }

    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }

    public Booking updateStatus(Long id, String s) { /* ... Logic cũ ... */
        return null;
    }

    public Booking updateBookingInfo(Long id, BookingRequestDTO r) { /* ... Logic cũ ... */
        return null;
    }

    @Transactional(rollbackFor = Exception.class)
    public Booking createOnlineBooking(OnlineBookingRequest request, Account account) {
        // 1. Validate Chuyến đi
        Flight outboundFlight = flightRepository.findById(request.getFlightId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chuyến bay đi!"));
        // 2. Validate Chuyến về (Nếu có)
        Flight inboundFlight = null;
        if (request.getReturnFlightId() != null) {
            inboundFlight = flightRepository.findById(request.getReturnFlightId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy chuyến bay về!"));
            if (request.getTripType() == TripType.ONE_WAY) {
                throw new RuntimeException("Vé một chiều không được có chuyến bay về!");
            }
        } else {
            request.setTripType(TripType.ONE_WAY);
        }
        // 3. Validate Hạng ghế
        SeatClass classOut = SeatClass.valueOf(request.getSeatClassOut());
        SeatClass classIn = (inboundFlight != null && request.getSeatClassIn() != null)
                ? SeatClass.valueOf(request.getSeatClassIn())
                : null;
        // 4. Khởi tạo Booking
        Booking booking = new Booking();
        booking.setCustomerAccount(account); // <--- GÁN TÀI KHOẢN ĐANG LOGIN

        booking.setBookingCode("TEMP" + System.currentTimeMillis()); // Sẽ cập nhật sau khi lưu
        booking.setBookingDate(LocalDateTime.now());
        booking.setStatus(BookingStatus.PENDING);       // Chờ thanh toán
        booking.setPaymentStatus(PaymentStatus.UNPAID);
        booking.setChannel(Channel.ONLINE);
        booking.setPaymentMethod(PaymentMethod.valueOf(request.getPaymentMethod()));
        // Thông tin người liên hệ
        booking.setContactName(request.getContactName());
        booking.setContactEmail(request.getContactEmail());
        booking.setContactPhone(request.getContactPhone());
        booking.setFlight(outboundFlight);
        booking.setReturnFlight(inboundFlight);
        booking.setTripType(request.getTripType());
        // 5. Xử lý Hành khách & Vé
        BigDecimal totalAmount = BigDecimal.ZERO;
        List<Ticket> tickets = new ArrayList<>();
        List<Passenger> savedPassengers = new ArrayList<>();
        long soldOut = ticketRepository.countByFlightIdAndSeatClass(outboundFlight.getId(), classOut);
        long soldIn = (inboundFlight != null) ? ticketRepository.countByFlightIdAndSeatClass(inboundFlight.getId(), classIn) : 0;
        String prefixOut = getSeatPrefix(classOut);
        String prefixIn = (classIn != null) ? getSeatPrefix(classIn) : "";
        int index = 0;
        for (OnlinePassengerDTO pDto : request.getPassengers()) {
            index++;

            // --- VALIDATE DỮ LIỆU HÀNH KHÁCH (Backend Validation) ---
            if (pDto.getFullName() == null || pDto.getFullName().length() < 2 || pDto.getFullName().length() > 50) {
                throw new RuntimeException("Tên hành khách thứ " + index + " phải từ 2-50 ký tự.");
            }
            if (pDto.getGender() == null || pDto.getGender().isEmpty()) {
                throw new RuntimeException("Giới tính hành khách thứ " + index + " là bắt buộc.");
            }
            if (!pDto.isChild()) {
                if (pDto.getIdentityCard() == null || pDto.getIdentityCard().trim().isEmpty()) {
                    throw new RuntimeException("CMND/Passport là bắt buộc với người lớn (Hành khách " + index + ")");
                }
            }
            // A. Lưu Passenger
            Passenger passenger = new Passenger();
            passenger.setBooking(booking);
            passenger.setFullName(pDto.getFullName());
            passenger.setGender(pDto.getGender());
            passenger.setEmail(pDto.getEmail());
            passenger.setPhoneNumber(pDto.getPhone());
            passenger.setIdentityCard(pDto.getIdentityCard());
            passenger.setPassengerType(pDto.isChild() ? "CHILD" : "ADULT");
            passenger.setHasInfant(pDto.isHasInfant());
            savedPassengers.add(passenger);
            // B. Tạo vé chiều đi
            BigDecimal priceOut = getPriceFromFlight(outboundFlight, classOut);
            String seatNumOut = prefixOut + (soldOut + index);
            Ticket tOut = createSingleTicket(booking, outboundFlight, pDto.getFullName(), classOut, seatNumOut);
            tOut.setPrice(priceOut);
            tickets.add(tOut);
            totalAmount = totalAmount.add(priceOut);
            decreaseSeatQuantity(outboundFlight.getId(), classOut, 1);
            // C. Tạo vé chiều về
            if (inboundFlight != null) {
                BigDecimal priceIn = getPriceFromFlight(inboundFlight, classIn);
                String seatNumIn = prefixIn + (soldIn + index);
                Ticket tIn = createSingleTicket(booking, inboundFlight, pDto.getFullName(), classIn, seatNumIn);
                tIn.setPrice(priceIn);
                tickets.add(tIn);
                totalAmount = totalAmount.add(priceIn);
                decreaseSeatQuantity(inboundFlight.getId(), classIn, 1);
            }
        }
        booking.setTotalAmount(totalAmount);
        // 6. Lưu xuống DB
        Booking finalBooking = bookingRepository.save(booking);
        for (Passenger p : savedPassengers) p.setBooking(finalBooking);
        for (Ticket t : tickets) t.setBooking(finalBooking);
        passengerRepository.saveAll(savedPassengers);
        ticketRepository.saveAll(tickets);

        // Cập nhật mã booking theo ID (ví dụ: BK0029)
        finalBooking.setBookingCode(String.format("BK%04d", finalBooking.getId()));
        return bookingRepository.save(finalBooking);
    }

    public Booking createBooking(BookingRequestDTO r) { /* ... Logic cũ ... */
        return null;
    }

    public List<Booking> findHistoryByAccountId(Long id) {
        return bookingRepository.findByCustomerAccountIdOrderByBookingDateDesc(id);
    }

    public List<Booking> findHistoryByEmail(String e) {
        return bookingRepository.findByContactEmailOrderByBookingDateDesc(e);
    }

    public void updateStatusByCode(String bookingCode, BookingStatus status, String transactionNo) {
        Booking booking = bookingRepository
                .findByBookingCode(bookingCode)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(status);
        if (status == BookingStatus.PAID) {
            booking.setPaymentStatus(PaymentStatus.PAID);
            booking.setTransactionCode(transactionNo); // <--- LƯU MÃ GIAO DỊCH
            booking.setPaidAt(LocalDateTime.now());    // <--- LƯU THỜI GIAN
        }
        bookingRepository.save(booking);
    }
}