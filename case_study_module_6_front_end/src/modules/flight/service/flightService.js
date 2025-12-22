import axios from "axios";
import qs from "qs";
const URL_BE = "http://localhost:8080/api/flights";

export const getAllFlights = async (params) => {
    try {
        const response = await axios.get(URL_BE, {
            params,
            // Cấu hình để Axios gửi array sort đúng chuẩn Spring Boot
            // VD: sort=col1,asc&sort=col2,desc
            paramsSerializer: params => {
                return qs.stringify(params, { arrayFormat: 'repeat' })
            }
        });
        return response.data.content || [];
        // eslint-disable-next-line no-unused-vars
    } catch (e) { return []; }
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
        // eslint-disable-next-line no-unused-vars
    } catch (e) { return false; }
};