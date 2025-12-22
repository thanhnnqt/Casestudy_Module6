import api from "./axios.js";

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

export const register = async (credential) => {
    const res = await api.post("/auth/register", {
        credential
    });
    return res.data;
};