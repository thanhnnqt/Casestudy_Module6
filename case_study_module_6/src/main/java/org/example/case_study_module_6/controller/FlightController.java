    package org.example.case_study_module_6.controller;

    import org.example.case_study_module_6.dto.FlightRequestDTO;
    import org.example.case_study_module_6.entity.Flight;
    import org.example.case_study_module_6.service.impl.FlightService;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.data.domain.Page;
    import org.springframework.data.domain.Pageable;
    import org.springframework.data.domain.Sort;
    import org.springframework.data.web.PageableDefault;
    import org.springframework.format.annotation.DateTimeFormat;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;

    import java.math.BigDecimal;
    import java.time.LocalDate;
    import java.util.List;

    @RestController
    @RequestMapping("/api/flights")
    @CrossOrigin(origins = "*")
    public class FlightController {

        @Autowired private FlightService flightService;

        @GetMapping
        public ResponseEntity<Page<Flight>> getAllFlights(
                @RequestParam(required = false) String keyword,
                @RequestParam(required = false) String origin,
                @RequestParam(required = false) String destination,
                @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
                @RequestParam(required = false) BigDecimal minPrice,
                @RequestParam(required = false) BigDecimal maxPrice,
                @RequestParam(required = false) String status, // THÊM MỚI
                @PageableDefault(sort = "departureTime", direction = Sort.Direction.ASC, size = 10) Pageable pageable
        ) {
            return ResponseEntity.ok(flightService.getFlights(
                    keyword, origin, destination, startDate, endDate, minPrice, maxPrice, status, pageable));
        }

        @GetMapping("/{id}")
        public ResponseEntity<?> getFlightById(@PathVariable Long id) {
            return ResponseEntity.ok(flightService.getFlightById(id));
        }

        @GetMapping("/suggestions/numbers")
        public ResponseEntity<List<String>> getFlightNumberSuggestions() {
            return ResponseEntity.ok(flightService.getAllFlightNumbers());
        }

        @PostMapping
        public ResponseEntity<?> create(@RequestBody FlightRequestDTO req) {
            try {
                return ResponseEntity.ok(flightService.createFlight(req));
            } catch (RuntimeException e) {
                return ResponseEntity.badRequest().body(e.getMessage());
            }
        }

        @PutMapping("/{id}")
        public ResponseEntity<?> update(@PathVariable Long id, @RequestBody FlightRequestDTO req) {
            try {
                return ResponseEntity.ok(flightService.updateFlight(id, req));
            } catch (RuntimeException e) {
                return ResponseEntity.badRequest().body(e.getMessage());
            }
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<?> delete(@PathVariable Long id) {
            try {
                flightService.cancelFlight(id);
                return ResponseEntity.ok("Đã hủy chuyến bay thành công");
            } catch (RuntimeException e) {
                return ResponseEntity.badRequest().body(e.getMessage());
            }
        }

        // --- BỔ SUNG: API tìm kiếm theo ngày cụ thể ---
        @GetMapping("/search-by-date")
        public ResponseEntity<Page<Flight>> getFlightsByDate(
                @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
                @RequestParam(required = false) String origin,      // Thêm cái này
                @RequestParam(required = false) String destination, // Thêm cái này
                @RequestParam(required = false) String status,
                @PageableDefault(sort = "departureTime", direction = Sort.Direction.ASC, size = 10) Pageable pageable
        ) {
            // Gọi Service với đầy đủ tham số
            return ResponseEntity.ok(flightService.getFlightsBySpecificDate(date, origin, destination, status, pageable));
        }
    }

