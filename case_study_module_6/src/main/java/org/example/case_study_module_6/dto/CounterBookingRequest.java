package org.example.case_study_module_6.dto;

import lombok.Data;
import java.util.List;

@Data
public class CounterBookingRequest {
    private Long flightId;

    // --- THÊM TRƯỜNG NÀY ---
    private String seatClass; // Ví dụ: "ECONOMY" hoặc "BUSINESS"
    // -------------------------

    private String contactName;
    private String contactEmail;
    private String contactPhone;

    private List<PassengerDTO> passengers; // Trong này chỉ còn fullName
}