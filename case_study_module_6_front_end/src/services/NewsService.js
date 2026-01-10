import axios from "../modules/login/service/axiosConfig";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/news`;

export const getAllNews = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Lỗi lấy danh sách tin tức:", error);
        return [];
    }
};

// --- THÊM HÀM NÀY ---
export const getNewsById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi lấy chi tiết tin tức:", error);
        throw error;
    }
};
export const createNews = async (news) => {
    return await axios.post(API_URL, news);
};

export const updateNews = async (id, news) => {
    return await axios.put(`${API_URL}/${id}`, news);
};

export const deleteNews = async (id) => {
    return await axios.delete(`${API_URL}/${id}`);
};

