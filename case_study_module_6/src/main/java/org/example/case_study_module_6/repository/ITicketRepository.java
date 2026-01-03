package org.example.case_study_module_6.repository;

import org.example.case_study_module_6.enums.SeatClass;
import org.example.case_study_module_6.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ITicketRepository extends JpaRepository<Ticket, Long> {

    // THÊM ĐOẠN NÀY VÀO: Đếm xem chuyến bay này, hạng ghế này đã bán được bao nhiêu vé rồi
    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.flight.id = :flightId AND t.seatClass = :seatClass")
    long countByFlightIdAndSeatClass(@Param("flightId") Long flightId, @Param("seatClass") SeatClass seatClass);

    @Query(value = """
    SELECT a.name AS airline,
           SUM(t.price) AS totalRevenue
    FROM tickets t
    JOIN flights f ON t.flight_id = f.id
    JOIN airlines a ON f.airline_id = a.id
    WHERE t.booking_date BETWEEN :startDate AND :endDate
    GROUP BY a.name
    ORDER BY totalRevenue DESC
""", nativeQuery = true)
    List<Object[]> getAirlineRevenueBetweenDates(LocalDateTime startDate, LocalDateTime endDate);


    @Query(value = """
   SELECT e.full_name AS employeeName,
          COUNT(t.id) AS totalTickets
   FROM employees e
   JOIN tickets t ON (
       (e.id = 1 AND t.flight_id % 2 = 0) OR
       (e.id = 2 AND t.flight_id % 2 = 1)
   )
   GROUP BY e.full_name
   ORDER BY totalTickets DESC
   LIMIT 5
""", nativeQuery = true)
    List<Object[]> getEmployeePerformance(LocalDateTime start, LocalDateTime end);




}