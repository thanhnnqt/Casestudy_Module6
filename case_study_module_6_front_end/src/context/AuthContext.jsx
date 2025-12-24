import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // 🔹 Load user khi refresh trang
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const payload = JSON.parse(atob(token.split(".")[1]));
            setUser({
                email: payload.sub,
                role: payload.role,
                fullName: payload.fullName   // 👈
            });
        }
    }, []);

    // 🔹 Sau khi login thành công
    const login = (token) => {
        if (!token) throw new Error("Token is missing");

        localStorage.setItem("token", token);

        const payload = JSON.parse(atob(token.split(".")[1]));

        setUser({
            username: payload.sub,
            role: payload.role,
            customerId: payload.customerId,
            fullName: payload.fullName   // ✅ DB
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
