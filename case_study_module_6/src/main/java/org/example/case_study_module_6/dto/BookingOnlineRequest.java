package org.example.case_study_module_6.dto;

import lombok.Data;
import java.util.List;

@Data
public class BookingOnlineRequest {

    private Long flightId;
    private Long returnFlightId;
    private String tripType;

    private String seatClassOut;
    private String seatClassIn;

    private String contactName;
    private String contactEmail;
    private String contactPhone;

    private String paymentMethod; // VNPAY
    private Long totalAmount;

    private List<PassengerDTO> passengers;
}