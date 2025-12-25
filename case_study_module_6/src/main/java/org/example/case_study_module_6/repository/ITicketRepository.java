package org.example.case_study_module_6.repository;

import org.example.case_study_module_6.enums.SeatClass;
import org.example.case_study_module_6.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ITicketRepository extends JpaRepository<Ticket, Long> {

    // THÊM ĐOẠN NÀY VÀO: Đếm xem chuyến bay này, hạng ghế này đã bán được bao nhiêu vé rồi
    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.flight.id = :flightId AND t.seatClass = :seatClass")
    long countByFlightIdAndSeatClass(@Param("flightId") Long flightId, @Param("seatClass") SeatClass seatClass);
}