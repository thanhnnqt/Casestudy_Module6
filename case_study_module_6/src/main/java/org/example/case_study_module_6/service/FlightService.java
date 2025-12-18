package org.example.case_study_module_6.service;


import jakarta.persistence.criteria.Predicate;
import org.example.case_study_module_6.entity.Flight;

import org.example.case_study_module_6.entity.FlightStatus;
import org.example.case_study_module_6.repository.FlightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.math.BigDecimal;

@Service
public class FlightService {

    @Autowired
    private FlightRepository flightRepository;

    // Cập nhật: Thêm tham số origin, destination
    public Page<Flight> getFlights(String airline, String origin, String destination,
                                   LocalDateTime departureTime, BigDecimal maxPrice, Pageable pageable) {
        Specification<Flight> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (airline != null && !airline.isEmpty()) {
                predicates.add(criteriaBuilder.like(root.get("airline"), "%" + airline + "%"));
            }
            // Thêm lọc nơi đi
            if (origin != null && !origin.isEmpty()) {
                predicates.add(criteriaBuilder.like(root.get("origin"), "%" + origin + "%"));
            }
            // Thêm lọc nơi đến
            if (destination != null && !destination.isEmpty()) {
                predicates.add(criteriaBuilder.like(root.get("destination"), "%" + destination + "%"));
            }

            if (departureTime != null) {
                LocalDateTime startOfDay = departureTime.toLocalDate().atStartOfDay();
                LocalDateTime endOfDay = departureTime.toLocalDate().atTime(23, 59, 59);
                predicates.add(criteriaBuilder.between(root.get("departureTime"), startOfDay, endOfDay));
            }
            if (maxPrice != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice));
            }
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
        return flightRepository.findAll(spec, pageable);
    }

    public Flight getFlightById(Long id) {
        return flightRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chuyến bay với ID: " + id));
    }

    public Flight createFlight(Flight flight) {
        if (flight.getOrigin().equalsIgnoreCase(flight.getDestination())) {
            throw new RuntimeException("Sân bay đi và đến không được trùng nhau.");
        }
        if (flight.getArrivalTime().isBefore(flight.getDepartureTime().plusMinutes(30))) {
            throw new RuntimeException("Thời gian hạ cánh phải sau thời gian cất cánh ít nhất 30 phút.");
        }
        if (flightRepository.existsByFlightCode(flight.getFlightCode())) {
            throw new RuntimeException("Mã chuyến bay " + flight.getFlightCode() + " đã tồn tại!");
        }

        flight.setStatus(FlightStatus.SCHEDULED);
        return flightRepository.save(flight);
    }

    // Cập nhật: Cho phép sửa Status
    public Flight updateFlight(Long id, Flight flightDetails) {
        Flight existingFlight = getFlightById(id);

        // Validation logic
        if (flightDetails.getDepartureTime().isBefore(LocalDateTime.now())) {
            // Chỉ cảnh báo nếu đổi giờ về quá khứ, nhưng admin có quyền làm việc này để sửa log
        }

        existingFlight.setDepartureTime(flightDetails.getDepartureTime());
        existingFlight.setArrivalTime(flightDetails.getArrivalTime());

        // Cập nhật trạng thái mới từ Form
        if (flightDetails.getStatus() != null) {
            existingFlight.setStatus(flightDetails.getStatus());
        }

        if (existingFlight.getArrivalTime().isBefore(existingFlight.getDepartureTime().plusMinutes(30))) {
            throw new RuntimeException("Thời gian hạ cánh phải sau thời gian cất cánh ít nhất 30 phút.");
        }

        return flightRepository.save(existingFlight);
    }

    public void cancelFlight(Long id) {
        Flight flight = getFlightById(id);
        flight.setStatus(FlightStatus.CANCELLED);
        flightRepository.save(flight);
    }
}
