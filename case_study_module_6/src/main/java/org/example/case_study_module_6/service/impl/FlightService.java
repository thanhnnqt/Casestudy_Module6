package org.example.case_study_module_6.service.impl;

import org.example.case_study_module_6.dto.FlightRequestDTO;
import org.example.case_study_module_6.dto.SeatConfigDTO;
import org.example.case_study_module_6.entity.*;

import org.example.case_study_module_6.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class FlightService {
    @Autowired private IFlightRepository flightRepository;
    @Autowired private IAircraftRepository aircraftRepository;
    @Autowired private IAirportRepository airportRepository;

    // Cập nhật hàm getFlights nhận thêm status
    public Page<Flight> getFlights(String keyword, String origin, String destination,
                                   LocalDate startDate, LocalDate endDate,
                                   BigDecimal minPrice, BigDecimal maxPrice,
                                   String statusStr, // Nhận String từ controller
                                   Pageable pageable) {

        FlightStatus status = null;
        if (statusStr != null && !statusStr.isEmpty()) {
            try {
                status = FlightStatus.valueOf(statusStr);
            } catch (IllegalArgumentException e) {
                // Nếu client gửi status sai, coi như không lọc
            }
        }

        return flightRepository.searchFlights(
                keyword, origin, destination, startDate, endDate, minPrice, maxPrice, status, pageable
        );
    }

    public Flight getFlightById(Long id) {
        return flightRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy"));
    }

    public List<String> getAllFlightNumbers() {
        return flightRepository.findDistinctFlightNumbers();
    }

    @Transactional
    public Flight createFlight(FlightRequestDTO req) {
        Aircraft aircraft = aircraftRepository.findById(req.getAircraftId())
                .orElseThrow(() -> new RuntimeException("Máy bay không tồn tại"));

        //2. Validate Logic Ngày Giờ (BỔ SUNG)
        validateFlightTimes(req.getDepartureTime(), req.getArrivalTime());

        long conflicts = flightRepository.countConflictingFlights(
                req.getAircraftId(), null, req.getDepartureTime(), req.getArrivalTime());

        if (conflicts > 0) throw new RuntimeException("Máy bay này đã có lịch trình trong khoảng thời gian đã chọn!");

        validateTotalSeats(req.getSeatConfigs(), aircraft.getTotalSeats());

        Flight flight = new Flight();
        mapDtoToEntity(flight, req, aircraft);

        // Khi tạo mới, mặc định luôn là SCHEDULED (bỏ qua req.status nếu có)
        flight.setStatus(FlightStatus.SCHEDULED);

        List<FlightSeatDetail> details = new ArrayList<>();
        for (SeatConfigDTO config : req.getSeatConfigs()) {
            details.add(createNewSeatDetail(config, flight));
        }
        flight.setSeatDetails(details);

        return flightRepository.save(flight);
    }

    // HÀM BỔ SUNG: Kiểm tra logic ngày giờ
    private void validateFlightTimes(LocalDateTime departure, LocalDateTime arrival) {
        if (departure == null || arrival == null) {
            throw new RuntimeException("Thời gian khởi hành và hạ cánh không được để trống");
        }

        // Giờ bay phải sau hiện tại (Bỏ qua nếu đang test data cũ, nhưng nên có khi production)
         if (departure.isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Thời gian khởi hành phải ở trong tương lai");
         }

        if (arrival.isBefore(departure) || arrival.isEqual(departure)) {
            throw new RuntimeException("Thời gian hạ cánh phải sau thời gian khởi hành");
        }
    }

    @Transactional
    public Flight updateFlight(Long id, FlightRequestDTO req) {
        Flight flight = getFlightById(id);

        Aircraft aircraft = aircraftRepository.findById(req.getAircraftId())
                .orElseThrow(() -> new RuntimeException("Máy bay không tồn tại"));

        long conflicts = flightRepository.countConflictingFlights(
                req.getAircraftId(), id, req.getDepartureTime(), req.getArrivalTime());

        if (conflicts > 0) throw new RuntimeException("Lịch trình bị trùng với chuyến bay khác!");

        // 3. CẬP NHẬT (CHỈ 3 TRƯỜNG CHO PHÉP)
        flight.setDepartureTime(req.getDepartureTime());
        flight.setArrivalTime(req.getArrivalTime());

        if (req.getStatus() != null && !req.getStatus().isEmpty()) {
            try {
                flight.setStatus(FlightStatus.valueOf(req.getStatus()));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Trạng thái không hợp lệ");
            }
        }

        // TUYỆT ĐỐI KHÔNG GỌI mapDtoToEntity HAY CẬP NHẬT seatDetails TẠI ĐÂY

        return flightRepository.save(flight);
    }

    @Transactional
    public void cancelFlight(Long id) {
        Flight f = getFlightById(id);
        if (f.getStatus() == FlightStatus.COMPLETED) {
            throw new RuntimeException("Không thể hủy chuyến bay đã hoàn thành");
        }
        f.setStatus(FlightStatus.CANCELLED);
        flightRepository.save(f);
    }

    // --- Helpers ---
    private void validateTotalSeats(List<SeatConfigDTO> configs, int maxSeats) {
        if (configs == null || configs.isEmpty()) throw new RuntimeException("Phải cấu hình ít nhất một hạng ghế");
        int totalConfigSeats = configs.stream().mapToInt(SeatConfigDTO::getTotalSeats).sum();
        if (totalConfigSeats > maxSeats) throw new RuntimeException("Tổng số ghế (" + totalConfigSeats + ") vượt quá sức chứa máy bay (" + maxSeats + ")");
    }

    private void mapDtoToEntity(Flight flight, FlightRequestDTO req, Aircraft aircraft) {
        flight.setFlightNumber(req.getFlightNumber());
        flight.setAircraft(aircraft);
        flight.setDepartureAirport(airportRepository.findById(req.getDepartureAirportId())
                .orElseThrow(() -> new RuntimeException("Sân bay đi không tồn tại")));
        flight.setArrivalAirport(airportRepository.findById(req.getArrivalAirportId())
                .orElseThrow(() -> new RuntimeException("Sân bay đến không tồn tại")));
        flight.setDepartureTime(req.getDepartureTime());
        flight.setArrivalTime(req.getArrivalTime());
    }

    private FlightSeatDetail createNewSeatDetail(SeatConfigDTO config, Flight flight) {
        FlightSeatDetail detail = new FlightSeatDetail();
        try {
            detail.setSeatClass(SeatClass.valueOf(config.getSeatClass()));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Hạng ghế không hợp lệ: " + config.getSeatClass());
        }
        detail.setPrice(config.getPrice());
        detail.setTotalSeats(config.getTotalSeats());
        detail.setAvailableSeats(config.getTotalSeats());
        detail.setFlight(flight);
        return detail;
    }
}