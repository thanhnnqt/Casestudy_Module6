import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

export default function VerifyEmail() {
    const [params] = useSearchParams();

    useEffect(() => {
        const token = params.get("token");
        if (token) {
            axios.get("http://localhost:8080/auth/verify-email?token=" + token)
                .then(() => alert("Xác nhận email thành công"))
                .catch(() => alert("Token không hợp lệ"));
        }
    }, []);

    return <h2>Đang xác nhận email...</h2>;
}
