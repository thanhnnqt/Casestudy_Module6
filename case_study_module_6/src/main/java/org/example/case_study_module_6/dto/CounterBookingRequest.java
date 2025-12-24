package org.example.case_study_module_6.dto;

import lombok.Data;
import org.example.case_study_module_6.enums.SeatClass;

@Data
public class CounterBookingRequest {
    private Long flightId;
    private SeatClass seatClass;
    private int quantity;

    // --- SỬA LẠI TÊN BIẾN CHO KHỚP FRONTEND ---
    private String contactName;   // Lúc trước là customerName -> Sửa thành contactName
    private String contactEmail;  // Lúc trước là email -> Sửa thành contactEmail
    // ------------------------------------------
}