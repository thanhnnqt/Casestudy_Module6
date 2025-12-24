package org.example.case_study_module_6.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.example.case_study_module_6.enums.SeatClass;


import java.math.BigDecimal;

@Entity
@Table(name = "flight_seat_details")
@Getter
@Setter
public class FlightSeatDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "flight_id")
    @JsonBackReference // Ngắt vòng lặp JSON
    private Flight flight;

    @Enumerated(EnumType.STRING)
    @Column(name = "seat_class")
    private SeatClass seatClass;

    private BigDecimal price;

    @Column(name = "total_seats")
    private Integer totalSeats;

    @Column(name = "available_seats")
    private Integer availableSeats;
}
