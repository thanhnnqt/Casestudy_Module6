import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ roles, children }) {
    const { user, loading } = useAuth();

    // ⏳ ĐỢI LOAD USER TỪ LOCALSTORAGE
    if (loading) {
        return null; // hoặc spinner
    }

    // ❌ CHƯA LOGIN
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // ❌ SAI ROLE
    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/403" replace />;
    }

    // ✅ OK
    return children;
}
