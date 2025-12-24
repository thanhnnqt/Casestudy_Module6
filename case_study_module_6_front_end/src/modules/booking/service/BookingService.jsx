import axios from "axios";
import qs from "qs";

// URL gốc trỏ về Backend Spring Boot
const API_URL = "http://localhost:8080/api";

export const FlightService = {
    // 1. Tìm chuyến bay
    searchFlights: (from, to, date) => {
        const params = {
            date: date,
            status: 'SCHEDULED',
            page: 0,
            size: 100
        };

        console.log("Gọi API tìm vé theo ngày với params:", params);

        return axios.get(`${API_URL}/flights/search-by-date`, {
            params: params,
            paramsSerializer: params => {
                return qs.stringify(params, { arrayFormat: 'repeat' })
            }
        });
    },

    // 2. Lấy chi tiết 1 chuyến bay
    getFlightById: (id) => {
        return axios.get(`${API_URL}/flights/${id}`);
    },

    // 3. Tạo Booking (Dành cho đặt Online - Nếu có dùng)
    createBooking: (bookingPayload) => {
        return axios.post(`${API_URL}/bookings`, bookingPayload);
    },

    // 4. Lấy danh sách Booking
    getAllBookings: () => {
        return axios.get(`${API_URL}/bookings`);
    },

    // 5. Lấy danh sách sân bay
    getAllAirports: () => {
        return axios.get(`${API_URL}/airports`);
    },

    // 6. Lấy danh sách gợi ý số hiệu
    getFlightNumberSuggestions: () => {
        return axios.get(`${API_URL}/flights/suggestions/numbers`);
    },

    // 7. Cập nhật trạng thái booking
    updateBookingStatus: (id, status) => {
        return axios.put(`${API_URL}/bookings/${id}/status`, null, {
            params: { newStatus: status }
        });
    },

    // --- 8. [MỚI THÊM] BÁN VÉ TẠI QUẦY (Xử lý Payload chuẩn cho Java) ---
    createCounterBooking: (values) => {
        // Lấy danh sách hành khách từ form
        const passengerList = values.passengers || [];

        // Tạo payload chuẩn mà Backend (DTO) yêu cầu
        const payload = {
            flightId: values.flightId,

            // Lấy hạng ghế từ người đầu tiên (mặc định ECONOMY nếu lỗi)
            seatClass: passengerList.length > 0 ? passengerList[0].seatClass : "ECONOMY",

            // Số lượng vé chính là số người trong list
            quantity: passengerList.length,

            contactName: values.contactName,
            contactEmail: values.contactEmail
        };

        console.log("Payload gửi đi bán tại quầy:", payload);

        // Gọi đúng endpoint bán tại quầy
        return axios.post(`${API_URL}/bookings/sell-at-counter`, payload);
    }
};