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
 TRUE);

/* ===================== ADMINS (1) ===================== */
INSERT INTO admins (
    admin_code,
    full_name,
    email,
    phone_number,
    account_id
)
VALUES (
           'AD_DEMO',
           'Demo System Admin',
           'admin_demo@system.com',
           '0909000000',
           (SELECT id FROM accounts WHERE username = 'admin_demo')
       );

/* ===================== EMPLOYEES (5) ===================== */
/* ===================== EMPLOYEES (5) UPDATED WITH CORRECT SHA-256 ===================== */
INSERT INTO employees (
    full_name,
    address,
    phone_number,
    identification_id,
    email,
    dob,
    gender,
    img_url,
    img_hash,
    account_id
) VALUES
      ('Nguyen Van Huy', 'Ha Noi', '0901000001', '012345001', 'nv1@company.com', '1995-01-01', 'Nam',
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
INSERT INTO customers (
    customer_code, full_name, date_of_birth, gender,
    phone_number, email, identity_card,
    address, total_spending, account_id
)
VALUES (
           'KH1',
           'Nguyen Van Demo 1',
           '1995-01-01',
           'NAM',
           '0911111111',
           'demo1@mail.com',
           '100000000001',
           'Ha Noi',
           0,
           (SELECT id FROM accounts WHERE username = 'demo1')
       );

-- demo2
INSERT INTO customers (
    customer_code, full_name, date_of_birth, gender,
    phone_number, email, identity_card,
    address, total_spending, account_id
)
VALUES (
           'KH2',
           'Nguyen Van Demo 2',
           '1996-02-02',
           'NU',
           '0911111112',
           'demo2@mail.com',
           '100000000002',
           'Hai Phong',
           0,
           (SELECT id FROM accounts WHERE username = 'demo2')
       );

-- demo3
INSERT INTO customers (
    customer_code, full_name, date_of_birth, gender,
    phone_number, email, identity_card,
    address, total_spending, account_id
)
VALUES (
           'KH3',
           'Nguyen Van Demo 3',
           '1997-03-03',
           'NAM',
           '0911111113',
           'demo3@mail.com',
           '100000000003',
           'Da Nang',
           0,
           (SELECT id FROM accounts WHERE username = 'demo3')
       );

-- demo4
INSERT INTO customers (
    customer_code, full_name, date_of_birth, gender,
    phone_number, email, identity_card,
    address, total_spending, account_id
)
VALUES (
           'KH4',
           'Nguyen Van Demo 4',
           '1998-04-04',
           'NU',
           '0911111114',
           'demo4@mail.com',
           '100000000004',
           'Ho Chi Minh',
           0,
           (SELECT id FROM accounts WHERE username = 'demo4')
       );

-- demo5
INSERT INTO customers (
    customer_code, full_name, date_of_birth, gender,
    phone_number, email, identity_card,
    address, total_spending, account_id
)
VALUES (
           'KH5',
           'Nguyen Van Demo 5',
           '1999-05-05',
           'KHAC',
           '0911111115',
           'demo5@mail.com',
           '100000000005',
           'Can Tho',
           0,
           (SELECT id FROM accounts WHERE username = 'demo5')
       );



/* ===================== AIRPORTS (5) ===================== */
INSERT INTO airports (code, name, city)
VALUES ('HAN', 'Noi Bai', 'Ha Noi'),
       ('HPH', 'Cat Bi', 'Hai Phong'),
       ('DAD', 'Da Nang', 'Da Nang'),
       ('SGN', 'Tan Son Nhat', 'Ho Chi Minh'),
       ('PQC', 'Phu Quoc', 'Kien Giang');

/* ===================== AIRLINES (3) ===================== */
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
