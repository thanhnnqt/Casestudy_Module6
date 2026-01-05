import axios from "axios";

// Đảm bảo biến này được khai báo ở đầu file
const URL_EMPLOYEE = "http://localhost:8080/v1/api/employees";
const URL_AUTH = "http://localhost:8080/auth";

export const getAllEmployees = async (page, size) => {
    try {
        const res = await axios.get(`${URL_EMPLOYEE}?page=${page}&size=${size}`);
        return res.data;
    } catch (e) {
        console.error("Lỗi getAllEmployees:", e);
        return [];
    }
};

export const getEmployeeListBySearch = async (name, phone, page, size) => {
    try {
        const res = await axios.get(
            `${URL_EMPLOYEE}?name=${name}&phone=${phone}&page=${page}&size=${size}`
        );
        return res.data;
    } catch (e) {
        console.error("Lỗi search:", e);
        return [];
    }
};

// --- HÀM QUAN TRỌNG ĐÃ SỬA ---
export const getEmployeeById = async (id) => {
    // 1. Lấy token
    let token = localStorage.getItem("token");

    // 2. Xử lý Token: Nếu token bị bao bởi dấu ngoặc kép "...", hãy gỡ bỏ nó
    // (Ví dụ: "eyJ..." -> eyJ...)
    if (token && token.startsWith('"') && token.endsWith('"')) {
        token = token.slice(1, -1);
    }

    console.log("Token gửi đi (đã xử lý):", token); // <-- Kiểm tra console xem token có sạch không

    try {
        const res = await axios.get(`${URL_EMPLOYEE}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Gửi kèm "vé"
            },
        });
        return res.data;
    } catch (error) {
        // In chi tiết lỗi để biết tại sao bị chặn 403
        if (error.response) {
            console.error("Server từ chối (Status):", error.response.status);
            console.error("Lý do từ Server:", error.response.data); // <-- Quan trọng: Xem Server nói gì
        }
        throw error;
    }
};

export const saveEmployee = async (employee) => {
    try {
        await axios.post(URL_EMPLOYEE, employee);
        return true;
    } catch (e) {
        console.error("Lỗi save:", e);
        return false;
    }
};

export const updateEmployee = async (id, employee) => {
    try {
        await axios.put(`${URL_EMPLOYEE}/${id}`, employee);
        return true;
    } catch (e) {
        console.error("Lỗi update:", e);
        return false;
    }
};

export const deleteEmployee = async (id) => {
    try {
        await axios.delete(`${URL_EMPLOYEE}/${id}`);
        return true;
    } catch (e) {
        console.error("Lỗi delete:", e);
        return false;
    }
};

// Thêm hàm này để tránh lỗi "is not defined" ở EmployeeInfo (nếu bạn dùng cách cũ)
export const getEmployeeByUsername = async (username) => {
    try {
        const res = await axios.get(`${URL_EMPLOYEE}?username=${username}`);
        if (res.data && res.data.content && res.data.content.length > 0) {
            return res.data.content[0];
        }
        return res.data;
    } catch (e) {
        return null;
    }
};

export const changePassword = async (passwordData) => {
    // 1. Xử lý Token
    let token = localStorage.getItem("token");
    if (token && token.startsWith('"') && token.endsWith('"')) {
        token = token.slice(1, -1);
    }

    try {
        // QUAN TRỌNG: Backend dùng @PutMapping nên ở đây phải là axios.put
        const res = await axios.put(`${URL_AUTH}/change-password`, passwordData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res;
    } catch (error) {
        throw error;
    }
};