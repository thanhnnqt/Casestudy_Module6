CREATE TABLE passengers (
                            id BIGINT AUTO_INCREMENT PRIMARY KEY,
                            full_name VARCHAR(255),
                            booking_id BIGINT,

    -- Tạo khóa ngoại liên kết với bảng bookings
                            CONSTRAINT fk_passengers_booking
                                FOREIGN KEY (booking_id) REFERENCES bookings(id)
);