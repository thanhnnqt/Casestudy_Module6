package org.example.case_study_module_6.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
@Table(name = "passengers")
public class Passenger {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name")
    private String fullName;

    // --- CÁC TRƯỜNG MỚI BỔ SUNG NHƯNG KHÔNG ẢNH HƯỞNG CODE CŨ CỦA ĐỒNG NGHIỆP (CHO CHỨC NĂNG ONLINE) ---

    @Column(name = "gender")
    private String gender; // "Nam", "Nữ", "Khác"

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "email")
    private String email;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "identity_card")
    private String identityCard; // CMND/Passport

    @Column(name = "passenger_type")
    private String passengerType; // "ADULT" hoặc "CHILD"

    @Column(name = "has_infant")
    private Boolean hasInfant; // Checkbox "Có kèm em bé"

    // -----------------------------------------------------

    // Quan hệ ngược về Booking
    @ManyToOne
    @JoinColumn(name = "booking_id")
    @JsonBackReference
    private Booking booking;
}