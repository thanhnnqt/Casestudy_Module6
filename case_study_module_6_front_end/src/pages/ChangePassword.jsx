import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../modules/login/service/axiosConfig";
import { toast } from "react-toastify";
import "../styles/profile.css";

export default function ChangePassword() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.newPassword.length < 6) {
            toast.error("Mật khẩu mới phải ít nhất 6 ký tự");
            return;
        }

        if (form.newPassword !== form.confirmPassword) {
            toast.error("Xác nhận mật khẩu không khớp");
            return;
        }

        try {
            await axios.put("/auth/change-password", {
                oldPassword: form.oldPassword,
                newPassword: form.newPassword
            });

            toast.success("Đổi mật khẩu thành công");
            navigate("/profile");
        } catch (err) {
            toast.error(err.response?.data || "Đổi mật khẩu thất bại");
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2 className="auth-title">🔐 Đổi mật khẩu</h2>
                <p className="auth-subtitle">
                    Vui lòng nhập mật khẩu hiện tại và mật khẩu mới
                </p>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <input
                            type="password"
                            name="oldPassword"
                            placeholder="Mật khẩu hiện tại"
                            value={form.oldPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="password"
                            name="newPassword"
                            placeholder="Mật khẩu mới"
                            value={form.newPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Xác nhận mật khẩu mới"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="auth-actions">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={() => navigate("/profile")}
                        >
                            Hủy
                        </button>

                        <button type="submit" className="btn-primary">
                            Lưu thay đổi
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
