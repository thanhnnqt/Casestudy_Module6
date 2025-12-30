package org.example.case_study_module_6.dto;

import lombok.Data;
import org.example.case_study_module_6.enums.TripType;
import java.util.List;

@Data
public class OnlineBookingRequest {
    private Long flightId;          // Chuyến đi (Bắt buộc)
    private Long returnFlightId;    // Chuyến về (Tùy chọn - Có thể null)
    private TripType tripType;      // ONE_WAY hoặc ROUND_TRIP

    private String seatClassOut;    // Hạng ghế chiều đi
    private String seatClassIn;     // Hạng ghế chiều về (Có thể null)

    // Thông tin người liên hệ (Contact)
    private String contactName;
    private String contactEmail;
    private String contactPhone;
    private String paymentMethod;

    // Danh sách hành khách (Dùng DTO chi tiết mới)
    private List<
            OnlinePassengerDTO> passengers;
}