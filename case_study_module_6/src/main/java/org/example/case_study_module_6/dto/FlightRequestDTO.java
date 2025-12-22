package org.example.case_study_module_6.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class FlightRequestDTO {
    private String flightNumber;
    private Integer aircraftId;
    private Integer departureAirportId;
    private Integer arrivalAirportId;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private BigDecimal basePrice;
    private String status;
}
