/* ===================== BƯỚC 1: TẠO TÀI KHOẢN (ACCOUNTS) ===================== */
-- Lưu ý: Password ở đây là "123456" (đã mã hóa)

INSERT INTO accounts (username, password, provider, enabled)
VALUES
-- 1. ADMIN ACCOUNT
('admin_demo', '$2a$10$TQhZ2iB1qZ1bEOxm0.DinurTA0O.qao17BkgbReJoSFHwDXQgcvWW', 'LOCAL', TRUE),

-- 2. EMPLOYEE ACCOUNTS (5 Tài khoản nhân viên)
('demo1', '$2a$10$TQhZ2iB1qZ1bEOxm0.DinurTA0O.qao17BkgbReJoSFHwDXQgcvWW', 'LOCAL', TRUE),
('demo2', '$2a$10$TQhZ2iB1qZ1bEOxm0.DinurTA0O.qao17BkgbReJoSFHwDXQgcvWW', 'LOCAL', TRUE),
('demo3', '$2a$10$TQhZ2iB1qZ1bEOxm0.DinurTA0O.qao17BkgbReJoSFHwDXQgcvWW', 'LOCAL', TRUE),
('demo4', '$2a$10$TQhZ2iB1qZ1bEOxm0.DinurTA0O.qao17BkgbReJoSFHwDXQgcvWW', 'LOCAL', TRUE),
('demo5', '$2a$10$TQhZ2iB1qZ1bEOxm0.DinurTA0O.qao17BkgbReJoSFHwDXQgcvWW', 'LOCAL', TRUE);


/* ===================== BƯỚC 2: LIÊN KẾT ADMIN ===================== */
INSERT INTO admins (admin_code, full_name, email, phone_number, account_id)
VALUES ('AD_01',
        'Demo System Admin',
        'admin@system.com',
        '0909000000',
        (SELECT id FROM accounts WHERE username = 'admin_demo')); -- Tự động lấy ID của admin_demo


/* ===================== BƯỚC 3: LIÊN KẾT 5 NHÂN VIÊN ===================== */
INSERT INTO employees (full_name, address, phone_number, identification_id, email, dob, gender, img_url, img_hash, account_id)
VALUES
-- Nhân viên 1 -> Gắn vào demo1
('Nguyen Van Huy', 'Ha Noi', '0901000001', '012345001', 'nv1@company.com', '1995-01-01', 'Nam',
 'https://res.cloudinary.com/dfduj6hiv/image/upload/v1767062658/g3tnflpe4umkdcejpprx.webp',
 '32fb526959373d9b54a651a97c3ed216cb39c3bdfa546db0d3acc3b4a404cc9a',
 (SELECT id FROM accounts WHERE username = 'demo1')),

-- Nhân viên 2 -> Gắn vào demo2
('Tran Thi Mai', 'Ha Noi', '0901000002', '012345002', 'nv2@company.com', '1996-02-02', 'Nữ',
 'https://res.cloudinary.com/dfduj6hiv/image/upload/v1766978920/l7rivvz2cshrpb3ra5on.webp',
 '5c0193f8bf8c2f1b354efde78a512f194407a527041a3a91f05e54bf62f3bc48',
 (SELECT id FROM accounts WHERE username = 'demo2')),

-- Nhân viên 3 -> Gắn vào demo3
('Le Minh Duc', 'Da Nang', '0901000003', '012345003', 'nv3@company.com', '1994-03-03', 'Nam',
 'https://res.cloudinary.com/dfduj6hiv/image/upload/v1767062643/g3xye2yoji9hhmlvsv3z.webp',
 'b27dcd4d20be284d8580c73576f40760d47576a89d7a2f33dc1b159c828c5645',
 (SELECT id FROM accounts WHERE username = 'demo3')),

-- Nhân viên 4 -> Gắn vào demo4
('Pham Quang Hieu', 'Da Nang', '0901000004', '012345004', 'nv4@company.com', '1993-04-04', 'Nam',
 'https://res.cloudinary.com/dfduj6hiv/image/upload/v1766998277/c1qhxssyiheavo02izwi.jpg',
 '781550e149fd178a77efc4857adb0ff378e24f7b3e3d78c6c33d26c1a01ee326',
 (SELECT id FROM accounts WHERE username = 'demo4')),

-- Nhân viên 5 -> Gắn vào demo5
('Hoang Thanh Tung', 'Ho Chi Minh', '0901000005', '012345005', 'nv5@company.com', '1992-05-05', 'Nam',
 'https://res.cloudinary.com/dfduj6hiv/image/upload/v1766977350/xkfrcvws16poasyijcxh.webp',
 '7d49041c6049c40b7b8391ce5d83498d3f0af0f8c02f041e178e4ed856247a43',
 (SELECT id FROM accounts WHERE username = 'demo5'));





/* ===================== BƯỚC 1: TẠO 20 TÀI KHOẢN KHÁCH HÀNG (ACCOUNTS) ===================== */
-- Username: customer1 -> customer20
-- Password: 123456 (Mặc định)

INSERT INTO accounts (username, password, provider, enabled)
VALUES
    ('customer1', '$2a$10$TQhZ2iB1qZ1bEOxm0.DinurTA0O.qao17BkgbReJoSFHwDXQgcvWW', 'LOCAL', TRUE),
    ('customer2', '$2a$10$TQhZ2iB1qZ1bEOxm0.DinurTA0O.qao17BkgbReJoSFHwDXQgcvWW', 'LOCAL', TRUE),
    ('customer3', '$2a$10$TQhZ2iB1qZ1bEOxm0.DinurTA0O.qao17BkgbReJoSFHwDXQgcvWW', 'LOCAL', TRUE),
    ('customer4', '$2a$10$TQhZ2iB1qZ1bEOxm0.DinurTA0O.qao17BkgbReJoSFHwDXQgcvWW', 'LOCAL', TRUE),
    ('customer5', '$2a$10$TQhZ2iB1qZ1bEOxm0.DinurTA0O.qao17BkgbReJoSFHwDXQgcvWW', 'LOCAL', TRUE),
    ('customer6', '$2a$10$TQhZ2iB1qZ1bEOxm0.DinurTA0O.qao17BkgbReJoSFHwDXQgcvWW', 'LOCAL', TRUE),
    ('customer7', '$2a$10$TQhZ2iB1qZ1bEOxm0.DinurTA0O.qao17BkgbReJoSFHwDXQgcvWW', 'LOCAL', TRUE),
    ('customer8', '$2a$10$TQhZ2iB1qZ1bEOxm0.DinurTA0O.qao17BkgbReJoSFHwDXQgcvWW', 'LOCAL', TRUE),
    ('customer9', '$2a$10$TQhZ2iB1qZ1bEOxm0.DinurTA0O.qao17BkgbReJoSFHwDXQgcvWW', 'LOCAL', TRUE),
    ('customer10', '$2a$10$TQhZ2iB1qZ1bEOxm0.DinurTA0O.qao17BkgbReJoSFHwDXQgcvWW', 'LOCAL', TRUE),
    ('customer11', '$2a$10$TQhZ2iB1qZ1bEOxm0.DinurTA0O.qao17BkgbReJoSFHwDXQgcvWW', 'LOCAL', TRUE),
    ('customer12', '$2a$10$TQhZ2iB1qZ1bEOxm0.DinurTA0O.qao17BkgbReJoSFHwDXQgcvWW', 'LOCAL', TRUE),
    ('customer13', '$2a$10$TQhZ2iB1qZ1bEOxm0.DinurTA0O.qao17BkgbReJoSFHwDXQgcvWW', 'LOCAL', TRUE),
    ('customer14', '$2a$10$TQhZ2iB1qZ1bEOxm0.DinurTA0O.qao17BkgbReJoSFHwDXQgcvWW', 'LOCAL', TRUE),
    ('customer15', '$2a$10$TQhZ2iB1qZ1bEOxm0.DinurTA0O.qao17BkgbReJoSFHwDXQgcvWW', 'LOCAL', TRUE),
    ('customer16', '$2a$10$TQhZ2iB1qZ1bEOxm0.DinurTA0O.qao17BkgbReJoSFHwDXQgcvWW', 'LOCAL', TRUE),
    ('customer17', '$2a$10$TQhZ2iB1qZ1bEOxm0.DinurTA0O.qao17BkgbReJoSFHwDXQgcvWW', 'LOCAL', TRUE),
    ('customer18', '$2a$10$TQhZ2iB1qZ1bEOxm0.DinurTA0O.qao17BkgbReJoSFHwDXQgcvWW', 'LOCAL', TRUE),
    ('customer19', '$2a$10$TQhZ2iB1qZ1bEOxm0.DinurTA0O.qao17BkgbReJoSFHwDXQgcvWW', 'LOCAL', TRUE),
    ('customer20', '$2a$10$TQhZ2iB1qZ1bEOxm0.DinurTA0O.qao17BkgbReJoSFHwDXQgcvWW', 'LOCAL', TRUE);


/* ===================== BƯỚC 2: LIÊN KẾT 20 KHÁCH HÀNG (CUSTOMERS) ===================== */

INSERT INTO customers (customer_code, full_name, date_of_birth, gender, phone_number, email, identity_card, address, total_spending, account_id)
VALUES
-- KH1 -> customer1
('KH1', 'Nguyen Van A', '1995-01-01', 'NAM', '0911111101', 'kh1@mail.com', '001095000001', 'Ha Noi', 0,
 (SELECT id FROM accounts WHERE username = 'customer1')),

-- KH2 -> customer2
('KH2', 'Tran Thi B', '1996-02-02', 'NU', '0911111102', 'kh2@mail.com', '001096000002', 'Ho Chi Minh', 5000000,
 (SELECT id FROM accounts WHERE username = 'customer2')),

-- KH3 -> customer3
('KH3', 'Le Van C', '1997-03-03', 'NAM', '0911111103', 'kh3@mail.com', '001097000003', 'Da Nang', 1200000,
 (SELECT id FROM accounts WHERE username = 'customer3')),

-- KH4 -> customer4
('KH4', 'Pham Thi D', '1998-04-04', 'NU', '0911111104', 'kh4@mail.com', '001098000004', 'Hai Phong', 0,
 (SELECT id FROM accounts WHERE username = 'customer4')),

-- KH5 -> customer5
('KH5', 'Hoang Van E', '1999-05-05', 'NAM', '0911111105', 'kh5@mail.com', '001099000005', 'Can Tho', 0,
 (SELECT id FROM accounts WHERE username = 'customer5')),

-- KH6 -> customer6
('KH6', 'Do Thi F', '1993-06-06', 'NU', '0911111106', 'kh6@mail.com', '001093000006', 'Hue', 0,
 (SELECT id FROM accounts WHERE username = 'customer6')),

-- KH7 -> customer7
('KH7', 'Vu Van G', '1988-07-07', 'NAM', '0911111107', 'kh7@mail.com', '001088000007', 'Nghe An', 0,
 (SELECT id FROM accounts WHERE username = 'customer7')),

-- KH8 -> customer8
('KH8', 'Dang Thi H', '2000-08-08', 'NU', '0911111108', 'kh8@mail.com', '001200000008', 'Quang Ninh', 0,
 (SELECT id FROM accounts WHERE username = 'customer8')),

-- KH9 -> customer9
('KH9', 'Bui Van I', '1991-09-09', 'NAM', '0911111109', 'kh9@mail.com', '001091000009', 'Bac Ninh', 0,
 (SELECT id FROM accounts WHERE username = 'customer9')),

-- KH10 -> customer10
('KH10', 'Ngo Thi K', '1997-10-10', 'NU', '0911111110', 'kh10@mail.com', '001097000010', 'Da Lat', 0,
 (SELECT id FROM accounts WHERE username = 'customer10')),

-- KH11 -> customer11
('KH11', 'Ly Van L', '1985-11-11', 'NAM', '0911111111', 'kh11@mail.com', '001085000011', 'Hai Duong', 0,
 (SELECT id FROM accounts WHERE username = 'customer11')),

-- KH12 -> customer12
('KH12', 'Duong Thi M', '2001-12-12', 'NU', '0911111112', 'kh12@mail.com', '001201000012', 'Nam Dinh', 0,
 (SELECT id FROM accounts WHERE username = 'customer12')),

-- KH13 -> customer13
('KH13', 'Cao Van N', '1994-01-13', 'NAM', '0911111113', 'kh13@mail.com', '001094000013', 'Thanh Hoa', 0,
 (SELECT id FROM accounts WHERE username = 'customer13')),

-- KH14 -> customer14
('KH14', 'Phan Thi O', '1996-02-14', 'NU', '0911111114', 'kh14@mail.com', '001096000014', 'Khanh Hoa', 0,
 (SELECT id FROM accounts WHERE username = 'customer14')),

-- KH15 -> customer15
('KH15', 'Truong Van P', '1990-03-15', 'NAM', '0911111115', 'kh15@mail.com', '001090000015', 'Dong Nai', 0,
 (SELECT id FROM accounts WHERE username = 'customer15')),

-- KH16 -> customer16
('KH16', 'Dinh Thi Q', '1989-04-16', 'NU', '0911111116', 'kh16@mail.com', '001089000016', 'Binh Duong', 0,
 (SELECT id FROM accounts WHERE username = 'customer16')),

-- KH17 -> customer17
('KH17', 'Lam Van R', '1993-05-17', 'NAM', '0911111117', 'kh17@mail.com', '001093000017', 'Long An', 0,
 (SELECT id FROM accounts WHERE username = 'customer17')),

-- KH18 -> customer18
('KH18', 'Mai Thi S', '2002-06-18', 'NU', '0911111118', 'kh18@mail.com', '001202000018', 'Tien Giang', 0,
 (SELECT id FROM accounts WHERE username = 'customer18')),

-- KH19 -> customer19
('KH19', 'Trinh Van T', '1995-07-19', 'NAM', '0911111119', 'kh19@mail.com', '001095000019', 'Kien Giang', 0,
 (SELECT id FROM accounts WHERE username = 'customer19')),

-- KH20 -> customer20
('KH20', 'Vo Thi U', '1998-08-20', 'NU', '0911111120', 'kh20@mail.com', '001098000020', 'Ca Mau', 0,
 (SELECT id FROM accounts WHERE username = 'customer20'));



/* ===================== AIRPORTS (5) ===================== */
INSERT INTO airports (code, name, city)
VALUES ('HAN', 'Noi Bai', 'Ha Noi'),
       ('HPH', 'Cat Bi', 'Hai Phong'),
       ('DAD', 'Da Nang', 'Da Nang'),
       ('SGN', 'Tan Son Nhat', 'Ho Chi Minh'),
       ('PQC', 'Phu Quoc', 'Kien Giang');

/* ===================== AIRLINES (3) ===================== */
INSERT INTO airlines (code, name, logo_url)
VALUES ('VN', 'Vietnam Airlines',
        'https://danangairport.vn/files/media/202411/d8a44873-4441-4663-8b0b-415a687e7f89.jpg'),
       ('VJ', 'VietJet Air', 'https://danangairport.vn/files/media/202411/VJ.jpg'),
       ('QH', 'Bamboo Airways', 'https://danangairport.vn/files/media/202411/6b1deea9-2644-4164-bfef-e28b69b0f4a4.jpg'),
       ('BL', 'Pacific Airlines', 'https://danangairport.vn/files/media/202501/pacific.jpg'),
       ('7C', 'Jeju Air', 'https://danangairport.vn/files/media/202411/17ed00d1-5fe4-4a85-b847-01b5fed39345.jpg'),
       ('AK', 'Air Asia', 'https://danangairport.vn/files/media/202411/AK.jpg'),
       ('SQ', 'Singapore Airlines',
        'https://danangairport.vn/files/media/202411/b6354f97-8558-4983-94f5-44f5c5fc7fff.jpg');


/* ===================== AIRCRAFTS (10+) ===================== */
INSERT INTO aircrafts (name, registration_code, total_seats, airline_id)
VALUES
-- Vietnam Airlines (ID = 1)
('Airbus A321', 'VN-A321', 184, 1),
('Boeing 787-9 Dreamliner', 'VN-B789', 274, 1),
('Airbus A350-900', 'VN-A350', 305, 1),

-- VietJet Air (ID = 2)
('Airbus A320', 'VJ-A320', 180, 2),
('Airbus A321 Neo', 'VJ-A321N', 230, 2),

-- Bamboo Airways (ID = 3)
('Embraer E190', 'QH-E190', 110, 3),
('Boeing 787-9 Dreamliner', 'QH-B789', 290, 3),

-- Pacific Airlines (ID = 4)
('Airbus A320-200', 'BL-A320', 174, 4),

-- Jeju Air (ID = 5)
('Boeing 737-800', '7C-B738', 189, 5),

-- Air Asia (ID = 6)
('Airbus A321', 'AK-A321', 220, 6),

-- Singapore Airlines (ID = 7)
('Airbus A350-900', 'SQ-A359', 300, 7);


/* ===================== FLIGHTS (10) ===================== */
INSERT INTO flights
(flight_number, aircraft_id, departure_airport_id, arrival_airport_id, departure_time, arrival_time, status)
VALUES ('VN201', 1, 1, 4, '2026-01-10 08:00', '2026-01-10 10:00', 'SCHEDULED'),
       ('VN202', 2, 4, 1, '2026-01-11 14:00', '2026-01-11 16:30', 'SCHEDULED'),
       ('VJ301', 3, 4, 3, '2026-01-12 09:00', '2026-01-12 10:20', 'SCHEDULED'),
       ('QH901', 4, 3, 1, '2026-01-12 15:00', '2026-01-12 17:00', 'SCHEDULED'),
       ('VN203', 1, 1, 3, '2026-01-13 07:30', '2026-01-13 09:00', 'SCHEDULED'),
       ('VJ302', 3, 3, 4, '2026-01-14 18:00', '2026-01-14 19:30', 'SCHEDULED'),
       ('VN204', 2, 4, 5, '2026-01-15 13:20', '2026-01-15 15:00', 'SCHEDULED'),
       ('QH902', 4, 5, 4, '2026-01-16 06:00', '2026-01-16 07:40', 'SCHEDULED'),
       ('VN205', 1, 5, 1, '2026-01-17 11:10', '2026-01-17 13:00', 'SCHEDULED'),
       ('VJ303', 3, 1, 5, '2026-01-18 21:00', '2026-01-18 23:00', 'SCHEDULED');

/* ===================== BOOKINGS DEMO (30) ===================== */
INSERT INTO bookings
(booking_code, booking_date, total_amount, status, channel, trip_type,
 contact_email, contact_phone, payment_method, payment_status,
 transaction_code, paid_at, customer_account_id, created_by_sales_id)
VALUES
-- ===== DEC 2025 =====
('BK0001', '2025-12-20 10:00', 1800000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo1@mail.com', '0911111111', 'CASH', 'PAID', 'TRX0001', '2025-12-20 10:05', 10, 1),
('BK0002', '2025-12-21 11:00', 2000000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo2@mail.com', '0911111112', 'CASH', 'PAID', 'TRX0002', '2025-12-21 11:03', 11, 1),
('BK0003', '2025-12-22 09:30', 2200000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo3@mail.com', '0911111113', 'CASH', 'PAID', 'TRX0003', '2025-12-22 09:35', 12, 2),
('BK0004', '2025-12-25 08:40', 2400000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo4@mail.com', '0911111114', 'CASH', 'PAID', 'TRX0004', '2025-12-25 08:45', 13, 2),
('BK0005', '2025-12-27 19:00', 2600000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo5@mail.com', '0911111115', 'CASH', 'PAID', 'TRX0005', '2025-12-27 19:05', 14, 3),
('BK0006', '2025-12-29 14:10', 2800000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo6@mail.com', '0911111116', 'CASH', 'PAID', 'TRX0006', '2025-12-29 14:12', 15, 4),
('BK0007', '2025-12-30 20:20', 3000000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo7@mail.com', '0911111117', 'CASH', 'PAID', 'TRX0007', '2025-12-30 20:22', 16, 5),
('BK0008', '2025-12-31 16:30', 3200000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo8@mail.com', '0911111118', 'CASH', 'PAID', 'TRX0008', '2025-12-31 16:32', 17, 5),

-- ===== WEEK 01/2026 (1–4 JAN) =====
('BK0009', '2026-01-01 09:00', 2100000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo9@mail.com', '0911111119', 'CASH', 'PAID', 'TRX0009', '2026-01-01 09:05', 18, 2),
('BK0010', '2026-01-01 15:10', 2300000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo10@mail.com', '0911111120', 'CASH', 'PAID', 'TRX0010', '2026-01-01 15:12', 19, 3),
('BK0011', '2026-01-01 18:20', 2500000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo1@mail.com', '0911111111', 'CASH', 'PAID', 'TRX0011', '2026-01-01 18:23', 10, 5),
('BK0012', '2026-01-01 21:30', 2600000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo2@mail.com', '0911111112', 'CASH', 'PAID', 'TRX0012', '2026-01-01 21:33', 11, 1),

('BK0013', '2026-01-02 09:30', 2700000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo3@mail.com', '0911111113', 'CASH', 'PAID', 'TRX0013', '2026-01-02 09:32', 12, 2),
('BK0014', '2026-01-02 12:00', 2800000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo4@mail.com', '0911111114', 'CASH', 'PAID', 'TRX0014', '2026-01-02 12:03', 13, 4),
('BK0015', '2026-01-02 14:10', 2900000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo5@mail.com', '0911111115', 'CASH', 'PAID', 'TRX0015', '2026-01-02 14:12', 14, 2),
('BK0016', '2026-01-02 19:40', 3000000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo6@mail.com', '0911111116', 'CASH', 'PAID', 'TRX0016', '2026-01-02 19:42', 15, 2),

('BK0017', '2026-01-03 08:10', 3200000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo7@mail.com', '0911111117', 'CASH', 'PAID', 'TRX0017', '2026-01-03 08:12', 16, 4),
('BK0018', '2026-01-03 10:00', 3100000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo8@mail.com', '0911111118', 'CASH', 'PAID', 'TRX0018', '2026-01-03 10:03', 17, 2),
('BK0019', '2026-01-03 15:20', 3300000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo9@mail.com', '0911111119', 'CASH', 'PAID', 'TRX0019', '2026-01-03 15:21', 18, 5),
('BK0020', '2026-01-03 17:20', 3400000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo10@mail.com', '0911111120', 'CASH', 'PAID', 'TRX0020', '2026-01-03 17:22', 19, 4),
('BK0021', '2026-01-03 20:20', 3500000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo1@mail.com', '0911111111', 'CASH', 'PAID', 'TRX0021', '2026-01-03 20:22', 10, 1),
('BK0022', '2026-01-03 22:20', 3600000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo2@mail.com', '0911111112', 'CASH', 'PAID', 'TRX0022', '2026-01-03 22:22', 11, 2),

('BK0023', '2026-01-04 09:15', 3700000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo3@mail.com', '0911111113', 'CASH', 'PAID', 'TRX0023', '2026-01-04 09:17', 12, 4),
('BK0024', '2026-01-04 11:20', 3800000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo4@mail.com', '0911111114', 'CASH', 'PAID', 'TRX0024', '2026-01-04 11:23', 13, 2),
('BK0025', '2026-01-04 14:50', 3900000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo5@mail.com', '0911111115', 'CASH', 'PAID', 'TRX0025', '2026-01-04 14:52', 14, 3),
('BK0026', '2026-01-04 17:10', 4000000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo6@mail.com', '0911111116', 'CASH', 'PAID', 'TRX0026', '2026-01-04 17:12', 15, 1),
('BK0027', '2026-01-04 18:30', 4100000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo7@mail.com', '0911111117', 'CASH', 'PAID', 'TRX0027', '2026-01-04 18:32', 16, 2),
('BK0028', '2026-01-04 21:00', 4200000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo8@mail.com', '0911111118', 'CASH', 'PAID', 'TRX0028', '2026-01-04 21:03', 17, 1),

-- ===== DEMO DAY — 05/01/2026 =====
('BK0029', '2026-01-05 09:10', 4500000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo1@mail.com', '0911111111', 'CASH', 'PAID', 'TRX0029', '2026-01-05 09:13', 10, 1),
('BK0030', '2026-01-05 10:00', 4600000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo2@mail.com', '0911111112', 'CASH', 'PAID', 'TRX0030', '2026-01-05 10:02', 11, 2);

INSERT INTO tickets
(seat_number, ticket_number, passenger_name, passenger_dob,
 seat_class, price, booking_id, flight_id, status)
VALUES
-- Booking 1..8 → Flight 1
('1A', 'TCK0001', 'Nguyen Van Demo 1', '1995-01-01', 'ECONOMY', 1800000, 1, 1, 'BOOKED'),
('2A', 'TCK0002', 'Nguyen Van Demo 2', '1996-02-02', 'ECONOMY', 2000000, 2, 1, 'BOOKED'),
('3A', 'TCK0003', 'Nguyen Van Demo 3', '1997-03-03', 'ECONOMY', 2200000, 3, 1, 'BOOKED'),
('4A', 'TCK0004', 'Nguyen Van Demo 4', '1998-04-04', 'ECONOMY', 2400000, 4, 1, 'BOOKED'),
('5A', 'TCK0005', 'Nguyen Van Demo 5', '1999-05-05', 'ECONOMY', 2600000, 5, 1, 'BOOKED'),
('6A', 'TCK0006', 'Nguyen Van Demo 6', '1995-01-01', 'ECONOMY', 2800000, 6, 1, 'BOOKED'),
('7A', 'TCK0007', 'Nguyen Van Demo 7', '1996-02-02', 'ECONOMY', 3000000, 7, 1, 'BOOKED'),
('8A', 'TCK0008', 'Nguyen Van Demo 8', '1997-03-03', 'ECONOMY', 3200000, 8, 1, 'BOOKED'),

-- Booking 9..16 → Flight 2
('1B', 'TCK0009', 'Nguyen Van Demo 9', '1998-04-04', 'ECONOMY', 2100000, 9, 2, 'BOOKED'),
('2B', 'TCK0010', 'Nguyen Van Demo 10', '1999-05-05', 'ECONOMY', 2300000, 10, 2, 'BOOKED'),
('3B', 'TCK0011', 'Nguyen Van Demo 1', '1995-01-01', 'ECONOMY', 2500000, 11, 2, 'BOOKED'),
('4B', 'TCK0012', 'Nguyen Van Demo 2', '1996-02-02', 'ECONOMY', 2600000, 12, 2, 'BOOKED'),
('5B', 'TCK0013', 'Nguyen Van Demo 3', '1997-03-03', 'ECONOMY', 2700000, 13, 2, 'BOOKED'),
('6B', 'TCK0014', 'Nguyen Van Demo 4', '1998-04-04', 'ECONOMY', 2800000, 14, 2, 'BOOKED'),
('7B', 'TCK0015', 'Nguyen Van Demo 5', '1999-05-05', 'ECONOMY', 2900000, 15, 2, 'BOOKED'),
('8B', 'TCK0016', 'Nguyen Van Demo 6', '1995-01-01', 'ECONOMY', 3000000, 16, 2, 'BOOKED'),

-- Booking 17..24 → Flight 3
('1C', 'TCK0017', 'Nguyen Van Demo 7', '1996-02-02', 'ECONOMY', 3200000, 17, 3, 'BOOKED'),
('2C', 'TCK0018', 'Nguyen Van Demo 8', '1997-03-03', 'ECONOMY', 3100000, 18, 3, 'BOOKED'),
('3C', 'TCK0019', 'Nguyen Van Demo 9', '1998-04-04', 'ECONOMY', 3300000, 19, 3, 'BOOKED'),
('4C', 'TCK0020', 'Nguyen Van Demo 10', '1999-05-05', 'ECONOMY', 3400000, 20, 3, 'BOOKED'),
('5C', 'TCK0021', 'Nguyen Van Demo 1', '1995-01-01', 'ECONOMY', 3500000, 21, 3, 'BOOKED'),
('6C', 'TCK0022', 'Nguyen Van Demo 2', '1996-02-02', 'ECONOMY', 3600000, 22, 3, 'BOOKED'),
('7C', 'TCK0023', 'Nguyen Van Demo 3', '1997-03-03', 'ECONOMY', 3700000, 23, 3, 'BOOKED'),
('8C', 'TCK0024', 'Nguyen Van Demo 4', '1998-04-04', 'ECONOMY', 3800000, 24, 3, 'BOOKED'),

-- Booking 25..30 → Flight 4
('1D', 'TCK0025', 'Nguyen Van Demo 5', '1999-05-05', 'ECONOMY', 3900000, 25, 4, 'BOOKED'),
('2D', 'TCK0026', 'Nguyen Van Demo 6', '1995-01-01', 'ECONOMY', 4000000, 26, 4, 'BOOKED'),
('3D', 'TCK0027', 'Nguyen Van Demo 7', '1996-02-02', 'ECONOMY', 4100000, 27, 4, 'BOOKED'),
('4D', 'TCK0028', 'Nguyen Van Demo 8', '1997-03-03', 'ECONOMY', 4200000, 28, 4, 'BOOKED'),
('5D', 'TCK0029', 'Nguyen Van Demo 9', '1998-04-04', 'ECONOMY', 4300000, 29, 4, 'BOOKED'),
('6D', 'TCK0030', 'Nguyen Van Demo 10', '1999-05-05', 'ECONOMY', 4400000, 30, 4, 'BOOKED');


/* ===================== SEAT CONFIG ===================== */
INSERT INTO flight_seat_details (flight_id, seat_class, price, total_seats, available_seats)
VALUES (1, 'ECONOMY', 1500000, 150, 150),
       (1, 'BUSINESS', 3500000, 30, 30),
       (2, 'ECONOMY', 1800000, 200, 200),
       (2, 'BUSINESS', 4200000, 40, 40),
       (3, 'ECONOMY', 1200000, 160, 160),
       (3, 'BUSINESS', 3000000, 20, 20),
       (4, 'ECONOMY', 1300000, 90, 90),
       (4, 'BUSINESS', 2800000, 20, 20),
       (5, 'ECONOMY', 1600000, 150, 150),
       (5, 'BUSINESS', 3600000, 30, 30),
       (6, 'ECONOMY', 1400000, 180, 180),
       (6, 'BUSINESS', 3300000, 30, 30),
       (7, 'ECONOMY', 1700000, 200, 200),
       (7, 'BUSINESS', 4000000, 40, 40),
       (8, 'ECONOMY', 1450000, 100, 100),
       (8, 'BUSINESS', 3100000, 10, 10),
       (9, 'ECONOMY', 1550000, 150, 150),
       (9, 'BUSINESS', 3500000, 30, 30),
       (10, 'ECONOMY', 1750000, 180, 180),
       (10, 'BUSINESS', 4200000, 30, 30);

-- INSERT INTO accounts (username, password, ...) VALUES ('admin', '...', ...);



INSERT INTO news (title, slug, summary, email, content, thumbnail, category, is_active, published_at, account_id)
VALUES
    -- =================================================================================
    -- DANH MỤC 1: NEWS (TIN TỨC & CẨM NANG DU LỊCH)
    -- =================================================================================
    (
        'Kinh nghiệm du lịch Đà Nẵng - Hội An 4 ngày 3 đêm tự túc chi tiết nhất 2025',
        'kinh-nghiem-du-lich-da-nang-hoi-an',
        'Lịch trình chi tiết khám phá cầu Rồng, Bà Nà Hills và phố cổ Hội An với chi phí tối ưu cho cặp đôi và gia đình.',
        'admin@example.com',
        '
        <p>Đà Nẵng không chỉ nổi tiếng với những cây cầu độc đáo mà còn là cửa ngõ dẫn đến phố cổ Hội An thơ mộng. Dưới đây là lịch trình 4 ngày 3 đêm được tối ưu hóa cho du khách lần đầu ghé thăm.</p>

        <h3 class="text-primary mt-4">Ngày 1: Khám phá Bán đảo Sơn Trà & Biển Mỹ Khê</h3>
        <p>Buổi sáng, sau khi đáp sân bay, bạn nên thuê xe máy di chuyển lên <strong>Bán đảo Sơn Trà</strong>. Đừng quên ghé thăm Chùa Linh Ứng để chiêm ngưỡng tượng Phật Bà Quan Âm cao nhất Việt Nam.</p>
        <p>Buổi chiều là thời gian lý tưởng để đắm mình trong làn nước xanh mát của <strong>biển Mỹ Khê</strong> - một trong 6 bãi biển quyến rũ nhất hành tinh.</p>

        <h3 class="text-primary mt-4">Ngày 2: Bà Nà Hills - Đường lên tiên cảnh</h3>
        <ul>
            <li><strong>08:00:</strong> Khởi hành đi Bà Nà Hills. Check-in tại Cầu Vàng (Golden Bridge).</li>
            <li><strong>12:00:</strong> Thưởng thức buffet trưa tại Làng Pháp.</li>
            <li><strong>15:00:</strong> Tham gia các trò chơi tại Fantasy Park.</li>
        </ul>

        <h3 class="text-primary mt-4">Ngày 3: Phố cổ Hội An</h3>
        <p>Cách Đà Nẵng khoảng 30km, Hội An đẹp nhất về đêm khi những chiếc đèn lồng được thắp sáng. Bạn nhất định phải thử món <em>Cao Lầu</em> và <em>Bánh mì Phượng</em> trứ danh tại đây.</p>
        ',
        'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b',
        'NEWS', 1, NOW(), 1
    ),
    (
        'Top 10 món ngon Hà Nội "gây thương nhớ" cho thực khách phương xa',
        'top-10-mon-ngon-ha-noi',
        'Từ Phở bò gia truyền, Bún chả Obama đến Cà phê trứng - Những hương vị tinh túy của ẩm thực Hà Thành bạn nhất định phải thử.',
        'foodie@example.com',
        '
        <p>Ẩm thực Hà Nội là sự kết hợp tinh tế giữa nguyên liệu tươi ngon và cách chế biến cầu kỳ. Dưới đây là danh sách những món ăn bạn không thể bỏ lỡ:</p>

        <h4 class="fw-bold">1. Phở Bò</h4>
        <p>Không chỉ là món ăn sáng, Phở là linh hồn của Hà Nội. Nước dùng thanh ngọt, bánh phở mềm dai hòa quyện cùng thịt bò tái lăn.</p>

        <h4 class="fw-bold">2. Bún Chả</h4>
        <p>Món ăn từng được Tổng thống Obama thưởng thức. Chả nướng than hoa thơm lừng ăn kèm nước chấm chua ngọt đu đủ xanh.</p>

        <h4 class="fw-bold">3. Cà phê trứng</h4>
        <p>Một thức uống béo ngậy, thơm lừng không hề tanh, được ví như "Cappuccino của Việt Nam".</p>
        <div class="alert alert-info">
            <strong>Gợi ý địa chỉ:</strong> Giảng Café (Yên Phụ) hoặc Đinh Café (Bờ Hồ).
        </div>
        ',
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
        'NEWS', 1, NOW() - INTERVAL 1 DAY, 1
    ),
    (
        'Review chi tiết Phú Quốc 3N2Đ: Thiên đường nghỉ dưỡng',
        'review-phu-quoc-thien-duong',
        'Khám phá Bãi Sao, cáp treo Hòn Thơm và ngắm hoàng hôn cực phẩm tại Sunset Sanato. Mẹo đặt phòng và vé máy bay giá tốt.',
        'traveler@example.com',
        '
        <p>Phú Quốc mùa này biển êm và nắng đẹp, cực kỳ thích hợp cho các hoạt động lặn ngắm san hô.</p>
        <h3 class="text-success">Di chuyển</h3>
        <p>Vé máy bay khứ hồi từ HCM đi Phú Quốc hiện đang có giá rất tốt, chỉ khoảng 1.500.000đ nếu đặt trước 2 tuần.</p>
        <h3 class="text-success">Lưu trú</h3>
        <p>Khu vực Dương Đông là trung tâm, thuận tiện đi lại. Nếu thích yên tĩnh, bạn có thể chọn các resort ở Bãi Ông Lang.</p>
        <h3 class="text-success">Lịch trình tham khảo</h3>
        <ul>
            <li><strong>Ngày 1:</strong> Tour 4 đảo, lặn ngắm san hô.</li>
            <li><strong>Ngày 2:</strong> VinWonders & Safari.</li>
            <li><strong>Ngày 3:</strong> Chợ đêm Phú Quốc và mua quà lưu niệm.</li>
        </ul>
        ',
        'https://r2.nucuoimekong.com/wp-content/uploads/combo-vinpearl-phu-quoc-nu-cuoi-me-kong.webp',
        'NEWS', 1, NOW() - INTERVAL 2 DAY, 1
    ),
    (
        'Bí kíp chuẩn bị hành lý khi đi máy bay: Gọn nhẹ và đầy đủ',
        'bi-kip-chuan-bi-hanh-ly',
        'Hướng dẫn cách xếp đồ thông minh (KonMari), quy định về chất lỏng và pin sạc dự phòng để qua cửa an ninh nhanh chóng.',
        'support@example.com',
        '
        <p>Việc đóng gói hành lý sao cho vừa gọn, vừa đủ cân luôn là bài toán khó. Hãy áp dụng quy tắc 5-4-3-2-1 cho chuyến đi 1 tuần:</p>
        <ul>
            <li>5 bộ đồ lót</li>
            <li>4 chiếc áo thun/sơ mi</li>
            <li>3 chiếc quần/váy</li>
            <li>2 đôi giày</li>
            <li>1 chiếc mũ/nón</li>
        </ul>
        <h3 class="text-danger">Lưu ý quan trọng về Pin sạc dự phòng</h3>
        <p>Tuyệt đối không để pin sạc dự phòng trong hành lý ký gửi. Bạn bắt buộc phải mang theo trong hành lý xách tay và công suất không quá 100Wh.</p>
        ',
        'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6',
        'NEWS', 1, NOW() - INTERVAL 3 DAY, 1
    ),
    (
        'Khám phá hang Sơn Đoòng - Hang động lớn nhất thế giới',
        'kham-pha-hang-son-doong',
        'Hành trình thám hiểm kỳ quan thiên nhiên thế giới ngay tại Quảng Bình. Những điều cần biết về thể lực và chi phí trước khi đăng ký tour.',
        'adventure@example.com',
        '
        <p>Sơn Đoòng không chỉ là một hang động, nó là một thế giới ngầm với hệ sinh thái riêng biệt, có cả rừng nguyên sinh và sông ngầm bên trong.</p>
        <h3>Độ khó: Cấp độ 6 (Rất khó)</h3>
        <p>Tour thám hiểm yêu cầu bạn phải có thể lực cực tốt. Bạn sẽ phải đi bộ băng rừng, leo vách đá và lội suối trong suốt 4 ngày 3 đêm.</p>
        <h3>Chi phí</h3>
        <p>Hiện tại Oxalis Adventure là đơn vị duy nhất được cấp phép khai thác tour này. Chi phí khoảng 3.000 USD/người (khoảng 70 triệu VND).</p>
        ',
        'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd',
        'NEWS', 1, NOW() - INTERVAL 4 DAY, 1
    ),
    (
        'Du lịch một mình (Solo Travel): Xu hướng mới của giới trẻ',
        'du-lich-mot-minh-solo-travel',
        'Tại sao bạn nên thử đi du lịch một mình ít nhất một lần trong đời? Những kỹ năng sinh tồn, an toàn và cách kết bạn trên đường đi.',
        'lifestyle@example.com',
        '
        <p>Solo Travel là cơ hội tuyệt vời để bạn lắng nghe bản thân và bước ra khỏi vùng an toàn.</p>
        <h3>Lợi ích</h3>
        <ul>
            <li>Tự do về thời gian và lịch trình.</li>
            <li>Dễ dàng kết bạn mới từ khắp nơi trên thế giới.</li>
            <li>Rèn luyện kỹ năng giải quyết vấn đề độc lập.</li>
        </ul>
        <h3>Mẹo an toàn</h3>
        <p>Luôn gửi định vị cho người thân, không đi quá khuya ở nơi vắng vẻ và tìm hiểu kỹ văn hóa địa phương trước khi đến.</p>
        ',
        'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800',
        'NEWS', 1, NOW() - INTERVAL 5 DAY, 1
    ),

    -- =================================================================================
    -- DANH MỤC 2: PROMOTION (KHUYẾN MÃI)
    -- =================================================================================
    (
        'Săn vé 0 đồng - Bay thả ga mùa lễ hội 2025',
        'san-ve-0-dong-mua-le-hoi',
        'Cơ hội sở hữu vé máy bay giá chỉ từ 0 đồng (chưa bao gồm thuế phí) trong khung giờ vàng 12h - 14h mỗi ngày.',
        'marketing@example.com',
        '
        <h2 class="text-danger fw-bold">CHƯƠNG TRÌNH KHUYẾN MÃI LỚN NHẤT NĂM</h2>
        <p>Chào đón mùa du lịch cao điểm, hãng hàng không tung ra 1.000.000 vé giá rẻ.</p>

        <h4>Chi tiết chương trình:</h4>
        <ul>
            <li><strong>Thời gian đặt vé:</strong> 12:00 - 14:00 mỗi ngày.</li>
            <li><strong>Thời gian bay:</strong> 01/06/2025 - 31/12/2025.</li>
            <li><strong>Chặng bay áp dụng:</strong> Tất cả các đường bay nội địa.</li>
        </ul>
        <p class="fst-italic text-muted">*Lưu ý: Giá vé chưa bao gồm thuế, phí sân bay và các khoản phụ thu khác.</p>
        ',
        'https://images.unsplash.com/photo-1436491865332-7a61a109cc05',
        'PROMOTION', 1, NOW(), 1
    ),
    (
        'Ưu đãi chào hè: Giảm 30% cho nhóm đặt từ 4 người',
        'uu-dai-chao-he-giam-30',
        'Rủ càng đông, giá càng rẻ! Áp dụng cho các chặng bay đến Nha Trang, Đà Nẵng, Quy Nhơn khởi hành trong tháng 6.',
        'sales@example.com',
        '
        <p>Bạn đang lên kế hoạch du lịch cùng hội bạn thân hay gia đình? Đừng bỏ lỡ ưu đãi nhóm cực hời này.</p>
        <h3>Điều kiện áp dụng:</h3>
        <ul>
            <li>Nhóm khách từ 04 người lớn trở lên đi cùng nhau (cùng mã đặt chỗ).</li>
            <li>Giảm trực tiếp <strong>30% giá vé cơ bản</strong>.</li>
            <li>Không áp dụng hoàn hủy vé.</li>
        </ul>
        <p>Hãy nhanh tay đặt vé để có một mùa hè rực rỡ bên những người thân yêu!</p>
        ',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
        'PROMOTION', 1, NOW() - INTERVAL 1 DAY, 1
    ),
    (
        'Combo trọn gói: Vé máy bay + Khách sạn 5 sao Phú Quốc chỉ 3.999k',
        'combo-ve-may-bay-khach-san-phu-quoc',
        'Tận hưởng kỳ nghỉ dưỡng sang chảnh 3N2Đ tại Vinpearl Phú Quốc bao gồm vé máy bay khứ hồi và buffet sáng hàng ngày.',
        'marketing@example.com',
        '
        <p>Chỉ với <strong>3.999.000 VNĐ/khách</strong>, bạn sẽ nhận được:</p>
        <ul class="list-group list-group-flush mb-3">
            <li class="list-group-item"><i class="bi bi-check-circle-fill text-success me-2"></i> Vé máy bay khứ hồi (bao gồm 7kg hành lý xách tay).</li>
            <li class="list-group-item"><i class="bi bi-check-circle-fill text-success me-2"></i> 02 đêm nghỉ tại phòng Deluxe hướng biển.</li>
            <li class="list-group-item"><i class="bi bi-check-circle-fill text-success me-2"></i> Buffet sáng chuẩn quốc tế.</li>
            <li class="list-group-item"><i class="bi bi-check-circle-fill text-success me-2"></i> Miễn phí vé vào cửa VinWonders 1 ngày.</li>
        </ul>
        <p>Số lượng có hạn. Vui lòng liên hệ hotline để kiểm tra tình trạng phòng trống.</p>
        ',
        'https://images.unsplash.com/photo-1582719508461-905c673771fd',
        'PROMOTION', 1, NOW() - INTERVAL 2 DAY, 1
    ),
    (
        'Giảm 200K khi thanh toán qua thẻ tín dụng VIB',
        'giam-200k-thanh-toan-vib',
        'Nhập mã VIBFLY200 tại bước thanh toán để được giảm ngay 200.000đ cho đơn hàng từ 2 triệu đồng. Số lượng mã có hạn mỗi ngày.',
        'partners@example.com',
        '
        <p>Chương trình hợp tác đặc biệt giữa Hãng hàng không và Ngân hàng Quốc tế VIB.</p>
        <h3>Hướng dẫn nhận ưu đãi:</h3>
        <ol>
            <li>Truy cập website hoặc ứng dụng đặt vé.</li>
            <li>Chọn chuyến bay và điền thông tin hành khách.</li>
            <li>Tại bước thanh toán, chọn phương thức "Thẻ tín dụng/Ghi nợ".</li>
            <li>Sử dụng thẻ VIB và nhập mã <strong>VIBFLY200</strong>.</li>
        </ol>
        <p>Chương trình diễn ra vào các ngày thứ 6, 7, Chủ nhật hàng tuần.</p>
        ',
        'https://tintuc.ngan-hang.com/media/blog/1710378498394.png',
        'PROMOTION', 1, NOW() - INTERVAL 3 DAY, 1
    ),
    (
        'Thứ 4 bay thỏa thích - Đồng giá 99K toàn mạng bay',
        'thu-4-bay-thoa-thich',
        'Thứ 4 hàng tuần, mở bán hàng ngàn vé đồng giá 99K. Lên lịch săn vé ngay hôm nay để không bỏ lỡ.',
        'sales@example.com',
        '
        <p>Đánh bay nỗi lo về giá vé máy bay. Vào mỗi thứ 4 hàng tuần, chúng tôi tung ra hàng loạt vé đồng giá <strong>99.000 VNĐ</strong>.</p>
        <p>Áp dụng cho các chặng bay ngắn như: HCM - Đà Lạt, HCM - Nha Trang, Hà Nội - Đà Nẵng...</p>
        <p><em>Lưu ý: Giá vé chưa bao gồm thuế phí. Vé khuyến mãi không được phép hoàn/hủy.</em></p>
        ',
        'https://images.unsplash.com/photo-1529074963764-98f45c47344b',
        'PROMOTION', 1, NOW() - INTERVAL 4 DAY, 1
    ),
    (
        'Tặng ngay 15kg hành lý ký gửi cho hội viên mới',
        'tang-hanh-ly-ky-gui-hoi-vien-moi',
        'Đăng ký thành viên Loyalty ngay hôm nay để nhận ưu đãi miễn phí 15kg hành lý ký gửi cho chuyến bay đầu tiên.',
        'loyalty@example.com',
        '
        <p>Bạn chưa là thành viên? Hãy đăng ký ngay để hưởng đặc quyền:</p>
        <ul>
            <li>Miễn phí 15kg hành lý ký gửi (trị giá 300.000đ).</li>
            <li>Tích điểm trên mỗi chuyến bay.</li>
            <li>Ưu tiên làm thủ tục tại quầy.</li>
        </ul>
        <p>Chương trình áp dụng cho khách hàng đăng ký mới từ ngày 01/01/2025.</p>
        ',
        'https://images.unsplash.com/photo-1553531384-cc64ac80f931',
        'PROMOTION', 1, NOW() - INTERVAL 5 DAY, 1
    ),

    -- =================================================================================
    -- DANH MỤC 3: ANNOUNCEMENT (THÔNG BÁO)
    -- =================================================================================
    (
        'Thông báo lịch hoạt động dịp Tết Nguyên Đán Ất Tỵ 2025',
        'thong-bao-lich-nghi-tet-2025',
        'Cập nhật lịch làm việc của phòng vé và tổng đài chăm sóc khách hàng trong dịp nghỉ lễ lớn nhất trong năm.',
        'admin@example.com',
        '
        <p>Kính gửi Quý khách hàng,</p>
        <p>Để thuận tiện cho việc đặt vé và hỗ trợ trong dịp Tết, chúng tôi xin thông báo lịch làm việc như sau:</p>
        <ul>
            <li><strong>Hệ thống đặt vé online:</strong> Hoạt động 24/7 xuyên Tết.</li>
            <li><strong>Tổng đài hỗ trợ (Hotline):</strong> Hoạt động từ 06:00 - 22:00 hàng ngày (kể cả Mùng 1 Tết).</li>
            <li><strong>Văn phòng đại diện:</strong> Nghỉ từ 29 Tết đến hết Mùng 5 Tết.</li>
        </ul>
        <p>Kính chúc Quý khách một năm mới An Khang - Thịnh Vượng!</p>
        ',
        'https://images.unsplash.com/photo-1512909481869-0eaa1e9817ba',
        'ANNOUNCEMENT', 1, NOW(), 1
    ),
    (
        'Quy định mới về giấy tờ tùy thân khi đi máy bay (Áp dụng từ 01/2025)',
        'quy-dinh-giay-to-tuy-than-2025',
        'Hành khách lưu ý mang theo CCCD gắn chip hoặc sử dụng tài khoản VNeID định danh mức 2 để làm thủ tục nhanh chóng.',
        'legal@example.com',
        '
        <div class="alert alert-warning">
            <strong>Thông báo quan trọng:</strong> Từ ngày 01/01/2025, các sân bay sẽ siết chặt quy định kiểm tra giấy tờ.
        </div>
        <p>Các loại giấy tờ được chấp nhận:</p>
        <ol>
            <li>Hộ chiếu (còn hạn ít nhất 6 tháng).</li>
            <li>Căn cước công dân (CCCD) gắn chip.</li>
            <li>Tài khoản định danh điện tử <strong>VNeID mức độ 2</strong> (mở sẵn ứng dụng trên điện thoại).</li>
            <li>Giấy khai sinh bản gốc hoặc bản sao trích lục (đối với trẻ em dưới 14 tuổi).</li>
        </ol>
        <p>Ảnh chụp giấy tờ qua điện thoại sẽ <strong>KHÔNG</strong> được chấp nhận.</p>
        ',
        'https://images.unsplash.com/photo-1628151015968-3a4429e9ef04',
        'ANNOUNCEMENT', 1, NOW() - INTERVAL 1 DAY, 1
    ),
    (
        'Bảo trì hệ thống đặt vé rạng sáng ngày 15/05/2025',
        'bao-tri-he-thong-15-05',
        'Hệ thống sẽ tạm ngưng phục vụ từ 02:00 đến 04:00 để nâng cấp server và tính năng mới. Mong quý khách thông cảm.',
        'tech@example.com',
        '
        <p>Nhằm nâng cao chất lượng dịch vụ và tốc độ xử lý đơn hàng, chúng tôi sẽ tiến hành bảo trì định kỳ.</p>
        <p><strong>Thời gian gián đoạn:</strong> 02:00 - 04:00 sáng ngày 15/05/2025.</p>
        <p>Trong thời gian này, quý khách sẽ không thể truy cập vào website và ứng dụng mobile. Các chuyến bay đã đặt vẫn khởi hành bình thường.</p>
        ',
        'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb',
        'ANNOUNCEMENT', 1, NOW() - INTERVAL 2 DAY, 1
    ),
    (
        'Cảnh báo: Xuất hiện các trang web giả mạo bán vé máy bay Tết',
        'canh-bao-website-gia-mao',
        'Khuyến cáo khách hàng chỉ đặt vé tại website chính thức và ứng dụng di động để tránh bị lừa đảo tiền vé.',
        'security@example.com',
        '
        <p>Gần đây, bộ phận an ninh đã phát hiện nhiều tên miền giả mạo có giao diện giống 99% website chính thức nhằm đánh cắp thông tin thẻ tín dụng.</p>
        <h3>Dấu hiệu nhận biết website giả mạo:</h3>
        <ul>
            <li>Tên miền lạ (ví dụ: .cc, .top, .xyz thay vì .com hoặc .vn).</li>
            <li>Giá vé rẻ bất thường so với thị trường.</li>
            <li>Yêu cầu chuyển khoản vào tài khoản cá nhân.</li>
        </ul>
        <p>Hãy là người tiêu dùng thông thái!</p>
        ',
        'https://images.unsplash.com/photo-1563013544-824ae1b704d3',
        'ANNOUNCEMENT', 1, NOW() - INTERVAL 3 DAY, 1
    ),
    (
        'Thông báo: Thay đổi sảnh chờ tại sân bay Tân Sơn Nhất (Ga Quốc nội)',
        'thay-doi-sanh-cho-tan-son-nhat',
        'Từ ngày 01/06, các chuyến bay đi Hà Nội sẽ làm thủ tục tại sảnh E thay vì sảnh D như trước đây. Quý khách lưu ý.',
        'support@example.com',
        '
        <p>Để giảm tải cho khu vực kiểm soát an ninh soi chiếu, Cảng HKQT Tân Sơn Nhất thực hiện phân luồng lại như sau:</p>
        <ul>
            <li><strong>Vietnam Airlines Group:</strong> Sảnh A, B.</li>
            <li><strong>VietJet Air:</strong> Sảnh C, D.</li>
            <li><strong>Bamboo Airways & Viettravel Airlines:</strong> Chuyển sang <strong>Sảnh E</strong> (khu vực cũ của Jetstar).</li>
        </ul>
        <p>Quý khách vui lòng có mặt tại sân bay trước 120 phút để kịp thời gian di chuyển.</p>
        ',
        'https://images.unsplash.com/photo-1530521954074-e64f6810b32d',
        'ANNOUNCEMENT', 1, NOW() - INTERVAL 4 DAY, 1
    ),
    (
        'Chính sách hoàn/hủy vé do ảnh hưởng của cơn bão số 3 (Yagi)',
        'chinh-sach-hoan-huy-ve-bao-so-3',
        'Hỗ trợ đổi vé miễn phí hoặc hoàn bảo lưu định danh cho hành khách có chuyến bay đến/đi từ các sân bay bị ảnh hưởng.',
        'support@example.com',
        '
        <p>Do ảnh hưởng trực tiếp của cơn bão số 3, các sân bay sau đây sẽ tạm đóng cửa:</p>
        <ul>
            <li>Sân bay Vân Đồn (Quảng Ninh)</li>
            <li>Sân bay Cát Bi (Hải Phòng)</li>
            <li>Sân bay Nội Bài (Hà Nội) - Dự kiến từ 10:00 đến 19:00</li>
        </ul>
        <h3>Phương án hỗ trợ:</h3>
        <p>Hành khách có thể đổi sang chuyến bay ngày hôm sau (miễn phí đổi + chênh lệch giá vé) hoặc yêu cầu hoàn vé về tài khoản bảo lưu (sử dụng trong 365 ngày).</p>
        ',
        'https://images.unsplash.com/photo-1516912481808-3406841bd33c',
        'ANNOUNCEMENT', 1, NOW() - INTERVAL 5 DAY, 1
    );
