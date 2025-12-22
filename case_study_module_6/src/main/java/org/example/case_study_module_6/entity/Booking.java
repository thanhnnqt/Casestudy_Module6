package org.example.case_study_module_6.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String bookingCode;

    private LocalDateTime bookingDate;

    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;

    private String channels;
    private String tripType;

    private String contactEmail;
    private String contactPhone;

    @ManyToOne
    @JoinColumn(name = "customer_account_id")
    private Account customerAccount;

    @ManyToOne
    @JoinColumn(name = "created_by_sales_id")
    private Account createdBySales;

    public enum BookingStatus {
        PENDING, PAID, CANCELLED, REFUNDED
    }
}

