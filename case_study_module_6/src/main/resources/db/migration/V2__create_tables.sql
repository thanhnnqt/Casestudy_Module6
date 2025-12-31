-- ================== 1. ACCOUNTS (Chỉ lưu thông tin đăng nhập) ==================
CREATE TABLE accounts
(
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    username   VARCHAR(100) NOT NULL UNIQUE,
    password   VARCHAR(255) NULL,
    provider   ENUM('LOCAL','GOOGLE') DEFAULT 'LOCAL',
    enabled    BOOLEAN   DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================== 2. DANH MỤC CƠ BẢN ==================
CREATE TABLE airports
(
    id   INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(5)   NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL
);

CREATE TABLE airlines
(
    id       INT AUTO_INCREMENT PRIMARY KEY,
    code     VARCHAR(10)  NOT NULL UNIQUE,
    name     VARCHAR(100) NOT NULL,
    logo_url VARCHAR(255)
);

CREATE TABLE aircrafts
(
    id                INT AUTO_INCREMENT PRIMARY KEY,
    name              VARCHAR(100) NOT NULL,
    registration_code VARCHAR(20) UNIQUE,
    total_seats       INT          NOT NULL,
    airline_id        INT          NOT NULL,
    FOREIGN KEY (airline_id) REFERENCES airlines (id)
);

-- ================== 3. CHUYẾN BAY & CẤU HÌNH GIÁ ==================
CREATE TABLE flights
(
    id                   BIGINT AUTO_INCREMENT PRIMARY KEY,
    flight_number        VARCHAR(20),
    aircraft_id          INT      NOT NULL,
    departure_airport_id INT      NOT NULL,
    arrival_airport_id   INT      NOT NULL,
    departure_time       DATETIME NOT NULL,
    arrival_time         DATETIME NOT NULL,

    -- Đã BỎ cột base_price theo yêu cầu. Giá giờ nằm hoàn toàn ở bảng dưới.

    status               ENUM('SCHEDULED','DELAYED','IN_FLIGHT','CANCELLED','COMPLETED'),

    UNIQUE (flight_number, departure_time),
    FOREIGN KEY (aircraft_id) REFERENCES aircrafts (id),
    FOREIGN KEY (departure_airport_id) REFERENCES airports (id),
    FOREIGN KEY (arrival_airport_id) REFERENCES airports (id)
);


-- Bảng này quyết định giá và số lượng ghế từng hạng
CREATE TABLE flight_seat_details
(
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    flight_id       BIGINT         NOT NULL,

    -- Hạng ghế
    seat_class      ENUM('ECONOMY', 'BUSINESS', 'FIRST_CLASS') NOT NULL,

    -- GIÁ VÉ CHÍNH THỨC (Duy nhất chỗ này có giá)
    price           DECIMAL(15, 2) NOT NULL,

    -- Số lượng ghế quy hoạch cho hạng này
    total_seats     INT            NOT NULL,
    available_seats INT            NOT NULL,

    FOREIGN KEY (flight_id) REFERENCES flights (id),
    UNIQUE (flight_id, seat_class)
);

-- ================== 4. ĐẶT VÉ ==================
CREATE TABLE bookings
(
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,

    -- ===== THÔNG TIN BOOKING =====
    booking_code        VARCHAR(20)    NOT NULL UNIQUE, -- Mã đặt chỗ (PNR)
    booking_date        DATETIME  DEFAULT CURRENT_TIMESTAMP,

    total_amount        DECIMAL(15, 2) NOT NULL,        -- Tổng tiền cần thanh toán

    status              ENUM(
        'PENDING',     -- Giữ chỗ, chưa thanh toán
        'PAID',        -- Đã thanh toán
        'CANCELLED',   -- Hủy trước thanh toán
        'REFUNDED'     -- Đã hoàn tiền
    ) DEFAULT 'PENDING',

    channel             ENUM(
        'ONLINE',
        'OFFLINE',
        'AGENT'
    ) NOT NULL,

    trip_type           ENUM(
        'ONE_WAY',
        'ROUND_TRIP'
    ) NOT NULL,

    -- ===== THÔNG TIN LIÊN HỆ =====
    contact_email       VARCHAR(100),
    contact_phone       VARCHAR(20),

    -- ===== THÔNG TIN THANH TOÁN =====
    payment_method      ENUM(
        'CASH',
        'BANK_TRANSFER',
        'VNPAY',
        'MOMO',
        'ZALOPAY'
    ),

    payment_status      ENUM(
        'UNPAID',
        'PAID',
        'FAILED',
        'REFUNDED'
    ) DEFAULT 'UNPAID',

    transaction_code    VARCHAR(100),                   -- Mã giao dịch từ cổng thanh toán
    paid_at             DATETIME,                       -- Thời điểm thanh toán

    -- ===== NGƯỜI THỰC HIỆN =====
    customer_account_id BIGINT,
    created_by_sales_id BIGINT,

    -- ===== AUDIT =====
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- ===== FOREIGN KEY =====
    CONSTRAINT fk_booking_customer
        FOREIGN KEY (customer_account_id)
            REFERENCES accounts (id),

    CONSTRAINT fk_booking_sales
        FOREIGN KEY (created_by_sales_id)
            REFERENCES accounts (id)
);

CREATE TABLE tickets
(
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    seat_number    VARCHAR(10),
    ticket_number  VARCHAR(50) UNIQUE,
    passenger_name VARCHAR(100)   NOT NULL,
    passenger_dob  DATE,

    -- Hạng vé khách đã mua
    seat_class     ENUM('ECONOMY', 'BUSINESS', 'FIRST_CLASS') NOT NULL,

    -- Giá chốt tại thời điểm mua (Lưu lại để sau này đối soát)
    price          DECIMAL(15, 2) NOT NULL,

    booking_id     BIGINT         NOT NULL,
    flight_id      BIGINT         NOT NULL,

    status         ENUM('BOOKED', 'CHECKED_IN', 'CANCELLED') DEFAULT 'BOOKED',

    UNIQUE (flight_id, seat_number),
    FOREIGN KEY (booking_id) REFERENCES bookings (id),
    FOREIGN KEY (flight_id) REFERENCES flights (id)
);

-- ================== 5. PROFILE (Định danh Role ở đây) ==================

-- Nếu Account ID tồn tại trong bảng này => ROLE_EMPLOYEE
CREATE TABLE employees
(
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name         VARCHAR(100) NOT NULL,
    address           VARCHAR(255),
    phone_number      VARCHAR(20),
    identification_id VARCHAR(20),
    email             VARCHAR(100),
    dob               DATE,
    gender            ENUM('Nam', 'Nữ', 'Khác') DEFAULT 'Khác',
    img_url           VARCHAR(500),
    img_hash          VARCHAR(500),
    account_id        BIGINT,
    FOREIGN KEY (account_id) REFERENCES accounts (id)
);

-- Nếu Account ID tồn tại trong bảng này => ROLE_CUSTOMER
CREATE TABLE customers
(
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_code  VARCHAR(100),
    full_name      VARCHAR(100) NOT NULL,
    date_of_birth  DATE,
    gender         ENUM('NAM', 'NU', 'KHAC') DEFAULT 'KHAC',
    phone_number   VARCHAR(15) UNIQUE,
    email          VARCHAR(100) UNIQUE,
    identity_card  VARCHAR(20) UNIQUE,
    address        VARCHAR(255),
    total_spending DECIMAL(15, 2) DEFAULT 0,
    created_at     TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,

    account_id     BIGINT UNIQUE,

    CONSTRAINT fk_customer_account
        FOREIGN KEY (account_id)
            REFERENCES accounts (id)
            ON DELETE CASCADE
);

-- Nếu Account ID tồn tại trong bảng này => ROLE_ADMIN
CREATE TABLE admins
(
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    admin_code   VARCHAR(50) UNIQUE,
    full_name    VARCHAR(100) NOT NULL,
    email        VARCHAR(100) UNIQUE,
    phone_number VARCHAR(20) UNIQUE,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    account_id   BIGINT       NOT NULL UNIQUE,

    CONSTRAINT fk_admin_account
        FOREIGN KEY (account_id)
            REFERENCES accounts (id)
            ON DELETE CASCADE
);

-- ================== 6. CMS ==================
CREATE TABLE news
(
    news_id      INT AUTO_INCREMENT PRIMARY KEY,
    title        VARCHAR(255),
    slug         VARCHAR(255),
    summary      VARCHAR(500),
    email        VARCHAR(255), -- Đã thêm trường này
    content      LONGTEXT,     -- @Lob map sang LONGTEXT
    thumbnail    VARCHAR(255),

    -- EnumType.STRING trong Java nên lưu là VARCHAR trong DB để linh hoạt
    category     VARCHAR(50) DEFAULT 'NEWS',

    is_active    BIT(1) DEFAULT 1, -- Boolean map sang BIT
    published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    account_id   BIGINT NOT NULL,
    CONSTRAINT fk_news_account FOREIGN KEY (account_id) REFERENCES accounts (id)
);
CREATE TABLE payments
(
    id                 BIGINT AUTO_INCREMENT PRIMARY KEY,

    -- Booking được thanh toán
    booking_id         BIGINT         NOT NULL,

    -- Phương thức thanh toán
    payment_method     ENUM(
        'CASH',
        'BANK_TRANSFER',
        'VNPAY',
        'MOMO',
        'ZALOPAY'
    ) NOT NULL,

    -- Số tiền thanh toán
    amount             DECIMAL(15, 2) NOT NULL,

    -- Trạng thái thanh toán
    status             ENUM(
        'PENDING',
        'SUCCESS',
        'FAILED',
        'REFUNDED'
    ) DEFAULT 'PENDING',

    -- Mã giao dịch từ cổng thanh toán / ngân hàng
    transaction_code   VARCHAR(100),

    -- Tài khoản thực hiện thanh toán
    paid_by_account_id BIGINT,

    -- Thời điểm thanh toán
    paid_at            DATETIME,

    created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- ================== FOREIGN KEY ==================
    CONSTRAINT fk_payment_booking
        FOREIGN KEY (booking_id)
            REFERENCES bookings (id),

    CONSTRAINT fk_payment_account
        FOREIGN KEY (paid_by_account_id)
            REFERENCES accounts (id)
);

CREATE TABLE verification_tokens
(
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    token            VARCHAR(255) NOT NULL UNIQUE,
    expiry_date      DATETIME     NOT NULL,
    register_request TEXT
);
CREATE TABLE password_reset_tokens
(
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    token      VARCHAR(255) NOT NULL UNIQUE,
    email      VARCHAR(100) NOT NULL,
    expired_at DATETIME     NOT NULL,
    used       BOOLEAN DEFAULT FALSE
);