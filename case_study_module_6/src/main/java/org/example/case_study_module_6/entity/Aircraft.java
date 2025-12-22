package org.example.case_study_module_6.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Aircraft {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
    private String registrationCode;
    private Integer totalSeats;

    @ManyToOne
    @JoinColumn(name = "airline_id")
    private Airline airline;
}
