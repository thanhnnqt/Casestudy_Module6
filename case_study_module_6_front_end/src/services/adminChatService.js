import axios from "../modules/login/service/axiosConfig";

export const getAdminInbox = async () => {
    const res = await axios.get("/api/admin/chat/customers");
    return res.data;
};

export const markMessagesAsRead = async (customerId) => {
    const res = await axios.post(`/api/admin/chat/mark-read/${customerId}`);
    return res.data;
};
