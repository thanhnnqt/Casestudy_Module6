import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token || !token.includes(".")) {
            localStorage.removeItem("token");
            return;
        }

        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            setUser({
                email: payload.sub,
                role: payload.role
            });
        } catch (e) {
            console.error("Invalid token", e);
            localStorage.removeItem("token");
            setUser(null);
        }
    }, []);

    const login = (token) => {
        localStorage.setItem("token", token);
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({
            email: payload.sub,
            role: payload.role
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
