import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../modules/login/service/axiosConfig";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import "../styles/profile.css";

export default function Profile() {
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get("/api/customers/me");
                setCustomer(res.data);
            } catch (err) {
                toast.error(
                    err.response?.data || "Không lấy được thông tin khách hàng"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    /* ================= FORMAT ================= */
    const formatGender = (gender) => {
        switch (gender) {
            case "NAM":
                return "Nam";
            case "NU":
                return "Nữ";
            default:
                return "Khác";
        }
    };

    const formatDate = (date) => {
        if (!date) return "";
        return new Date(date).toLocaleDateString("vi-VN");
    };
    /* ========================================== */

    if (loading) {
        return <p style={{ textAlign: "center" }}>Đang tải thông tin...</p>;
    }

    if (!customer) {
        return <p style={{ textAlign: "center" }}>Không có dữ liệu khách hàng</p>;
    }

    return (
        <div className="profile-container">
            <div className="profile-layout">
                {/* ===== LEFT: ACTIONS ===== */}
                <div className="profile-sidebar">
                    <h3>⚙️ Tài khoản</h3>

                    <button
                        className="sidebar-btn"
                        onClick={() => navigate("/change-password")}
                    >
                        🔑 Đổi mật khẩu
                    </button>

                    <button
                        className="sidebar-btn"
                        onClick={() => navigate("/bookings")}
                    >
                        📜 Lịch sử đặt vé
                    </button>

                    <button
                        className="sidebar-btn"
                        onClick={() => navigate("/profile/edit")}
                    >
                        ✏️ Chỉnh sửa thông tin
                    </button>
                </div>

                {/* ===== RIGHT: PROFILE INFO ===== */}
                <div className="profile-card">
                    <h2>👤 Thông tin cá nhân</h2>

                    <div className="profile-row">
                        <span>Mã KH</span>
                        <span>{customer.customerCode}</span>
                    </div>

                    <div className="profile-row">
                        <span>Họ tên</span>
                        <span>{customer.fullName}</span>
                    </div>

                    <div className="profile-row">
                        <span>Email</span>
                        <span>{customer.email}</span>
                    </div>

                    <div className="profile-row">
                        <span>SĐT</span>
                        <span>{customer.phoneNumber}</span>
                    </div>

                    <div className="profile-row">
                        <span>CCCD</span>
                        <span>{customer.identityCard}</span>
                    </div>

                    <div className="profile-row">
                        <span>Giới tính</span>
                        <span>{formatGender(customer.gender)}</span>
                    </div>

                    <div className="profile-row">
                        <span>Ngày sinh</span>
                        <span>{formatDate(customer.dateOfBirth)}</span>
                    </div>

                    <div className="profile-row">
                        <span>Địa chỉ</span>
                        <span>{customer.address}</span>
                    </div>

                    {user?.provider === 'GOOGLE' && (
                        <div className="mt-4 p-3 border rounded bg-light">
                            <h5 className="text-primary fw-bold">✨ Nâng cấp tài khoản</h5>
                            <p className="small text-muted">Bạn đang đăng nhập qua Google. Bạn có muốn tạo mật khẩu riêng cho email này để đăng nhập trực tiếp không?</p>
                            <button
                                className="btn btn-primary w-100 fw-bold"
                                onClick={() => navigate(`/register?email=${customer.email}`)}
                            >
                                Tạo tài khoản hệ thống
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

}
