package org.example.case_study_module_6.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "airports")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Airport {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String code;
    private String name;
    private String city;
}
