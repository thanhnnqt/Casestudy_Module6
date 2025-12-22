import { useState } from "react";
import { register as registerApi } from "../service/authService";
import { useNavigate } from "react-router-dom";

function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",

        fullName: "",
        dateOfBirth: "",
        gender: "Khác",
        phoneNumber: "",
        identityCard: "",
        address: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            alert("Mật khẩu xác nhận không khớp");
            return;
        }

        try {
            await registerApi({
                username: form.username,
                email: form.email,
                password: form.password,
                fullName: form.fullName,
                dateOfBirth: form.dateOfBirth,
                gender: form.gender,
                phoneNumber: form.phoneNumber,
                identityCard: form.identityCard,
                address: form.address
            });

            alert("Đăng ký thành công! Vui lòng đăng nhập.");
            navigate("/login");

        } catch (err) {
            alert(err.response?.data || "Đăng ký thất bại");
        }
    };

    return (
        <div className="container my-5 pt-5" style={{ maxWidth: "520px" }}>
            <div className="card shadow border-0 rounded-4">
                <div className="card-body p-5">

                    <h4 className="fw-bold text-center mb-3">
                        Đăng ký tài khoản
                    </h4>

                    <p className="text-muted text-center mb-4">
                        Tạo tài khoản để đặt vé nhanh chóng
                    </p>

                    <form onSubmit={handleSubmit}>

                        {/* USERNAME */}
                        <div className="mb-3">
                            <label className="form-label">
                                Tên đăng nhập (<span className="text-danger">*</span>)
                            </label>
                            <input
                                type="text"
                                name="username"
                                className="form-control"
                                value={form.username}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* EMAIL */}
                        <div className="mb-3">
                            <label className="form-label">
                                Email (<span className="text-danger">*</span>)
                            </label>
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* PASSWORD */}
                        <div className="mb-3">
                            <label className="form-label">
                                Mật khẩu (<span className="text-danger">*</span>)
                            </label>
                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* CONFIRM PASSWORD */}
                        <div className="mb-3">
                            <label className="form-label">
                                Xác nhận mật khẩu (<span className="text-danger">*</span>)
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                className="form-control"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* FULL NAME */}
                        <div className="mb-3">
                            <label className="form-label">
                                Họ và tên (<span className="text-danger">*</span>)
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                className="form-control"
                                value={form.fullName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* PHONE */}
                        <div className="mb-3">
                            <label className="form-label">
                                Số điện thoại
                            </label>
                            <input
                                type="text"
                                name="phoneNumber"
                                className="form-control"
                                value={form.phoneNumber}
                                onChange={handleChange}
                            />
                        </div>

                        {/* IDENTITY CARD */}
                        <div className="mb-3">
                            <label className="form-label">
                                CMND / CCCD
                            </label>
                            <input
                                type="text"
                                name="identityCard"
                                className="form-control"
                                value={form.identityCard}
                                onChange={handleChange}
                            />
                        </div>

                        {/* DATE OF BIRTH */}
                        <div className="mb-3">
                            <label className="form-label">
                                Ngày sinh
                            </label>
                            <input
                                type="date"
                                name="dateOfBirth"
                                className="form-control"
                                value={form.dateOfBirth}
                                onChange={handleChange}
                            />
                        </div>

                        {/* GENDER */}
                        <div className="mb-3">
                            <label className="form-label d-block">
                                Giới tính
                            </label>

                            {[
                                { label: "Nam", value: "NAM" },
                                { label: "Nữ", value: "NU" },
                                { label: "Khác", value: "KHAC" }
                            ].map(g => (
                                <div className="form-check form-check-inline" key={g.value}>
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="gender"
                                        value={g.value}
                                        checked={form.gender === g.value}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label">{g.label}</label>
                                </div>
                            ))}
                        </div>

                        {/* ADDRESS */}
                        <div className="mb-4">
                            <label className="form-label">
                                Địa chỉ
                            </label>
                            <textarea
                                name="address"
                                className="form-control"
                                rows="3"
                                value={form.address}
                                onChange={handleChange}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-info w-100 fw-bold"
                        >
                            Đăng ký
                        </button>

                        <div className="text-center mt-3">
                            <span className="text-muted">
                                Đã có tài khoản?
                            </span>{" "}
                            <a href="/login">Đăng nhập</a>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;
