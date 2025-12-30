import { useState } from "react";
import axios from "../modules/login/service/axiosConfig";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/auth/forgot-password", null, {
                params: { email }
            });
            toast.success("📩 Đã gửi email khôi phục mật khẩu");
        } catch {
            toast.error("❌ Email không tồn tại");
        }
    };

    return (
        <div className="container my-5 pt-5 d-flex justify-content-center">
            <div className="card shadow border-0" style={{ maxWidth: "420px", width: "100%" }}>
                <div className="card-body p-4">

                    <h4 className="fw-bold mb-4 text-center">Quên mật khẩu</h4>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Nhập email đã đăng ký"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-outline-dark w-100 fw-bold"
                        >
                            Gửi email khôi phục
                        </button>
                    </form>

                    <div className="text-center mt-3">
                        <Link to="/login" className="small text-muted text-decoration-none">
                            ← Quay lại đăng nhập
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}
