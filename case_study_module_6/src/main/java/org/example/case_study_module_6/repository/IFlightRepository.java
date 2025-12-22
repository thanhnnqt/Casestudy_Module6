package org.example.case_study_module_6.repository;



import org.example.case_study_module_6.entity.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface IFlightRepository extends JpaRepository<Flight, Long>, JpaSpecificationExecutor<Flight> {

    // Query kiểm tra trùng lịch:
    // Tìm các chuyến bay của máy bay X, chưa bị hủy
    boolean existsByFlightNumberAndDepartureTime(String flightNumber, LocalDateTime departureTime);
    // Mà thời gian bay mới GIAO NHAU với thời gian bay cũ
    // (StartA < EndB) AND (EndA > StartB)
    @Query("SELECT COUNT(f) FROM Flight f WHERE f.aircraft.id = :aircraftId " +
            "AND f.status != org.example.case_study_module_6.entity.FlightStatus.CANCELLED " +
            "AND f.id != :currentFlightId " + // Bỏ qua chính nó khi sửa
            "AND (:newStart < f.arrivalTime AND :newEnd > f.departureTime)")
    long countConflictingFlights(@Param("aircraftId") Integer aircraftId,
                                 @Param("currentFlightId") Long currentFlightId,
                                 @Param("newStart") LocalDateTime newStart,
                                 @Param("newEnd") LocalDateTime newEnd);

    // API MỚI: Lấy danh sách tất cả số hiệu chuyến bay để làm gợi ý tìm kiếm
    @Query("SELECT DISTINCT f.flightNumber FROM Flight f")
    List<String> findDistinctFlightNumbers();
}
