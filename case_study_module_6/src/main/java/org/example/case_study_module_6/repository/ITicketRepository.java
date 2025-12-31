package org.example.case_study_module_6.repository;

import org.example.case_study_module_6.enums.SeatClass;
import org.example.case_study_module_6.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ITicketRepository extends JpaRepository<Ticket, Long> {

    // THÊM ĐOẠN NÀY VÀO: Đếm xem chuyến bay này, hạng ghế này đã bán được bao nhiêu vé rồi
    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.flight.id = :flightId AND t.seatClass = :seatClass")
    long countByFlightIdAndSeatClass(@Param("flightId") Long flightId, @Param("seatClass") SeatClass seatClass);

    @Query("""
    SELECT al.name, SUM(t.price)
    FROM Ticket t
    JOIN t.flight f
    JOIN f.aircraft ac
    JOIN ac.airline al
    WHERE t.status = 'BOOKED'
      AND f.departureTime BETWEEN :start AND :end
    GROUP BY al.name
    ORDER BY SUM(t.price) DESC
""")
    List<Object[]> getAirlineRevenueBetweenDates(LocalDateTime start, LocalDateTime end);
}