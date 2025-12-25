package org.example.case_study_module_6.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;


@Entity
@Table(name = "customers")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String customerCode;

    private String fullName;
    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(unique = true)
    private String email;

    private String phoneNumber;
    private String email;
    private String identityCard;
    private String address;

    private BigDecimal totalSpending = BigDecimal.ZERO;

    private LocalDateTime createdAt;

    @OneToOne
    @JoinColumn(name = "account_id", unique = true)
    private Account account;

    public enum Gender {
        NAM, NU, KHAC
    }
}