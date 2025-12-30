import axios from "../modules/login/service/axiosConfig";

const API_URL = "http://localhost:8080/api/customers";

// 1. Lấy danh sách (Hỗ trợ tìm kiếm nhiều trường)
// params là object: { name: '...', phone: '...', identity: '...' }
export const getAllCustomers = async (params = {}) => {
    try {
        const response = await axios.get(API_URL, { params });
        // Server Spring Boot trả về đối tượng Page có cấu trúc:
        // { content: [...], totalPages: 5, number: 0, ... }
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách:", error);
        throw error;
    }
};

// 2. Lấy chi tiết
export const getCustomerById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy chi tiết:", error);
        throw error;
    }
};

// 3. Thêm mới
export const createCustomer = async (customer) => {
    try {
        await axios.post(API_URL, customer);
    } catch (error) {
        console.error("Lỗi khi thêm mới:", error);
        throw error;
    }
};

// 4. Cập nhật
export const updateCustomer = async (id, customer) => {
    try {
        await axios.put(`${API_URL}/${id}`, customer);
    } catch (error) {
        console.error("Lỗi khi cập nhật:", error);
        throw error;
    }
};

// 5. Xóa
export const deleteCustomer = async (id) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error("Lỗi khi xóa:", error);
        throw error;
    }
};