import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../modules/login/service/axiosConfig";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import "../styles/profile.css";

export default function Profile() {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            try {
                let url = "/api/customers/me";
                if (user.role === "EMPLOYEE") url = `/v1/api/employees/${user.profileId}`;
                if (user.role === "ADMIN") url = `/v1/api/admins/${user.profileId}`;

                const res = await axios.get(url);
                setProfileData(res.data);
            } catch (err) {
                console.error("Profile fetch error:", err);
                toast.error(
                    err.response?.data || "Không lấy được thông tin cá nhân"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user]);

    /* ================= FORMAT ================= */
    const formatGender = (gender) => {
        if (!gender) return "Chưa cập nhật";
        const g = gender.toUpperCase();
        if (g === "NAM") return "Nam";
        if (g === "NU" || g === "NỮ") return "Nữ";
        return "Khác";
    };

    const formatDate = (date) => {
        if (!date) return "Chưa cập nhật";
        return new Date(date).toLocaleDateString("vi-VN");
    };
    /* ========================================== */

    if (loading) {
        return <p style={{ textAlign: "center", marginTop: '50px' }}>Đang tải thông tin...</p>;
    }

    if (!profileData) {
        return <p style={{ textAlign: "center", marginTop: '50px' }}>Không có dữ liệu người dùng</p>;
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

                    {user?.role === "CUSTOMER" && (
                        <button
                            className="sidebar-btn"
                            onClick={() => navigate("/bookings")}
                        >
                            📜 Lịch sử đặt vé
                        </button>
                    )}

                    {user?.role === "CUSTOMER" && (
                        <button
                            className="sidebar-btn"
                            onClick={() => navigate("/profile/edit")}
                        >
                            ✏️ Chỉnh sửa thông tin
                        </button>
                    )}
                </div>

                {/* ===== RIGHT: PROFILE INFO ===== */}
                <div className="profile-card">
                    <h2>👤 Thông tin cá nhân {user?.role ? `(${user.role})` : ""}</h2>

                    {/* FIELD LIST BY ROLE */}
                    {user?.role === "ADMIN" ? (
                        <>
                            <div className="profile-row">
                                <span>Mã Admin</span>
                                <span>{profileData.adminCode}</span>
                            </div>
                            <div className="profile-row">
                                <span>Họ tên</span>
                                <span>{profileData.fullName}</span>
                            </div>
                            <div className="profile-row">
                                <span>Email</span>
                                <span>{profileData.email}</span>
                            </div>
                            <div className="profile-row">
                                <span>SĐT</span>
                                <span>{profileData.phoneNumber}</span>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="profile-row">
                                <span>{user?.role === "CUSTOMER" ? "Mã KH" : "Họ tên"}</span>
                                <span>{user?.role === "CUSTOMER" ? profileData.customerCode : profileData.fullName}</span>
                            </div>
                            {user?.role === "CUSTOMER" && (
                                <div className="profile-row">
                                    <span>Họ tên</span>
                                    <span>{profileData.fullName}</span>
                                </div>
                            )}
                            <div className="profile-row">
                                <span>Email</span>
                                <span>{profileData.email}</span>
                            </div>

                            <div className="profile-row">
                                <span>SĐT</span>
                                <span>{profileData.phoneNumber}</span>
                            </div>

                            <div className="profile-row">
                                <span>CCCD</span>
                                <span>{profileData.identityCard || profileData.identificationId}</span>
                            </div>

                            <div className="profile-row">
                                <span>Giới tính</span>
                                <span>{formatGender(profileData.gender)}</span>
                            </div>

                            <div className="profile-row">
                                <span>Ngày sinh</span>
                                <span>{formatDate(profileData.dateOfBirth || profileData.dob)}</span>
                            </div>

                            <div className="profile-row">
                                <span>Địa chỉ</span>
                                <span>{profileData.address}</span>
                            </div>
                        </>
                    )}

                    {user?.role === 'CUSTOMER' && user?.provider === 'GOOGLE' && (
                        <div className="mt-4 p-3 border rounded bg-light">
                            <h5 className="text-primary fw-bold">✨ Nâng cấp tài khoản</h5>
                            <p className="small text-muted">Bạn đang đăng nhập qua Google. Bạn có muốn tạo mật khẩu riêng cho email này để đăng nhập trực tiếp không?</p>
                            <button
                                className="btn btn-primary w-100 fw-bold"
                                onClick={() => navigate(`/register?email=${profileData.email}`)}
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
