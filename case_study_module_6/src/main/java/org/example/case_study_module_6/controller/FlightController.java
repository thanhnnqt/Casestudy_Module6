package org.example.case_study_module_6.controller;


import org.example.case_study_module_6.dto.FlightRequestDTO;
import org.example.case_study_module_6.entity.Flight;
import org.example.case_study_module_6.service.FlightService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/flights")
@CrossOrigin(origins = "http://localhost:5173")
public class FlightController {
    @Autowired private FlightService flightService;

    @GetMapping
    public ResponseEntity<Page<Flight>> getAllFlights(
            @RequestParam(required = false) String keyword, // Gộp tìm kiếm
            @RequestParam(required = false) String origin,
            @RequestParam(required = false) String destination,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            // --- THAY ĐỔI: KHOẢNG GIÁ ---
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @PageableDefault(sort = "departureTime", direction = Sort.Direction.ASC) Pageable pageable
    ) {
        return ResponseEntity.ok(flightService.getFlights(keyword, origin, destination, startDate, endDate, minPrice, maxPrice, pageable));
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> getFlightById(@PathVariable Long id) {
        try {
            Flight flight = flightService.getFlightById(id);
            return ResponseEntity.ok(flight);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // API lấy gợi ý số hiệu chuyến bay
    @GetMapping("/suggestions/numbers")
    public ResponseEntity<List<String>> getFlightNumberSuggestions() {
        return ResponseEntity.ok(flightService.getAllFlightNumbers());
    }

    // Các method create, update, delete giữ nguyên...
    @PostMapping
    public ResponseEntity<?> create(@RequestBody FlightRequestDTO req) {
        try { return ResponseEntity.ok(flightService.createFlight(req)); }
        catch (RuntimeException e) { return ResponseEntity.badRequest().body(e.getMessage()); }
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody FlightRequestDTO req) {
        try { return ResponseEntity.ok(flightService.updateFlight(id, req)); }
        catch (RuntimeException e) { return ResponseEntity.badRequest().body(e.getMessage()); }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try { flightService.cancelFlight(id); return ResponseEntity.ok("OK"); }
        catch (RuntimeException e) { return ResponseEntity.badRequest().body(e.getMessage()); }
    }
}