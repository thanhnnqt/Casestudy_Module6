import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "../modules/login/service/axiosConfig";
import { toast } from "react-toastify";

export default function ResetPassword() {
    const [params] = useSearchParams();
    const navigate = useNavigate();

    const token = params.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleReset = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("❌ Mật khẩu xác nhận không khớp");
            return;
        }

        try {
            await axios.post("/auth/reset-password", null, {
                params: { token, newPassword: password }
            });
            toast.success("✅ Đổi mật khẩu thành công");
            navigate("/login");
        } catch {
            toast.error("❌ Token không hợp lệ hoặc đã hết hạn");
        }
    };

    return (
        <div className="container my-5 pt-5 d-flex justify-content-center">
            <div className="card shadow border-0" style={{ maxWidth: "420px", width: "100%" }}>
                <div className="card-body p-4">

                    <h4 className="fw-bold mb-4 text-center">Đặt lại mật khẩu</h4>

                    <form onSubmit={handleReset}>
                        <div className="mb-3">
                            <label className="form-label">Mật khẩu mới</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Nhập mật khẩu mới"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Xác nhận mật khẩu</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Nhập lại mật khẩu"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-outline-dark w-100 fw-bold"
                        >
                            Xác nhận đổi mật khẩu
                        </button>
                    </form>

                </div>
            </div>
        </div>
    );
}
