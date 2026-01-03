import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

function decodeJwt(token) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
    );

    return JSON.parse(jsonPayload);
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null); // 🔥 THÊM DÒNG NÀY

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken); // 🔥 THÊM
            const payload = decodeJwt(storedToken);
            setUser({
                username: payload.sub,
                role: payload.role,
                customerId: payload.customerId,
                fullName: payload.fullName
            });
        }
    }, []);

    const login = (newToken) => {
        localStorage.setItem("token", newToken);
        setToken(newToken); // 🔥 THÊM
        const payload = decodeJwt(newToken);
        setUser({
            username: payload.sub,
            role: payload.role,
            customerId: payload.customerId,
            fullName: payload.fullName
        });
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        setToken(null); // 🔥 THÊM
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
