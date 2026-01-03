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

    @Autowired private IFlightSeatDetailRepository flightSeatDetailRepository;
    @Autowired private IBookingRepository bookingRepository;
    @Autowired private ITicketRepository ticketRepository;
    @Autowired private IFlightRepository flightRepository;

    // --- [MỚI] Helper tính tuổi ---
    private int calculateAge(LocalDate dob) {
        if (dob == null) return 99; // Mặc định người lớn nếu không có ngày sinh
        return Period.between(dob, LocalDate.now()).getYears();
    }

    // =========================================================================
    // 1. HÀM BÁN VÉ TẠI QUẦY (COUNTER) - Đã cập nhật lưu DOB & Giảm giá
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

        // Trừ ghế
        seatDetail.setAvailableSeats(seatDetail.getAvailableSeats() - quantity);
        flightSeatDetailRepository.save(seatDetail);

        // Tạo Booking
        Booking booking = new Booking();
        booking.setBookingDate(LocalDateTime.now());
        booking.setFlight(seatDetail.getFlight());
        booking.setBookingCode("VN-" + System.currentTimeMillis());

        booking.setStatus(BookingStatus.PAID);
        booking.setPaymentStatus(PaymentStatus.PAID);
        booking.setPaymentMethod(PaymentMethod.CASH);
        booking.setChannel(Channel.OFFLINE);
        booking.setTripType(TripType.ONE_WAY);
        booking.setContactName(request.getContactName());
        booking.setContactEmail(request.getContactEmail());
        booking.setContactPhone(request.getContactPhone());

        // Lưu booking trước để lấy ID
        Booking savedBooking = bookingRepository.save(booking);

        // Logic tạo vé và tính tổng tiền thực tế (có giảm giá trẻ em)
        BigDecimal totalAmount = BigDecimal.ZERO;
        long currentSold = ticketRepository.countByFlightIdAndSeatClass(request.getFlightId(), seatClass);
        String prefix = getSeatPrefix(seatClass);

        List<Ticket> tickets = new ArrayList<>();
        BigDecimal basePrice = seatDetail.getPrice();

        for (int i = 0; i < quantity; i++) {
            PassengerDTO p = passengerList.get(i);

            // Tính giá vé cho từng khách
            BigDecimal finalPrice = basePrice;
            if (calculateAge(p.getDob()) < 5) {
                finalPrice = basePrice.multiply(new BigDecimal("0.5")); // Giảm 50%
            }

            Ticket ticket = new Ticket();
            ticket.setBooking(savedBooking);
            ticket.setFlight(seatDetail.getFlight());
            ticket.setSeatClass(seatClass);
            ticket.setPrice(finalPrice); // Giá đã giảm
            ticket.setPassengerName(p.getFullName());
            ticket.setPassengerDob(p.getDob()); // [Quan trọng] Lưu ngày sinh

            ticket.setSeatNumber(prefix + (currentSold + i + 1));
            ticket.setTicketNumber("TIC-" + System.currentTimeMillis() + i);
            ticket.setStatus(TicketStatus.BOOKED);

            tickets.add(ticket);
            totalAmount = totalAmount.add(finalPrice);
        }

        ticketRepository.saveAll(tickets);

        // Cập nhật lại tổng tiền chính xác cho Booking
        savedBooking.setTotalAmount(totalAmount);
        return bookingRepository.save(savedBooking);
    }

    // =========================================================================
    // 2. HÀM BÁN VÉ ONLINE (Đã cập nhật logic GIÁ TRẺ EM)
    // =========================================================================
    @Transactional(rollbackFor = Exception.class)
    public Booking createBooking(BookingRequestDTO request) {
        // --- BƯỚC 1: Tìm chuyến bay ---
        Flight outboundFlight = flightRepository.findById(request.getFlightId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chuyến bay đi!"));

        Flight inboundFlight = null;
        if (request.getTripType() == TripType.ROUND_TRIP && request.getReturnFlightId() != null) {
            inboundFlight = flightRepository.findById(request.getReturnFlightId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy chuyến bay về!"));
        }

        // --- BƯỚC 2: Tạo Booking ---
        SeatClass classOut = SeatClass.valueOf(request.getSeatClassOut());
        SeatClass classIn = (inboundFlight != null && request.getSeatClassIn() != null)
                ? SeatClass.valueOf(request.getSeatClassIn()) : null;

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

        // --- BƯỚC 3: Tạo Vé & Tính tiền (Có logic giảm giá) ---
        BigDecimal totalAmount = BigDecimal.ZERO;
        List<Ticket> tickets = new ArrayList<>();

        // A. XỬ LÝ CHIỀU ĐI
        if (request.getPassengersOut() != null) {
            long currentSoldOut = ticketRepository.countByFlightIdAndSeatClass(outboundFlight.getId(), classOut);
            String prefixOut = getSeatPrefix(classOut);
            BigDecimal basePrice = getPriceFromFlight(outboundFlight, classOut);

            for (int i = 0; i < request.getPassengersOut().size(); i++) {
                PassengerDTO p = request.getPassengersOut().get(i);
                String seatNum = prefixOut + (currentSoldOut + i + 1);

                // Logic giảm giá
                BigDecimal finalPrice = basePrice;
                if (calculateAge(p.getDob()) < 5) {
                    finalPrice = basePrice.multiply(new BigDecimal("0.5"));
                }

                Ticket ticketOut = createSingleTicket(booking, outboundFlight, p.getFullName(), classOut, seatNum);
                ticketOut.setPrice(finalPrice); // Ghi đè giá
                ticketOut.setPassengerDob(p.getDob()); // Lưu DOB

                tickets.add(ticketOut);
                totalAmount = totalAmount.add(finalPrice);
                decreaseSeatQuantity(outboundFlight.getId(), classOut, 1);
            }
        }

        // B. XỬ LÝ CHIỀU VỀ
        if (inboundFlight != null && classIn != null && request.getPassengersIn() != null) {
            long currentSoldIn = ticketRepository.countByFlightIdAndSeatClass(inboundFlight.getId(), classIn);
            String prefixIn = getSeatPrefix(classIn);
            BigDecimal basePriceIn = getPriceFromFlight(inboundFlight, classIn);

            for (int i = 0; i < request.getPassengersIn().size(); i++) {
                PassengerDTO p = request.getPassengersIn().get(i);
                String seatNum = prefixIn + (currentSoldIn + i + 1);

                // Logic giảm giá
                BigDecimal finalPrice = basePriceIn;
                if (calculateAge(p.getDob()) < 5) {
                    finalPrice = basePriceIn.multiply(new BigDecimal("0.5"));
                }

                Ticket ticketIn = createSingleTicket(booking, inboundFlight, p.getFullName(), classIn, seatNum);
                ticketIn.setPrice(finalPrice);
                ticketIn.setPassengerDob(p.getDob());

                tickets.add(ticketIn);
                totalAmount = totalAmount.add(finalPrice);
                decreaseSeatQuantity(inboundFlight.getId(), classIn, 1);
            }
        }

        booking.setTotalAmount(totalAmount);

        // --- BƯỚC 4: Lưu DB ---
        Booking savedBooking = bookingRepository.save(booking);
        for (Ticket t : tickets) {
            t.setBooking(savedBooking);
        }
        ticketRepository.saveAll(tickets);

        return savedBooking;
    }

    // =========================================================================
    // 3. CÁC HÀM XỬ LÝ KHÁC (DELETE, UPDATE, HELPER) - GIỮ NGUYÊN
    // =========================================================================

    @Transactional(rollbackFor = Exception.class)
    public void deleteBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Booking ID: " + id));

        List<Ticket> tickets = booking.getTickets();
        for (Ticket ticket : tickets) {
            Flight flight = ticket.getFlight();
            SeatClass seatClass = ticket.getSeatClass();
            Optional<FlightSeatDetail> seatDetailOpt = flightSeatDetailRepository.findByFlightIdAndSeatClass(flight.getId(), seatClass);
            if(seatDetailOpt.isPresent()) {
                FlightSeatDetail seatDetail = seatDetailOpt.get();
                seatDetail.setAvailableSeats(seatDetail.getAvailableSeats() + 1);
                flightSeatDetailRepository.save(seatDetail);
            }
        }
        ticketRepository.deleteAll(tickets);
        bookingRepository.delete(booking);
    }

    // 2. Hàm Cập Nhật Thông Tin (Sửa tên, DOB -> Tự động tính lại giá tiền)
    @Transactional(rollbackFor = Exception.class)
    public Booking updateBookingInfo(Long id, BookingRequestDTO request) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Booking ID: " + id));

        // Cập nhật thông tin liên hệ
        booking.setContactName(request.getContactName());
        booking.setContactPhone(request.getContactPhone());
        booking.setContactEmail(request.getContactEmail());
        booking.setPaymentMethod(PaymentMethod.valueOf(request.getPaymentMethod()));

        List<Ticket> tickets = booking.getTickets();
        BigDecimal newTotalAmount = BigDecimal.ZERO; // Biến tính tổng tiền mới

        // Duyệt qua tất cả vé để cập nhật thông tin và tính lại tiền
        for (Ticket t : tickets) {
            PassengerDTO p = null;
            boolean isOutbound = t.getFlight().getId().equals(booking.getFlight().getId());
            boolean isInbound = booking.getReturnFlight() != null && t.getFlight().getId().equals(booking.getReturnFlight().getId());

            // Tìm thông tin khách tương ứng từ Request gửi lên
            if (isOutbound && request.getPassengersOut() != null) {
                // Logic map đơn giản theo index (Giả sử thứ tự vé không đổi)
                int index = tickets.indexOf(t);
                // Cần cẩn thận: tickets trong List có thể không theo thứ tự index của request.
                // Tạm thời dùng cách match theo danh sách filtered bên dưới cho chuẩn xác hơn:
            }
        }

        // --- CÁCH TÍNH LẠI CHUẨN XÁC HƠN ---

        // 1. Xử lý chiều đi
        List<Ticket> ticketsOut = tickets.stream()
                .filter(t -> t.getFlight().getId().equals(booking.getFlight().getId()))
                .collect(Collectors.toList());

        if (request.getPassengersOut() != null && ticketsOut.size() == request.getPassengersOut().size()) {
            for (int i = 0; i < ticketsOut.size(); i++) {
                Ticket t = ticketsOut.get(i);
                PassengerDTO p = request.getPassengersOut().get(i);

                t.setPassengerName(p.getFullName());
                t.setPassengerDob(p.getDob()); // Cập nhật ngày sinh

                // TÍNH LẠI GIÁ VÉ CHIỀU ĐI
                BigDecimal basePrice = getPriceFromFlight(t.getFlight(), t.getSeatClass());
                if (calculateAge(p.getDob()) < 5) {
                    basePrice = basePrice.multiply(new BigDecimal("0.5"));
                }
                t.setPrice(basePrice); // Lưu giá mới vào vé
            }
        }

        // 2. Xử lý chiều về (nếu có)
        if (booking.getReturnFlight() != null && request.getPassengersIn() != null) {
            List<Ticket> ticketsIn = tickets.stream()
                    .filter(t -> t.getFlight().getId().equals(booking.getReturnFlight().getId()))
                    .collect(Collectors.toList());

            if (ticketsIn.size() == request.getPassengersIn().size()) {
                for (int i = 0; i < ticketsIn.size(); i++) {
                    Ticket t = ticketsIn.get(i);
                    PassengerDTO p = request.getPassengersIn().get(i);

                    t.setPassengerName(p.getFullName());
                    t.setPassengerDob(p.getDob());

                    // TÍNH LẠI GIÁ VÉ CHIỀU VỀ
                    BigDecimal basePrice = getPriceFromFlight(t.getFlight(), t.getSeatClass());
                    if (calculateAge(p.getDob()) < 5) {
                        basePrice = basePrice.multiply(new BigDecimal("0.5"));
                    }
                    t.setPrice(basePrice); // Lưu giá mới
                }
            }
        }

        // 3. Tính lại tổng tiền booking từ danh sách vé đã cập nhật giá
        for (Ticket t : tickets) {
            newTotalAmount = newTotalAmount.add(t.getPrice());
        }
        booking.setTotalAmount(newTotalAmount); // [QUAN TRỌNG] Cập nhật tổng tiền vào Booking

        ticketRepository.saveAll(tickets);
        return bookingRepository.save(booking);
    }

    private Ticket createSingleTicket(Booking booking, Flight flight, String passengerName, SeatClass seatClass, String seatNumber) {
        Ticket ticket = new Ticket();
        ticket.setBooking(booking);
        ticket.setFlight(flight);
        ticket.setPassengerName(passengerName);
        ticket.setSeatClass(seatClass);
        ticket.setStatus(TicketStatus.BOOKED);
        ticket.setTicketNumber("T-" + System.nanoTime());
        // Giá mặc định (sẽ bị ghi đè nếu có giảm giá)
        ticket.setPrice(getPriceFromFlight(flight, seatClass));
        ticket.setSeatNumber(seatNumber);
        return ticket;
    }

    private String getSeatPrefix(SeatClass seatClass) {
        if (seatClass == null) return "A";
        return seatClass == SeatClass.BUSINESS ? "B" : "A";
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
            FlightSeatDetail s = seatDetailOpt.get();
            if (s.getAvailableSeats() >= quantity) {
                s.setAvailableSeats(s.getAvailableSeats() - quantity);
                flightSeatDetailRepository.save(s);
            } else { throw new RuntimeException("Hết ghế"); }
        }
    }

    public List<Booking> findAll() {
        return bookingRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
    }

    public Booking updateStatus(Long id, String newStatus) {
        Booking booking = bookingRepository.findById(id).orElseThrow();
        try {
            BookingStatus status = BookingStatus.valueOf(newStatus);
            if(status == BookingStatus.CANCELLED && booking.getStatus() != BookingStatus.CANCELLED) {
                for(Ticket t : booking.getTickets()) {
                    Optional<FlightSeatDetail> sOpt = flightSeatDetailRepository.findByFlightIdAndSeatClass(t.getFlight().getId(), t.getSeatClass());
                    sOpt.ifPresent(s -> {
                        s.setAvailableSeats(s.getAvailableSeats() + 1);
                        flightSeatDetailRepository.save(s);
                    });
                }
            }
            booking.setStatus(status);
            if(status == BookingStatus.PAID) booking.setPaymentStatus(PaymentStatus.PAID);
            return bookingRepository.save(booking);
        } catch (Exception e) { throw new RuntimeException("Lỗi update status"); }
    }

    @Autowired
    private IPassengerRepository passengerRepository; // Nhớ Autowire thêm cái này

    // =========================================================================
    // 4. HÀM ĐẶT VÉ ONLINE MỚI (Tách biệt hoàn toàn)
    // =========================================================================
    @Transactional(rollbackFor = Exception.class)
    public Booking createOnlineBooking(OnlineBookingRequest request) {

        // 1. Validate Chuyến đi
        Flight outboundFlight = flightRepository.findById(request.getFlightId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chuyến bay đi!"));

        // 2. Validate Chuyến về (Nếu có)
        Flight inboundFlight = null;
        if (request.getReturnFlightId() != null) {
            inboundFlight = flightRepository.findById(request.getReturnFlightId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy chuyến bay về!"));

            // Nếu gửi ID chuyến về nhưng loại vé lại là 1 chiều -> Báo lỗi hoặc tự sửa
            if (request.getTripType() == TripType.ONE_WAY) {
                throw new RuntimeException("Vé một chiều không được có chuyến bay về!");
            }
        } else {
            // Nếu không có chuyến về, ép kiểu về ONE_WAY
            request.setTripType(TripType.ONE_WAY);
        }

        // 3. Validate Hạng ghế
        SeatClass classOut = SeatClass.valueOf(request.getSeatClassOut());
        SeatClass classIn = (inboundFlight != null && request.getSeatClassIn() != null)
                ? SeatClass.valueOf(request.getSeatClassIn())
                : null;

        // 4. Khởi tạo Booking
        Booking booking = new Booking();
        booking.setBookingCode("WEB-" + System.currentTimeMillis());
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

        // Lấy số lượng ghế đã bán để xếp chỗ tiếp theo
        long soldOut = ticketRepository.countByFlightIdAndSeatClass(outboundFlight.getId(), classOut);
        long soldIn = (inboundFlight != null) ? ticketRepository.countByFlightIdAndSeatClass(inboundFlight.getId(), classIn) : 0;

        String prefixOut = getSeatPrefix(classOut);
        String prefixIn = (classIn != null) ? getSeatPrefix(classIn) : "";

        int index = 0;
        for (OnlinePassengerDTO pDto : request.getPassengers()) {
            index++;

            // --- VALIDATE DỮ LIỆU HÀNH KHÁCH (Backend Validation) ---
            if (pDto.getFullName() == null || pDto.getFullName().length() < 10 || pDto.getFullName().length() > 50) {
                throw new RuntimeException("Tên hành khách thứ " + index + " phải từ 10-50 ký tự.");
            }
            if (pDto.getGender() == null || pDto.getGender().isEmpty()) {
                throw new RuntimeException("Giới tính hành khách thứ " + index + " là bắt buộc.");
            }
            // Logic: Nếu KHÔNG phải trẻ em -> Bắt buộc CMND
            if (!pDto.isChild()) {
                if (pDto.getIdentityCard() == null || pDto.getIdentityCard().trim().isEmpty()) {
                    throw new RuntimeException("CMND/Passport là bắt buộc với người lớn (Hành khách " + index + ")");
                }
            }

            // A. Lưu thông tin Passenger vào bảng 'passengers'
            Passenger passenger = new Passenger();
            passenger.setBooking(booking); // Link với booking (sẽ save sau khi booking có ID)
            passenger.setFullName(pDto.getFullName());
            passenger.setGender(pDto.getGender());
            passenger.setEmail(pDto.getEmail());
            passenger.setPhoneNumber(pDto.getPhone());
            passenger.setIdentityCard(pDto.getIdentityCard());
            passenger.setPassengerType(pDto.isChild() ? "CHILD" : "ADULT");
            passenger.setHasInfant(pDto.isHasInfant());

            savedPassengers.add(passenger);

            // B. Tạo vé chiều đi (Ticket)
            // Logic giá: Trẻ em (CHILD) có thể giảm giá ở đây nếu muốn. Ví dụ: giảm 25%
            BigDecimal priceOut = getPriceFromFlight(outboundFlight, classOut);

            String seatNumOut = prefixOut + (soldOut + index);
            Ticket tOut = createSingleTicket(booking, outboundFlight, pDto.getFullName(), classOut, seatNumOut);
            tOut.setPrice(priceOut); // Gán giá
            tickets.add(tOut);
            totalAmount = totalAmount.add(priceOut);

            // Trừ ghế trống chiều đi
            decreaseSeatQuantity(outboundFlight.getId(), classOut, 1);

            // C. Tạo vé chiều về (Nếu có)
            if (inboundFlight != null) {
                BigDecimal priceIn = getPriceFromFlight(inboundFlight, classIn);
                String seatNumIn = prefixIn + (soldIn + index);

                Ticket tIn = createSingleTicket(booking, inboundFlight, pDto.getFullName(), classIn, seatNumIn);
                tIn.setPrice(priceIn);
                tickets.add(tIn);
                totalAmount = totalAmount.add(priceIn);

                // Trừ ghế trống chiều về
                decreaseSeatQuantity(inboundFlight.getId(), classIn, 1);
            }
        }

        booking.setTotalAmount(totalAmount);

        // 6. Lưu tất cả xuống DB
        Booking finalBooking = bookingRepository.save(booking);

        // Cập nhật ID booking cho list passenger và ticket
        for (Passenger p : savedPassengers) p.setBooking(finalBooking);
        for (Ticket t : tickets) t.setBooking(finalBooking);

        passengerRepository.saveAll(savedPassengers);
        ticketRepository.saveAll(tickets);

        // 7. Gửi Email (Placeholder)
        // emailService.sendBookingConfirmation(finalBooking);

        return finalBooking;
    }

    // ThanhNN

    public void updateStatusByCode(String bookingCode, BookingStatus status) {
        Booking booking = bookingRepository
                .findByBookingCode(bookingCode)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus(status);
        bookingRepository.save(booking);
    }

    private String generateBookingCode() {
        return "BK" + System.currentTimeMillis();
    }

    public Booking createPendingBooking(BookingOnlineRequest req) {

        Booking booking = new Booking();

        booking.setBookingCode(generateBookingCode());
        booking.setBookingDate(LocalDateTime.now());

        booking.setStatus(BookingStatus.PENDING);
        booking.setPaymentStatus(PaymentStatus.UNPAID);
        booking.setPaymentMethod(PaymentMethod.VNPAY);
        booking.setChannel(Channel.ONLINE);

        booking.setTripType(
                TripType.valueOf(req.getTripType())
        );

        booking.setTotalAmount(
                BigDecimal.valueOf(req.getTotalAmount())
        );

        booking.setContactName(req.getContactName());
        booking.setContactEmail(req.getContactEmail());
        booking.setContactPhone(req.getContactPhone());

        // flight / returnFlight set sau nếu cần

        return bookingRepository.save(booking);
    }
}