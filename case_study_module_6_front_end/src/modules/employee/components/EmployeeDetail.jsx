import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';

import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { editEmployee, findEmployeeById } from "../service/employeeService.js";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { toast } from "react-toastify";
import { Button } from "react-bootstrap";
import * as Yup from "yup";

/* ===== COMPONENT SAO ĐỎ ===== */
const Required = () => <span className="text-danger"> *</span>;

const EmployeeDetail = () => {

    const navigate = useNavigate();
    const { id } = useParams();

    /* ===== STATE ===== */
    const [detail, setDetail] = useState({
        id: "",
        employeeCode: "",
        fullName: "",
        phoneNumber: "",
        email: "",
        dob: "",
        gender: "Nam",
        address: "",
        imgURL: ""
    });

    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);

    /* ===== VALIDATION ===== */
    const validationSchema = Yup.object({
        fullName: Yup.string()
            .required("Vui lòng không để trống họ và tên")
            .matches(
                /^[A-Z][a-z]+(\s[A-Z][a-z]+)+$/,
                "Họ tên phải viết hoa chữ cái đầu"
            ),
        phoneNumber: Yup.string()
            .required("Vui lòng không để trống số điện thoại")
            .matches(/^0\d{9}$/, "Số điện thoại phải đủ 10 chữ số"),
        email: Yup.string()
            .required("Vui lòng không để trống email")
            .email("Email không đúng định dạng"),
        dob: Yup.date()
            .nullable()
            .required("Vui lòng chọn ngày sinh")
            .max(new Date(), "Ngày sinh không hợp lệ"),
        gender: Yup.string()
            .required("Vui lòng chọn giới tính")
            .oneOf(["Nam", "Nữ"], "Giới tính không hợp lệ"),
        address: Yup.string()
            .required("Vui lòng không để trống địa chỉ"),
        imgURL: Yup.string()
            .required("Vui lòng tải ảnh nhân viên")
    });

    /* ===== LOAD DATA ===== */
    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                const data = await findEmployeeById(id);
                setDetail(data);
                setPreview(data.imgURL);
            };
            fetchData();
        }
    }, [id]);

    /* ===== UPLOAD CLOUDINARY ===== */
    const uploadImageToCloudinary = async (file, setFieldValue) => {
        if (!file) return;

        setUploading(true);
        setPreview(URL.createObjectURL(file));

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "employee_preset");

        try {
            const res = await fetch(
                "https://api.cloudinary.com/v1_1/dfduj6hiv/image/upload",
                { method: "POST", body: formData }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error?.message || "Upload thất bại");
            }

            setFieldValue("imgURL", data.secure_url);
        } catch (err) {
            toast.error("Upload ảnh thất bại");
        } finally {
            setUploading(false);
        }
    };

    /* ===== SUBMIT ===== */
    const handleEdit = async (values) => {
        const isEdited = await editEmployee(values);
        if (isEdited) {
            toast.success("Cập nhật thành công", { autoClose: 2000 });
            navigate("/employees");
        } else {
            toast.error("Cập nhật thất bại");
        }
    };

    return (
        <div className="bg-light mt-5">
            <div className="container py-5">

                {/* ===== HEADER ===== */}
                <div className="text-center mb-4">
                    <h3 className="fw-bold text-primary mb-1">
                        <i className="bi bi-pencil-square me-2"></i>
                        Cập nhật nhân viên
                    </h3>
                    <small className="text-muted">
                        <span className="text-danger">*</span> là thông tin bắt buộc
                    </small>
                </div>

                {/* ===== FORM ===== */}
                <div className="card shadow-sm border-0 border-start border-4 border-primary">
                    <div className="card-body px-4 py-4">

                        <Formik
                            enableReinitialize
                            initialValues={detail}
                            validationSchema={validationSchema}
                            onSubmit={handleEdit}
                        >
                            {({ setFieldValue }) => (
                                <Form>

                                    <Field type="hidden" name="id" />

                                    {/* ===== ẢNH (1 HÀNG RIÊNG) ===== */}
                                    <div className="mb-4">
                                        <label className="form-label fw-semibold">
                                            Ảnh nhân viên <Required />
                                        </label>

                                        {preview && (
                                            <img
                                                src={preview}
                                                alt="avatar"
                                                className="d-block border rounded mb-3"
                                                style={{
                                                    width: 180,
                                                    height: 220,
                                                    objectFit: "cover"
                                                }}
                                            />
                                        )}

                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="form-control"
                                            onChange={(e) =>
                                                uploadImageToCloudinary(
                                                    e.target.files[0],
                                                    setFieldValue
                                                )
                                            }
                                        />

                                        <ErrorMessage
                                            name="imgURL"
                                            component="div"
                                            className="text-danger small mt-1"
                                        />

                                        {uploading && (
                                            <small className="text-muted d-block mt-1">
                                                Đang upload ảnh...
                                            </small>
                                        )}
                                    </div>

                                    {/* ===== ROW 1 ===== */}
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">
                                                Họ và tên <Required />
                                            </label>
                                            <Field name="fullName" className="form-control" />
                                            <ErrorMessage
                                                name="fullName"
                                                component="div"
                                                className="text-danger small mt-1"
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">
                                                Số điện thoại <Required />
                                            </label>
                                            <Field name="phoneNumber" className="form-control" />
                                            <ErrorMessage
                                                name="phoneNumber"
                                                component="div"
                                                className="text-danger small mt-1"
                                            />
                                        </div>
                                    </div>

                                    {/* ===== ROW 2 ===== */}
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">
                                                Email <Required />
                                            </label>
                                            <Field name="email" className="form-control" />
                                            <ErrorMessage
                                                name="email"
                                                component="div"
                                                className="text-danger small mt-1"
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">
                                                Ngày sinh <Required />
                                            </label>
                                            <Field type="date" name="dob" className="form-control" />
                                            <ErrorMessage
                                                name="dob"
                                                component="div"
                                                className="text-danger small mt-1"
                                            />
                                        </div>
                                    </div>

                                    {/* ===== ROW 3 ===== */}
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">
                                                Giới tính <Required />
                                            </label>
                                            <div className="d-flex gap-4 mt-2">
                                                <div className="form-check">
                                                    <Field
                                                        type="radio"
                                                        name="gender"
                                                        value="Nam"
                                                        className="form-check-input"
                                                    />
                                                    <label className="form-check-label">Nam</label>
                                                </div>
                                                <div className="form-check">
                                                    <Field
                                                        type="radio"
                                                        name="gender"
                                                        value="Nữ"
                                                        className="form-check-input"
                                                    />
                                                    <label className="form-check-label">Nữ</label>
                                                </div>
                                            </div>
                                            <ErrorMessage
                                                name="gender"
                                                component="div"
                                                className="text-danger small mt-1"
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">
                                                Địa chỉ <Required />
                                            </label>
                                            <Field name="address" className="form-control" />
                                            <ErrorMessage
                                                name="address"
                                                component="div"
                                                className="text-danger small mt-1"
                                            />
                                        </div>
                                    </div>

                                    {/* ===== ACTION ===== */}
                                    <div className="d-flex justify-content-between align-items-center border-top pt-4">
                                        <Link to="/employees" className="btn btn-outline-secondary px-4">
                                            Quay lại
                                        </Link>

                                        <Button
                                            type="submit"
                                            className="btn btn-primary px-5"
                                            disabled={uploading}
                                        >
                                            Lưu thay đổi
                                        </Button>
                                    </div>

                                </Form>
                            )}
                        </Formik>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDetail;
