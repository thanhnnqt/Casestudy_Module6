package org.example.case_study_module_6.dto;

import lombok.Data;
import java.util.List;

@Data
public class BookingRequestDTO {
    private Long flightId;
    private Long accountId;

    private String contactEmail;
    private String contactName;
    private String contactPhone;
    private String paymentMethod;
    private List<PassengerDTO> passengers;
}