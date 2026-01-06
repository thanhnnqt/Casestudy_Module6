package org.example.case_study_module_6.service;

import org.example.case_study_module_6.dto.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface IReportService {
    RevenueDTO compareReport(
            String type,
            String view,
            LocalDate start,
            LocalDate end,
            LocalDate compareStart,
            LocalDate compareEnd
    );

    EmployeePieChartDTO employeePerformanceByMonth(
            LocalDate start,
            LocalDate end
    );

    EmployeePieChartDTO employeePerformanceByYear(
            int year
    );

    List<EmployeePieChartDTO> employeePerformanceByQuarter(
            int year
    );

    AirlinePieChartDTO airlineRevenueByMonth(LocalDate start, LocalDate end);

    AirlinePieChartDTO airlineRevenueByYear(int year);

    List<AirlinePieChartDTO> airlineRevenueByQuarter(int year);
}
