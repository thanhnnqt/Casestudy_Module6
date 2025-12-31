package org.example.case_study_module_6.service.impl;

import org.example.case_study_module_6.dto.AirlineRevenueDTO;
import org.example.case_study_module_6.dto.RevenueDTO;
import org.example.case_study_module_6.dto.SalesPerformanceDTO;
import org.example.case_study_module_6.repository.IBookingRepository;
import org.example.case_study_module_6.repository.ITicketRepository;
import org.example.case_study_module_6.service.IReportService;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDate;

import java.util.List;

@Service
public class ReportService implements IReportService {
    private final IBookingRepository bookingRepo;
    private final ITicketRepository ticketRepo;

    public ReportService(IBookingRepository bookingRepo, ITicketRepository ticketRepo) {
        this.bookingRepo = bookingRepo;
        this.ticketRepo = ticketRepo;
    }

    public List<RevenueDTO> getRevenue(LocalDate start, LocalDate end) {
        return bookingRepo.getRevenueByDateRange(start.atStartOfDay(), end.atTime(23,59,59))
                .stream()
                .map(r -> new RevenueDTO(((Date) r[0]).toLocalDate(), ((Number) r[1]).doubleValue()))
                .toList();
    }

    public List<SalesPerformanceDTO> getSalesPerformance(LocalDate start, LocalDate end) {
        return bookingRepo.getTopSalesPerformance(start.atStartOfDay(), end.atTime(23,59,59))
                .stream()
                .map(r -> new SalesPerformanceDTO((String) r[0], ((Number) r[1]).doubleValue()))
                .toList();
    }

    public List<AirlineRevenueDTO> getAirlineRevenue(LocalDate start, LocalDate end) {
        return ticketRepo.getAirlineRevenueBetweenDates(start.atStartOfDay(), end.atTime(23,59,59))
                .stream()
                .map(r -> new AirlineRevenueDTO((String) r[0], ((Number) r[1]).doubleValue()))
                .toList();
    }
}
