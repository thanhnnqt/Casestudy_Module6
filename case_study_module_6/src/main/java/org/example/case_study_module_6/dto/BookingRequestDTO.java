package org.example.case_study_module_6.dto;

import lombok.Data;
import org.example.case_study_module_6.enums.PaymentMethod;

import java.util.List;

@Data
public class BookingRequestDTO {
    private Long flightId;
    private String contactEmail;

    private PaymentMethod paymentMethod;

    private List<PassengerDTO> passengers;
}
