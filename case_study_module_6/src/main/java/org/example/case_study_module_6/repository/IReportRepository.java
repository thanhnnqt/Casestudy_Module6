package org.example.case_study_module_6.repository;

import org.example.case_study_module_6.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface IReportRepository extends JpaRepository<Booking, Long> {
    @Query("""
    SELECT DATE(b.bookingDate), SUM(b.totalAmount)
    FROM Booking b
    WHERE b.paymentStatus = 'PAID'
      AND b.bookingDate BETWEEN :start AND :end
    GROUP BY DATE(b.bookingDate)
""")
    List<Object[]> getRevenueByDateRange(LocalDateTime start, LocalDateTime end);

    @Query("""
    SELECT u.fullName, SUM(b.totalAmount)
    FROM Booking b
    JOIN User u ON u.id = b.createdBySales.id
    WHERE b.paymentStatus = 'PAID'
      AND b.bookingDate BETWEEN :start AND :end
    GROUP BY u.fullName
    ORDER BY SUM(b.totalAmount) DESC
""")
    List<Object[]> getTopSalesPerformance(LocalDateTime start, LocalDateTime end);

}
