package org.example.case_study_module_6.repository;

import org.example.case_study_module_6.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface IBookingRepository extends JpaRepository<Booking, Long> {
    Optional<Booking> findByBookingCode(String bookingCode);
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