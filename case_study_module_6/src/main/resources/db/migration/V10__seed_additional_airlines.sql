/* =========================================================
   FIX: ADD MISSING TICKETS FOR PAID BOOKINGS
   Purpose: Ensure revenue is calculated correctly
========================================================= */

INSERT INTO tickets (
    seat_number,
    ticket_number,
    passenger_name,
    passenger_dob,
    seat_class,
    price,
    booking_id,
    flight_id,
    status
)
SELECT
    CONCAT('A', b.id)                                AS seat_number,
    CONCAT('AUTO_TCK_', b.booking_code)              AS ticket_number,
    COALESCE(b.contact_name, 'Auto Passenger')       AS passenger_name,
    '1995-01-01'                                     AS passenger_dob,
    'ECONOMY'                                        AS seat_class,
    b.total_amount                                   AS price,
    b.id                                             AS booking_id,
    b.flight_id                                      AS flight_id,
    'BOOKED'                                         AS status
FROM bookings b
         LEFT JOIN tickets t ON t.booking_id = b.id
WHERE t.id IS NULL
  AND b.status = 'PAID'
  AND b.flight_id IS NOT NULL;
