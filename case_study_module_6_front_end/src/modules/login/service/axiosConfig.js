import axios from "axios";

const instance = axios.create({
    baseURL: "http://192.168.1.68:8080",
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
