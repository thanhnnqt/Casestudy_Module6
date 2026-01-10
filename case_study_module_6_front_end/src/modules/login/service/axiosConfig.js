import axios from "axios";

const instance = axios.create({
    baseURL: "https://casestudymodule6-production.up.railway.app",
    headers: {
        "Content-Type": "application/json"
    }
});

instance.interceptors.request.use((config) => {
    const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default instance;
