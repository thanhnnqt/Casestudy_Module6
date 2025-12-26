package org.example.case_study_module_6.dto;

import lombok.Data;
import org.example.case_study_module_6.enums.TripType;
import java.util.List;

@Data
public class BookingRequestDTO {
    private Long flightId;
    private Long returnFlightId;
    private TripType tripType;

    private String seatClassOut;
    private String seatClassIn;

    private Long accountId;
    private String contactEmail;
    private String contactName;
    private String contactPhone;
    private String paymentMethod;

    // --- THAY ĐỔI Ở ĐÂY ---
    private List<PassengerDTO> passengersOut; // Danh sách khách chiều đi
    private List<PassengerDTO> passengersIn;  // Danh sách khách chiều về (có thể rỗng)
}