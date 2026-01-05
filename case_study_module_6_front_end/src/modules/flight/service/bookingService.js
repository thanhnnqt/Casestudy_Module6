import axios from "../../login/service/axiosConfig";

const URL_BE = "/api/bookings";
const URL_PAYMENT = "/api/payment"; // Thêm dòng này

// Gọi API đặt vé Online (Giữ nguyên)
export const createOnlineBooking = async (bookingData) => {
    try {
        const response = await axios.post(`${URL_BE}/online`, bookingData);
        return response.data;
    } catch (error) {
        throw error.response?.data || "Lỗi kết nối hệ thống";
    }
};

// [MỚI] Gọi API tạo link thanh toán VNPay
export const createPaymentUrl = async (amount, bookingCode) => {
    try {
        const response = await axios.post(`${URL_PAYMENT}/create-payment-url`, {
            amount,
            bookingCode
        });
        return response.data; // Trả về { url: "..." }
    } catch (error) {
        console.error("Lỗi lấy link thanh toán", error);
        throw error;
    }
};