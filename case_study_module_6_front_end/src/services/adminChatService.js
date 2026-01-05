import axios from "../modules/login/service/axiosConfig";

export const getAdminInbox = async () => {
    const res = await axios.get("/api/admin/chat/customers");
    return res.data;
};
