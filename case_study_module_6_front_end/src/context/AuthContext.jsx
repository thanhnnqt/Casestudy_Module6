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

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const payload = decodeJwt(token);
            setUser({
                username: payload.sub,
                role: payload.role,
                customerId: payload.customerId,
                fullName: payload.fullName
            });
        }
    }, []);

    const login = (token) => {
        localStorage.setItem("token", token);
        const payload = decodeJwt(token);
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
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
