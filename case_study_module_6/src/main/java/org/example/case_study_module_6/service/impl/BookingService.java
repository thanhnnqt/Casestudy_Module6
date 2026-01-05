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
    @Autowired private IPassengerRepository passengerRepository; // Thêm repo này

    // --- Helper tính tuổi ---
    private int calculateAge(LocalDate dob) {
        if (dob == null) return 99;
        return Period.between(dob, LocalDate.now()).getYears();
    }

    // --- [ĐÃ SỬA] Helper xác định mã ghế (A, B, C) ---
    private String getSeatPrefix(SeatClass seatClass) {
        if (seatClass == null) return "A";
        switch (seatClass) {
            case FIRST_CLASS:
                return "C"; // Hạng nhất: C...
            case BUSINESS:
                return "B"; // Hạng thương gia: B...
            case ECONOMY:
            default:
                return "A"; // Hạng phổ thông: A...
        }
    }

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
        booking.setStatus(BookingStatus.PAID);
        booking.setPaymentStatus(PaymentStatus.PAID);
        booking.setPaymentMethod(PaymentMethod.CASH);
        booking.setChannel(Channel.OFFLINE);
        booking.setTripType(TripType.ONE_WAY);
        booking.setContactName(request.getContactName());
        booking.setContactEmail(request.getContactEmail());
        booking.setContactPhone(request.getContactPhone());

        Booking savedBooking = bookingRepository.save(booking);

        // Logic xếp ghế
        long currentSold = ticketRepository.countByFlightIdAndSeatClass(request.getFlightId(), seatClass);
        String prefix = getSeatPrefix(seatClass);

        List<Ticket> tickets = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;
        BigDecimal basePrice = seatDetail.getPrice();

        for (int i = 0; i < quantity; i++) {
            PassengerDTO p = passengerList.get(i);

            BigDecimal finalPrice = basePrice;
            if (calculateAge(p.getDob()) < 5) {
                finalPrice = basePrice.multiply(new BigDecimal("0.5"));
            }

            Ticket ticket = new Ticket();
            ticket.setBooking(savedBooking);
            ticket.setFlight(seatDetail.getFlight());
            ticket.setSeatClass(seatClass);
            ticket.setPrice(finalPrice);
            ticket.setPassengerName(p.getFullName());
            ticket.setPassengerDob(p.getDob());

            // Số ghế: Prefix (A/B/C) + Số thứ tự
            ticket.setSeatNumber(prefix + (currentSold + i + 1));

            ticket.setTicketNumber("TIC-" + System.currentTimeMillis() + i);
            ticket.setStatus(TicketStatus.BOOKED);

            tickets.add(ticket);
            totalAmount = totalAmount.add(finalPrice);
        }

        ticketRepository.saveAll(tickets);
        savedBooking.setTotalAmount(totalAmount);
        return bookingRepository.save(savedBooking);
    }

    // =========================================================================
    // 2. HÀM BÁN VÉ ONLINE (SỬA ĐỔI)
    // =========================================================================
    @Transactional(rollbackFor = Exception.class)
    public Booking createBooking(BookingRequestDTO request) {
        Flight outboundFlight = flightRepository.findById(request.getFlightId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chuyến bay đi!"));

        Flight inboundFlight = null;
        if (request.getTripType() == TripType.ROUND_TRIP && request.getReturnFlightId() != null) {
            inboundFlight = flightRepository.findById(request.getReturnFlightId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy chuyến bay về!"));
        }

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

        BigDecimal totalAmount = BigDecimal.ZERO;
        List<Ticket> tickets = new ArrayList<>();

        // A. CHIỀU ĐI
        if (request.getPassengersOut() != null) {
            long currentSoldOut = ticketRepository.countByFlightIdAndSeatClass(outboundFlight.getId(), classOut);
            String prefixOut = getSeatPrefix(classOut); // A, B hoặc C
            BigDecimal basePrice = getPriceFromFlight(outboundFlight, classOut);

            for (int i = 0; i < request.getPassengersOut().size(); i++) {
                PassengerDTO p = request.getPassengersOut().get(i);

                String seatNum = prefixOut + (currentSoldOut + i + 1);

                BigDecimal finalPrice = basePrice;
                if (calculateAge(p.getDob()) < 5) {
                    finalPrice = basePrice.multiply(new BigDecimal("0.5"));
                }

                Ticket ticketOut = createSingleTicket(booking, outboundFlight, p.getFullName(), classOut, seatNum);
                ticketOut.setPrice(finalPrice);
                ticketOut.setPassengerDob(p.getDob());

                tickets.add(ticketOut);
                totalAmount = totalAmount.add(finalPrice);
                decreaseSeatQuantity(outboundFlight.getId(), classOut, 1);
            }
        }

        // B. CHIỀU VỀ
        if (inboundFlight != null && classIn != null && request.getPassengersIn() != null) {
            long currentSoldIn = ticketRepository.countByFlightIdAndSeatClass(inboundFlight.getId(), classIn);
            String prefixIn = getSeatPrefix(classIn); // A, B hoặc C
            BigDecimal basePriceIn = getPriceFromFlight(inboundFlight, classIn);

            for (int i = 0; i < request.getPassengersIn().size(); i++) {
                PassengerDTO p = request.getPassengersIn().get(i);

                String seatNum = prefixIn + (currentSoldIn + i + 1);

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
        Booking savedBooking = bookingRepository.save(booking);
        for (Ticket t : tickets) {
            t.setBooking(savedBooking);
        }
        ticketRepository.saveAll(tickets);

        return savedBooking;
    }

    // =========================================================================
    // 3. CÁC HÀM KHÁC (UPDATE, DELETE, HELPER)
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

    @Transactional(rollbackFor = Exception.class)
    public Booking updateBookingInfo(Long id, BookingRequestDTO request) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Booking ID: " + id));

        booking.setContactName(request.getContactName());
        booking.setContactPhone(request.getContactPhone());
        booking.setContactEmail(request.getContactEmail());
        booking.setPaymentMethod(PaymentMethod.valueOf(request.getPaymentMethod()));

        List<Ticket> tickets = booking.getTickets();
        BigDecimal newTotalAmount = BigDecimal.ZERO;

        // Xử lý chiều đi
        List<Ticket> ticketsOut = tickets.stream()
                .filter(t -> t.getFlight().getId().equals(booking.getFlight().getId()))
                .collect(Collectors.toList());

        if (request.getPassengersOut() != null && ticketsOut.size() == request.getPassengersOut().size()) {
            for (int i = 0; i < ticketsOut.size(); i++) {
                Ticket t = ticketsOut.get(i);
                PassengerDTO p = request.getPassengersOut().get(i);
                t.setPassengerName(p.getFullName());
                t.setPassengerDob(p.getDob());

                BigDecimal basePrice = getPriceFromFlight(t.getFlight(), t.getSeatClass());
                if (calculateAge(p.getDob()) < 5) basePrice = basePrice.multiply(new BigDecimal("0.5"));
                t.setPrice(basePrice);
            }
        }

        // Xử lý chiều về
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

                    BigDecimal basePrice = getPriceFromFlight(t.getFlight(), t.getSeatClass());
                    if (calculateAge(p.getDob()) < 5) basePrice = basePrice.multiply(new BigDecimal("0.5"));
                    t.setPrice(basePrice);
                }
            }
        }

        // Tính lại tổng tiền
        for (Ticket t : tickets) {
            newTotalAmount = newTotalAmount.add(t.getPrice());
        }
        booking.setTotalAmount(newTotalAmount);

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
        ticket.setPrice(getPriceFromFlight(flight, seatClass));
        ticket.setSeatNumber(seatNumber);
        return ticket;
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

    @Transactional(rollbackFor = Exception.class)
    public Booking createOnlineBooking(OnlineBookingRequest request) {
        Flight outboundFlight = flightRepository.findById(request.getFlightId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chuyến bay đi!"));

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

        SeatClass classOut = SeatClass.valueOf(request.getSeatClassOut());
        SeatClass classIn = (inboundFlight != null && request.getSeatClassIn() != null) ? SeatClass.valueOf(request.getSeatClassIn()) : null;

        Booking booking = new Booking();
        booking.setBookingCode("WEB-" + System.currentTimeMillis());
        booking.setBookingDate(LocalDateTime.now());
        booking.setStatus(BookingStatus.PENDING);
        booking.setPaymentStatus(PaymentStatus.UNPAID);
        booking.setChannel(Channel.ONLINE);
        booking.setPaymentMethod(PaymentMethod.valueOf(request.getPaymentMethod()));
        booking.setContactName(request.getContactName());
        booking.setContactEmail(request.getContactEmail());
        booking.setContactPhone(request.getContactPhone());
        booking.setFlight(outboundFlight);
        booking.setReturnFlight(inboundFlight);
        booking.setTripType(request.getTripType());

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
            if (pDto.getFullName() == null || pDto.getFullName().length() < 10 || pDto.getFullName().length() > 50) {
                throw new RuntimeException("Tên hành khách thứ " + index + " phải từ 10-50 ký tự.");
            }
            if (pDto.getGender() == null || pDto.getGender().isEmpty()) {
                throw new RuntimeException("Giới tính hành khách thứ " + index + " là bắt buộc.");
            }
            if (!pDto.isChild() && (pDto.getIdentityCard() == null || pDto.getIdentityCard().trim().isEmpty())) {
                throw new RuntimeException("CMND/Passport là bắt buộc với người lớn (Hành khách " + index + ")");
            }

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

            BigDecimal priceOut = getPriceFromFlight(outboundFlight, classOut);
            String seatNumOut = prefixOut + (soldOut + index);
            Ticket tOut = createSingleTicket(booking, outboundFlight, pDto.getFullName(), classOut, seatNumOut);
            tOut.setPrice(priceOut);
            tickets.add(tOut);
            totalAmount = totalAmount.add(priceOut);
            decreaseSeatQuantity(outboundFlight.getId(), classOut, 1);

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
        Booking finalBooking = bookingRepository.save(booking);
        for (Passenger p : savedPassengers) p.setBooking(finalBooking);
        for (Ticket t : tickets) t.setBooking(finalBooking);

        passengerRepository.saveAll(savedPassengers);
        ticketRepository.saveAll(tickets);

        return finalBooking;
    }
}