package org.example.case_study_module_6.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class SeatConfigDTO {
    private String seatClass; // "ECONOMY", "BUSINESS"
    private BigDecimal price;
    private Integer totalSeats;
}