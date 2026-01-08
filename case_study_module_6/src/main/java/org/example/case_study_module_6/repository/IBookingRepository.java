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
                SELECT
                    DAY(b.paid_at) AS label,
                    SUM(b.total_amount) AS value
                FROM bookings b
                WHERE b.payment_status = 'PAID'
                  AND DATE(b.paid_at) BETWEEN :start AND :end
                GROUP BY DAY(b.paid_at)
                ORDER BY DAY(b.paid_at)
            """, nativeQuery = true)
    List<Object[]> revenueByDay(
            @Param("start") LocalDate start,
            @Param("end") LocalDate end
    );

    @Query(value = """
                SELECT
                    QUARTER(b.paid_at) AS label,
                    SUM(b.total_amount) AS value
                FROM bookings b
                WHERE b.payment_status = 'PAID'
                  AND b.paid_at BETWEEN :start AND :end
                GROUP BY QUARTER(b.paid_at)
                ORDER BY QUARTER(b.paid_at)
            """, nativeQuery = true)
    List<Object[]> revenueByQuarter(
            @Param("start") LocalDate start,
            @Param("end") LocalDate end
    );

    @Query(value = """
                SELECT
                    MONTH(b.paid_at) AS label,
                    SUM(b.total_amount) AS value
                FROM bookings b
                WHERE b.payment_status = 'PAID'
                  AND DATE(b.paid_at) BETWEEN :start AND :end
                GROUP BY MONTH(b.paid_at)
                ORDER BY MONTH(b.paid_at)
            """, nativeQuery = true)
    List<Object[]> revenueByMonth(
            @Param("start") LocalDate start,
            @Param("end") LocalDate end
    );

    @Query(value = """
                SELECT 
                    e.full_name,
                    COUNT(b.id) AS total
                FROM bookings b
                JOIN employees e ON b.created_by_sales_id = e.id
                WHERE b.status = 'PAID'
                  AND b.paid_at BETWEEN :startDateTime AND :endDateTime
                GROUP BY e.id, e.full_name
                ORDER BY total DESC
            """, nativeQuery = true)
    List<Object[]> countBookingByEmployee(
            @Param("startDateTime") LocalDateTime start,
            @Param("endDateTime") LocalDateTime end
    );

    @Query(value = """
                SELECT 
                    al.name AS airline_name,
                    SUM(b.total_amount) AS revenue
                FROM bookings b
                JOIN flights f ON b.flight_id = f.id
                JOIN aircrafts ac ON f.aircraft_id = ac.id
                JOIN airlines al ON ac.airline_id = al.id
                WHERE b.payment_status = 'PAID'
                  AND b.paid_at BETWEEN :start AND :end
                GROUP BY al.id, al.name
                ORDER BY revenue DESC
            """, nativeQuery = true)
    List<Object[]> revenueByAirline(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );


    @Query("SELECT b FROM Booking b LEFT JOIN FETCH b.tickets LEFT JOIN FETCH b.flight LEFT JOIN FETCH b.returnFlight")
    List<Booking> findAllWithTickets();

    List<Booking> findByCustomerAccountIdOrderByBookingDateDesc(Long accountId);
}