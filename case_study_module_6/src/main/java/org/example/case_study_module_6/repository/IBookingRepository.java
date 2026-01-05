package org.example.case_study_module_6.repository;

import org.example.case_study_module_6.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface IBookingRepository extends JpaRepository<Booking, Long> {
    Optional<Booking> findByBookingCode(String bookingCode);
    List<Booking> findByContactEmailOrderByBookingDateDesc(String email);

    @Query(value = """
    SELECT CAST(b.booking_date AS DATE) AS bookingDate,
           SUM(b.total_amount) AS totalRevenue
    FROM bookings b
    WHERE b.booking_date BETWEEN :start AND :end
    GROUP BY CAST(b.booking_date AS DATE)
    ORDER BY bookingDate ASC
""", nativeQuery = true)
    List<Object[]> getRevenueByDateRange(@Param("start") LocalDateTime start,
                                         @Param("end") LocalDateTime end);


    @Query(value = """
    SELECT COALESCE(SUM(b.total_amount), 0)
    FROM bookings b
    WHERE b.booking_date BETWEEN :start AND :end
""", nativeQuery = true)
    Double getTotalRevenue(@Param("start") LocalDateTime start,
                           @Param("end") LocalDateTime end);


    @Query(value = """
    SELECT e.full_name,
           SUM(b.total_amount) AS totalRevenue
    FROM bookings b
    JOIN employees e ON b.created_by_sales_id = e.id
    WHERE b.booking_date BETWEEN :start AND :end
    GROUP BY e.full_name
    ORDER BY totalRevenue DESC
    LIMIT 5
""", nativeQuery = true)
    List<Object[]> getTopSalesPerformance(@Param("start") LocalDateTime start,
                                          @Param("end") LocalDateTime end);


    @Query(value = """
    SELECT al.name,
           SUM(b.total_amount)
    FROM bookings b
    JOIN flights f ON b.flight_id = f.id
    JOIN aircraft a ON f.aircraft_id = a.id
    JOIN airlines al ON a.airline_id = al.id
    WHERE b.booking_date BETWEEN :start AND :end
    GROUP BY al.name
    ORDER BY SUM(b.total_amount) DESC
""", nativeQuery = true)
    List<Object[]> getAirlineRevenue(@Param("start") LocalDateTime start,
                                     @Param("end") LocalDateTime end);


    @Query(value = """
    SELECT e.full_name AS employeeName,
           COUNT(b.id) AS totalBookings
    FROM bookings b
    JOIN employees e ON b.created_by_sales_id = e.id
    WHERE b.booking_date BETWEEN :start AND :end
    GROUP BY e.full_name
    ORDER BY totalBookings DESC
    LIMIT 3
""", nativeQuery = true)
    List<Object[]> getTopEmployees(LocalDateTime start, LocalDateTime end);

    @Query(value = """
    SELECT al.name AS airlineName,
           SUM(t.price) AS totalRevenue
    FROM tickets t
    JOIN bookings b ON t.booking_id = b.id
    JOIN flights f ON t.flight_id = f.id
    JOIN aircrafts ac ON f.aircraft_id = ac.id
    JOIN airlines al ON ac.airline_id = al.id
    WHERE b.booking_date BETWEEN :start AND :end
    GROUP BY al.name
    ORDER BY totalRevenue DESC
    LIMIT 3
""", nativeQuery = true)
    List<Object[]> getTopAirlines(LocalDateTime start, LocalDateTime end);




    @Query(value = """
    SELECT e.full_name AS employeeName,
           COUNT(*) AS totalBookings
    FROM bookings b
    JOIN employees e ON b.created_by_sales_id = e.id
    WHERE b.booking_date BETWEEN :start AND :end
    GROUP BY e.id, e.full_name
    ORDER BY totalBookings DESC
    LIMIT 3
""", nativeQuery = true)
    List<Object[]> getTop3Employees(LocalDateTime start, LocalDateTime end);


    @Query(value = """
    SELECT al.name AS airlineName,
           SUM(t.price) AS totalRevenue
    FROM tickets t
    JOIN bookings b ON t.booking_id = b.id
    JOIN flights f ON t.flight_id = f.id
    JOIN aircraft a ON f.aircraft_id = a.id
    JOIN airlines al ON a.airline_id = al.id
    WHERE b.booking_date BETWEEN :start AND :end
    GROUP BY al.id, al.name
    ORDER BY totalRevenue DESC
    LIMIT 3
""", nativeQuery = true)
    List<Object[]> getTop3Airlines(LocalDateTime start, LocalDateTime end);
    List<Booking> findByCustomerAccountIdOrderByBookingDateDesc(Long accountId);
}