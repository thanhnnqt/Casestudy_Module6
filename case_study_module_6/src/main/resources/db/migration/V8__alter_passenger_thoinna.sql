USE case_study_module_6;

-- 1. Thêm các cột thông tin chi tiết cho hành khách
ALTER TABLE passengers
    ADD COLUMN gender VARCHAR(10) NULL,          -- NAM, NU, KHAC
    ADD COLUMN date_of_birth DATE NULL,
    ADD COLUMN email VARCHAR(100) NULL,
    ADD COLUMN phone_number VARCHAR(20) NULL,
    ADD COLUMN identity_card VARCHAR(20) NULL,   -- CMND/Passport

    -- Checkbox "Là trẻ em đi kèm" -> Nếu TRUE thì là CHILD, ngược lại là ADULT
    ADD COLUMN passenger_type VARCHAR(20) DEFAULT 'ADULT',

    -- Checkbox "Có kèm em bé" -> Người lớn này có bế thêm em bé không
    ADD COLUMN has_infant BOOLEAN DEFAULT FALSE;

-- 2. Đảm bảo bảng bookings hỗ trợ vé 1 chiều (return_flight_id đã nullable chưa?)
-- Kiểm tra lại cho chắc, nếu chưa thì chạy lệnh này:
ALTER TABLE bookings MODIFY COLUMN return_flight_id BIGINT NULL;