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

        boolean existsByFlightNumber(String flightNumber);

        // 1. Query tìm kiếm nâng cao - SỬ DỤNG SUBQUERY để tránh duplicate
        @Query(value = "SELECT f FROM Flight f " +
                        "LEFT JOIN FETCH f.aircraft a " +
                        "LEFT JOIN FETCH a.airline al " +
                        "LEFT JOIN FETCH f.departureAirport " +
                        "LEFT JOIN FETCH f.arrivalAirport " +
                        "WHERE f.id IN (" +
                        "  SELECT DISTINCT f2.id FROM Flight f2 " +
                        "  JOIN f2.aircraft a2 " +
                        "  JOIN a2.airline al2 " +
                        "  JOIN f2.seatDetails s2 " +
                        "  WHERE (:keyword IS NULL OR :keyword = '' OR f2.flightNumber LIKE %:keyword% OR al2.name LIKE %:keyword%) "
                        +
                        "  AND (:origin IS NULL OR :origin = '' OR f2.departureAirport.city LIKE %:origin% OR f2.departureAirport.name LIKE %:origin% OR f2.departureAirport.code LIKE %:origin%) "
                        +
                        "  AND (:destination IS NULL OR :destination = '' OR f2.arrivalAirport.city LIKE %:destination% OR f2.arrivalAirport.name LIKE %:destination% OR f2.arrivalAirport.code LIKE %:destination%) "
                        +
                        "  AND (:startDate IS NULL OR CAST(f2.departureTime AS date) >= :startDate) " +
                        "  AND (:endDate IS NULL OR CAST(f2.departureTime AS date) <= :endDate) " +
                        "  AND (:minPrice IS NULL OR s2.price >= :minPrice) " +
                        "  AND (:maxPrice IS NULL OR s2.price <= :maxPrice) " +
                        "  AND (:status IS NULL OR f2.status = :status)" +
                        ")", countQuery = "SELECT COUNT(DISTINCT f.id) FROM Flight f " +
                                        "JOIN f.aircraft a " +
                                        "JOIN a.airline al " +
                                        "JOIN f.seatDetails s " +
                                        "WHERE (:keyword IS NULL OR :keyword = '' OR f.flightNumber LIKE %:keyword% OR al.name LIKE %:keyword%) "
                                        +
                                        "AND (:origin IS NULL OR :origin = '' OR f.departureAirport.city LIKE %:origin% OR f.departureAirport.name LIKE %:origin% OR f.departureAirport.code LIKE %:origin%) "
                                        +
                                        "AND (:destination IS NULL OR :destination = '' OR f.arrivalAirport.city LIKE %:destination% OR f.arrivalAirport.name LIKE %:destination% OR f.arrivalAirport.code LIKE %:destination%) "
                                        +
                                        "AND (:startDate IS NULL OR CAST(f.departureTime AS date) >= :startDate) " +
                                        "AND (:endDate IS NULL OR CAST(f.departureTime AS date) <= :endDate) " +
                                        "AND (:minPrice IS NULL OR s.price >= :minPrice) " +
                                        "AND (:maxPrice IS NULL OR s.price <= :maxPrice) " +
                                        "AND (:status IS NULL OR f.status = :status)")
        Page<Flight> searchFlights(@Param("keyword") String keyword,
                        @Param("origin") String origin,
                        @Param("destination") String destination,
                        @Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate,
                        @Param("minPrice") BigDecimal minPrice,
                        @Param("maxPrice") BigDecimal maxPrice,
                        @Param("status") FlightStatus status,
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

        // ---------------------------------------------------------
        // 4. (MỚI) Tìm kiếm chuyến bay chính xác theo ngày (Bỏ qua giờ phút)
        // Logic: Ép kiểu departureTime (ngày + giờ) về date (chỉ ngày) để so sánh
        @Query("SELECT f FROM Flight f " +
                        "WHERE CAST(f.departureTime AS date) = :searchDate " +
                        "AND (:origin IS NULL OR f.departureAirport.code = :origin) " + // Thêm dòng này
                        "AND (:destination IS NULL OR f.arrivalAirport.code = :destination) " + // Thêm dòng này
                        "AND (:status IS NULL OR f.status = :status)")
        Page<Flight> findByDepartureDate(@Param("searchDate") LocalDate searchDate,
                        @Param("origin") String origin, // Thêm tham số
                        @Param("destination") String destination, // Thêm tham số
                        @Param("status") FlightStatus status,
                        Pageable pageable);
}