import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../modules/login/service/axiosConfig";
import { toast } from "react-toastify";
import "../styles/profile.css";

export default function Profile() {
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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

    if (loading) {
        return <p style={{ textAlign: "center" }}>Đang tải thông tin...</p>;
    }

    if (!customer) {
        return <p style={{ textAlign: "center" }}>Không có dữ liệu khách hàng</p>;
    }

    return (
        <div className="profile-container">
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
                    <span>{customer.gender}</span>
                </div>

                <div className="profile-row">
                    <span>Ngày sinh</span>
                    <span>{customer.dateOfBirth}</span>
                </div>

                <div className="profile-row">
                    <span>Địa chỉ</span>
                    <span>{customer.address}</span>
                </div>

                {/* ===== ACTION ===== */}
                <button
                    className="btn-change-password"
                    onClick={() => navigate("/change-password")}
                >
                    🔑 Đổi mật khẩu
                </button>
                <button
                    className="btn-change-password"
                    style={{ background: "#52c41a", marginBottom: "12px" }}
                    onClick={() => navigate("/profile/edit")}
                >
                    ✏️ Chỉnh sửa thông tin
                </button>
            </div>
        </div>
    );
}
