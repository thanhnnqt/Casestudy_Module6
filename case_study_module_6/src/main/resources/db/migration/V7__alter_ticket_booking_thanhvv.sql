-- Nới rộng cột mã vé
ALTER TABLE tickets MODIFY COLUMN ticket_number VARCHAR(50);

-- Nới rộng cột mã booking (cho chắc ăn)
ALTER TABLE bookings MODIFY COLUMN booking_code VARCHAR(50);

-- Nới rộng cột trạng thái (đề phòng tên Enum dài)
ALTER TABLE bookings MODIFY COLUMN status VARCHAR(50);
ALTER TABLE bookings MODIFY COLUMN payment_status VARCHAR(50);
ALTER TABLE bookings MODIFY COLUMN channel VARCHAR(50);



-- 4. Tạo khóa ngoại cho flight_id (Nếu chưa có)
ALTER TABLE bookings
    ADD CONSTRAINT fk_booking_flight
        FOREIGN KEY (flight_id) REFERENCES flights(id);
