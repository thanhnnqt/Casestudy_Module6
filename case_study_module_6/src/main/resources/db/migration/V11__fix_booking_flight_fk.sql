USE case_study_module_6;

-- ===============================
-- 1. ADD flight_id column if missing
-- ===============================
SET @col_flight := (
    SELECT COUNT(*)
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'bookings'
      AND COLUMN_NAME = 'flight_id'
);

SET @sql := IF(
    @col_flight = 0,
    'ALTER TABLE bookings ADD COLUMN flight_id BIGINT',
    'SELECT 1'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;


-- ===============================
-- 2. ADD contact_name column if missing
-- ===============================
SET @col_contact := (
    SELECT COUNT(*)
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'bookings'
      AND COLUMN_NAME = 'contact_name'
);

SET @sql := IF(
    @col_contact = 0,
    'ALTER TABLE bookings ADD COLUMN contact_name VARCHAR(255)',
    'SELECT 1'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;


-- ===============================
-- 3. ADD FK if missing
-- ===============================
SET @fk_exists := (
    SELECT COUNT(*)
    FROM information_schema.TABLE_CONSTRAINTS
    WHERE CONSTRAINT_SCHEMA = DATABASE()
      AND TABLE_NAME = 'bookings'
      AND CONSTRAINT_NAME = 'fk_booking_flight'
);

SET @sql := IF(
    @fk_exists = 0,
    'ALTER TABLE bookings ADD CONSTRAINT fk_booking_flight FOREIGN KEY (flight_id) REFERENCES flights(id)',
    'SELECT 1'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
