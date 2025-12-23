package org.example.case_study_module_6.service;


import jakarta.persistence.criteria.Expression;
import org.example.case_study_module_6.dto.FlightRequestDTO;
import org.example.case_study_module_6.entity.Flight;
import jakarta.persistence.criteria.Predicate;

import org.example.case_study_module_6.entity.FlightStatus;
import org.example.case_study_module_6.repository.IAircraftRepository;
import org.example.case_study_module_6.repository.IAirportRepository;
import org.example.case_study_module_6.repository.IFlightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class FlightService {

    @Autowired private IFlightRepository IFlightRepository;
    @Autowired private IAirportRepository IAirportRepository;
    @Autowired private IAircraftRepository IAircraftRepository;

    // 1. TÌM KIẾM NÂNG CAO (Fix lỗi tìm VN101)
    public Page<Flight> getFlights(String keyword, String origin, String destination, LocalDate startDate, LocalDate endDate, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable) {
        Specification<Flight> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (keyword != null && !keyword.isEmpty()) {
                String likePattern = "%" + keyword + "%";
                Predicate airlineNameLike = cb.like(root.get("aircraft").get("airline").get("name"), likePattern);
                Predicate flightNumLike = cb.like(root.get("flightNumber"), likePattern);
                Expression<String> fullCode = cb.concat(root.get("aircraft").get("airline").get("code"), root.get("flightNumber"));
                Predicate fullCodeLike = cb.like(fullCode, likePattern);
                predicates.add(cb.or(airlineNameLike, flightNumLike, fullCodeLike));
            }

            if (origin != null && !origin.isEmpty()) {
                predicates.add(cb.like(root.get("departureAirport").get("city"), "%" + origin + "%"));
            }
            if (destination != null && !destination.isEmpty()) {
                predicates.add(cb.like(root.get("arrivalAirport").get("city"), "%" + destination + "%"));
            }

            if (startDate != null && endDate != null) {
                LocalDateTime searchStart = startDate.atStartOfDay();
                LocalDateTime searchEnd = endDate.atTime(23, 59, 59);
                predicates.add(cb.and(
                        cb.lessThanOrEqualTo(root.get("departureTime"), searchEnd),
                        cb.greaterThanOrEqualTo(root.get("arrivalTime"), searchStart)
                ));
            }

            // --- LOGIC KHOẢNG GIÁ ---
            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("basePrice"), minPrice));
            }
            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("basePrice"), maxPrice));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
        return IFlightRepository.findAll(spec, pageable);
    }

    // ... (Giữ nguyên các hàm create, update, getAllFlightNumbers ở dưới không đổi) ...
    public List<String> getAllFlightNumbers() { return IFlightRepository.findDistinctFlightNumbers(); }
    public Flight getFlightById(Long id) { return IFlightRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy")); }

    public Flight createFlight(FlightRequestDTO req) {
        // ... (Giữ nguyên code cũ)
        // (Copy lại phần createFlight từ câu trả lời trước nếu cần, logic không đổi)
        if (req.getDepartureTime().isBefore(LocalDateTime.now().plusHours(24))) {
            throw new RuntimeException("Giờ khởi hành phải sau thời điểm hiện tại ít nhất 24 giờ.");
        }
        if (req.getDepartureAirportId().equals(req.getArrivalAirportId())) {
            throw new RuntimeException("Sân bay đi và đến không được trùng nhau.");
        }
        if (!req.getArrivalTime().isAfter(req.getDepartureTime().plusMinutes(30))) {
            throw new RuntimeException("Thời gian bay tối thiểu 30 phút.");
        }
        if (IFlightRepository.existsByFlightNumberAndDepartureTime(req.getFlightNumber(), req.getDepartureTime())) {
            throw new RuntimeException("Chuyến bay số hiệu " + req.getFlightNumber() + " đã tồn tại vào giờ này.");
        }
        long conflicts = IFlightRepository.countConflictingFlights(
                req.getAircraftId(), -1L, req.getDepartureTime(), req.getArrivalTime());
        if (conflicts > 0) {
            throw new RuntimeException("Máy bay này đang bận lịch trình khác.");
        }

        Flight flight = new Flight();
        flight.setFlightNumber(req.getFlightNumber());
        flight.setDepartureTime(req.getDepartureTime());
        flight.setArrivalTime(req.getArrivalTime());
        flight.setBasePrice(req.getBasePrice());
        flight.setAircraft(IAircraftRepository.findById(req.getAircraftId()).orElseThrow());
        flight.setDepartureAirport(IAirportRepository.findById(req.getDepartureAirportId()).orElseThrow());
        flight.setArrivalAirport(IAirportRepository.findById(req.getArrivalAirportId()).orElseThrow());
        flight.setStatus(FlightStatus.SCHEDULED);

        return IFlightRepository.save(flight);
    }

    public Flight updateFlight(Long id, FlightRequestDTO req) {
        // ... (Giữ nguyên code cũ)
        Flight existingFlight = getFlightById(id);
        if (existingFlight.getStatus() == FlightStatus.CANCELLED || existingFlight.getStatus() == FlightStatus.COMPLETED) {
            throw new RuntimeException("Không thể sửa chuyến bay đã Hủy hoặc Hoàn thành.");
        }
        if (req.getDepartureTime().isBefore(LocalDateTime.now().plusHours(24))) {
            throw new RuntimeException("Giờ khởi hành mới phải sau thời điểm hiện tại ít nhất 24 giờ.");
        }
        long conflicts = IFlightRepository.countConflictingFlights(
                existingFlight.getAircraft().getId(), id, req.getDepartureTime(), req.getArrivalTime());
        if (conflicts > 0) {
            throw new RuntimeException("Máy bay sẽ bị trùng lịch nếu đổi sang giờ này.");
        }
        existingFlight.setDepartureTime(req.getDepartureTime());
        existingFlight.setArrivalTime(req.getArrivalTime());
        if (req.getStatus() != null) {
            existingFlight.setStatus(FlightStatus.valueOf(req.getStatus()));
        }
        return IFlightRepository.save(existingFlight);
    }

    public void cancelFlight(Long id) {
        Flight flight = getFlightById(id);
        flight.setStatus(FlightStatus.CANCELLED);
        IFlightRepository.save(flight);
    }
}