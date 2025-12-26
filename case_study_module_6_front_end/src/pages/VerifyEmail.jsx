import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function VerifyEmail() {
    const [params] = useSearchParams();

    useEffect(() => {
        const token = params.get("token");

        if (!token) {
            toast.error("Thiếu token xác nhận email");
            return;
        }

        axios
            .get(`http://localhost:8080/auth/verify-email?token=${token}`)
            .then(() => {
                toast.success("✅ Xác nhận email thành công");
            })
            .catch(() => {
                toast.error("❌ Token không hợp lệ hoặc đã hết hạn");
            });
    }, []);

    return (
        <h2 style={{ textAlign: "center", marginTop: "40px" }}>
            Đang xác nhận email...
        </h2>
    );
}
