import axios from "../modules/login/service/axiosConfig";

export const getAllAirports = async () => {
    try {
        const res = await axios.get("/api/airports");
        return res.data;
    } catch (err) {
        console.error("Error fetching airports:", err);
        return [];
    }
};
