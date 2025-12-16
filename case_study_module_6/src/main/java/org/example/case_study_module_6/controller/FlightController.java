package org.example.case_study_module_6.controller;
import org.example.case_study_module_6.entity.Flight;
import org.example.case_study_module_6.service.FlightService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/flights")
@CrossOrigin(origins = "http://localhost:5173")
public class FlightController {

    @Autowired
    private FlightService flightService;


    @GetMapping
    public ResponseEntity<Page<Flight>> getAllFlights(
            @RequestParam(required = false) String airline,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime departureTime,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("departureTime").ascending());
        Page<Flight> flights = flightService.getFlights(airline, departureTime, maxPrice, pageable);
        return ResponseEntity.ok(flights);
    }


    @GetMapping("/{id}")
    public ResponseEntity<Flight> getFlightById(@PathVariable Long id) {
        return ResponseEntity.ok(flightService.getFlightById(id));
    }

    @PostMapping
    public ResponseEntity<?> createFlight(@RequestBody Flight flight) {
        try {
            return ResponseEntity.ok(flightService.createFlight(flight));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<?> updateFlight(@PathVariable Long id, @RequestBody Flight flight) {
        try {
            return ResponseEntity.ok(flightService.updateFlightTime(id, flight));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFlight(@PathVariable Long id) {
        try {
            flightService.cancelFlight(id);
            return ResponseEntity.ok("Đã hủy chuyến bay thành công.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}