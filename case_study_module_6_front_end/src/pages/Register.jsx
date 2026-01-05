import { useState } from "react";
import { register as registerApi } from "../modules/login/service/authService.js";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

function Register() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const prefillEmail = searchParams.get("email") || "";
    const isUpgrade = !!searchParams.get("email"); // Nếu có email tức là đi từ Profile qua

    const [form, setForm] = useState({
        username: "",
        email: prefillEmail,
        password: "",
        confirmPassword: "",
        fullName: "",
        dateOfBirth: "",
        gender: "KHAC",
        phoneNumber: "",
        identityCard: "",
        address: ""
    });

    // 🔥 field-level errors
    const [errors, setErrors] = useState({});

    /* ================= CHANGE ================= */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));

        // xoá lỗi của field khi user sửa
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const genders = [
        { value: "NAM", label: "Nam" },
        { value: "NU", label: "Nữ" },
        { value: "KHAC", label: "Khác" }
    ];

    /* ================= CLIENT VALIDATE ================= */
    const validate = () => {
        const e = {};

        if (!form.username || form.username.trim().length < 4) {
            e.username = "Tên đăng nhập phải có ít nhất 4 ký tự";
        }

        if (!form.email) {
            e.email = "Vui lòng nhập email";
        } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
            e.email = "Email không hợp lệ";
        }

        if (!form.password || form.password.length < 6) {
            e.password = "Mật khẩu phải có ít nhất 6 ký tự";
        }

        if (!form.confirmPassword) {
            e.confirmPassword = "Vui lòng xác nhận mật khẩu";
        } else if (form.password !== form.confirmPassword) {
            e.confirmPassword = "Mật khẩu xác nhận không khớp";
        }

        const nameRegex = /^([A-ZÀ-Ỹ][a-zà-ỹ]+)(\s[A-ZÀ-Ỹ][a-zà-ỹ]+)+$/;
        if (!form.fullName || !nameRegex.test(form.fullName.trim())) {
            e.fullName = "Họ tên phải viết hoa chữ cái đầu mỗi từ";
        }

        if (!form.phoneNumber) {
            e.phoneNumber = "Vui lòng nhập số điện thoại";
        } else if (!/^0\d{9}$/.test(form.phoneNumber)) {
            e.phoneNumber = "Số điện thoại phải có dạng 0xxxxxxxxx";
        }

        if (!form.identityCard) {
            e.identityCard = "Vui lòng nhập CCCD";
        } else if (!/^(\d{9}|\d{12})$/.test(form.identityCard)) {
            e.identityCard = "CCCD phải gồm 9 hoặc 12 chữ số";
        }

        if (!form.dateOfBirth) {
            e.dateOfBirth = "Vui lòng chọn ngày sinh";
        } else {
            const dob = new Date(form.dateOfBirth);
            const today = new Date();
            let age = today.getFullYear() - dob.getFullYear();
            const m = today.getMonth() - dob.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
            if (age < 16) e.dateOfBirth = "Tuổi phải ≥ 16";
        }

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    /* ================= SUBMIT ================= */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        if (!validate()) return;

        try {
            const response = await registerApi({
                username: form.username,
                email: form.email,
                password: form.password,
                fullName: form.fullName,
                dateOfBirth: form.dateOfBirth,
                gender: form.gender,
                phoneNumber: form.phoneNumber,
                identityCard: form.identityCard,
                address: form.address || null
            });

            // Nếu Backend trả về string message trực tiếp (trong response.data)
            const msg = typeof response === 'string' ? response : (response?.data || "🎉 Đăng ký thành công");
            toast.success(msg);
            setTimeout(() => navigate("/login"), 1500);

        } catch (err) {
            // 🔥 BACKEND trả về Map<field, message>
            if (err.response?.status === 400 && typeof err.response.data === "object") {
                setErrors(err.response.data);
            } else {
                toast.error("Đăng ký thất bại");
            }
        }
    };

    const inputClass = (name) =>
        `form-control ${errors[name] ? "is-invalid" : ""}`;

    /* ================= RENDER ================= */
    return (
        <div className="container-fluid px-4 my-3">
            <div className="row justify-content-center">
                <div className="col-12">
                    <div className="card shadow border-0 rounded-4">
                        <div className="card-body p-3">

                            <h5 className="fw-bold text-center mb-3">
                                {isUpgrade ? "Thiết lập tài khoản hệ thống" : "Đăng ký tài khoản"}
                            </h5>

                            {isUpgrade && (
                                <div className="alert alert-info py-2 small">
                                    Chào bạn! Hãy đặt Tên đăng nhập và Mật khẩu để có thể đăng nhập trực tiếp mà không cần qua Google nhé.
                                    (Email <b>{prefillEmail}</b> đã được xác thực từ Google)
                                </div>
                            )}

                            <form onSubmit={handleSubmit} noValidate>
                                <div className="row">

                                    {/* USERNAME */}
                                    <div className="col-lg-4 col-md-6 mb-2">
                                        <label className="form-label">Tên đăng nhập *</label>
                                        <input
                                            name="username"
                                            className={inputClass("username")}
                                            value={form.username}
                                            onChange={handleChange}
                                        />
                                        <div className="invalid-feedback">{errors.username}</div>
                                    </div>

                                    {/* EMAIL */}
                                    <div className="col-lg-4 col-md-6 mb-2">
                                        <label className="form-label">Email *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            className={inputClass("email")}
                                            value={form.email}
                                            onChange={handleChange}
                                        />
                                        <div className="invalid-feedback">{errors.email}</div>
                                    </div>

                                    {/* PHONE */}
                                    <div className="col-lg-4 col-md-6 mb-2">
                                        <label className="form-label">SĐT *</label>
                                        <input
                                            name="phoneNumber"
                                            className={inputClass("phoneNumber")}
                                            value={form.phoneNumber}
                                            onChange={handleChange}
                                        />
                                        <div className="invalid-feedback">{errors.phoneNumber}</div>
                                    </div>

                                    {/* PASSWORD */}
                                    <div className="col-lg-4 col-md-6 mb-2">
                                        <label className="form-label">Mật khẩu *</label>
                                        <input
                                            type="password"
                                            name="password"
                                            className={inputClass("password")}
                                            value={form.password}
                                            onChange={handleChange}
                                        />
                                        <div className="invalid-feedback">{errors.password}</div>
                                    </div>

                                    {/* CONFIRM */}
                                    <div className="col-lg-4 col-md-6 mb-2">
                                        <label className="form-label">Xác nhận mật khẩu *</label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            className={inputClass("confirmPassword")}
                                            value={form.confirmPassword}
                                            onChange={handleChange}
                                        />
                                        <div className="invalid-feedback">{errors.confirmPassword}</div>
                                    </div>

                                    {/* FULL NAME */}
                                    <div className="col-lg-4 col-md-6 mb-2">
                                        <label className="form-label">Họ tên *</label>
                                        <input
                                            name="fullName"
                                            className={inputClass("fullName")}
                                            value={form.fullName}
                                            onChange={handleChange}
                                        />
                                        <div className="invalid-feedback">{errors.fullName}</div>
                                    </div>

                                    {/* DOB */}
                                    <div className="col-lg-4 col-md-6 mb-2">
                                        <label className="form-label">Ngày sinh *</label>
                                        <input
                                            type="date"
                                            name="dateOfBirth"
                                            className={inputClass("dateOfBirth")}
                                            value={form.dateOfBirth}
                                            onChange={handleChange}
                                        />
                                        <div className="invalid-feedback">{errors.dateOfBirth}</div>
                                    </div>

                                    {/* CCCD */}
                                    <div className="col-lg-4 col-md-6 mb-2">
                                        <label className="form-label">CCCD *</label>
                                        <input
                                            name="identityCard"
                                            className={inputClass("identityCard")}
                                            value={form.identityCard}
                                            onChange={handleChange}
                                        />
                                        <div className="invalid-feedback">{errors.identityCard}</div>
                                    </div>

                                    {/* GENDER */}
                                    <div className="col-lg-4 col-md-6 mb-2">
                                        <label className="form-label d-block">Giới tính</label>

                                        {genders.map(g => (
                                            <div className="form-check form-check-inline" key={g.value}>
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="gender"
                                                    value={g.value}
                                                    checked={form.gender === g.value}
                                                    onChange={handleChange}
                                                />
                                                <label className="form-check-label">
                                                    {g.label}
                                                </label>
                                            </div>
                                        ))}
                                    </div>


                                    {/* ADDRESS */}
                                    <div className="col-12 mb-2">
                                        <label className="form-label">Địa chỉ</label>
                                        <textarea
                                            rows="2"
                                            name="address"
                                            className="form-control"
                                            value={form.address}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <button className="btn btn-info w-100 fw-bold mt-3">
                                    Đăng ký
                                </button>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
