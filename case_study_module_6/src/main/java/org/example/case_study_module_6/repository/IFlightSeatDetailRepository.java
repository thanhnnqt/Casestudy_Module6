package org.example.case_study_module_6.repository;

import org.example.case_study_module_6.entity.FlightSeatDetail;
import org.example.case_study_module_6.enums.SeatClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IFlightSeatDetailRepository extends JpaRepository<FlightSeatDetail, Long> {

    // THÊM ĐOẠN NÀY VÀO: Tìm chi tiết ghế để trừ số lượng
    @Query("SELECT fsd FROM FlightSeatDetail fsd WHERE fsd.flight.id = :flightId AND fsd.seatClass = :seatClass")
    Optional<FlightSeatDetail> findByFlightIdAndSeatClass(@Param("flightId") Long flightId, @Param("seatClass") SeatClass seatClass);
}