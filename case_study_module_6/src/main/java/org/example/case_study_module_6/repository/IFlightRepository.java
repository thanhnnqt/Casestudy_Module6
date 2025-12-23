package org.example.case_study_module_6.repository;

import org.example.case_study_module_6.entity.Flight;
import org.example.case_study_module_6.entity.FlightStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface IFlightRepository extends JpaRepository<Flight, Long>, JpaSpecificationExecutor<Flight> {

    // 1. Query tìm kiếm nâng cao (Đã cập nhật)
    @Query("SELECT DISTINCT f FROM Flight f " +
            "JOIN f.seatDetails s " +
            "WHERE (:keyword IS NULL OR :keyword = '' OR f.flightNumber LIKE %:keyword% OR f.aircraft.airline.name LIKE %:keyword%) " +
            "AND (:origin IS NULL OR :origin = '' OR f.departureAirport.city LIKE %:origin% OR f.departureAirport.name LIKE %:origin%) " +
            "AND (:destination IS NULL OR :destination = '' OR f.arrivalAirport.city LIKE %:destination% OR f.arrivalAirport.name LIKE %:destination%) " +
            "AND (:startDate IS NULL OR CAST(f.departureTime AS date) >= :startDate) " +
            "AND (:endDate IS NULL OR CAST(f.departureTime AS date) <= :endDate) " +
            "AND (:minPrice IS NULL OR s.price >= :minPrice) " +
            "AND (:maxPrice IS NULL OR s.price <= :maxPrice) " +
            "AND (:status IS NULL OR f.status = :status)") // Thêm lọc status
    Page<Flight> searchFlights(@Param("keyword") String keyword,
                               @Param("origin") String origin,
                               @Param("destination") String destination,
                               @Param("startDate") LocalDate startDate,
                               @Param("endDate") LocalDate endDate,
                               @Param("minPrice") BigDecimal minPrice,
                               @Param("maxPrice") BigDecimal maxPrice,
                               @Param("status") FlightStatus status, // Tham số mới
                               Pageable pageable);

    // 2. Query kiểm tra trùng lịch (Giữ nguyên)
    @Query("SELECT COUNT(f) FROM Flight f WHERE f.aircraft.id = :aircraftId " +
            "AND f.status != org.example.case_study_module_6.entity.FlightStatus.CANCELLED " +
            "AND (:currentFlightId IS NULL OR f.id != :currentFlightId) " +
            "AND (:newStart < f.arrivalTime AND :newEnd > f.departureTime)")
    long countConflictingFlights(@Param("aircraftId") Integer aircraftId,
                                 @Param("currentFlightId") Long currentFlightId,
                                 @Param("newStart") LocalDateTime newStart,
                                 @Param("newEnd") LocalDateTime newEnd);

    // 3. Lấy danh sách số hiệu chuyến bay
    @Query("SELECT DISTINCT f.flightNumber FROM Flight f")
    List<String> findDistinctFlightNumbers();
}