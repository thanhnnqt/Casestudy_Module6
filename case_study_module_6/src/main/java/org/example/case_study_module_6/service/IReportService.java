package org.example.case_study_module_6.service;

import org.example.case_study_module_6.dto.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface IReportService {
    List<RevenueDTO> getRevenue(LocalDate start, LocalDate end);
    List<SalesPerformanceDTO> getSalesPerformance(LocalDate start, LocalDate end);
    List<AirlineRevenueDTO> getAirlineRevenue(LocalDate start, LocalDate end);
    Map<String, Object> compareReport(String type,
                                      LocalDate start,
                                      LocalDate end,
                                      LocalDate compareStart,
                                      LocalDate compareEnd);
    CompareResponseDTO compareEmployeePerformance(LocalDate start, LocalDate end,
                                                  LocalDate compareStart, LocalDate compareEnd);
    TopChartDTO getTopEmployees(LocalDate start, LocalDate end);
    TopChartDTO getTopAirlines(LocalDate start, LocalDate end);
}
