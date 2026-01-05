import axios from "axios";

const api = axios.create({
    baseURL: "http://192.168.1.68:8080",
});

api.interceptors.request.use((config) => {
    const isPublicAuth =
        config.url.startsWith("/auth/login") ||
        config.url.startsWith("/auth/register");

    if (!isPublicAuth) {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export default api;
