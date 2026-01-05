package org.example.case_study_module_6.controller;

import org.example.case_study_module_6.dto.AirlineRevenueDTO;
import org.example.case_study_module_6.dto.RevenueDTO;
import org.example.case_study_module_6.dto.SalesPerformanceDTO;
import org.example.case_study_module_6.dto.TopChartDTO;
import org.example.case_study_module_6.service.IReportService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final IReportService reportService;

    public ReportController(IReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/compare")
    public ResponseEntity<?> compareReport(
            @RequestParam String type,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate compareStart,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate compareEnd
    ) {
        return ResponseEntity.ok(
                reportService.compareReport(type, start, end, compareStart, compareEnd)
        );
    }

    @GetMapping("/top-employees")
    public ResponseEntity<TopChartDTO> getTopEmployees(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end
    ) {
        return ResponseEntity.ok(reportService.getTopEmployees(start, end));
    }


    @GetMapping("/top-airlines")
    public ResponseEntity<TopChartDTO> getTopAirlines(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end
    ) {
        return ResponseEntity.ok(reportService.getTopAirlines(start, end));
    }

}
