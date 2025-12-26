package org.example.case_study_module_6.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.case_study_module_6.dto.RegisterRequest;
import org.example.case_study_module_6.dto.converter.RegisterRequestConverter;

import java.time.LocalDateTime;

@Entity
@Table(name = "verification_tokens")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VerificationToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    // ✅ CHỈ GIỮ CỘT NÀY
    @Column(name = "expiry_date", nullable = false)
    private LocalDateTime expiryDate;

    @Convert(converter = RegisterRequestConverter.class)
    @Column(columnDefinition = "TEXT")
    private RegisterRequest registerRequest;
}
