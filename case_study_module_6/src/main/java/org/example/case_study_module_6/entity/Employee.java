package org.example.case_study_module_6.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "employees")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "full_name")
    private String fullName;
    @Column(name = "address")
    private String address;
    @Column(name = "phone_number")
    private String phoneNumber;
    @Column(name = "email")
    private String email;
    @Column(name = "dob")
    private LocalDate dob;
    @Column(name = "gender")
    @Enumerated(EnumType.STRING)
    private Gender gender;
    @Column(unique = true, name = "img_url")
    private String imgURL;
    @Column(unique = true, name = "img_hash")
    private String imgHash;
    private String identificationId;
    @OneToOne
    @JoinColumn(name = "account_id", nullable = false, unique = true)
    private Account account;
//    @Column(nullable = true)
//    private Long accountId;

    public enum Gender {
        Nam, Nữ, Khác
    }
}
