import api from "./axiosConfig.js";

export const login = async (data) => {
    const res = await api.post("/auth/login", data);
    return res.data;
};

export const loginGoogle = async (credential) => {
    const res = await api.post("/auth/google", {
        credential
    });
    return res.data;
};

export const register = async (data) => {
    const res = await api.post("/auth/register", data);
    return res.data;
};

export const getMe = async () =>
    await api.get("/auth/me");
