/* ===================== INSERT ACCOUNTS (30) ===================== */
INSERT INTO accounts (username, password, provider, enabled)
VALUES ('admin', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8X1eZq9VHtV6nRvWmvMRGsiE9z1eW', 'LOCAL', TRUE),

       ('employee1', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8X1eZq9VHtV6nRvWmvMRGsiE9z1eW', 'LOCAL', TRUE),
       ('employee2', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8X1eZq9VHtV6nRvWmvMRGsiE9z1eW', 'LOCAL', TRUE),
       ('employee3', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8X1eZq9VHtV6nRvWmvMRGsiE9z1eW', 'LOCAL', TRUE),
       ('employee4', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8X1eZq9VHtV6nRvWmvMRGsiE9z1eW', 'LOCAL', TRUE),
       ('employee5', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8X1eZq9VHtV6nRvWmvMRGsiE9z1eW', 'LOCAL', TRUE),

       ('customer1', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8X1eZq9VHtV6nRvWmvMRGsiE9z1eW', 'LOCAL', TRUE),
       ('customer2', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8X1eZq9VHtV6nRvWmvMRGsiE9z1eW', 'LOCAL', TRUE),
       ('customer3', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8X1eZq9VHtV6nRvWmvMRGsiE9z1eW', 'LOCAL', TRUE),
       ('customer4', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8X1eZq9VHtV6nRvWmvMRGsiE9z1eW', 'LOCAL', TRUE),
       ('customer5', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8X1eZq9VHtV6nRvWmvMRGsiE9z1eW', 'LOCAL', TRUE),
       ('customer6', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8X1eZq9VHtV6nRvWmvMRGsiE9z1eW', 'LOCAL', TRUE),
       ('customer7', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8X1eZq9VHtV6nRvWmvMRGsiE9z1eW', 'LOCAL', TRUE),
       ('customer8', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8X1eZq9VHtV6nRvWmvMRGsiE9z1eW', 'LOCAL', TRUE),
       ('customer9', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8X1eZq9VHtV6nRvWmvMRGsiE9z1eW', 'LOCAL', TRUE),
       ('customer10', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8X1eZq9VHtV6nRvWmvMRGsiE9z1eW', 'LOCAL', TRUE),
       ('customer11', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8X1eZq9VHtV6nRvWmvMRGsiE9z1eW', 'LOCAL', TRUE),
       ('customer12', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8X1eZq9VHtV6nRvWmvMRGsiE9z1eW', 'LOCAL', TRUE),
       ('customer13', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8X1eZq9VHtV6nRvWmvMRGsiE9z1eW', 'LOCAL', TRUE),
       ('customer14', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8X1eZq9VHtV6nRvWmvMRGsiE9z1eW', 'LOCAL', TRUE),
       ('customer15', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8X1eZq9VHtV6nRvWmvMRGsiE9z1eW', 'LOCAL', TRUE),
       ('customer16', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8X1eZq9VHtV6nRvWmvMRGsiE9z1eW', 'LOCAL', TRUE),
       ('customer17', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8X1eZq9VHtV6nRvWmvMRGsiE9z1eW', 'LOCAL', TRUE),
       ('customer18', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8X1eZq9VHtV6nRvWmvMRGsiE9z1eW', 'LOCAL', TRUE),
       ('customer19', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8X1eZq9VHtV6nRvWmvMRGsiE9z1eW', 'LOCAL', TRUE),
       ('customer20', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8X1eZq9VHtV6nRvWmvMRGsiE9z1eW', 'LOCAL', TRUE),

       ('extra1', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8X1eZq9VHtV6nRvWmvMRGsiE9z1eW', 'LOCAL', TRUE),
       ('extra2', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8X1eZq9VHtV6nRvWmvMRGsiE9z1eW', 'LOCAL', TRUE),
       ('extra3', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8X1eZq9VHtV6nRvWmvMRGsiE9z1eW', 'LOCAL', TRUE),
       ('extra4', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8X1eZq9VHtV6nRvWmvMRGsiE9z1eW', 'LOCAL', TRUE);

/* ===================== ADMINS (1) ===================== */
INSERT INTO admins (admin_code, full_name, email, phone_number, account_id)
VALUES ('AD01', 'System Admin', 'admin@system.com', '0900000000', 1);

/* ===================== EMPLOYEES (5) ===================== */
INSERT INTO employees (full_name, address, phone_number, email, dob, gender, imgURL, account_id)
VALUES ('Nguyen Van Huy', 'Ha Noi', '0901000001', 'nv1@company.com', '1995-01-01', 'Nam',
        'https://res.cloudinary.com/dfduj6hiv/image/upload/v1766559419/anh1_pgptg9.jpg', 2),
       ('Tran Thi Mai', 'Ha Noi', '0901000002', 'nv2@company.com', '1996-02-02', 'Nu',
        'https://res.cloudinary.com/dfduj6hiv/image/upload/v1766559640/anh2_qoopvg.webp', 3),
       ('Le Minh Duc', 'Da Nang', '0901000003', 'nv3@company.com', '1994-03-03', 'Nam',
        'https://res.cloudinary.com/dfduj6hiv/image/upload/v1766559709/anh3_gqwraf.jpg', 4),
       ('Pham Quang Hieu', 'Da Nang', '0901000004', 'nv4@company.com', '1993-04-04', 'Nam',
        'https://res.cloudinary.com/dfduj6hiv/image/upload/v1766559769/anh4_zcg3vw.webp', 5),
       ('Hoang Thanh Tung', 'Ho Chi Minh', '0901000005', 'nv5@company.com', '1992-05-05', 'Nam',
        'https://res.cloudinary.com/dfduj6hiv/image/upload/v1766559859/anh6_lql0pq.webp', 6);

/* ===================== CUSTOMERS (20) ===================== */
INSERT INTO customers
(customer_code, full_name, date_of_birth, gender, phone_number, email, identity_card, address, total_spending, account_id)
VALUES
    ('KH1', 'Nguyen Minh Quan', '1990-01-01', 'NAM', '0912000001', 'kh1@mail.com', '012345001', 'Ha Noi', 0, 7),
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

/* ===================== AIRLINES (7) ===================== */
INSERT INTO airlines (code, name, logo_url)
VALUES
    ('VN', 'Vietnam Airlines', 'https://danangairport.vn/files/media/202411/d8a44873-4441-4663-8b0b-415a687e7f89.jpg'),
    ('VJ', 'VietJet Air', 'https://danangairport.vn/files/media/202411/VJ.jpg'),
    ('QH', 'Bamboo Airways', 'https://danangairport.vn/files/media/202411/6b1deea9-2644-4164-bfef-e28b69b0f4a4.jpg'),
    ('BL', 'Pacific Airlines', 'https://danangairport.vn/files/media/202501/pacific.jpg'),
    ('7C', 'Jeju Air', 'https://danangairport.vn/files/media/202411/17ed00d1-5fe4-4a85-b847-01b5fed39345.jpg'),
    ('AK', 'Air Asia', 'https://danangairport.vn/files/media/202411/AK.jpg'),
    ('SQ', 'Singapore Airlines', 'https://danangairport.vn/files/media/202411/b6354f97-8558-4983-94f5-44f5c5fc7fff.jpg');


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
