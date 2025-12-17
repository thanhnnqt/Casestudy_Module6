package org.example.case_study_module_6.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "flights")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Flight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Mã chuyến bay không được để trống")
    @Column(nullable = false, unique = true)
    private String flightCode;

    @NotBlank(message = "Hãng hàng không không được để trống")
    private String airline;

    @NotBlank(message = "Sân bay đi không được để trống")
    private String origin;

    @NotBlank(message = "Sân bay đến không được để trống")
    private String destination;

    @NotNull(message = "Giờ khởi hành không được để trống")
    @Future(message = "Giờ khởi hành phải ở tương lai")
    private LocalDateTime departureTime;

    @NotNull(message = "Giờ hạ cánh không được để trống")
    private LocalDateTime arrivalTime;

    @NotNull(message = "Giá vé không được để trống")
    @Min(value = 0, message = "Giá vé không được âm")
    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    private FlightStatus status = FlightStatus.SCHEDULED;
}


