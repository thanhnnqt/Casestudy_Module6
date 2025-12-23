-- ================== 1. ACCOUNTS ==================
INSERT INTO accounts (id, username, password, enabled) VALUES
                                                           (1, 'admin',      '$2a$10$X9qM3n9G7H2N7J4fY9KpXeE1ZfH2zZyZ6tHk6qf2b0l6sP7gG', true),
                                                           (2, 'employee1',  '$2a$10$X9qM3n9G7H2N7J4fY9KpXeE1ZfH2zZyZ6tHk6qf2b0l6sP7gG', true),
                                                           (3, 'employee2',  '$2a$10$X9qM3n9G7H2N7J4fY9KpXeE1ZfH2zZyZ6tHk6qf2b0l6sP7gG', true),
                                                           (4, 'customer1',  '$2a$10$X9qM3n9G7H2N7J4fY9KpXeE1ZfH2zZyZ6tHk6qf2b0l6sP7gG', true),
                                                           (5, 'customer2',  '$2a$10$X9qM3n9G7H2N7J4fY9KpXeE1ZfH2zZyZ6tHk6qf2b0l6sP7gG', true);

-- ================== 2. AIRPORTS ==================
INSERT INTO airports (id, code, name, city) VALUES
                                                (1, 'HAN', 'Noi Bai International Airport', 'Ha Noi'),
                                                (2, 'SGN', 'Tan Son Nhat International Airport', 'Ho Chi Minh'),
                                                (3, 'DAD', 'Da Nang International Airport', 'Da Nang');

-- ================== 3. AIRLINES ==================
INSERT INTO airlines (id, code, name) VALUES
                                          (1, 'VN', 'Vietnam Airlines'),
                                          (2, 'VJ', 'VietJet Air');

-- ================== 4. AIRCRAFTS ==================
INSERT INTO aircrafts (id, name, registration_code, total_seats, airline_id) VALUES
                                                                                 (1, 'Airbus A320', 'VN-A320', 180, 1),
                                                                                 (2, 'Boeing 787',  'VN-B787', 250, 1),
                                                                                 (3, 'Airbus A321', 'VJ-A321', 200, 2);

-- ================== 5. FLIGHTS ==================
INSERT INTO flights
(id, flight_number, aircraft_id, departure_airport_id, arrival_airport_id, departure_time, arrival_time, status)
VALUES
    (1, 'VN101', 1, 1, 2, '2025-01-10 08:00:00', '2025-01-10 10:00:00', 'SCHEDULED'),
    (2, 'VN202', 2, 2, 1, '2025-01-11 14:00:00', '2025-01-11 16:30:00', 'SCHEDULED'),
    (3, 'VJ303', 3, 1, 3, '2025-01-12 09:00:00', '2025-01-12 10:20:00', 'SCHEDULED');

-- ================== 6. FLIGHT SEAT DETAILS ==================
INSERT INTO flight_seat_details
(flight_id, seat_class, price, total_seats, available_seats)
VALUES
    (1, 'ECONOMY',       1500000, 150, 150),
    (1, 'BUSINESS',      3500000, 30, 30),

    (2, 'ECONOMY',       1800000, 200, 200),
    (2, 'BUSINESS',      4200000, 40, 40),

    (3, 'ECONOMY',       1200000, 180, 180);

-- ================== 7. PROFILES ==================
INSERT INTO admins (admin_code, full_name, email, account_id) VALUES
    ('ADMIN001', 'System Admin', 'admin@airline.com', 1);

INSERT INTO employees (employee_code, full_name, phone_number, email, account_id) VALUES
                                                                                      ('NV1', 'Nguyen Van Cu', '0901000001', 'emp1@airline.com', 2),
                                                                                      ('NV2', 'Tran Van Ha', '0901000002', 'emp2@airline.com', 3);

INSERT INTO customers (customer_code, full_name, phone_number, account_id) VALUES
                                                                               ('KH1', 'Nguyen Thi Nhu', '0902000001', 4),
                                                                               ('KH2', 'Do Van Bao', '0902000002', 5);

-- ================== 8. BOOKINGS ==================
INSERT INTO bookings
(id, booking_code, total_amount, channel, trip_type, customer_account_id)
VALUES
    (1, 'BK001', 1500000, 'ONLINE', 'ONE_WAY', 4),
    (2, 'BK002', 1800000, 'ONLINE', 'ONE_WAY', 5);

-- ================== 9. TICKETS ==================
INSERT INTO tickets
(seat_number, ticket_number, passenger_name, seat_class, price, booking_id, flight_id)
VALUES
    ('12A', 'TCK001', 'Nguyen Van A', 'ECONOMY', 1500000, 1, 1),
    ('14C', 'TCK002', 'Tran Thi B',  'ECONOMY', 1800000, 2, 2);

-- ================== 10. NEWS ==================
INSERT INTO news
(title, slug, summary, content, account_id)
VALUES
    ('Khai trương đường bay mới', 'duong-bay-moi',
     'Mở đường bay Hà Nội – Đà Nẵng',
     'Vietnam Airlines chính thức khai trương đường bay mới...',
     1);

-- ================== 11. PAYMENTS ==================
INSERT INTO payments
(booking_id, payment_method, amount, status, transaction_code, paid_by_account_id)
VALUES
    (1, 'VNPAY', 1500000, 'SUCCESS', 'VN20250101001', 4),
    (2, 'MOMO',  1800000, 'SUCCESS', 'MM20250101002', 5);
