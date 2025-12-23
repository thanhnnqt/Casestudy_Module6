
/* =========================================================
   7. SEED DATA
========================================================= */
INSERT INTO accounts (username,password) VALUES
                                             ('admin','hash_admin'),
                                             ('employee','hash_employee'),
                                             ('customer1','hash_customer'),
                                             ('customer2','hash_customer');

INSERT INTO admins (admin_code,full_name,account_id)
VALUES ('AD01','Admin System',1);

INSERT INTO employees (employee_code,full_name,account_id)
VALUES ('EMP01','Sales Staff',2);

INSERT INTO customers (customer_code,full_name,account_id) VALUES
                                                               ('CUS01','Nguyễn Văn A',3),
                                                               ('CUS02','Trần Thị B',4);

-- ================== 6. FLIGHT SEAT DETAILS ==================
INSERT INTO flight_seat_details
(flight_id, seat_class, price, total_seats, available_seats)
VALUES
    (1, 'ECONOMY',       1500000, 150, 150),
    (1, 'BUSINESS',      3500000, 30, 30),
INSERT INTO airports (code, name, city) VALUES
-- Miền Bắc
('HAN', 'Nội Bài', 'Hà Nội'),
('HPH', 'Cát Bi', 'Hải Phòng'),
('VDO', 'Vân Đồn', 'Quảng Ninh'),
('VII', 'Vinh', 'Nghệ An'),
('THD', 'Thọ Xuân', 'Thanh Hóa'),
-- Miền Trung
('DAD', 'Đà Nẵng', 'Đà Nẵng'),
('CXR', 'Cam Ranh', 'Khánh Hòa'),
('HUI', 'Phú Bài', 'Huế'),
('UIH', 'Phù Cát', 'Quy Nhơn'),
('VCL', 'Chu Lai', 'Quảng Nam'),
-- Miền Nam
('SGN', 'Tân Sơn Nhất', 'Hồ Chí Minh'),
('PQC', 'Phú Quốc', 'Kiên Giang'),
('VCA', 'Cần Thơ', 'Cần Thơ'),
('VCS', 'Côn Đảo', 'Bà Rịa - Vũng Tàu'),
('DLI', 'Liên Khương', 'Đà Lạt'),
-- Quốc Tế
('SIN', 'Changi', 'Singapore'),
('BKK', 'Suvarnabhumi', 'Bangkok'),
('NRT', 'Narita', 'Tokyo'),
('ICN', 'Incheon', 'Seoul'),
('HKG', 'Hong Kong Intl', 'Hong Kong');

    (2, 'ECONOMY',       1800000, 200, 200),
    (2, 'BUSINESS',      4200000, 40, 40),
INSERT INTO airlines (code, name, logo_url) VALUES
                                                ('VN', 'Vietnam Airlines', 'https://danangairport.vn/files/media/202411/d8a44873-4441-4663-8b0b-415a687e7f89.jpg'),
                                                ('VJ', 'VietJet Air', 'https://danangairport.vn/files/media/202411/VJ.jpg'),
                                                ('QH', 'Bamboo Airways', 'https://danangairport.vn/files/media/202411/6b1deea9-2644-4164-bfef-e28b69b0f4a4.jpg'),
                                                ('BL', 'Pacific Airlines', 'https://danangairport.vn/files/media/202501/pacific.jpg'),
                                                ('7C', 'Jeju Air', 'https://danangairport.vn/files/media/202411/17ed00d1-5fe4-4a85-b847-01b5fed39345.jpg'),
                                                ('AK', 'Air Asia', 'https://danangairport.vn/files/media/202411/AK.jpg'),
                                                ('SQ', 'Singapore Airlines', 'https://danangairport.vn/files/media/202411/b6354f97-8558-4983-94f5-44f5c5fc7fff.jpg');

    (3, 'ECONOMY',       1200000, 180, 180);
INSERT INTO aircrafts (name, registration_code, total_seats, airline_id) VALUES
-- 1. Vietnam Airlines (3 chiếc)
('Airbus A321',    'VN-A321', 184, 1), -- Dòng phổ biến
('Boeing 787-9',   'VN-B787', 274, 1), -- Dreamliner (Thân rộng)
('Airbus A350',    'VN-A350', 305, 1), -- Thân rộng hiện đại

-- 2. VietJet Air (3 chiếc)
('Airbus A320',    'VJ-A320', 180, 2), -- Dòng cơ bản
('Airbus A321neo', 'VJ-A321N', 230, 2),-- Dòng nhiều ghế
('Airbus A330',    'VJ-A330', 377, 2), -- Thân rộng (Mới của VJ)

-- 3. Bamboo Airways (3 chiếc)
('Embraer E190',   'QH-E190', 110, 3), -- Máy bay phản lực nhỏ (đi Côn Đảo)
('Airbus A320neo', 'QH-A320N', 176, 3),
('Boeing 787-9',   'QH-B787', 294, 3),

-- 4. Pacific Airlines (3 chiếc)
('Airbus A320',    'BL-A320', 180, 4),
('Airbus A320',    'BL-A321', 180, 4),
('Airbus A320',    'BL-A322', 180, 4), -- Pacific chủ yếu bay A320 đồng hạng

-- 5. Jeju Air (2 chiếc)
('Boeing 737-800', '7C-B737', 189, 5), -- Dòng chủ lực của Jeju
('Boeing 737 MAX', '7C-MAX8', 189, 5),

-- 6. Air Asia (3 chiếc)
('Airbus A320',    'AK-A320', 180, 6),
('Airbus A320neo', 'AK-A320N', 186, 6),
('Airbus A321neo', 'AK-A321N', 236, 6), -- Thân hẹp siêu dài

-- 7. Singapore Airlines (3 chiếc - Dòng cao cấp)
('Boeing 777-300ER', 'SQ-B777', 264, 7), -- 4 Hạng ghế
('Airbus A380',      'SQ-A380', 471, 7), -- Siêu máy bay 2 tầng
('Airbus A350-900',  'SQ-A350', 253, 7);

INSERT INTO flights (flight_number,aircraft_id,departure_airport_id,arrival_airport_id,departure_time,arrival_time,status)
VALUES ('VN201',1,1,2,'2025-01-10 08:00','2025-01-10 10:00','SCHEDULED');

INSERT INTO flight_seat_details (flight_id,seat_class,price,total_seats,available_seats)
VALUES (1,'ECONOMY',1500000,150,150);

INSERT INTO bookings (booking_code,total_amount,channel,trip_type,customer_account_id,status)
VALUES ('PNR001',1500000,'ONLINE','ONE_WAY',3,'PAID');

INSERT INTO tickets (seat_number,ticket_number,passenger_name,seat_class,price,booking_id,flight_id)
VALUES ('12A','TIC001','Nguyễn Văn A','ECONOMY',1500000,1,1);

INSERT INTO payments (booking_id,payment_method,amount,status,transaction_code,paid_by_account_id,paid_at)
VALUES (1,'VNPAY',1500000,'SUCCESS','VNP123',3,NOW());

INSERT INTO news (title,slug,content,category,account_id)
VALUES ('Khuyến mãi','khuyen-mai','Giảm giá vé','PROMOTION',1);

/* =========================================================
   DONE
========================================================= */
