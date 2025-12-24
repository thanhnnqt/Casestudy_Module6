import axios from "axios";

const API_URL = "http://localhost:8080/api/customers";

// 1. Lấy danh sách (kèm tìm kiếm)
export const getAllCustomers = async (keyword = "") => {
    try {
        // Gọi: http://localhost:8080/api/customers?keyword=...
        const response = await axios.get(`${API_URL}?keyword=${keyword}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách:", error);
        throw error;
    }
};

// 2. Lấy chi tiết theo ID (để hiển thị lên form sửa)
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