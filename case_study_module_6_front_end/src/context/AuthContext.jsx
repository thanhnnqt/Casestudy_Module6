import { createContext, useContext, useEffect, useState } from "react";
import {getMe} from "../modules/login/service/authService.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        getMe()
            .then(res => setUser(res.data))
            .catch(() => {
                localStorage.removeItem("token");
                setUser(null);
            });
    }, []);

    const login = async (token) => {
        localStorage.setItem("token", token);
        const res = await getMe();   // ✅ lấy từ backend
        setUser(res.data);           // { email, username, role }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
