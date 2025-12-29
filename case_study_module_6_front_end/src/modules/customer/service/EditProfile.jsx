import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../modules/login/service/axiosConfig";
import { toast } from "react-toastify";

export default function EditProfile() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        fullName: "",
        phoneNumber: "",
        identityCard: "",
        gender: "KHAC",
        dateOfBirth: "",
        address: ""
    });

    const [errors, setErrors] = useState({});

    const genders = [
        { value: "NAM", label: "Nam" },
        { value: "NU", label: "Nữ" },
        { value: "KHAC", label: "Khác" }
    ];

    /* ================= LOAD DATA ================= */
    useEffect(() => {
        axios.get("/api/customers/me")
            .then(res => {
                setForm({
                    fullName: res.data.fullName || "",
                    phoneNumber: res.data.phoneNumber || "",
                    identityCard: res.data.identityCard || "",
                    gender: res.data.gender || "KHAC",
                    dateOfBirth: res.data.dateOfBirth || "",
                    address: res.data.address || ""
                });
            })
            .catch(() => toast.error("Không lấy được thông tin cá nhân"))
            .finally(() => setLoading(false));
    }, []);

    /* ================= CHANGE ================= */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    /* ================= VALIDATE ================= */
    const validate = () => {
        const e = {};

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
            await axios.put("/api/customers/me", form);
            toast.success("✅ Cập nhật thông tin thành công");
            navigate("/profile");
        } catch (err) {
            if (err.response?.status === 400 && typeof err.response.data === "object") {
                setErrors(err.response.data);
            } else {
                toast.error("Cập nhật thất bại");
            }
        }
    };

    const inputClass = (name) =>
        `form-control ${errors[name] ? "is-invalid" : ""}`;

    if (loading) {
        return <p className="text-center mt-4">Đang tải...</p>;
    }

    /* ================= RENDER ================= */
    return (
        <div className="container-fluid px-4 my-3">
            <div className="row justify-content-center">
                <div className="col-12">
                    <div className="card shadow border-0 rounded-4">
                        <div className="card-body p-3">

                            <h5 className="fw-bold text-center mb-3">
                                ✏️ Chỉnh sửa thông tin cá nhân
                            </h5>

                            <form onSubmit={handleSubmit} noValidate>
                                <div className="row">

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
                                                <label className="form-check-label">{g.label}</label>
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

                                <div className="d-flex gap-2 mt-3">
                                    <button
                                        type="button"
                                        className="btn btn-secondary w-50"
                                        onClick={() => navigate("/profile")}
                                    >
                                        Hủy
                                    </button>

                                    <button className="btn btn-info w-50 fw-bold">
                                        Lưu thay đổi
                                    </button>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
