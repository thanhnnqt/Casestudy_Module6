/* ===================== INSERT ACCOUNTS (30) ===================== */
INSERT INTO accounts (username, password, provider, enabled)
VALUES ('admin', '$2a$10$TQhZ2iB1qZ1bEOxm0.DinurTA0O.qao17BkgbReJoSFHwDXQgcvWW', 'LOCAL', TRUE),

       ('employee1', '$2a$10$TQhZ2iB1qZ1bEOxm0.DinurTA0O.qao17BkgbReJoSFHwDXQgcvWW', 'LOCAL', TRUE),
       ('employee2', '$2a$10$TQhZ2iB1qZ1bEOxm0.DinurTA0O.qao17BkgbReJoSFHwDXQgcvWW', 'LOCAL', TRUE),
       ('employee3', '$2a$10$TQhZ2iB1qZ1bEOxm0.DinurTA0O.qao17BkgbReJoSFHwDXQgcvWW', 'LOCAL', TRUE),
       ('employee4', '$2a$10$TQhZ2iB1qZ1bEOxm0.DinurTA0O.qao17BkgbReJoSFHwDXQgcvWW', 'LOCAL', TRUE),
       ('employee5', '$2a$10$TQhZ2iB1qZ1bEOxm0.DinurTA0O.qao17BkgbReJoSFHwDXQgcvWW', 'LOCAL', TRUE),

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
       ('customer20', '$2a$10$TQhZ2iB1qZ1bEOxm0.DinurTA0O.qao17BkgbReJoSFHwDXQgcvWW', 'LOCAL', TRUE),

       ('extra1', '$2a$10$TQhZ2iB1qZ1bEOxm0.DinurTA0O.qao17BkgbReJoSFHwDXQgcvWW', 'LOCAL', TRUE),
       ('extra2', '$2a$10$TQhZ2iB1qZ1bEOxm0.DinurTA0O.qao17BkgbReJoSFHwDXQgcvWW', 'LOCAL', TRUE),
       ('extra3', '$2a$10$TQhZ2iB1qZ1bEOxm0.DinurTA0O.qao17BkgbReJoSFHwDXQgcvWW', 'LOCAL', TRUE),
       ('extra4', '$2a$10$TQhZ2iB1qZ1bEOxm0.DinurTA0O.qao17BkgbReJoSFHwDXQgcvWW', 'LOCAL', TRUE);


/* ===================== ADMINS (1) ===================== */
INSERT INTO admins (admin_code, full_name, email, phone_number, account_id)
VALUES ('AD01', 'System Admin', 'admin@system.com', '0900000000', 1);

/* ===================== EMPLOYEES (5) ===================== */
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
        'https://res.cloudinary.com/dfduj6hiv/image/upload/v1766739909/yl5cfsnewqncz1rduvyp.webp',
        'd90f6840d0bbdcf1d7e39c8e1dd80cf9b3a9902e1cb4f95846c61d5539ff2218', 2),

       ('Tran Thi Mai', 'Ha Noi', '0901000002', '012345002', 'nv2@company.com', '1996-02-02', 'Nữ',
        'https://res.cloudinary.com/dfduj6hiv/image/upload/v1766739876/jmgncqzshahjzmfizl8x.webp',
        'f6c6e01a98133927f0bcd0ba94fe257f29bbadb7ea88b962eb4e2e500a4b2a6e', 3),

       ('Le Minh Duc', 'Da Nang', '0901000003', '012345003', 'nv3@company.com', '1994-03-03', 'Nam',
        'https://res.cloudinary.com/dfduj6hiv/image/upload/v1766739290/rju4whh8jshokpnwwrac.jpg',
        '4ed91e6afb5fd4648358b22084582334344ade8c8119556a54c21d8312c4ba89', 4),

       ('Pham Quang Hieu', 'Da Nang', '0901000004', '012345004', 'nv4@company.com', '1993-04-04', 'Nam',
        'https://res.cloudinary.com/dfduj6hiv/image/upload/v1766739900/ggmooyemcqhtuts579yx.webp',
        '2d888ef44e15acfe54007cf2e788ae3a4f1edcd1814b7ff2b62b41baf7e6d040', 5),

       ('Hoang Thanh Tung', 'Ho Chi Minh', '0901000005', '012345005', 'nv5@company.com', '1992-05-05', 'Nam',
        'https://res.cloudinary.com/dfduj6hiv/image/upload/v1766739248/evxvr8nbzwzjqtvqfsuz.jpg',
        '91e4aee2ffa010a2b0a36a8a4cf64decb7a0b59be5e3dc4e09361cfd1980ce86', 6);


/* ===================== CUSTOMERS (20) ===================== */
INSERT INTO customers
(customer_code, full_name, date_of_birth, gender, phone_number, email, identity_card, address, total_spending,
 account_id)
VALUES ('KH1', 'Nguyen Minh Quan', '1990-01-01', 'NAM', '0912000001', 'kh1@mail.com', '012345001', 'Ha Noi', 0, 7),
       ('KH2', 'Tran Ngoc Anh', '1991-02-02', 'NU', '0912000002', 'kh2@mail.com', '012345002', 'Ha Noi', 0, 8),
       ('KH3', 'Le Hoang Nam', '1992-03-03', 'NAM', '0912000003', 'kh3@mail.com', '012345003', 'Da Nang', 0, 9),
       ('KH4', 'Pham Thu Ha', '1993-04-04', 'NU', '0912000004', 'kh4@mail.com', '012345004', 'Da Nang', 0, 10),
       ('KH5', 'Hoang Gia Bao', '1994-05-05', 'NAM', '0912000005', 'kh5@mail.com', '012345005', 'Ho Chi Minh', 0, 11),
       ('KH6', 'Do Thanh Thao', '1995-06-06', 'NU', '0912000006', 'kh6@mail.com', '012345006', 'Ho Chi Minh', 0, 12),
       ('KH7', 'Bui Duc Thinh', '1996-07-07', 'NAM', '0912000007', 'kh7@mail.com', '012345007', 'Can Tho', 0, 13),
       ('KH8', 'Dang My Linh', '1997-08-08', 'NU', '0912000008', 'kh8@mail.com', '012345008', 'Hai Phong', 0, 14),
       ('KH9', 'Ngo Tien Dat', '1998-09-09', 'NAM', '0912000009', 'kh9@mail.com', '012345009', 'Hue', 0, 15),
       ('KH10', 'Vu Anh Tuyet', '1999-10-10', 'NU', '0912000010', 'kh10@mail.com', '012345010', 'Nha Trang', 0, 16),
       ('KH11', 'Le Viet Hoang', '1990-02-10', 'NAM', '0912000011', 'kh11@mail.com', '012345011', 'Ha Nam', 0, 17),
       ('KH12', 'Vu Thi Thu', '1991-03-11', 'NU', '0912000012', 'kh12@mail.com', '012345012', 'Hai Duong', 0, 18),
       ('KH13', 'Ha Duc Nhan', '1992-04-12', 'NAM', '0912000013', 'kh13@mail.com', '012345013', 'Hue', 0, 19),
       ('KH14', 'Trinh Thi Diem', '1993-05-13', 'NU', '0912000014', 'kh14@mail.com', '012345014', 'Ho Chi Minh', 0, 20),
       ('KH15', 'Ngo Phong', '1994-06-14', 'NAM', '0912000015', 'kh15@mail.com', '012345015', 'Ha Noi', 0, 21),
       ('KH16', 'Ly Phuong Linh', '1995-07-15', 'NU', '0912000016', 'kh16@mail.com', '012345016', 'Ha Noi', 0, 22),
       ('KH17', 'Vuong Quang Dai', '1996-08-16', 'NAM', '0912000017', 'kh17@mail.com', '012345017', 'Ha Noi', 0, 23),
       ('KH18', 'Mai Quynh', '1997-09-17', 'NU', '0912000018', 'kh18@mail.com', '012345018', 'Da Nang', 0, 24),
       ('KH19', 'Ta Quoc Trung', '1998-10-18', 'NAM', '0912000019', 'kh19@mail.com', '012345019', 'Ho Chi Minh', 0, 25),
       ('KH20', 'Vo Kim Ngan', '1999-11-19', 'NU', '0912000020', 'kh20@mail.com', '012345020', 'Ho Chi Minh', 0, 26);


/* ===================== AIRPORTS (5) ===================== */
INSERT INTO airports (code, name, city)
VALUES ('HAN', 'Noi Bai', 'Ha Noi'),
       ('HPH', 'Cat Bi', 'Hai Phong'),
       ('DAD', 'Da Nang', 'Da Nang'),
       ('SGN', 'Tan Son Nhat', 'Ho Chi Minh'),
       ('PQC', 'Phu Quoc', 'Kien Giang');

/* ===================== AIRLINES (3) ===================== */
INSERT INTO airlines (code, name, logo_url)
VALUES ('VN', 'Vietnam Airlines', 'https://example.com/vn.png'),
       ('VJ', 'VietJet Air', 'https://example.com/vj.png'),
       ('QH', 'Bamboo Airways', 'https://example.com/qh.png');

/* ===================== AIRCRAFTS (4) ===================== */
INSERT INTO aircrafts (name, registration_code, total_seats, airline_id)
VALUES ('Airbus A321', 'VN-A321', 184, 1),
       ('Boeing 787-9', 'VN-B787', 274, 1),
       ('Airbus A320', 'VJ-A320', 180, 2),
       ('Embraer E190', 'QH-E190', 110, 3);

/* ===================== FLIGHTS (10) ===================== */
INSERT INTO flights
(flight_number, aircraft_id, departure_airport_id, arrival_airport_id, departure_time, arrival_time, status)
VALUES ('VN201', 1, 1, 4, '2025-01-10 08:00', '2025-01-10 10:00', 'SCHEDULED'),
       ('VN202', 2, 4, 1, '2025-01-11 14:00', '2025-01-11 16:30', 'SCHEDULED'),
       ('VJ301', 3, 4, 3, '2025-01-12 09:00', '2025-01-12 10:20', 'SCHEDULED'),
       ('QH901', 4, 3, 1, '2025-01-12 15:00', '2025-01-12 17:00', 'SCHEDULED'),
       ('VN203', 1, 1, 3, '2025-01-13 07:30', '2025-01-13 09:00', 'SCHEDULED'),
       ('VJ302', 3, 3, 4, '2025-01-14 18:00', '2025-01-14 19:30', 'SCHEDULED'),
       ('VN204', 2, 4, 5, '2025-01-15 13:20', '2025-01-15 15:00', 'SCHEDULED'),
       ('QH902', 4, 5, 4, '2025-01-16 06:00', '2025-01-16 07:40', 'SCHEDULED'),
       ('VN205', 1, 5, 1, '2025-01-17 11:10', '2025-01-17 13:00', 'SCHEDULED'),
       ('VJ303', 3, 1, 5, '2025-01-18 21:00', '2025-01-18 23:00', 'SCHEDULED');

/* ===================== BOOKINGS (10) UPDATED ===================== */
/* ===================== BOOKINGS FOR ANALYTICS TEST ===================== */
INSERT INTO bookings
(booking_code, booking_date, total_amount, status, channel, trip_type,
 contact_email, contact_phone, payment_method, payment_status,
 transaction_code, paid_at, customer_account_id, created_by_sales_id)
VALUES
-- Tuần này (2026-05-10 đang là tuần này)
('BK101', '2026-05-10 09:00:00', 1000000, 'PAID', 'ONLINE', 'ONE_WAY',
 'test1@mail.com', '0901110001', 'BANK_TRANSFER', 'PAID', 'TXN101', '2026-05-10 09:05:00', 7, 2),
('BK102', '2026-05-09 14:00:00', 1000000, 'PAID', 'ONLINE', 'ONE_WAY',
 'test2@mail.com', '0901110002', 'BANK_TRANSFER', 'PAID', 'TXN102', '2026-05-09 14:05:00', 8, 2),

-- Tuần trước
('BK103', '2026-05-02 11:00:00', 1000000, 'PAID', 'ONLINE', 'ONE_WAY',
 'test3@mail.com', '0901110003', 'BANK_TRANSFER', 'PAID', 'TXN103', '2026-05-02 11:05:00', 9, 2),
('BK104', '2026-04-29 18:00:00', 1000000, 'PAID', 'ONLINE', 'ONE_WAY',
 'test4@mail.com', '0901110004', 'BANK_TRANSFER', 'PAID', 'TXN104', '2026-04-29 18:05:00', 10, 2),

-- Tháng này (ngoài phạm vi tuần hiện tại)
('BK105', '2026-05-03 10:00:00', 1000000, 'PAID', 'ONLINE', 'ONE_WAY',
 'test5@mail.com', '0901110005', 'BANK_TRANSFER', 'PAID', 'TXN105', '2026-05-03 10:05:00', 11, 2),
('BK106', '2026-05-01 15:00:00', 1000000, 'PAID', 'ONLINE', 'ONE_WAY',
 'test6@mail.com', '0901110006', 'BANK_TRANSFER', 'PAID', 'TXN106', '2026-05-01 15:05:00', 12, 2),

-- Tháng trước
('BK107', '2026-04-15 12:00:00', 1000000, 'PAID', 'ONLINE', 'ONE_WAY',
 'test7@mail.com', '0901110007', 'BANK_TRANSFER', 'PAID', 'TXN107', '2026-04-15 12:05:00', 13, 2),
('BK108', '2026-04-05 09:00:00', 1000000, 'PAID', 'ONLINE', 'ONE_WAY',
 'test8@mail.com', '0901110008', 'BANK_TRANSFER', 'PAID', 'TXN108', '2026-04-05 09:05:00', 14, 2),

-- Quý này (ngoài tháng này)
('BK109', '2026-06-10 08:00:00', 1000000, 'PAID', 'ONLINE', 'ONE_WAY',
 'test9@mail.com', '0901110009', 'BANK_TRANSFER', 'PAID', 'TXN109', '2026-06-10 08:05:00', 15, 2),
('BK110', '2026-04-10 19:00:00', 1000000, 'PAID', 'ONLINE', 'ONE_WAY',
 'test10@mail.com', '0901110010', 'BANK_TRANSFER', 'PAID', 'TXN110', '2026-04-10 19:05:00', 16, 2),

-- Quý trước
('BK111', '2026-03-25 10:00:00', 1000000, 'PAID', 'ONLINE', 'ONE_WAY',
 'test11@mail.com', '0901110011', 'BANK_TRANSFER', 'PAID', 'TXN111', '2026-03-25 10:05:00', 7, 2),
('BK112', '2026-02-10 17:00:00', 1000000, 'PAID', 'ONLINE', 'ONE_WAY',
 'test12@mail.com', '0901110012', 'BANK_TRANSFER', 'PAID', 'TXN112', '2026-02-10 17:05:00', 8, 2),

-- Năm nay (ngoài quý này)
('BK113', '2026-07-20 13:30:00', 1000000, 'PAID', 'ONLINE', 'ONE_WAY',
 'test13@mail.com', '0901110013', 'BANK_TRANSFER', 'PAID', 'TXN113', '2026-07-20 13:35:00', 9, 2),
('BK114', '2026-12-01 08:20:00', 1000000, 'PAID', 'ONLINE', 'ONE_WAY',
 'test14@mail.com', '0901110014', 'BANK_TRANSFER', 'PAID', 'TXN114', '2026-12-01 08:25:00', 10, 2),

-- Năm trước
('BK115', '2025-08-15 14:00:00', 1000000, 'PAID', 'ONLINE', 'ONE_WAY',
 'test15@mail.com', '0901110015', 'BANK_TRANSFER', 'PAID', 'TXN115', '2025-08-15 14:05:00', 11, 2),
('BK116', '2025-12-28 09:20:00', 1000000, 'PAID', 'ONLINE', 'ONE_WAY',
 'test16@mail.com', '0901110016', 'BANK_TRANSFER', 'PAID', 'TXN116', '2025-12-28 09:25:00', 12, 2);


/* ===================== TICKETS (10) ===================== */
INSERT INTO tickets
(seat_number, ticket_number, passenger_name, passenger_dob, seat_class, price,
 booking_id, flight_id, status)
VALUES ('A01', 'TK001', 'Nguyen Minh Quan', '1990-01-01', 'ECONOMY', 1500000, 1, 1, 'BOOKED'),
       ('A02', 'TK002', 'Tran Ngoc Anh', '1991-02-02', 'ECONOMY', 1800000, 2, 2, 'BOOKED'),
       ('A03', 'TK003', 'Le Hoang Nam', '1992-03-03', 'ECONOMY', 1200000, 3, 3, 'BOOKED'),
       ('A04', 'TK004', 'Pham Thu Ha', '1993-04-04', 'ECONOMY', 1300000, 4, 4, 'BOOKED'),
       ('A05', 'TK005', 'Hoang Gia Bao', '1994-05-05', 'ECONOMY', 1600000, 5, 5, 'BOOKED'),
       ('A06', 'TK006', 'Do Thanh Thao', '1995-06-06', 'ECONOMY', 1400000, 6, 6, 'BOOKED'),
       ('A07', 'TK007', 'Bui Duc Thinh', '1996-07-07', 'ECONOMY', 1700000, 7, 7, 'BOOKED'),
       ('A08', 'TK008', 'Dang My Linh', '1997-08-08', 'ECONOMY', 1450000, 8, 8, 'BOOKED'),
       ('A09', 'TK009', 'Ngo Tien Dat', '1998-09-09', 'ECONOMY', 1550000, 9, 9, 'BOOKED'),
       ('A10', 'TK010', 'Vu Anh Tuyet', '1999-10-10', 'ECONOMY', 1750000, 10, 10, 'BOOKED');

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
