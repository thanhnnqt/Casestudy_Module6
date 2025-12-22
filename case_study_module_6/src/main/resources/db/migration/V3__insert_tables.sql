
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

INSERT INTO airports (code,name,city) VALUES
                                          ('SGN','Tân Sơn Nhất','HCM'),
                                          ('HAN','Nội Bài','Hà Nội');

INSERT INTO airlines (code,name) VALUES
                                     ('VN','Vietnam Airlines'),
                                     ('VJ','VietJet Air');

INSERT INTO aircrafts (name,registration_code,total_seats,airline_id) VALUES
    ('Airbus A321','VN-A321',180,1);

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
