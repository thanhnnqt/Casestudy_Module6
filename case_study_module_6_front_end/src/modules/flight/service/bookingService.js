import axios from "axios";

const URL_BE = "http://localhost:8080/api/bookings";

// Gọi API đặt vé Online (Full thông tin)
export const createOnlineBooking = async (bookingData) => {
    try {
        const response = await axios.post(`${URL_BE}/online`, bookingData);
        return response.data;
    } catch (error) {
        throw error.response?.data || "Lỗi kết nối hệ thống";
    }
};