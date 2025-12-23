USE case_study_module_6;

-- 1. Thêm cột flight_id (Nếu chạy lệnh trước bị lỗi thì lệnh này sẽ tạo mới cột)
ALTER TABLE bookings
    ADD COLUMN flight_id BIGINT;

-- 2. Thêm cột thông tin liên hệ (Nếu chưa có)
ALTER TABLE bookings
    ADD COLUMN contact_name VARCHAR(255);

-- 3. Tạo khóa ngoại TRỎ ĐÚNG VÀO BẢNG 'flights'
ALTER TABLE bookings
    ADD CONSTRAINT fk_booking_flights
        FOREIGN KEY (flight_id) REFERENCES flights(id);