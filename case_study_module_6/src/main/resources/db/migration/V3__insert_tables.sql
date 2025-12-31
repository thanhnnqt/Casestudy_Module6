/* ===================== INSERT ACCOUNTS (30) ===================== */
INSERT INTO accounts (username, password, provider, enabled)
VALUES
-- USER 1
('demo1',
 '$2a$10$TQhZ2iB1qZ1bEOxm0.DinurTA0O.qao17BkgbReJoSFHwDXQgcvWW',
 'LOCAL',
 TRUE),

-- USER 2
('demo2',
 '$2a$10$TQhZ2iB1qZ1bEOxm0.DinurTA0O.qao17BkgbReJoSFHwDXQgcvWW',
 'LOCAL',
 TRUE),

-- USER 3
('demo3',
 '$2a$10$TQhZ2iB1qZ1bEOxm0.DinurTA0O.qao17BkgbReJoSFHwDXQgcvWW',
 'LOCAL',
 TRUE),

-- USER 4
('demo4',
 '$2a$10$TQhZ2iB1qZ1bEOxm0.DinurTA0O.qao17BkgbReJoSFHwDXQgcvWW',
 'LOCAL',
 TRUE),

-- USER 5
('demo5',
 '$2a$10$TQhZ2iB1qZ1bEOxm0.DinurTA0O.qao17BkgbReJoSFHwDXQgcvWW',
 'LOCAL',
 TRUE),
-- ADMIN
('admin_demo',
 '$2a$10$TQhZ2iB1qZ1bEOxm0.DinurTA0O.qao17BkgbReJoSFHwDXQgcvWW',
 'LOCAL',
 TRUE),

-- EMPLOYEE
('employee_demo1',
 '$2a$10$TQhZ2iB1qZ1bEOxm0.DinurTA0O.qao17BkgbReJoSFHwDXQgcvWW',
 'LOCAL',
 TRUE),

('employee_demo2',
 '$2a$10$TQhZ2iB1qZ1bEOxm0.DinurTA0O.qao17BkgbReJoSFHwDXQgcvWW',
 'LOCAL',
 TRUE),
('customer_demo1', '$2a$10$TQhZ2iB1qZ1bEOxm0.DinurTA0O.qao17BkgbReJoSFHwDXQgcvWW', 'LOCAL', TRUE),
('customer_demo2', '$2a$10$TQhZ2iB1qZ1bEOxm0.DinurTA0O.qao17BkgbReJoSFHwDXQgcvWW', 'LOCAL', TRUE),
('customer_demo3', '$2a$10$TQhZ2iB1qZ1bEOxm0.DinurTA0O.qao17BkgbReJoSFHwDXQgcvWW', 'LOCAL', TRUE),
('customer_demo4', '$2a$10$TQhZ2iB1qZ1bEOxm0.DinurTA0O.qao17BkgbReJoSFHwDXQgcvWW', 'LOCAL', TRUE),
('customer_demo5', '$2a$10$TQhZ2iB1qZ1bEOxm0.DinurTA0O.qao17BkgbReJoSFHwDXQgcvWW', 'LOCAL', TRUE),
('customer_demo6', '$2a$10$TQhZ2iB1qZ1bEOxm0.DinurTA0O.qao17BkgbReJoSFHwDXQgcvWW', 'LOCAL', TRUE),
('customer_demo7', '$2a$10$TQhZ2iB1qZ1bEOxm0.DinurTA0O.qao17BkgbReJoSFHwDXQgcvWW', 'LOCAL', TRUE),
('customer_demo8', '$2a$10$TQhZ2iB1qZ1bEOxm0.DinurTA0O.qao17BkgbReJoSFHwDXQgcvWW', 'LOCAL', TRUE),
('customer_demo9', '$2a$10$TQhZ2iB1qZ1bEOxm0.DinurTA0O.qao17BkgbReJoSFHwDXQgcvWW', 'LOCAL', TRUE),
('customer_demo10', '$2a$10$TQhZ2iB1qZ1bEOxm0.DinurTA0O.qao17BkgbReJoSFHwDXQgcvWW', 'LOCAL', TRUE),
('customer_demo11',
 '$2a$10$TQhZ2iB1qZ1bEOxm0.DinurTA0O.qao17BkgbReJoSFHwDXQgcvWW',
 'LOCAL',
 TRUE),
('customer_demo12',
 '$2a$10$TQhZ2iB1qZ1bEOxm0.DinurTA0O.qao17BkgbReJoSFHwDXQgcvWW',
 'LOCAL',
 TRUE);


/* ===================== ADMINS (1) ===================== */
INSERT INTO admins (admin_code,
                    full_name,
                    email,
                    phone_number,
                    account_id)
VALUES ('AD_DEMO',
        'Demo System Admin',
        'admin_demo@system.com',
        '0909000000',
        (SELECT id FROM accounts WHERE username = 'admin_demo'));

/* ===================== EMPLOYEES (5) ===================== */
/* ===================== EMPLOYEES (5) UPDATED WITH CORRECT SHA-256 ===================== */
INSERT INTO employees (full_name,
                       address,
                       phone_number,
                       identification_id,
                       email,
                       dob,
                       gender,
                       img_url,
                       img_hash,
                       account_id)
VALUES ('Nguyen Van Huy', 'Ha Noi', '0901000001', '012345001', 'nv1@company.com', '1995-01-01', 'Nam',
        'https://res.cloudinary.com/dfduj6hiv/image/upload/v1767062658/g3tnflpe4umkdcejpprx.webp',
        '32fb526959373d9b54a651a97c3ed216cb39c3bdfa546db0d3acc3b4a404cc9a', 2),

       ('Tran Thi Mai', 'Ha Noi', '0901000002', '012345002', 'nv2@company.com', '1996-02-02', 'Nữ',
        'https://res.cloudinary.com/dfduj6hiv/image/upload/v1766978920/l7rivvz2cshrpb3ra5on.webp',
        '5c0193f8bf8c2f1b354efde78a512f194407a527041a3a91f05e54bf62f3bc48', 3),

       ('Le Minh Duc', 'Da Nang', '0901000003', '012345003', 'nv3@company.com', '1994-03-03', 'Nam',
        'https://res.cloudinary.com/dfduj6hiv/image/upload/v1767062643/g3xye2yoji9hhmlvsv3z.webp',
        'b27dcd4d20be284d8580c73576f40760d47576a89d7a2f33dc1b159c828c5645', 4),

       ('Pham Quang Hieu', 'Da Nang', '0901000004', '012345004', 'nv4@company.com', '1993-04-04', 'Nam',
        'https://res.cloudinary.com/dfduj6hiv/image/upload/v1766998277/c1qhxssyiheavo02izwi.jpg',
        '781550e149fd178a77efc4857adb0ff378e24f7b3e3d78c6c33d26c1a01ee326', 5),

       ('Hoang Thanh Tung', 'Ho Chi Minh', '0901000005', '012345005', 'nv5@company.com', '1992-05-05', 'Nam',
        'https://res.cloudinary.com/dfduj6hiv/image/upload/v1766977350/xkfrcvws16poasyijcxh.webp',
        '7d49041c6049c40b7b8391ce5d83498d3f0af0f8c02f041e178e4ed856247a43', 6);



/* ===================== CUSTOMERS (20) ===================== */
-- demo1 → account_id = MAX(id) - 4
INSERT INTO customers (customer_code, full_name, date_of_birth, gender,
                       phone_number, email, identity_card,
                       address, total_spending, account_id)
VALUES ('KH1',
        'Nguyen Van Demo 1',
        '1995-01-01',
        'NAM',
        '0911111111',
        'demo1@mail.com',
        '100000000001',
        'Ha Noi',
        0,
        (SELECT id FROM accounts WHERE username = 'demo1'));

-- demo2
INSERT INTO customers (customer_code, full_name, date_of_birth, gender,
                       phone_number, email, identity_card,
                       address, total_spending, account_id)
VALUES ('KH2',
        'Nguyen Van Demo 2',
        '1996-02-02',
        'NU',
        '0911111112',
        'demo2@mail.com',
        '100000000002',
        'Hai Phong',
        0,
        (SELECT id FROM accounts WHERE username = 'demo2'));

-- demo3
INSERT INTO customers (customer_code, full_name, date_of_birth, gender,
                       phone_number, email, identity_card,
                       address, total_spending, account_id)
VALUES ('KH3',
        'Nguyen Van Demo 3',
        '1997-03-03',
        'NAM',
        '0911111113',
        'demo3@mail.com',
        '100000000003',
        'Da Nang',
        0,
        (SELECT id FROM accounts WHERE username = 'demo3'));

-- demo4
INSERT INTO customers (customer_code, full_name, date_of_birth, gender,
                       phone_number, email, identity_card,
                       address, total_spending, account_id)
VALUES ('KH4',
        'Nguyen Van Demo 4',
        '1998-04-04',
        'NU',
        '0911111114',
        'demo4@mail.com',
        '100000000004',
        'Ho Chi Minh',
        0,
        (SELECT id FROM accounts WHERE username = 'demo4'));

-- demo5
INSERT INTO customers (customer_code, full_name, date_of_birth, gender,
                       phone_number, email, identity_card,
                       address, total_spending, account_id)
VALUES ('KH5',
        'Nguyen Van Demo 5',
        '1999-05-05',
        'KHAC',
        '0911111115',
        'demo5@mail.com',
        '100000000005',
        'Can Tho',
        0,
        (SELECT id FROM accounts WHERE username = 'demo5'));


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
 'demo1@mail.com', '0911111111', 'CASH', 'PAID', 'TRX0001', '2025-12-20 10:05', 10, 7),
('BK0002', '2025-12-21 11:00', 2000000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo2@mail.com', '0911111112', 'CASH', 'PAID', 'TRX0002', '2025-12-21 11:03', 11, 8),
('BK0003', '2025-12-22 09:30', 2200000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo3@mail.com', '0911111113', 'CASH', 'PAID', 'TRX0003', '2025-12-22 09:35', 12, 7),
('BK0004', '2025-12-25 08:40', 2400000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo4@mail.com', '0911111114', 'CASH', 'PAID', 'TRX0004', '2025-12-25 08:45', 13, 8),
('BK0005', '2025-12-27 19:00', 2600000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo5@mail.com', '0911111115', 'CASH', 'PAID', 'TRX0005', '2025-12-27 19:05', 14, 7),
('BK0006', '2025-12-29 14:10', 2800000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo6@mail.com', '0911111116', 'CASH', 'PAID', 'TRX0006', '2025-12-29 14:12', 15, 8),
('BK0007', '2025-12-30 20:20', 3000000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo7@mail.com', '0911111117', 'CASH', 'PAID', 'TRX0007', '2025-12-30 20:22', 16, 7),
('BK0008', '2025-12-31 16:30', 3200000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo8@mail.com', '0911111118', 'CASH', 'PAID', 'TRX0008', '2025-12-31 16:32', 17, 8),

-- ===== WEEK 01/2026 (1–4 JAN) =====
('BK0009', '2026-01-01 09:00', 2100000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo9@mail.com', '0911111119', 'CASH', 'PAID', 'TRX0009', '2026-01-01 09:05', 18, 7),
('BK0010', '2026-01-01 15:10', 2300000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo10@mail.com', '0911111120', 'CASH', 'PAID', 'TRX0010', '2026-01-01 15:12', 19, 8),
('BK0011', '2026-01-01 18:20', 2500000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo1@mail.com', '0911111111', 'CASH', 'PAID', 'TRX0011', '2026-01-01 18:23', 10, 7),
('BK0012', '2026-01-01 21:30', 2600000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo2@mail.com', '0911111112', 'CASH', 'PAID', 'TRX0012', '2026-01-01 21:33', 11, 8),

('BK0013', '2026-01-02 09:30', 2700000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo3@mail.com', '0911111113', 'CASH', 'PAID', 'TRX0013', '2026-01-02 09:32', 12, 7),
('BK0014', '2026-01-02 12:00', 2800000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo4@mail.com', '0911111114', 'CASH', 'PAID', 'TRX0014', '2026-01-02 12:03', 13, 8),
('BK0015', '2026-01-02 14:10', 2900000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo5@mail.com', '0911111115', 'CASH', 'PAID', 'TRX0015', '2026-01-02 14:12', 14, 7),
('BK0016', '2026-01-02 19:40', 3000000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo6@mail.com', '0911111116', 'CASH', 'PAID', 'TRX0016', '2026-01-02 19:42', 15, 8),

('BK0017', '2026-01-03 08:10', 3200000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo7@mail.com', '0911111117', 'CASH', 'PAID', 'TRX0017', '2026-01-03 08:12', 16, 7),
('BK0018', '2026-01-03 10:00', 3100000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo8@mail.com', '0911111118', 'CASH', 'PAID', 'TRX0018', '2026-01-03 10:03', 17, 8),
('BK0019', '2026-01-03 15:20', 3300000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo9@mail.com', '0911111119', 'CASH', 'PAID', 'TRX0019', '2026-01-03 15:21', 18, 7),
('BK0020', '2026-01-03 17:20', 3400000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo10@mail.com', '0911111120', 'CASH', 'PAID', 'TRX0020', '2026-01-03 17:22', 19, 8),
('BK0021', '2026-01-03 20:20', 3500000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo1@mail.com', '0911111111', 'CASH', 'PAID', 'TRX0021', '2026-01-03 20:22', 10, 7),
('BK0022', '2026-01-03 22:20', 3600000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo2@mail.com', '0911111112', 'CASH', 'PAID', 'TRX0022', '2026-01-03 22:22', 11, 8),

('BK0023', '2026-01-04 09:15', 3700000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo3@mail.com', '0911111113', 'CASH', 'PAID', 'TRX0023', '2026-01-04 09:17', 12, 7),
('BK0024', '2026-01-04 11:20', 3800000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo4@mail.com', '0911111114', 'CASH', 'PAID', 'TRX0024', '2026-01-04 11:23', 13, 8),
('BK0025', '2026-01-04 14:50', 3900000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo5@mail.com', '0911111115', 'CASH', 'PAID', 'TRX0025', '2026-01-04 14:52', 14, 7),
('BK0026', '2026-01-04 17:10', 4000000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo6@mail.com', '0911111116', 'CASH', 'PAID', 'TRX0026', '2026-01-04 17:12', 15, 8),
('BK0027', '2026-01-04 18:30', 4100000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo7@mail.com', '0911111117', 'CASH', 'PAID', 'TRX0027', '2026-01-04 18:32', 16, 7),
('BK0028', '2026-01-04 21:00', 4200000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo8@mail.com', '0911111118', 'CASH', 'PAID', 'TRX0028', '2026-01-04 21:03', 17, 8),

-- ===== DEMO DAY — 05/01/2026 =====
('BK0029', '2026-01-05 09:10', 4500000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo1@mail.com', '0911111111', 'CASH', 'PAID', 'TRX0029', '2026-01-05 09:13', 10, 7),
('BK0030', '2026-01-05 10:00', 4600000, 'PAID', 'OFFLINE', 'ONE_WAY',
 'demo2@mail.com', '0911111112', 'CASH', 'PAID', 'TRX0030', '2026-01-05 10:02', 11, 8);

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

INSERT INTO news
    (title, slug, summary, content, category, account_id)
VALUES ('Tin 1', 'tin-1', 'Tom tat tin 1', 'Noi dung tin 1', 'NEWS', 1),
       ('Tin 2', 'tin-2', 'Tom tat tin 2', 'Noi dung tin 2', 'NEWS', 1),
       ('Tin 3', 'tin-3', 'Tom tat tin 3', 'Noi dung tin 3', 'PROMOTION', 1),
       ('Tin 4', 'tin-4', 'Tom tat tin 4', 'Noi dung tin 4', 'NEWS', 1),
       ('Tin 5', 'tin-5', 'Tom tat tin 5', 'Noi dung tin 5', 'ANNOUNCEMENT', 1),
       ('Tin 6', 'tin-6', 'Tom tat tin 6', 'Noi dung tin 6', 'PROMOTION', 1),
       ('Tin 7', 'tin-7', 'Tom tat tin 7', 'Noi dung tin 7', 'NEWS', 1),
       ('Tin 8', 'tin-8', 'Tom tat tin 8', 'Noi dung tin 8', 'NEWS', 1),
       ('Tin 9', 'tin-9', 'Tom tat tin 9', 'Noi dung tin 9', 'ANNOUNCEMENT', 1),
       ('Tin 10', 'tin-10', 'Tom tat tin 10', 'Noi dung tin 10', 'PROMOTION', 1);

