import {ErrorMessage, Field, Form, Formik} from "formik";
import {addEmployee} from "../service/employeeService.js";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import * as Yup from "yup";
import {Button} from "react-bootstrap";

/* ===== COMPONENT SAO ĐỎ ===== */
const Required = () => <span className="text-danger"> *</span>;

const AddEmployee = () => {
    const navigate = useNavigate();

    // ===== STATE UPLOAD ẢNH =====
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(null);

    // ===== INITIAL VALUES =====
    const initialValues = {
        fullName: "",
        phoneNumber: "",
        email: "",
        dob: "",
        gender: "Nam",
        address: "",
        imgURL: ""
    };

    // ===== VALIDATION =====
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

    // ===== UPLOAD CLOUDINARY =====
    const uploadImageToCloudinary = async (file, setFieldValue) => {
        if (!file) return;

        setUploading(true);
        setPreview(URL.createObjectURL(file));

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "employee_preset"); // ⚠️ preset của bạn

        try {
            const res = await fetch(
                "https://api.cloudinary.com/v1_1/dfduj6hiv/image/upload",
                {
                    method: "POST",
                    body: formData
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error?.message || "Upload thất bại");
            }

            setFieldValue("imgURL", data.secure_url);
        } catch (err) {
            toast.error("Upload ảnh thất bại");
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    // ===== SUBMIT =====
    const handleSubmit = async (values) => {
        const isAdded = await addEmployee(values);
        if (isAdded) {
            toast.success("Thêm mới nhân viên thành công!", {
                autoClose: 2000
            });
            navigate("/employees");
        } else {
            toast.error("Thêm mới nhân viên thất bại!");
        }
    };

    return (
        <div className="bg-light mt-5">
            <div className="container py-5">

                {/* ===== HEADER ===== */}
                <div className="text-center mb-4">
                    <h3 className="fw-bold text-primary mb-1">
                        <i className="bi bi-person-plus-fill me-2"></i>
                        Thêm mới nhân viên bán vé
                    </h3>
                    <small className="text-muted">
                        <span className="text-danger">*</span> là thông tin bắt buộc
                    </small>
                </div>

                {/* ===== FORM ===== */}
                <div className="card shadow-sm border-0 border-start border-4 border-primary">
                    <div className="card-body px-4 py-4">

                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({setFieldValue}) => (
                                <Form>

                                    {/* ===== ROW 1 ===== */}
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">
                                                Họ và tên <Required/>
                                            </label>
                                            <Field
                                                name="fullName"
                                                className="form-control"
                                                placeholder="Nguyen Van An"
                                            />
                                            <ErrorMessage name="fullName" component="div"
                                                          className="text-danger small mt-1"/>
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">
                                                Số điện thoại <Required/>
                                            </label>
                                            <Field
                                                name="phoneNumber"
                                                className="form-control"
                                                placeholder="0901234567"
                                            />
                                            <ErrorMessage name="phoneNumber" component="div"
                                                          className="text-danger small mt-1"/>
                                        </div>
                                    </div>

                                    {/* ===== ROW 2 ===== */}
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">
                                                Email <Required/>
                                            </label>
                                            <Field
                                                name="email"
                                                className="form-control"
                                                placeholder="example@gmail.com"
                                            />
                                            <ErrorMessage name="email" component="div"
                                                          className="text-danger small mt-1"/>
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">
                                                Ngày sinh <Required/>
                                            </label>
                                            <Field
                                                type="date"
                                                name="dob"
                                                className="form-control"
                                            />
                                            <ErrorMessage name="dob" component="div"
                                                          className="text-danger small mt-1"/>
                                        </div>
                                    </div>

                                    {/* ===== ROW 3 ===== */}
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">
                                                Giới tính <Required/>
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
                                            <ErrorMessage name="gender" component="div"
                                                          className="text-danger small mt-1"/>
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">
                                                Địa chỉ <Required/>
                                            </label>
                                            <Field
                                                name="address"
                                                className="form-control"
                                                placeholder="Hà Nội"
                                            />
                                            <ErrorMessage name="address" component="div"
                                                          className="text-danger small mt-1"/>
                                        </div>
                                    </div>

                                    {/* ===== IMAGE ===== */}
                                    <div className="mb-4">
                                        <label className="form-label fw-semibold">
                                            Ảnh nhân viên <Required/>
                                        </label>
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
                                        <ErrorMessage name="imgURL" component="div"
                                                      className="text-danger small mt-1"/>

                                        {uploading && (
                                            <small className="text-muted d-block mt-1">
                                                Đang upload ảnh...
                                            </small>
                                        )}

                                        {preview && (
                                            <img
                                                src={preview}
                                                alt="preview"
                                                className="border rounded mt-3"
                                                style={{
                                                    width: 140,
                                                    height: 140,
                                                    objectFit: "cover"
                                                }}
                                            />
                                        )}
                                    </div>

                                    {/* ===== ACTION ===== */}
                                    <div className="d-flex justify-content-end border-top pt-4">
                                        <Button
                                            type="submit"
                                            className="btn btn-primary px-5 fw-semibold"
                                            disabled={uploading}
                                        >
                                            <i className="bi bi-save me-1"></i>
                                            Lưu
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

export default AddEmployee;
