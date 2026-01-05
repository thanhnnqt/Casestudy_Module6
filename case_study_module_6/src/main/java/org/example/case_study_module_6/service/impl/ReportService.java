package org.example.case_study_module_6.service.impl;

import org.example.case_study_module_6.dto.*;
import org.example.case_study_module_6.repository.IBookingRepository;
import org.example.case_study_module_6.repository.ITicketRepository;
import org.example.case_study_module_6.service.IReportService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
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
    public Map<String, Object> compareReport(
            String type,
            LocalDate start,
            LocalDate end,
            LocalDate compareStart,
            LocalDate compareEnd
    ) {

        // ✅ ĐẶT Ở ĐÂY
        boolean noCompare = compareStart == null || compareEnd == null;

        if (type.equalsIgnoreCase("revenue")) {

            double main = bookingRepo.getTotalRevenue(
                    start.atStartOfDay(),
                    end.atTime(23, 59, 59)
            );

            if (noCompare) {
                return Map.of(
                        "labels", List.of("Doanh thu"),
                        "main", List.of(main),
                        "compare", List.of(),
                        "unit", "VND"
                );
            }

            double compare = bookingRepo.getTotalRevenue(
                    compareStart.atStartOfDay(),
                    compareEnd.atTime(23, 59, 59)
            );

            return Map.of(
                    "labels", List.of("Doanh thu"),
                    "main", List.of(main),
                    "compare", List.of(compare),
                    "unit", "VND"
            );
        }

        if (type.equalsIgnoreCase("employee")) {

            List<Object[]> main =
                    bookingRepo.getTopEmployees(startOf(start), endOf(end));

            // ✅ KHÔNG SO SÁNH
            if (noCompare) {
                return singleTop(main, "tickets");
            }

            // ✅ SO SÁNH
            List<Object[]> compare =
                    bookingRepo.getTopEmployees(startOf(compareStart), endOf(compareEnd));

            return compareTop(main, compare, "tickets");
        }


        if (type.equalsIgnoreCase("airline")) {

            List<Object[]> main =
                    bookingRepo.getTopAirlines(startOf(start), endOf(end));

            // ✅ KHÔNG SO SÁNH
            if (noCompare) {
                return singleTop(main, "tickets");
            }

            // ✅ SO SÁNH
            List<Object[]> compare =
                    bookingRepo.getTopAirlines(startOf(compareStart), endOf(compareEnd));

            return compareTop(main, compare, "tickets");
        }


        return Map.of("message", "Invalid report type");
    }


    @Override
    public CompareResponseDTO compareEmployeePerformance(LocalDate start, LocalDate end, LocalDate compareStart, LocalDate compareEnd) {
        return null;
    }

    @Override
    public TopChartDTO getTopEmployees(LocalDate start, LocalDate end) {
        return null;
    }

    @Override
    public TopChartDTO getTopAirlines(LocalDate start, LocalDate end) {
        return null;
    }

    private Map<String, Object> compareTop(List<Object[]> main, List<Object[]> compare, String unit) {

        Map<String, Double> mainMap = toMap(main);
        Map<String, Double> compareMap = toMap(compare);

        // Lấy toàn bộ top theo kỳ chính vẫn hiển thị đủ 3
        List<String> labels = mainMap.keySet().stream().toList();

        if (labels.isEmpty()) {
            return Map.of("message", "Không có dữ liệu so sánh");
        }

        List<Double> mainValues = labels.stream()
                .map(mainMap::get)
                .toList();

        List<Double> compareValues = labels.stream()
                .map(label -> compareMap.getOrDefault(label, 0.0))
                .toList();

        return Map.of(
                "labels", labels,
                "main", mainValues,
                "compare", compareValues,
                "unit", unit
        );
    }

    private Map<String, Double> toMap(List<Object[]> rows) {
        return rows.stream()
                .collect(Collectors.toMap(
                        r -> (String) r[0],
                        r -> ((Number) r[1]).doubleValue()
                ));
    }
}
