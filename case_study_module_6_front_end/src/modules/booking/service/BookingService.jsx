import axios from "axios";
import qs from "qs";

// URL gốc trỏ về Backend Spring Boot
const API_URL = "http://localhost:8080/api";

export const FlightService = {
    // 1. Tìm chuyến bay (Khớp với FlightController)
    searchFlights: (from, to, date) => {
        // Mapping tham số từ giao diện (from, to) sang tham số Backend (origin, destination)
        const params = {
            origin: from,          // Backend cần 'origin'
            destination: to,       // Backend cần 'destination'
            startDate: date,       // Backend cần 'startDate'
            // Các tham số khác nếu cần:
            // minPrice: ...,
            // maxPrice: ...,
            page: 0,
            size: 100 // Lấy nhiều chút để hiện hết
        };

        console.log("Gọi API tìm vé với params:", params);

        return axios.get(`${API_URL}/flights`, {
            params: params,
            paramsSerializer: params => {
                return qs.stringify(params, { arrayFormat: 'repeat' })
            }
        });
    },

    // 2. Lấy chi tiết 1 chuyến bay (Dùng khi cần check lại ID)
    getFlightById: (id) => {
        return axios.get(`${API_URL}/flights/${id}`);
    },

    // 3. Tạo Booking (Giả định bạn có BookingController ở /api/bookings)
    createBooking: (bookingPayload) => {
        return axios.post(`${API_URL}/bookings`, bookingPayload);
    },

    // 4. Lấy danh sách Booking (Giả định bạn có BookingController)
    getAllBookings: () => {
        return axios.get(`${API_URL}/bookings`);
    }
};