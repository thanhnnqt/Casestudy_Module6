/* =========================================================
   SEED DATA - FULL (MATCH SCHEMA)
========================================================= */

-- =========================================================
-- 1. ACCOUNTS
-- =========================================================
INSERT INTO accounts (username, password, enabled) VALUES
                                                       ('admin',      '$2a$10$7EqJtq98hPqEX7fNZaFWoOhi5fGJzZ6FZ8kH9h9t7VDaRao7Ihi9K', TRUE),

                                                       ('employee1',  '$2a$10$7EqJtq98hPqEX7fNZaFWoOhi5fGJzZ6FZ8kH9h9t7VDaRao7Ihi9K', TRUE),
                                                       ('employee2',  '$2a$10$7EqJtq98hPqEX7fNZaFWoOhi5fGJzZ6FZ8kH9h9t7VDaRao7Ihi9K', TRUE),
                                                       ('employee3',  '$2a$10$7EqJtq98hPqEX7fNZaFWoOhi5fGJzZ6FZ8kH9h9t7VDaRao7Ihi9K', TRUE),
                                                       ('employee4',  '$2a$10$7EqJtq98hPqEX7fNZaFWoOhi5fGJzZ6FZ8kH9h9t7VDaRao7Ihi9K', TRUE),
                                                       ('employee5',  '$2a$10$7EqJtq98hPqEX7fNZaFWoOhi5fGJzZ6FZ8kH9h9t7VDaRao7Ihi9K', TRUE),
                                                       ('employee6',  '$2a$10$7EqJtq98hPqEX7fNZaFWoOhi5fGJzZ6FZ8kH9h9t7VDaRao7Ihi9K', TRUE),
                                                       ('employee7',  '$2a$10$7EqJtq98hPqEX7fNZaFWoOhi5fGJzZ6FZ8kH9h9t7VDaRao7Ihi9K', TRUE),
                                                       ('employee8',  '$2a$10$7EqJtq98hPqEX7fNZaFWoOhi5fGJzZ6FZ8kH9h9t7VDaRao7Ihi9K', TRUE),
                                                       ('employee9',  '$2a$10$7EqJtq98hPqEX7fNZaFWoOhi5fGJzZ6FZ8kH9h9t7VDaRao7Ihi9K', TRUE),
                                                       ('employee10', '$2a$10$7EqJtq98hPqEX7fNZaFWoOhi5fGJzZ6FZ8kH9h9t7VDaRao7Ihi9K', TRUE),

                                                       ('customer1',  '$2a$10$7EqJtq98hPqEX7fNZaFWoOhi5fGJzZ6FZ8kH9h9t7VDaRao7Ihi9K', TRUE),
                                                       ('customer2',  '$2a$10$7EqJtq98hPqEX7fNZaFWoOhi5fGJzZ6FZ8kH9h9t7VDaRao7Ihi9K', TRUE),
                                                       ('customer3',  '$2a$10$7EqJtq98hPqEX7fNZaFWoOhi5fGJzZ6FZ8kH9h9t7VDaRao7Ihi9K', TRUE),
                                                       ('customer4',  '$2a$10$7EqJtq98hPqEX7fNZaFWoOhi5fGJzZ6FZ8kH9h9t7VDaRao7Ihi9K', TRUE),
                                                       ('customer5',  '$2a$10$7EqJtq98hPqEX7fNZaFWoOhi5fGJzZ6FZ8kH9h9t7VDaRao7Ihi9K', TRUE),
                                                       ('customer6',  '$2a$10$7EqJtq98hPqEX7fNZaFWoOhi5fGJzZ6FZ8kH9h9t7VDaRao7Ihi9K', TRUE),
                                                       ('customer7',  '$2a$10$7EqJtq98hPqEX7fNZaFWoOhi5fGJzZ6FZ8kH9h9t7VDaRao7Ihi9K', TRUE),
                                                       ('customer8',  '$2a$10$7EqJtq98hPqEX7fNZaFWoOhi5fGJzZ6FZ8kH9h9t7VDaRao7Ihi9K', TRUE),
                                                       ('customer9',  '$2a$10$7EqJtq98hPqEX7fNZaFWoOhi5fGJzZ6FZ8kH9h9t7VDaRao7Ihi9K', TRUE),
                                                       ('customer10', '$2a$10$7EqJtq98hPqEX7fNZaFWoOhi5fGJzZ6FZ8kH9h9t7VDaRao7Ihi9K', TRUE);

-- =========================================================
-- 2. ADMINS
-- =========================================================
INSERT INTO admins (admin_code, full_name, email, phone_number, account_id)
VALUES ('AD01','Nguyen Quoc Tuan','admin@system.com','0900000000',1);

-- =========================================================
-- 3. EMPLOYEES (10) – TEN THAT, KHONG DAU
-- =========================================================
INSERT INTO employees
(employee_code, full_name, address, phone_number, email, dob, gender, account_id)
VALUES
    ('NV1','Nguyen Van Huy','Ha Noi','0901000001','nv1@company.com','1995-01-01','Nam',2),
    ('NV2','Tran Thi Mai','Ha Noi','0901000002','nv2@company.com','1996-02-02','Nu',3),
    ('NV3','Le Minh Duc','Da Nang','0901000003','nv3@company.com','1994-03-03','Nam',4),
    ('NV4','Pham Quang Hieu','Da Nang','0901000004','nv4@company.com','1993-04-04','Nam',5),
    ('NV5','Hoang Thanh Tung','HCM','0901000005','nv5@company.com','1992-05-05','Nam',6),
    ('NV6','Do Thu Trang','HCM','0901000006','nv6@company.com','1997-06-06','Nu',7),
    ('NV7','Bui Van Long','Can Tho','0901000007','nv7@company.com','1991-07-07','Nam',8),
    ('NV8','Dang Thi Phuong','Hai Phong','0901000008','nv8@company.com','1998-08-08','Nu',9),
    ('NV9','Ngo Quoc Bao','Hue','0901000009','nv9@company.com','1990-09-09','Nam',10),
    ('NV10','Vu Khanh Linh','Nha Trang','0901000010','nv10@company.com','1999-10-10','Nu',11);

-- =========================================================
-- 4. CUSTOMERS (10) – TEN THAT, KHONG DAU
-- =========================================================
INSERT INTO customers
(customer_code, full_name, date_of_birth, gender, phone_number, identity_card, address, total_spending, account_id)
VALUES
    ('KH1','Nguyen Minh Quan','1990-01-01','Nam','0912000001','012345001','Ha Noi',0,12),
    ('KH2','Tran Ngoc Anh','1991-02-02','Nu','0912000002','012345002','Ha Noi',0,13),
    ('KH3','Le Hoang Nam','1992-03-03','Nam','0912000003','012345003','Da Nang',0,14),
    ('KH4','Pham Thu Ha','1993-04-04','Nu','0912000004','012345004','Da Nang',0,15),
    ('KH5','Hoang Gia Bao','1994-05-05','Nam','0912000005','012345005','HCM',0,16),
    ('KH6','Do Thanh Thao','1995-06-06','Nu','0912000006','012345006','HCM',0,17),
    ('KH7','Bui Duc Thinh','1996-07-07','Nam','0912000007','012345007','Can Tho',0,18),
    ('KH8','Dang My Linh','1997-08-08','Nu','0912000008','012345008','Hai Phong',0,19),
    ('KH9','Ngo Tien Dat','1998-09-09','Nam','0912000009','012345009','Hue',0,20),
    ('KH10','Vu Anh Tuyet','1999-10-10','Nu','0912000010','012345010','Nha Trang',0,21);


-- =========================================================
-- 5. AIRPORTS
-- =========================================================
INSERT INTO airports (code, name, city) VALUES
                                            ('HAN','Noi Bai','Ha Noi'),
                                            ('HPH','Cat Bi','Hai Phong'),
                                            ('DAD','Da Nang','Da Nang'),
                                            ('SGN','Tan Son Nhat','Ho Chi Minh'),
                                            ('PQC','Phu Quoc','Kien Giang');

-- =========================================================
-- 6. AIRLINES
-- =========================================================
INSERT INTO airlines (code, name, logo_url) VALUES
                                                ('VN','Vietnam Airlines','https://example.com/vn.png'),
                                                ('VJ','VietJet Air','https://example.com/vj.png'),
                                                ('QH','Bamboo Airways','https://example.com/qh.png');

-- =========================================================
-- 7. AIRCRAFTS
-- =========================================================
INSERT INTO aircrafts (name, registration_code, total_seats, airline_id) VALUES
                                                                             ('Airbus A321','VN-A321',184,1),
                                                                             ('Boeing 787-9','VN-B787',274,1),
                                                                             ('Airbus A320','VJ-A320',180,2),
                                                                             ('Embraer E190','QH-E190',110,3);

-- =========================================================
-- 8. FLIGHTS
-- =========================================================
INSERT INTO flights
(flight_number, aircraft_id, departure_airport_id, arrival_airport_id, departure_time, arrival_time, status)
VALUES
    ('VN201',1,1,4,'2025-01-10 08:00','2025-01-10 10:00','SCHEDULED'),
    ('VN202',2,4,1,'2025-01-11 14:00','2025-01-11 16:30','SCHEDULED');

-- =========================================================
-- 9. FLIGHT SEAT DETAILS
-- =========================================================
INSERT INTO flight_seat_details
(flight_id, seat_class, price, total_seats, available_seats)
VALUES
    (1,'ECONOMY',1500000,150,150),
    (1,'BUSINESS',3500000,30,30),
    (2,'ECONOMY',1800000,200,200),
    (2,'BUSINESS',4200000,40,40);

-- =========================================================
-- 10. BOOKINGS
-- =========================================================
INSERT INTO bookings
(booking_code, total_amount, status, channel, trip_type,
 contact_email, contact_phone, payment_method, payment_status,
 customer_account_id, created_by_sales_id)
VALUES
    ('PNR001',1500000,'PAID','ONLINE','ONE_WAY',
     'customer1@mail.com','0912000001','VNPAY','PAID',
     12,2);

-- =========================================================
-- 11. TICKETS
-- =========================================================
INSERT INTO tickets
(seat_number, ticket_number, passenger_name, passenger_dob,
 seat_class, price, booking_id, flight_id, status)
VALUES
    ('12A','TIC001','Nguyen Van An','1990-01-01',
     'ECONOMY',1500000,1,1,'BOOKED');

-- =========================================================
-- 12. PAYMENTS
-- =========================================================
INSERT INTO payments
(booking_id, payment_method, amount, status, transaction_code, paid_by_account_id, paid_at)
VALUES
    (1,'VNPAY',1500000,'SUCCESS','VNP123',12,NOW());

-- =========================================================
-- 13. NEWS
-- =========================================================
INSERT INTO news
(title, slug, summary, content, category, account_id)
VALUES
    ('Khuyen mai','khuyen-mai','Giam gia dac biet','Giam gia ve may bay','PROMOTION',1);

/* =========================================================
   DONE
========================================================= */
