package org.example.case_study_module_6.service;

import org.example.case_study_module_6.dto.AirlineRevenueDTO;
import org.example.case_study_module_6.dto.RevenueDTO;
import org.example.case_study_module_6.dto.SalesPerformanceDTO;

import java.time.LocalDate;
import java.util.List;

public interface IReportService {
    List<RevenueDTO> getRevenue(LocalDate start, LocalDate end);
    List<SalesPerformanceDTO> getSalesPerformance(LocalDate start, LocalDate end);
    List<AirlineRevenueDTO> getAirlineRevenue(LocalDate start, LocalDate end);
}
