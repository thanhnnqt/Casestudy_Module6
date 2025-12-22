package org.example.case_study_module_6.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "flights",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"flight_number", "departure_time"})
        }
)
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Flight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "flight_number", length = 20)
    private String flightNumber;

    @ManyToOne
    @JoinColumn(name = "aircraft_id", nullable = false)
    private Aircraft aircraft;

    @ManyToOne
    @JoinColumn(name = "departure_airport_id", nullable = false)
    private Airport departureAirport;

    @ManyToOne
    @JoinColumn(name = "arrival_airport_id", nullable = false)
    private Airport arrivalAirport;

    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;

    private BigDecimal basePrice;

    @Enumerated(EnumType.STRING)
    private FlightStatus status;

//    public enum FlightStatus {
//        SCHEDULED, DELAYED, IN_FLIGHT, CANCELLED, COMPLETED
//    }
}



