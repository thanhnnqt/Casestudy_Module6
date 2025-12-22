package org.example.case_study_module_6.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "accounts")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String username;

    @Column(unique = true, length = 100)
    private String email; // dùng cho Google login

    @Column(length = 255)
    private String password; // null nếu login Google

    private Boolean enabled = true;

    @Column(length = 20)
    private String provider; // LOCAL | GOOGLE

    @Column(length = 20)
    private String role; // USER | EMPLOYEE | ADMIN

    @CreationTimestamp
    private LocalDateTime createdAt;
}
