import { createContext, useContext, useEffect, useState } from "react";
import { getMe } from "../modules/login/service/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // 🔹 Load user khi refresh trang
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        getMe()
            .then(res => {
                // backend trả: { username, role }
                setUser({
                    username: res.data.username,
                    role: res.data.role
                });
            })
            .catch(() => {
                localStorage.removeItem("token");
                setUser(null);
            });
    }, []);

    // 🔹 Sau khi login thành công
    const login = async (token) => {
        if (!token) {
            throw new Error("Token is missing");
        }

        localStorage.setItem("token", token);

        const res = await getMe(); // lúc này interceptor mới gắn token
        setUser({
            username: res.data.username,
            role: res.data.role
        });
    };

    // 🔹 Logout
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
