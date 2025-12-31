package org.example.case_study_module_6.controller;

import lombok.RequiredArgsConstructor;
import org.example.case_study_module_6.dto.AirlineRevenueDTO;
import org.example.case_study_module_6.dto.RevenueDTO;
import org.example.case_study_module_6.dto.SalesPerformanceDTO;
import org.example.case_study_module_6.service.IReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reports")
public class ReportController {

    private final IReportService reportService;

    // A) Doanh thu theo thời gian
    @GetMapping("/revenue")
    public ResponseEntity<List<RevenueDTO>> getRevenue(
            @RequestParam LocalDate start,
            @RequestParam LocalDate end
    ) {
        return ResponseEntity.ok(reportService.getRevenue(start, end));
    }

    // B) Top nhân viên theo doanh thu
    @GetMapping("/sales-performance")
    public ResponseEntity<List<SalesPerformanceDTO>> getSalesPerformance(
            @RequestParam LocalDate start,
            @RequestParam LocalDate end
    ) {
        return ResponseEntity.ok(reportService.getSalesPerformance(start, end));
    }

    // C) Doanh thu theo hãng bay
    @GetMapping("/airline-revenue")
    public ResponseEntity<List<AirlineRevenueDTO>> getAirlineRevenue(
            @RequestParam LocalDate start,
            @RequestParam LocalDate end
    ) {
        return ResponseEntity.ok(reportService.getAirlineRevenue(start, end));
    }
}
