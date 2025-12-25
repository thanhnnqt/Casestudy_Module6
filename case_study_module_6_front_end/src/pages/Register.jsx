import { useState } from "react";
import { register as registerApi } from "../modules/login/service/authService.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",

        fullName: "",
        dateOfBirth: "",
        gender: "KHAC",
        phoneNumber: "",
        identityCard: "",
        address: ""
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        setErrors({ ...errors, [name]: null });
    };

    // ================= VALIDATE =================
    const validate = () => {
        const newErrors = {};

        // USERNAME
        if (!form.username || form.username.trim().length < 4) {
            newErrors.username = "Tên đăng nhập phải có ít nhất 4 ký tự";
        }

        // EMAIL (optional)
        if (!form.email) {
            newErrors.email = "Vui lòng nhập email";
        } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
            newErrors.email = "Email không hợp lệ";
        }

        // PASSWORD
        if (!form.password || form.password.length < 6) {
            newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
        }

        // CONFIRM PASSWORD (BẮT BUỘC)
        if (!form.confirmPassword) {
            newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
        } else if (form.password !== form.confirmPassword) {
            newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
        }

        // FULL NAME
        const nameRegex =
            /^([A-ZÀ-Ỹ][a-zà-ỹ]+)(\s[A-ZÀ-Ỹ][a-zà-ỹ]+)+$/;

        if (!nameRegex.test(form.fullName.trim())) {
            newErrors.fullName = "Họ tên phải viết hoa chữ cái đầu mỗi từ";
        }

        // PHONE NUMBER (BẮT BUỘC)
        if (!form.phoneNumber) {
            newErrors.phoneNumber = "Vui lòng nhập số điện thoại";
        } else if (!/^0\d{9}$/.test(form.phoneNumber)) {
            newErrors.phoneNumber = "Số điện thoại phải có dạng 0xxxxxxxxx";
        }

        // IDENTITY CARD (BẮT BUỘC)
        if (!form.identityCard) {
            newErrors.identityCard = "Vui lòng nhập CCCD";
        } else if (!/^(\d{9}|\d{12})$/.test(form.identityCard)) {
            newErrors.identityCard = "CCCD phải gồm 9 hoặc 12 chữ số";
        }

        // DATE OF BIRTH
        if (!form.dateOfBirth) {
            newErrors.dateOfBirth = "Vui lòng chọn ngày sinh";
        } else {
            const dob = new Date(form.dateOfBirth);
            const today = new Date();
            let age = today.getFullYear() - dob.getFullYear();

            const m = today.getMonth() - dob.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
                age--;
            }

            if (age < 16) {
                newErrors.dateOfBirth = "Tuổi phải lớn hơn hoặc bằng 16";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ================= SUBMIT =================
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            await registerApi({
                username: form.username,
                password: form.password,
                email: form.email || null,

                fullName: form.fullName,
                dateOfBirth: form.dateOfBirth,
                gender: form.gender,
                phoneNumber: form.phoneNumber,
                identityCard: form.identityCard,
                address: form.address || null
            });

            toast.success("🎉 Đăng ký thành công! Vui lòng đăng nhập");
            setTimeout(() => navigate("/login"), 1000);

        } catch (err) {
            setErrors({
                submit: err.response?.data || "Đăng ký thất bại"
            });
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

                    <form onSubmit={handleSubmit} noValidate>

                        {/* USERNAME */}
                        <div className="mb-3">
                            <label className="form-label">Tên đăng nhập *</label>
                            <input
                                type="text"
                                name="username"
                                className={`form-control ${errors.username ? "is-invalid" : ""}`}
                                value={form.username}
                                onChange={handleChange}
                            />
                            <div className="invalid-feedback">{errors.username}</div>
                        </div>

                        {/* EMAIL */}
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                name="email"
                                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                value={form.email}
                                onChange={handleChange}
                            />
                            <div className="invalid-feedback">{errors.email}</div>
                        </div>

                        {/* PASSWORD */}
                        <div className="mb-3">
                            <label className="form-label">Mật khẩu *</label>
                            <input
                                type="password"
                                name="password"
                                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                                value={form.password}
                                onChange={handleChange}
                            />
                            <div className="invalid-feedback">{errors.password}</div>
                        </div>

                        {/* CONFIRM PASSWORD */}
                        <div className="mb-3">
                            <label className="form-label">Xác nhận mật khẩu *</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                                value={form.confirmPassword}
                                onChange={handleChange}
                            />
                            <div className="invalid-feedback">{errors.confirmPassword}</div>
                        </div>

                        {/* FULL NAME */}
                        <div className="mb-3">
                            <label className="form-label">Họ và tên *</label>
                            <input
                                type="text"
                                name="fullName"
                                className={`form-control ${errors.fullName ? "is-invalid" : ""}`}
                                value={form.fullName}
                                onChange={handleChange}
                            />
                            <div className="invalid-feedback">{errors.fullName}</div>
                        </div>

                        {/* PHONE */}
                        <div className="mb-3">
                            <label className="form-label">Số điện thoại *</label>
                            <input
                                type="text"
                                name="phoneNumber"
                                className={`form-control ${errors.phoneNumber ? "is-invalid" : ""}`}
                                value={form.phoneNumber}
                                onChange={handleChange}
                            />
                            <div className="invalid-feedback">{errors.phoneNumber}</div>
                        </div>

                        {/* CCCD */}
                        <div className="mb-3">
                            <label className="form-label">CMND / CCCD *</label>
                            <input
                                type="text"
                                name="identityCard"
                                className={`form-control ${errors.identityCard ? "is-invalid" : ""}`}
                                value={form.identityCard}
                                onChange={handleChange}
                            />
                            <div className="invalid-feedback">{errors.identityCard}</div>
                        </div>

                        {/* DATE OF BIRTH */}
                        <div className="mb-3">
                            <label className="form-label">Ngày sinh *</label>
                            <input
                                type="date"
                                name="dateOfBirth"
                                className={`form-control ${errors.dateOfBirth ? "is-invalid" : ""}`}
                                value={form.dateOfBirth}
                                onChange={handleChange}
                            />
                            <div className="invalid-feedback">{errors.dateOfBirth}</div>
                        </div>

                        {/* GENDER */}
                        <div className="mb-3">
                            <label className="form-label d-block">Giới tính</label>
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
                            <label className="form-label">Địa chỉ</label>
                            <textarea
                                name="address"
                                className="form-control"
                                rows="3"
                                value={form.address}
                                onChange={handleChange}
                            />
                        </div>

                        {errors.submit && (
                            <div className="alert alert-danger">
                                {errors.submit}
                            </div>
                        )}

                        <button type="submit" className="btn btn-info w-100 fw-bold">
                            Đăng ký
                        </button>

                        <div className="text-center mt-3">
                            <span className="text-muted">Đã có tài khoản?</span>{" "}
                            <a href="/login">Đăng nhập</a>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;
