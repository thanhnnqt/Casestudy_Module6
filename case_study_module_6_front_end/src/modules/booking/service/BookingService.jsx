import axios from "../../../modules/login/service/axiosConfig";
import qs from "qs";

// URL gốc trỏ về Backend Spring Boot
const API_URL = "http://localhost:8080/api";

export const FlightService = {
    // 1. Tìm chuyến bay
    searchFlights: (from, to, date) => {
        const params = {
            date: date,           // Khớp với @RequestParam("date")
            origin: from,         // <--- SỬA THÀNH 'origin' để khớp với Backend
            destination: to,      // <--- SỬA THÀNH 'destination' để khớp với Backend
            status: 'SCHEDULED',
            page: 0,
            size: 100
        };

        console.log("Calling API with params:", params); // Log ra để kiểm tra

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

    // 3. Tạo Booking (Online)
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

    // 6. Gợi ý số hiệu
    getFlightNumberSuggestions: () => {
        return axios.get(`${API_URL}/flights/suggestions/numbers`);
    },

    // 7. Cập nhật trạng thái booking (Thanh toán/Hủy)
    updateBookingStatus: (id, status) => {
        return axios.put(`${API_URL}/bookings/${id}/status`, null, {
            params: { newStatus: status }
        });
    },

    // 8. BÁN VÉ TẠI QUẦY
    createCounterBooking: (data) => {
        return axios.post(`${API_URL}/bookings/sell-at-counter`, data);
    },

    // 9. XÓA VÉ (DELETE) ---
    deleteBooking: (id) => {
        return axios.delete(`${API_URL}/bookings/${id}`);
    },

    // 10. CẬP NHẬT THÔNG TIN VÉ (Sửa tên, SĐT...) ---
    updateBookingInfo: (data) => {
        // Gửi request PUT kèm dữ liệu đã sửa lên server
        return axios.put(`${API_URL}/bookings/${data.id}`, data);
    },
    // 11. Thanh toán VNPAY
    createPaymentUrl: (amount, bookingCode) => {
        return axios.get(`${API_URL}/payment/create_payment_url`, {
            params: { amount: amount, orderInfo: bookingCode }
        });
    }
};