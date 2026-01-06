package org.example.case_study_module_6.service.impl;

import org.example.case_study_module_6.dto.*;
import org.example.case_study_module_6.repository.IBookingRepository;
import org.example.case_study_module_6.repository.ITicketRepository;
import org.example.case_study_module_6.service.IReportService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.function.BiFunction;
import java.util.stream.Collectors;

@Service
public class ReportService implements IReportService {

    private final IBookingRepository bookingRepo;

    public ReportService(IBookingRepository bookingRepo) {
        this.bookingRepo = bookingRepo;
    }

    private LocalDateTime startOf(LocalDate d) {
        return d.atStartOfDay();
    }

    private LocalDateTime endOf(LocalDate d) {
        return d.atTime(23, 59, 59);
    }

    private Map<String, Object> singleTop(List<Object[]> rows, String unit) {

        if (rows == null || rows.isEmpty()) {
            return Map.of("message", "Không có dữ liệu");
        }

        List<String> labels = rows.stream()
                .map(r -> (String) r[0])
                .toList();

        List<Double> values = rows.stream()
                .map(r -> ((Number) r[1]).doubleValue())
                .toList();

        return Map.of(
                "labels", labels,
                "main", values,
                "compare", List.of(),
                "unit", unit
        );
    }

    @Override
    public RevenueDTO compareReport(
            String type,
            String view,
            LocalDate start,
            LocalDate end,
            LocalDate compareStart,
            LocalDate compareEnd
    ) {
        if (!"revenue".equals(type)) {
            throw new IllegalArgumentException("Unsupported report type");
        }

        List<String> labels = new ArrayList<>();
        List<Long> main = new ArrayList<>();
        List<Long> compare = new ArrayList<>();

        List<Object[]> mainRaw;

        switch (view) {
            case "MONTH" -> {
                mainRaw = bookingRepo.revenueByDay(start, end);
                mainRaw.forEach(r -> {
                    labels.add("Ngày " + r[0]);
                    main.add(((Number) r[1]).longValue());
                });
            }

            case "YEAR" -> {
                mainRaw = bookingRepo.revenueByMonth(start, end);
                mainRaw.forEach(r -> {
                    labels.add("Tháng " + r[0]);
                    main.add(((Number) r[1]).longValue());
                });
            }

            case "QUARTER" -> {
                mainRaw = bookingRepo.revenueByQuarter(start, end);
                mainRaw.forEach(r -> {
                    labels.add("Quý " + r[0]);
                    main.add(((Number) r[1]).longValue());
                });
            }

            default -> throw new IllegalArgumentException("Invalid view: " + view);
        }

        return new RevenueDTO(labels, main, compare, "VND");
    }


    private <T> List<T> buildTop3(
            List<Object[]> raw,
            BiFunction<String, Long, T> mapper
    ) {
        List<T> result = new ArrayList<>();
        long other = 0;

        for (int i = 0; i < raw.size(); i++) {
            String name = (String) raw.get(i)[0];
            long value = ((Number) raw.get(i)[1]).longValue();

            if (i < 3) {
                result.add(mapper.apply(name, value));
            } else {
                other += value;
            }
        }

        if (other > 0) {
            result.add(mapper.apply("Khác", other));
        }

        return result;
    }

    @Override
    public EmployeePieChartDTO employeePerformanceByMonth(LocalDate start, LocalDate end) {
        List<Object[]> raw = bookingRepo.countBookingByEmployee(
                startOf(start),
                endOf(end)
        );

        return new EmployeePieChartDTO(
                "Tháng " + start.getMonthValue(),
                buildTop3(raw, EmployeePieItemDTO::new)
        );
    }

    @Override
    public EmployeePieChartDTO employeePerformanceByYear(int year) {
        LocalDate start = LocalDate.of(year, 1, 1);
        LocalDate end = LocalDate.of(year, 12, 31);

        List<Object[]> raw = bookingRepo.countBookingByEmployee(
                startOf(start),
                endOf(end)
        );

        return new EmployeePieChartDTO(
                "Năm " + year,
                buildTop3(raw, EmployeePieItemDTO::new)
        );
    }

    @Override
    public List<EmployeePieChartDTO> employeePerformanceByQuarter(int year) {
        List<EmployeePieChartDTO> result = new ArrayList<>();

        for (int q = 1; q <= 4; q++) {
            LocalDate start = LocalDate.of(year, (q - 1) * 3 + 1, 1);
            LocalDate end = start.plusMonths(3).minusDays(1);

            List<Object[]> raw = bookingRepo.countBookingByEmployee(
                    startOf(start),
                    endOf(end)
            );

            result.add(
                    new EmployeePieChartDTO(
                            "Quý " + q,
                            buildTop3(raw, EmployeePieItemDTO::new)
                    )
            );
        }
        return result;
    }

    @Override
    public AirlinePieChartDTO airlineRevenueByMonth(LocalDate start, LocalDate end) {

        List<Object[]> raw = bookingRepo.revenueByAirline(
                startOf(start),
                endOf(end)
        );

        return new AirlinePieChartDTO(
                "Tháng " + start.getMonthValue(),
                buildTop3(raw, AirlinePieItemDTO::new)
        );
    }

    @Override
    public AirlinePieChartDTO airlineRevenueByYear(int year) {

        LocalDate start = LocalDate.of(year, 1, 1);
        LocalDate end = LocalDate.of(year, 12, 31);

        List<Object[]> raw = bookingRepo.revenueByAirline(
                startOf(start),
                endOf(end)
        );

        return new AirlinePieChartDTO(
                "Năm " + year,
                buildTop3(raw, AirlinePieItemDTO::new)
        );
    }

    @Override
    public List<AirlinePieChartDTO> airlineRevenueByQuarter(int year) {

        List<AirlinePieChartDTO> result = new ArrayList<>();

        for (int q = 1; q <= 4; q++) {

            LocalDate start = LocalDate.of(year, (q - 1) * 3 + 1, 1);
            LocalDate end = start.plusMonths(3).minusDays(1);

            List<Object[]> raw = bookingRepo.revenueByAirline(
                    startOf(start),
                    endOf(end)
            );

            result.add(
                    new AirlinePieChartDTO(
                            "Quý " + q,
                            buildTop3(raw, AirlinePieItemDTO::new)
                    )
            );
        }

        return result;
    }
}
