package org.example.case_study_module_6.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.example.case_study_module_6.enums.SeatClass;
import org.example.case_study_module_6.enums.TicketStatus;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "tickets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "booking_id")
    @JsonIgnore // Tránh vòng lặp JSON khi xem vé
    private Booking booking;

    @ManyToOne
    @JoinColumn(name = "flight_id")
    private Flight flight;

    @Enumerated(EnumType.STRING)
    @Column(name = "seat_class")
    private SeatClass seatClass;

    private BigDecimal price;

    @Column(name = "passenger_dob")
    private LocalDate passengerDob;

    // --- 2 TRƯỜNG MỚI THÊM ---
    @Column(name = "seat_number")
    private String seatNumber; // Lưu mã ghế: A1, A2, B1...

    @Column(name = "passenger_name")
    private String passengerName; // Lưu tên khách đi vé này

    @Column(name = "ticket_number")
    private String ticketNumber; // Ví dụ: TIC-12345

    // Nếu ông chưa có Enum TicketStatus thì đổi dòng dưới thành String status;
    @Enumerated(EnumType.STRING)
    private TicketStatus status;
}