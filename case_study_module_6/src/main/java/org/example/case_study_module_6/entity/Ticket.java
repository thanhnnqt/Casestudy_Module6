package org.example.case_study_module_6.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import org.example.case_study_module_6.enums.SeatClass;
import org.example.case_study_module_6.enums.TicketStatus;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Data
@Table(name = "tickets")
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ticket_number", unique = true)
    private String ticketNumber; // Mã vé (khác mã đặt chỗ)

    @Column(name = "passenger_name")
    private String passengerName;

    @Enumerated(EnumType.STRING)
    @Column(name = "seat_class")
    private SeatClass seatClass;

    private BigDecimal price; // Giá vé lúc mua

    // Quan hệ với Booking
    @ManyToOne
    @JoinColumn(name = "booking_id")
    @JsonBackReference
    private Booking booking;


    @ManyToOne
    @JoinColumn(name = "flight_id")
    private Flight flight;

    @Enumerated(EnumType.STRING)
    private TicketStatus status;
}