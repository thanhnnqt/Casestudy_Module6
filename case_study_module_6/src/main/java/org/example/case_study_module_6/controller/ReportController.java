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
            @RequestParam String view, // 👈 BẮT BUỘC PHẢI CÓ
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate compareStart,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate compareEnd
    ) {
        return ResponseEntity.ok(
                reportService.compareReport(type, view, start, end, compareStart, compareEnd)
        );
    }


    @GetMapping("/employee-performance")
    public ResponseEntity<?> employeePerformance(
            @RequestParam String view,   // MONTH | QUARTER | YEAR

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate start,

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate end,

            @RequestParam(required = false)
            Integer year
    ) {

        switch (view.toUpperCase()) {
            case "MONTH":
                return ResponseEntity.ok(
                        reportService.employeePerformanceByMonth(start, end)
                );

            case "YEAR":
                return ResponseEntity.ok(
                        reportService.employeePerformanceByYear(year)
                );

            case "QUARTER":
                return ResponseEntity.ok(
                        reportService.employeePerformanceByQuarter(year)
                );

            default:
                return ResponseEntity.badRequest()
                        .body("Invalid view type");
        }
    }

    @GetMapping("/airline-performance")
    public ResponseEntity<?> airlinePerformance(
            @RequestParam String view,   // MONTH | QUARTER | YEAR

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate start,

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate end,

            @RequestParam(required = false)
            Integer year
    ) {

        switch (view.toUpperCase()) {
            case "MONTH":
                return ResponseEntity.ok(
                        reportService.airlineRevenueByMonth(start, end)
                );

            case "YEAR":
                return ResponseEntity.ok(
                        reportService.airlineRevenueByYear(year)
                );

            case "QUARTER":
                return ResponseEntity.ok(
                        reportService.airlineRevenueByQuarter(year)
                );

            default:
                return ResponseEntity.badRequest()
                        .body("Invalid view type");
        }
    }



}
