import {ErrorMessage, Field, Form, Formik} from "formik";
import {
    addEmployee,
    checkIdentificationExists,
    checkEmailExists,
    checkPhoneExists,
    checkImageHashExists
} from "../service/employeeService.js";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import * as Yup from "yup";
import {Button} from "react-bootstrap";
import CryptoJS from "crypto-js";
import {toast} from "react-toastify";

const Required = () => <span className="text-danger"> *</span>;

const AddEmployee = () => {
    const navigate = useNavigate();
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [errorsServer, setErrorsServer] = useState({});

    const initialValues = {
        fullName: "",
        phoneNumber: "",
        identificationId: "",
        email: "",
        dob: "",
        gender: "",
        address: "",
        imgURL: "",
        imgHash: "",
    };

    const min18 = new Date();
    min18.setFullYear(min18.getFullYear() - 18);

    const validationSchema = Yup.object({
        fullName: Yup.string().required("Vui lòng không để trống họ và tên"),
        phoneNumber: Yup.string()
            .required("Vui lòng không để trống số điện thoại")
            .matches(/^0\d{9}$/, "Số điện thoại phải đủ 10 chữ số"),
        identificationId: Yup.string()
            .required("Vui lòng không để trống CCCD/CMND")
            .matches(/^\d{9}(\d{3})?$/, "CCCD/CMND phải gồm 9 hoặc 12 số"),
        email: Yup.string().required("Vui lòng không để trống email").email("Email không đúng định dạng"),
        dob: Yup.date().required("Vui lòng chọn ngày sinh").max(min18, "Phải đủ 18 tuổi trở lên"),
        gender: Yup.string().required("Vui lòng chọn giới tính"),
        address: Yup.string().required("Vui lòng không để trống địa chỉ"),
        imgURL: Yup.string().required("Vui lòng tải ảnh nhân viên"),
        imgHash: Yup.string().required("Không lấy được mã ảnh, vui lòng tải lại ảnh"),
    });

    const debounce = (func, delay = 600) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => func(...args), delay);
        };
    };

    const validateRealtime = debounce(async (field, value) => {
        if (!value) return;

        if (field === "identificationId") {
            const exists = await checkIdentificationExists(value);
            setErrorsServer((prev) => ({
                ...prev,
                identificationId: exists ? "CCCD đã tồn tại trong hệ thống" : "",
            }));
        }
        if (field === "email") {
            const exists = await checkEmailExists(value);
            setErrorsServer((prev) => ({
                ...prev,
                email: exists ? "Email đã tồn tại trong hệ thống" : "",
            }));
        }
        if (field === "phoneNumber") {
            const exists = await checkPhoneExists(value);
            setErrorsServer((prev) => ({
                ...prev,
                phoneNumber: exists ? "SĐT đã tồn tại trong hệ thống" : "",
            }));
        }
    });

    const createImageHash = async (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
                const hash = CryptoJS.SHA256(CryptoJS.lib.WordArray.create(reader.result)).toString();
                resolve(hash);
            };
            reader.readAsArrayBuffer(file);
        });
    };

    const uploadImageToCloudinary = async (file, setFieldValue) => {
        if (!file) return;

        setErrorsServer(prev => ({ ...prev, imgURL: "" }));

        setUploading(true);
        setPreview(URL.createObjectURL(file));

        try {
            const hash = await createImageHash(file);
            setFieldValue("imgHash", hash);

            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "employee_preset");

            const res = await fetch("https://api.cloudinary.com/v1_1/dfduj6hiv/image/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            setFieldValue("imgURL", data.secure_url);
        } catch {
            setFieldValue("imgURL", "");
            setFieldValue("imgHash", "");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (values) => {
        if (Object.values(errorsServer).some((msg) => msg !== "")) return;

        const imgExists = await checkImageHashExists(values.imgHash);
        if (imgExists) {
            setErrorsServer((prev) => ({
                ...prev,
                imgURL: "Ảnh này đã được sử dụng cho nhân viên khác",
            }));
            return;
        }

        const result = await addEmployee(values);
        if (result) {
            navigate("/employees");
            toast.success("Thêm mới nhân viên thành công!");
        }
    };

    return (
        <div className="bg-light mt-2">
            <div className="container py-2">
                <div className="mb-3 pb-2 border-bottom">
                    <h3 className="fw-bold text-primary mb-1 d-flex align-items-center gap-2">
                        <i className="bi bi-person-plus-fill fs-4"></i> Thêm nhân viên
                    </h3>
                    <small className="text-muted">Thông tin có <Required/> là bắt buộc nhập</small>
                </div>

                <div className="card shadow-sm border-0 border-start border-4 border-primary">
                    <div className="card-body px-4 py-3">
                        <Formik initialValues={initialValues} validationSchema={validationSchema}
                                onSubmit={handleSubmit}>
                            {({setFieldValue}) => (
                                <Form>
                                    <div className="row g-4">
                                        {/* Avatar */}
                                        <div className="col-md-4 d-flex flex-column align-items-center">
                                            {/* Label upload ảnh + dấu * */}
                                            <label className="fw-semibold w-100 text-center">
                                                Ảnh nhân viên <span className="text-danger">*</span>
                                            </label>

                                            <div
                                                className="rounded-circle overflow-hidden shadow-sm d-flex align-items-center justify-content-center mt-1"
                                                style={{width: 180, height: 180, backgroundColor: "#f1f3f5"}}
                                            >
                                                {preview ? (
                                                    <img
                                                        src={preview}
                                                        alt="avatar"
                                                        className="w-100 h-100"
                                                        style={{objectFit: "cover"}}
                                                    />
                                                ) : (
                                                    <i className="bi bi-person fs-1 text-muted"></i>
                                                )}
                                            </div>

                                            <div style={{width: 250}} className="mt-3">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className={`form-control ${errorsServer.imgURL ? "is-invalid" : ""}`}
                                                    onChange={(e) =>
                                                        uploadImageToCloudinary(e.target.files[0], setFieldValue)
                                                    }
                                                />
                                            </div>

                                            {/* Lỗi validate ảnh */}
                                            {(errorsServer.imgURL || <ErrorMessage name="imgURL"/>) && (
                                                <div className="text-danger small mt-2">
                                                    {errorsServer.imgURL}
                                                    <ErrorMessage name="imgURL"/>
                                                </div>
                                            )}

                                            {uploading && <small className="text-muted mt-1">Đang upload ảnh...</small>}
                                        </div>


                                        <div className="col-md-8">
                                            <div className="row mb-3">
                                                <div className="col-md-6">
                                                    <label>Họ tên <Required/></label>
                                                    <Field name="fullName" className="form-control"/>
                                                    <ErrorMessage name="fullName" component="div"
                                                                  className="text-danger small"/>
                                                </div>

                                                <div className="col-md-6">
                                                    <label>Số điện thoại <Required/></label>
                                                    <Field name="phoneNumber" className="form-control"
                                                           onKeyUp={(e) => validateRealtime("phoneNumber", e.target.value)}/>
                                                    <div className="text-danger small">{errorsServer.phoneNumber}</div>
                                                    <ErrorMessage name={'phoneNumber'} component={'small'}
                                                                  className={'text-danger'}/>
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <div className="col-md-6">
                                                    <label>CCCD/CMND <Required/></label>
                                                    <Field name="identificationId" className="form-control"
                                                           onKeyUp={(e) => validateRealtime("identificationId", e.target.value)}/>
                                                    <div
                                                        className="text-danger small">{errorsServer.identificationId}</div>
                                                    <ErrorMessage name={"identificationId"} component={'small'}
                                                                  className={'text-danger'}/>
                                                </div>

                                                <div className="col-md-6">
                                                    <label>Email <Required/></label>
                                                    <Field name="email" className="form-control"
                                                           onKeyUp={(e) => validateRealtime("email", e.target.value)}/>
                                                    <div className="text-danger small">{errorsServer.email}</div>
                                                    <ErrorMessage name={'email'} component={'small'}
                                                                  className={'text-danger'}/>
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <div className="col-md-6">
                                                    <label>Ngày sinh <Required/></label>
                                                    <Field type="date" name="dob" className="form-control"/>
                                                    <ErrorMessage name="dob" component="div"
                                                                  className="text-danger small"/>
                                                </div>

                                                <div className="col-md-6">
                                                    <label>Giới tính <Required/></label>
                                                    <div className="d-flex gap-3 mt-2">
                                                        <label><Field type="radio" name="gender"
                                                                      value="Nam"/> Nam</label>
                                                        <label><Field type="radio" name="gender" value="Nữ"/> Nữ</label>
                                                    </div>
                                                    <ErrorMessage name="gender" component="div"
                                                                  className="text-danger small mt-1"/>
                                                    {/* CHUYỂN LỖI XUỐNG ĐÂY */}
                                                </div>
                                            </div>

                                            <label>Địa chỉ <Required/></label>
                                            <Field name="address" className="form-control"/>
                                            <ErrorMessage name="address"
                                                          component="div" className="text-danger small"/>
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-end gap-3 border-top pt-3 mt-4">
                                        <Button
                                            type="button"
                                            className="btn btn-secondary px-4"
                                            onClick={() => navigate("/employees")}
                                        >
                                            Quay lại
                                        </Button>

                                        <Button
                                            type="submit"
                                            className="btn btn-primary px-5"
                                            disabled={uploading}
                                        >
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
