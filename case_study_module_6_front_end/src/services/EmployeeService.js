import axios from "axios";

const API_URL = "http://localhost:8080/api/employees";

// Hàm lấy thông tin nhân viên theo ID
export const getEmployeeById = async (id) => {
    // eslint-disable-next-line no-useless-catch
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// (Optional) Hàm lấy thông tin nhân viên đang đăng nhập (nếu backend có hỗ trợ)
export const getMyProfile = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
        const response = await axios.get(`${API_URL}/my-profile`);
        return response.data;
    } catch (error) {
        throw error;
    }
};