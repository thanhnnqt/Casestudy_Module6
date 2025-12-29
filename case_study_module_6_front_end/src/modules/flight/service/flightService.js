import axios from "axios";
import qs from "qs";
const URL_BE = "http://localhost:8080/api/flights";

export const getAllFlights = async (params) => {
    try {
        const response = await axios.get(URL_BE, {
            params,
            paramsSerializer: params => {
                return qs.stringify(params, { arrayFormat: 'repeat' })
            }
        });
        // --- SỬA QUAN TRỌNG: TRẢ VỀ TOÀN BỘ DATA (gồm content, totalPages...) ---
        return response.data;
    } catch (e) {
        console.error(e);
        return { content: [], totalPages: 0 };
    }
};

export const getFlightById = async (id) => (await axios.get(`${URL_BE}/${id}`)).data;

export const saveFlight = async (flight, id = null) => {
    try {
        const method = id ? 'put' : 'post';
        const url = id ? `${URL_BE}/${id}` : URL_BE;
        const response = await axios[method](url, flight);
        return response.status === 200;
    } catch (e) {
        throw e.response?.data || "Lỗi hệ thống";
    }
};

export const cancelFlight = async (id) => {
    try {
        const response = await axios.delete(`${URL_BE}/${id}`);
        return response.status === 200;
    } catch (e) { return false; }
};