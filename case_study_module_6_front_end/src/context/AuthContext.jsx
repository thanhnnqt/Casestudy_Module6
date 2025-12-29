import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

function decodeJwt(token) {
    const base64 = token.split(".")[1];
    const json = decodeURIComponent(
        atob(base64)
            .split("")
            .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
    );
    return JSON.parse(json);
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token =
            localStorage.getItem("token") ||
            sessionStorage.getItem("token");
        if (token) {
            const payload = decodeJwt(token);
            setUser({
                email: payload.sub,
                role: payload.role,
                fullName: payload.fullName
            });
        }
    }, []);

    const login = (token) => {
        if (!token) throw new Error("Token is missing");

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
        sessionStorage.removeItem("token");
        setUser(null);
    };
    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
