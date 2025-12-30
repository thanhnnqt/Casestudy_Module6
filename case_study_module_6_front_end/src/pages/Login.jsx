import { useState } from "react";
import { login as loginApi, loginGoogle } from "../modules/login/service/authService.js";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";

function Login() {
    const [form, setForm] = useState({
        username: "",
        password: ""
    });

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // ================= LOGIN LOCAL =================
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { token } = await loginApi(form);

            // 🔥 login() trả về role
            const role = await login(token);

            toast.success("Đăng nhập thành công");

            // 🔥 PHÂN TRANG THEO ROLE
            switch (role) {
                case "ROLE_ADMIN":
                    navigate("/admin");
                    break;
                case "ROLE_EMPLOYEE":
                    navigate("/employee");
                    break;
                default:
                    navigate("/"); // ROLE_USER
            }
        } catch (err) {
            toast.error(err.response?.data || "Sai tài khoản hoặc mật khẩu");
        }
    };

    // ================= LOGIN GOOGLE =================
    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const { token } = await loginGoogle(credentialResponse.credential);

            const role = await login(token);

            toast.success("Đăng nhập Google thành công");

            switch (role) {
                case "ROLE_ADMIN":
                    navigate("/admin");
                    break;
                case "ROLE_EMPLOYEE":
                    navigate("/employee");
                    break;
                default:
                    navigate("/");
            }
        } catch (err) {
            toast.error(err.response?.data || "Đăng nhập Google thất bại");
        }
    };

    return (
        <div className="container my-5 pt-5 d-flex justify-content-center">
            <div className="card shadow border-0" style={{ maxWidth: "420px", width: "100%" }}>
                <div className="card-body p-4">

                    <h4 className="fw-bold mb-4 text-center">Đăng nhập</h4>

                    {/* ===== LOGIN LOCAL ===== */}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Tài khoản</label>
                            <input
                                type="text"
                                name="username"
                                className="form-control"
                                placeholder="Username hoặc Email"
                                value={form.username}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Mật khẩu</label>
                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                placeholder="Nhập mật khẩu"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-outline-dark w-100 fw-bold mb-3"
                        >
                            Đăng nhập
                        </button>

                        <div className="text-end mb-3">
                            <Link
                                to="/forgot-password"
                                className="text-decoration-none text-muted"
                            >
                                Quên mật khẩu?
                            </Link>
                        </div>
                    </form>

                    {/* ===== OR ===== */}
                    <div className="text-center text-muted my-3">
                        ─── hoặc ───
                    </div>

                    {/* ===== LOGIN GOOGLE ===== */}
                    <div className="d-flex justify-content-center">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => toast.error("Google Login thất bại")}
                        />
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Login;
