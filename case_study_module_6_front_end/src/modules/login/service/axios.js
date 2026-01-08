import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
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
