package org.example.case_study_module_6.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.List;

// --- THÊM ĐOẠN NÀY VÀO LÀ HẾT ĐỎ ---
import org.example.case_study_module_6.enums.BookingStatus;
import org.example.case_study_module_6.enums.PaymentStatus;
import org.example.case_study_module_6.enums.PaymentMethod;
import org.example.case_study_module_6.enums.Channel;
// -----------------------------------

@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "booking_code")
    private String bookingCode;

    @Column(name = "booking_date")
    private LocalDateTime bookingDate;

    @Column(name = "total_amount")
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;

    @ManyToOne
    @JoinColumn(name = "flight_id")
    private Flight flight;

    // --- CÁC TRƯỜNG ĐÃ THÊM ---

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status")
    private PaymentStatus paymentStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method")
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    private Channel channel;

    @Column(name = "contact_name")
    private String contactName;   // Lưu tên người mua vé (Nguyễn Văn A)

    @Column(name = "contact_email")
    private String contactEmail;  // Lưu email

    @Column(name = "contact_phone")
    private String contactPhone;
    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL)
    private List<Ticket> tickets;
}