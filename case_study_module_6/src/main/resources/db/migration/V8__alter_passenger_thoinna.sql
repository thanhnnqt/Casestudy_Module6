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

/* ====================================================================================
   GENERATED DATA: 50 FLIGHTS (07/01/2026 - 12/01/2026)
   STARTING ID: 11 (Continuing from previous 10)
   ==================================================================================== */

INSERT INTO flights (flight_number, aircraft_id, departure_airport_id, arrival_airport_id, departure_time, arrival_time, status)
VALUES
-- === NGÀY 07/01/2026 (8 Chuyến) ===
('VN501', 1, 1, 4, '2026-01-07 06:00', '2026-01-07 08:10', 'SCHEDULED'), -- HAN -> SGN
('VJ502', 2, 4, 1, '2026-01-07 07:30', '2026-01-07 09:40', 'SCHEDULED'), -- SGN -> HAN
('QH503', 3, 3, 1, '2026-01-07 09:00', '2026-01-07 10:20', 'DELAYED'),   -- DAD -> HAN (Hoãn)
('BL504', 4, 1, 3, '2026-01-07 10:15', '2026-01-07 11:35', 'SCHEDULED'), -- HAN -> DAD
('7C505', 5, 5, 4, '2026-01-07 12:00', '2026-01-07 13:00', 'SCHEDULED'), -- PQC -> SGN
('AK506', 6, 4, 5, '2026-01-07 14:30', '2026-01-07 15:30', 'SCHEDULED'), -- SGN -> PQC
('SQ507', 7, 2, 3, '2026-01-07 16:45', '2026-01-07 18:00', 'CANCELLED'), -- HPH -> DAD (Hủy)
('VN508', 1, 3, 2, '2026-01-07 19:00', '2026-01-07 20:15', 'SCHEDULED'), -- DAD -> HPH

-- === NGÀY 08/01/2026 (8 Chuyến) ===
('VJ601', 3, 1, 5, '2026-01-08 05:30', '2026-01-08 07:40', 'SCHEDULED'), -- HAN -> PQC
('VN602', 2, 5, 1, '2026-01-08 08:30', '2026-01-08 10:40', 'SCHEDULED'), -- PQC -> HAN
('QH603', 4, 4, 3, '2026-01-08 10:00', '2026-01-08 11:20', 'SCHEDULED'), -- SGN -> DAD
('BL604', 5, 3, 4, '2026-01-08 13:15', '2026-01-08 14:35', 'DELAYED'),   -- DAD -> SGN (Hoãn)
('7C605', 6, 2, 4, '2026-01-08 15:00', '2026-01-08 17:00', 'SCHEDULED'), -- HPH -> SGN
('AK606', 7, 4, 2, '2026-01-08 18:00', '2026-01-08 20:00', 'SCHEDULED'), -- SGN -> HPH
('SQ607', 1, 1, 3, '2026-01-08 20:30', '2026-01-08 21:50', 'SCHEDULED'), -- HAN -> DAD
('VN608', 2, 3, 1, '2026-01-08 22:00', '2026-01-08 23:20', 'SCHEDULED'), -- DAD -> HAN

-- === NGÀY 09/01/2026 (9 Chuyến) ===
('VJ701', 3, 1, 4, '2026-01-09 06:15', '2026-01-09 08:25', 'SCHEDULED'),
('QH702', 4, 4, 1, '2026-01-09 07:00', '2026-01-09 09:10', 'SCHEDULED'),
('BL703', 5, 3, 5, '2026-01-09 09:45', '2026-01-09 11:45', 'SCHEDULED'),
('7C704', 6, 5, 3, '2026-01-09 12:30', '2026-01-09 14:30', 'CANCELLED'), -- Hủy do bão?
('AK705', 7, 2, 1, '2026-01-09 14:00', '2026-01-09 14:45', 'SCHEDULED'), -- Bay ngắn
('SQ706', 1, 1, 2, '2026-01-09 16:00', '2026-01-09 16:45', 'SCHEDULED'),
('VN707', 2, 4, 3, '2026-01-09 18:30', '2026-01-09 19:50', 'DELAYED'),
('VJ708', 3, 3, 4, '2026-01-09 20:45', '2026-01-09 22:05', 'SCHEDULED'),
('QH709', 4, 1, 5, '2026-01-09 23:00', '2026-01-10 01:10', 'SCHEDULED'), -- Bay đêm

-- === NGÀY 10/01/2026 (8 Chuyến - Cuối tuần) ===
('BL801', 5, 5, 1, '2026-01-10 07:00', '2026-01-10 09:10', 'SCHEDULED'),
('7C802', 6, 4, 2, '2026-01-10 08:45', '2026-01-10 10:45', 'SCHEDULED'),
('AK803', 7, 2, 4, '2026-01-10 11:30', '2026-01-10 13:30', 'SCHEDULED'),
('SQ804', 1, 1, 3, '2026-01-10 13:00', '2026-01-10 14:20', 'SCHEDULED'),
('VN805', 2, 3, 1, '2026-01-10 15:30', '2026-01-10 16:50', 'DELAYED'),
('VJ806', 3, 4, 5, '2026-01-10 17:00', '2026-01-10 18:00', 'SCHEDULED'),
('QH807', 4, 5, 4, '2026-01-10 19:15', '2026-01-10 20:15', 'SCHEDULED'),
('BL808', 5, 1, 4, '2026-01-10 21:30', '2026-01-10 23:40', 'SCHEDULED'),

-- === NGÀY 11/01/2026 (9 Chuyến) ===
('7C901', 6, 4, 1, '2026-01-11 05:45', '2026-01-11 07:55', 'SCHEDULED'),
('AK902', 7, 3, 2, '2026-01-11 08:00', '2026-01-11 09:15', 'SCHEDULED'),
('SQ903', 1, 2, 3, '2026-01-11 10:30', '2026-01-11 11:45', 'SCHEDULED'),
('VN904', 2, 1, 5, '2026-01-11 12:15', '2026-01-11 14:25', 'SCHEDULED'),
('VJ905', 3, 5, 1, '2026-01-11 15:00', '2026-01-11 17:10', 'CANCELLED'),
('QH906', 4, 4, 3, '2026-01-11 16:45', '2026-01-11 18:05', 'SCHEDULED'),
('BL907', 5, 3, 4, '2026-01-11 19:00', '2026-01-11 20:20', 'SCHEDULED'),
('7C908', 6, 1, 4, '2026-01-11 20:30', '2026-01-11 22:40', 'DELAYED'),
('AK909', 7, 4, 1, '2026-01-11 22:15', '2026-01-12 00:25', 'SCHEDULED'),

-- === NGÀY 12/01/2026 (8 Chuyến) ===
('SQ001', 1, 2, 5, '2026-01-12 06:30', '2026-01-12 08:40', 'SCHEDULED'), -- HPH -> PQC
('VN002', 2, 5, 2, '2026-01-12 09:15', '2026-01-12 11:25', 'SCHEDULED'), -- PQC -> HPH
('VJ003', 3, 1, 3, '2026-01-12 11:00', '2026-01-12 12:20', 'SCHEDULED'),
('QH004', 4, 3, 1, '2026-01-12 13:45', '2026-01-12 15:05', 'SCHEDULED'),
('BL005', 5, 4, 5, '2026-01-12 15:30', '2026-01-12 16:30', 'SCHEDULED'),
('7C006', 6, 5, 4, '2026-01-12 17:45', '2026-01-12 18:45', 'SCHEDULED'),
('AK007', 7, 3, 5, '2026-01-12 19:30', '2026-01-12 21:30', 'SCHEDULED'),
('VN008', 1, 5, 3, '2026-01-12 22:00', '2026-01-13 00:00', 'SCHEDULED');


/* ====================================================================================
   GENERATED SEAT DETAILS: 2 CLASSES PER FLIGHT
   MAPPING FLIGHT_ID 11 -> 60
   ==================================================================================== */

INSERT INTO flight_seat_details (flight_id, seat_class, price, total_seats, available_seats)
VALUES
-- Flight 11
(11, 'ECONOMY', 1250000, 150, 140), (11, 'BUSINESS', 3200000, 20, 18),
-- Flight 12
(12, 'ECONOMY', 1300000, 180, 180), (12, 'BUSINESS', 3500000, 30, 30),
-- Flight 13
(13, 'ECONOMY', 1100000, 160, 150), (13, 'BUSINESS', 2900000, 20, 15),
-- Flight 14
(14, 'ECONOMY', 1150000, 170, 165), (14, 'BUSINESS', 3000000, 20, 20),
-- Flight 15 (Phu Quoc - Hot)
(15, 'ECONOMY', 1800000, 150, 100), (15, 'BUSINESS', 4500000, 30, 25),
-- Flight 16
(16, 'ECONOMY', 1750000, 180, 170), (16, 'BUSINESS', 4200000, 30, 28),
-- Flight 17 (Cancelled)
(17, 'ECONOMY', 1200000, 150, 150), (17, 'BUSINESS', 3100000, 20, 20),
-- Flight 18
(18, 'ECONOMY', 1250000, 160, 155), (18, 'BUSINESS', 3300000, 20, 19),

-- Flight 19
(19, 'ECONOMY', 1900000, 180, 160), (19, 'BUSINESS', 4800000, 30, 25),
-- Flight 20
(20, 'ECONOMY', 1850000, 200, 190), (20, 'BUSINESS', 4700000, 40, 38),
-- Flight 21
(21, 'ECONOMY', 1350000, 150, 145), (21, 'BUSINESS', 3600000, 20, 18),
-- Flight 22
(22, 'ECONOMY', 1400000, 160, 150), (22, 'BUSINESS', 3700000, 20, 20),
-- Flight 23
(23, 'ECONOMY', 1500000, 170, 160), (23, 'BUSINESS', 3800000, 30, 29),
-- Flight 24
(24, 'ECONOMY', 1550000, 180, 175), (24, 'BUSINESS', 3900000, 30, 30),
-- Flight 25
(25, 'ECONOMY', 1220000, 150, 148), (25, 'BUSINESS', 3150000, 20, 20),
-- Flight 26
(26, 'ECONOMY', 1280000, 160, 158), (26, 'BUSINESS', 3250000, 20, 20),

-- Flight 27
(27, 'ECONOMY', 1600000, 180, 175), (27, 'BUSINESS', 4000000, 30, 30),
-- Flight 28
(28, 'ECONOMY', 1650000, 150, 140), (28, 'BUSINESS', 4100000, 20, 15),
-- Flight 29
(29, 'ECONOMY', 1450000, 160, 160), (29, 'BUSINESS', 3500000, 20, 20),
-- Flight 30 (Cancelled)
(30, 'ECONOMY', 1300000, 170, 170), (30, 'BUSINESS', 3400000, 30, 30),
-- Flight 31
(31, 'ECONOMY', 900000, 150, 100), (31, 'BUSINESS', 2500000, 20, 10), -- Giá rẻ
-- Flight 32
(32, 'ECONOMY', 950000, 180, 150), (32, 'BUSINESS', 2600000, 30, 25),
-- Flight 33 (Delayed)
(33, 'ECONOMY', 1320000, 160, 155), (33, 'BUSINESS', 3350000, 20, 19),
-- Flight 34
(34, 'ECONOMY', 1380000, 150, 145), (34, 'BUSINESS', 3450000, 20, 18),
-- Flight 35
(35, 'ECONOMY', 2100000, 180, 170), (35, 'BUSINESS', 5000000, 30, 28), -- Bay đêm giá cao? (Hoặc ngược lại tùy logic, ở đây set cao)

-- Flight 36
(36, 'ECONOMY', 1420000, 150, 140), (36, 'BUSINESS', 3600000, 20, 18),
-- Flight 37
(37, 'ECONOMY', 1480000, 160, 155), (37, 'BUSINESS', 3700000, 20, 19),
-- Flight 38
(38, 'ECONOMY', 1520000, 170, 165), (38, 'BUSINESS', 3800000, 30, 25),
-- Flight 39
(39, 'ECONOMY', 1250000, 150, 120), (39, 'BUSINESS', 3200000, 20, 15),
-- Flight 40 (Delayed)
(40, 'ECONOMY', 1280000, 180, 175), (40, 'BUSINESS', 3250000, 30, 28),
-- Flight 41
(41, 'ECONOMY', 1650000, 160, 150), (41, 'BUSINESS', 4150000, 20, 18),
-- Flight 42
(42, 'ECONOMY', 1700000, 150, 140), (42, 'BUSINESS', 4300000, 20, 15),
-- Flight 43
(43, 'ECONOMY', 1350000, 180, 180), (43, 'BUSINESS', 3500000, 30, 30),

-- Flight 44
(44, 'ECONOMY', 1220000, 150, 145), (44, 'BUSINESS', 3100000, 20, 18),
-- Flight 45
(45, 'ECONOMY', 1260000, 160, 155), (45, 'BUSINESS', 3150000, 20, 19),
-- Flight 46
(46, 'ECONOMY', 1300000, 170, 165), (46, 'BUSINESS', 3300000, 30, 25),
-- Flight 47
(47, 'ECONOMY', 2200000, 150, 130), (47, 'BUSINESS', 5500000, 20, 10), -- SGN-HAN giá cao
-- Flight 48 (Cancelled)
(48, 'ECONOMY', 1800000, 180, 180), (48, 'BUSINESS', 4500000, 30, 30),
-- Flight 49
(49, 'ECONOMY', 1350000, 160, 150), (49, 'BUSINESS', 3400000, 20, 18),
-- Flight 50
(50, 'ECONOMY', 1400000, 150, 140), (50, 'BUSINESS', 3500000, 20, 15),
-- Flight 51 (Delayed)
(51, 'ECONOMY', 1450000, 180, 175), (51, 'BUSINESS', 3600000, 30, 28),
-- Flight 52
(52, 'ECONOMY', 1500000, 160, 155), (52, 'BUSINESS', 3700000, 20, 18),

-- Flight 53
(53, 'ECONOMY', 2000000, 150, 140), (53, 'BUSINESS', 4800000, 20, 15), -- HPH-PQC
-- Flight 54
(54, 'ECONOMY', 2050000, 180, 170), (54, 'BUSINESS', 4900000, 30, 25),
-- Flight 55
(55, 'ECONOMY', 1150000, 160, 155), (55, 'BUSINESS', 2950000, 20, 18),
-- Flight 56
(56, 'ECONOMY', 1200000, 150, 145), (56, 'BUSINESS', 3050000, 20, 19),
-- Flight 57
(57, 'ECONOMY', 1600000, 170, 160), (57, 'BUSINESS', 4000000, 30, 25),
-- Flight 58
(58, 'ECONOMY', 1650000, 180, 175), (58, 'BUSINESS', 4100000, 30, 28),
-- Flight 59
(59, 'ECONOMY', 1900000, 150, 140), (59, 'BUSINESS', 4600000, 20, 15),
-- Flight 60
(60, 'ECONOMY', 1550000, 160, 150), (60, 'BUSINESS', 3800000, 20, 18);

/* ====================================================================================
   PHẦN BỔ SUNG: CẬP NHẬT LOGO & THÊM HÃNG BAY MỚI, CHUYẾN BAY MỚI (NGÀY 10-11/01/2026)
   ==================================================================================== */

-- 1. CẬP NHẬT LOGO CÁC HÃNG CŨ CHO ĐỒNG BỘ --
UPDATE airlines SET logo_url = 'https://danangairport.vn/files/media/202411/d8a44873-4441-4663-8b0b-415a687e7f89.jpg' WHERE code = 'VN';
UPDATE airlines SET logo_url = 'https://danangairport.vn/files/media/202411/VJ.jpg' WHERE code = 'VJ';
UPDATE airlines SET logo_url = 'https://danangairport.vn/files/media/202411/6b1deea9-2644-4164-bfef-e28b69b0f4a4.jpg' WHERE code = 'QH';
UPDATE airlines SET logo_url = 'https://danangairport.vn/files/media/202501/pacific.jpg' WHERE code = 'BL';
UPDATE airlines SET logo_url = 'https://danangairport.vn/files/media/202411/17ed00d1-5fe4-4a85-b847-01b5fed39345.jpg' WHERE code = '7C';
UPDATE airlines SET logo_url = 'https://danangairport.vn/files/media/202411/AK.jpg' WHERE code = 'AK';
UPDATE airlines SET logo_url = 'https://danangairport.vn/files/media/202411/b6354f97-8558-4983-94f5-44f5c5fc7fff.jpg' WHERE code = 'SQ';

-- 2. THÊM 3 HÃNG BAY MỚI --
INSERT INTO airlines (code, name, logo_url)
VALUES
    ('HX', 'Hong Kong Airlines', 'https://danangairport.vn/files/media/202411/377d2fa9-8856-473d-a2ed-fa22fe416108.jpg'),
    ('VU', 'Vietravel Airlines', 'https://danangairport.vn/files/media/202411/0affdec8-9557-4bb5-8397-a2e6fa39a10d.jpg'),
    ('IT', 'Tigerair Taiwan', 'https://danangairport.vn/files/media/202411/3e449e6e-0110-4314-afa6-b78ade34f559.jpg');

-- 3. THÊM MÁY BAY CHO 3 HÃNG MỚI (Để có thể xếp lịch bay) --
-- Giả sử ID hãng mới lần lượt là 8 (HX), 9 (VU), 10 (IT) do bảng airlines tự tăng
INSERT INTO aircrafts (name, registration_code, total_seats, airline_id)
VALUES
    ('Airbus A330-300', 'HX-A330', 285, (SELECT id FROM airlines WHERE code='HX')),
    ('Airbus A321ceo', 'VU-A321', 220, (SELECT id FROM airlines WHERE code='VU')),
    ('Airbus A320neo', 'IT-A320', 180, (SELECT id FROM airlines WHERE code='IT'));

/* ====================================================================================
   TẠO 50 CHUYẾN BAY MỚI (ID 61 -> 110)
   Quy tắc:
   - Ngày 10/01/2026: SGN (ID 4) -> HAN (ID 1)
   - Ngày 11/01/2026: HAN (ID 1) -> SGN (ID 4)
   - Đủ các hãng bay xoay vòng
   ====================================================================================
*/

INSERT INTO flights (flight_number, aircraft_id, departure_airport_id, arrival_airport_id, departure_time, arrival_time, status)
VALUES
-- === NGÀY 10/01/2026: SGN (Hồ Chí Minh) -> HAN (Hà Nội) ===
-- Buổi sáng
('VN1001', 1, 4, 1, '2026-01-10 05:30', '2026-01-10 07:40', 'SCHEDULED'),
('VJ1002', 2, 4, 1, '2026-01-10 06:00', '2026-01-10 08:10', 'SCHEDULED'),
('QH1003', 3, 4, 1, '2026-01-10 06:30', '2026-01-10 08:40', 'SCHEDULED'),
('BL1004', 4, 4, 1, '2026-01-10 07:00', '2026-01-10 09:10', 'SCHEDULED'),
('VU1005', 9, 4, 1, '2026-01-10 07:30', '2026-01-10 09:40', 'SCHEDULED'), -- Vietravel
('VN1006', 1, 4, 1, '2026-01-10 08:00', '2026-01-10 10:10', 'SCHEDULED'),
('VJ1007', 2, 4, 1, '2026-01-10 08:30', '2026-01-10 10:40', 'SCHEDULED'),
('HX1008', 8, 4, 1, '2026-01-10 09:00', '2026-01-10 11:10', 'SCHEDULED'), -- Hong Kong Air
('IT1009', 10, 4, 1, '2026-01-10 09:30', '2026-01-10 11:40', 'SCHEDULED'), -- Tigerair
('VN1010', 2, 4, 1, '2026-01-10 10:00', '2026-01-10 12:10', 'SCHEDULED'),

-- Buổi trưa - chiều
('VJ1011', 3, 4, 1, '2026-01-10 11:00', '2026-01-10 13:10', 'SCHEDULED'),
('QH1012', 4, 4, 1, '2026-01-10 11:45', '2026-01-10 13:55', 'SCHEDULED'),
('VU1013', 9, 4, 1, '2026-01-10 12:30', '2026-01-10 14:40', 'SCHEDULED'),
('VN1014', 1, 4, 1, '2026-01-10 13:15', '2026-01-10 15:25', 'SCHEDULED'),
('BL1015', 5, 4, 1, '2026-01-10 14:00', '2026-01-10 16:10', 'SCHEDULED'),
('SQ1016', 7, 4, 1, '2026-01-10 14:45', '2026-01-10 16:55', 'SCHEDULED'),
('VJ1017', 2, 4, 1, '2026-01-10 15:30', '2026-01-10 17:40', 'SCHEDULED'),
('AK1018', 6, 4, 1, '2026-01-10 16:15', '2026-01-10 18:25', 'SCHEDULED'),
('VN1019', 3, 4, 1, '2026-01-10 17:00', '2026-01-10 19:10', 'SCHEDULED'),
('QH1020', 4, 4, 1, '2026-01-10 17:45', '2026-01-10 19:55', 'SCHEDULED'),

-- Buổi tối
('VU1021', 9, 4, 1, '2026-01-10 18:30', '2026-01-10 20:40', 'SCHEDULED'),
('VJ1022', 2, 4, 1, '2026-01-10 19:30', '2026-01-10 21:40', 'SCHEDULED'),
('VN1023', 1, 4, 1, '2026-01-10 20:30', '2026-01-10 22:40', 'SCHEDULED'),
('7C1024', 5, 4, 1, '2026-01-10 21:30', '2026-01-10 23:40', 'SCHEDULED'),
('IT1025', 10, 4, 1, '2026-01-10 22:30', '2026-01-11 00:40', 'SCHEDULED'),

-- === NGÀY 11/01/2026: HAN (Hà Nội) -> SGN (Hồ Chí Minh) ===
-- Buổi sáng
('VN1101', 1, 1, 4, '2026-01-11 05:45', '2026-01-11 07:55', 'SCHEDULED'),
('VJ1102', 2, 1, 4, '2026-01-11 06:15', '2026-01-11 08:25', 'SCHEDULED'),
('QH1103', 3, 1, 4, '2026-01-11 07:00', '2026-01-11 09:10', 'SCHEDULED'),
('BL1104', 4, 1, 4, '2026-01-11 07:45', '2026-01-11 09:55', 'SCHEDULED'),
('VU1105', 9, 1, 4, '2026-01-11 08:30', '2026-01-11 10:40', 'SCHEDULED'),
('VN1106', 2, 1, 4, '2026-01-11 09:15', '2026-01-11 11:25', 'SCHEDULED'),
('VJ1107', 3, 1, 4, '2026-01-11 10:00', '2026-01-11 12:10', 'SCHEDULED'),
('HX1108', 8, 1, 4, '2026-01-11 10:45', '2026-01-11 12:55', 'SCHEDULED'),
('IT1109', 10, 1, 4, '2026-01-11 11:30', '2026-01-11 13:40', 'SCHEDULED'),
('VN1110', 1, 1, 4, '2026-01-11 12:15', '2026-01-11 14:25', 'SCHEDULED'),

-- Buổi trưa - chiều
('VJ1111', 2, 1, 4, '2026-01-11 13:00', '2026-01-11 15:10', 'SCHEDULED'),
('QH1112', 4, 1, 4, '2026-01-11 13:45', '2026-01-11 15:55', 'SCHEDULED'),
('VU1113', 9, 1, 4, '2026-01-11 14:30', '2026-01-11 16:40', 'SCHEDULED'),
('VN1114', 3, 1, 4, '2026-01-11 15:15', '2026-01-11 17:25', 'SCHEDULED'),
('BL1115', 5, 1, 4, '2026-01-11 16:00', '2026-01-11 18:10', 'SCHEDULED'),
('SQ1116', 7, 1, 4, '2026-01-11 16:45', '2026-01-11 18:55', 'SCHEDULED'),
('VJ1117', 2, 1, 4, '2026-01-11 17:30', '2026-01-11 19:40', 'SCHEDULED'),
('AK1118', 6, 1, 4, '2026-01-11 18:15', '2026-01-11 20:25', 'SCHEDULED'),
('VN1119', 1, 1, 4, '2026-01-11 19:00', '2026-01-11 21:10', 'SCHEDULED'),
('QH1120', 4, 1, 4, '2026-01-11 19:45', '2026-01-11 21:55', 'SCHEDULED'),

-- Buổi tối
('VU1121', 9, 1, 4, '2026-01-11 20:30', '2026-01-11 22:40', 'SCHEDULED'),
('VJ1122', 3, 1, 4, '2026-01-11 21:15', '2026-01-11 23:25', 'SCHEDULED'),
('VN1123', 2, 1, 4, '2026-01-11 22:00', '2026-01-12 00:10', 'SCHEDULED'),
('7C1124', 5, 1, 4, '2026-01-11 22:45', '2026-01-12 00:55', 'SCHEDULED'),
('IT1125', 10, 1, 4, '2026-01-11 23:30', '2026-01-12 01:40', 'SCHEDULED');

/* ====================================================================================
   THÊM CHI TIẾT GHẾ CHO 50 CHUYẾN BAY VỪA TẠO
   Mỗi chuyến bay có 3 hạng: ECONOMY, BUSINESS, FIRST
   ====================================================================================
*/

-- Chúng ta sẽ sử dụng vòng lặp hoặc chèn hàng loạt. Vì là script SQL thuần, ta dùng INSERT hàng loạt.
-- ID chuyến bay từ 61 đến 110.

INSERT INTO flight_seat_details (flight_id, seat_class, price, total_seats, available_seats)
SELECT id, 'ECONOMY', 1500000 + (FLOOR(RAND() * 500000)), 150, 150 FROM flights WHERE id BETWEEN 61 AND 110
UNION ALL
SELECT id, 'BUSINESS', 3500000 + (FLOOR(RAND() * 1000000)), 30, 30 FROM flights WHERE id BETWEEN 61 AND 110
UNION ALL
SELECT id, 'FIRST_CLASS', 6000000 + (FLOOR(RAND() * 2000000)), 10, 10 FROM flights WHERE id BETWEEN 61 AND 110;

-- Ghi chú: Đoạn lệnh trên dùng UNION ALL để chèn 3 dòng cho mỗi ID.
-- Giá vé (price) được random nhẹ để tạo sự đa dạng:
-- Economy: ~1.5tr - 2tr
-- Business: ~3.5tr - 4.5tr
-- First: ~6tr - 8tr