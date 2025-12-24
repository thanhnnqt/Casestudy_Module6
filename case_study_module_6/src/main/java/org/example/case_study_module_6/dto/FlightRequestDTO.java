package org.example.case_study_module_6.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class FlightRequestDTO {
    private String flightNumber;
    private Integer aircraftId;
    private Integer departureAirportId;
    private Integer arrivalAirportId;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;

    // THÊM MỚI: Trường này để hứng trạng thái khi Update
    private String status;

    private List<SeatConfigDTO> seatConfigs;
}