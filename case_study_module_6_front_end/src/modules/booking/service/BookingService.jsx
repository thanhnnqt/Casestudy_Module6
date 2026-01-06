import axios from "axios";
import qs from "qs";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

// --- HÀM LẤY TOKEN CỰC KỲ CẨN THẬN ---
const getAuthConfig = () => {
    let token = localStorage.getItem("accessToken") || localStorage.getItem("token");

    // Nếu token chưa có, thử tìm trong object 'user'
    if (!token) {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            try {
                const userObj = JSON.parse(userStr);
                token = userObj.token || userObj.accessToken || userObj.jwt;
            } catch (e) {
                console.error("Lỗi parse JSON user:", e);
            }
        }
    }

    // [QUAN TRỌNG] Loại bỏ dấu ngoặc kép thừa nếu có
    if (token && typeof token === 'string') {
        token = token.replace(/^"|"$/g, '');
    }

    if (!token) {
        console.warn("⛔ Cảnh báo: Không tìm thấy Token hợp lệ! Request có thể bị 403.");
        return {};
    }

    return {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        }
    };
};

export const FlightService = {
    // 1. Tìm chuyến bay
    searchFlights: (from, to, date) => {
        const params = {
            date: date,
            origin: from,
            destination: to,
            status: 'SCHEDULED',
            page: 0,
            size: 100
        };
        return axios.get(`${API_URL}/flights/search-by-date`, {
            params: params,
            paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
        });
    },

    // 2. Lấy chi tiết
    getFlightById: (id) => {
        return axios.get(`${API_URL}/flights/${id}`);
    },

    // 3. Tạo Booking (Online/Pending)
    createBooking: (bookingPayload) => {
        return axios.post(`${API_URL}/bookings`, bookingPayload, getAuthConfig());
    },

    // 4. Lấy danh sách
    getAllBookings: () => {
        return axios.get(`${API_URL}/bookings`, getAuthConfig());
    },

    // 5. Danh sách sân bay
    getAllAirports: () => {
        return axios.get(`${API_URL}/master/airports`);
    },

    // 7. Update trạng thái
    updateBookingStatus: (id, status) => {
        return axios.put(`${API_URL}/bookings/${id}/status`, null, {
            params: { newStatus: status },
            ...getAuthConfig()
        });
    },

    // 8. Bán tại quầy (CẦN TOKEN)
    createCounterBooking: (data) => {
        return axios.post(`${API_URL}/bookings/sell-at-counter`, data, getAuthConfig());
    },

    // 9. Xóa vé
    deleteBooking: (id) => {
        return axios.delete(`${API_URL}/bookings/${id}`, getAuthConfig());
    },

    // 10. Update thông tin
    updateBookingInfo: (data) => {
        return axios.put(`${API_URL}/bookings/${data.id}`, data, getAuthConfig());
    },

    // 11. Tạo link thanh toán VNPAY (QUAN TRỌNG: ĐÃ THÊM RETURN)
    createPaymentUrl: (amount, bookingCode) => {
        return axios.post(`${API_URL}/payment/create-payment-url`, { amount, bookingCode }, getAuthConfig());
    },

    // 12. Lấy lịch sử đặt vé của tôi
    getMyBookings: () => {
        return axios.get(`${API_URL}/bookings/my-history`, getAuthConfig());
    }
}

export const createOnlineBooking = (bookingPayload) => {
    return axios.post(`${API_URL}/bookings/online`, bookingPayload);
};

