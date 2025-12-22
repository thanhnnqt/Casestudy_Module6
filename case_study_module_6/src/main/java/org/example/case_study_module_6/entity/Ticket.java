package org.example.case_study_module_6.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(
        name = "tickets",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"flight_id", "seat_number"})
        }
)
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String seatNumber;

    @Column(unique = true)
    private String ticketNumber;

    @Column(nullable = false)
    private String passengerName;

    private LocalDate passengerDob;

    private BigDecimal price;

    @ManyToOne
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @ManyToOne
    @JoinColumn(name = "flight_id", nullable = false)
    private Flight flight;

    @Enumerated(EnumType.STRING)
    private TicketStatus status = TicketStatus.BOOKED;

    public enum TicketStatus {
        BOOKED, CHECKED_IN, CANCELLED
    }
}

