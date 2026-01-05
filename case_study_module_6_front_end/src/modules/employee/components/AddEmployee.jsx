import {ErrorMessage, Field, Form, Formik} from "formik";
import {
    addEmployee,
    checkIdentificationExists,
    checkEmailExists,
    checkPhoneExists,
    checkImageHashExists,
    checkUsernameExists,
    updateEmployeeImage,
} from "../service/employeeService.js";
import {useNavigate} from "react-router-dom";
import {useState, useCallback} from "react";
import * as Yup from "yup";
import CryptoJS from "crypto-js";
import {toast} from "react-toastify";

const Required = () => <span className="text-danger">*</span>;

const AddEmployee = () => {
    const navigate = useNavigate();
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [errorsServer, setErrorsServer] = useState({});

    const min18 = new Date();
    min18.setFullYear(min18.getFullYear() - 18);

    const initialValues = {
        fullName: "",
        phoneNumber: "",
        identificationId: "",
        email: "",
        dob: "",
        gender: "",
        address: "",
        username: "",
        password: "",
        imgURL: "",
        imgHash: "",
        provider: "LOCAL",
        targetRole: "EMPLOYEE",
        createAt: new Date().toISOString(),
    };

    const validationSchema = (role) =>
        Yup.object({
            fullName: Yup.string().required("Không để trống họ và tên"),
            phoneNumber: Yup.string().required("Không để trống số điện thoại").matches(/^0\d{9}$/, "10 số"),
            email: Yup.string().required("Không để trống email").email("Sai định dạng email"),
            username: Yup.string().required("Không trống tài khoản").min(4),
            password: Yup.string().required("Không trống mật khẩu"),
            ...(role === "EMPLOYEE" && {
                identificationId: Yup.string().required("Không để trống CCCD").matches(/^\d{9}(\d{3})?$/, "CCCD 9 hoặc 12 số"),
                dob: Yup.date().required("Không trống ngày sinh").max(min18, "≥ 18 tuổi"),
                gender: Yup.string().required("Chọn giới tính"),
                address: Yup.string().required("Không để trống địa chỉ"),
            }),
        });

    const debounce = (fn, delay = 700) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn(...args), delay);
        };
    };

    const createImageHash = async (file) => {
        const buffer = await file.arrayBuffer();
        return CryptoJS.SHA256(CryptoJS.lib.WordArray.create(buffer)).toString();
    };

    const uploadToCloudinary = async () => {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("upload_preset", "employee_preset");

        const res = await fetch("https://api.cloudinary.com/v1_1/dfduj6hiv/image/upload", {
            method: "POST",
            body: formData,
        });

        return res.json();
    };

    const handleSubmit = async (values, {setErrors}) => {
        try {
            const role = values.targetRole;

            if (role === "EMPLOYEE") {
                if (!selectedFile)
                    return toast.error("Vui lòng chọn ảnh nhân viên");

                const hash = await createImageHash(selectedFile);
                if (await checkImageHashExists(hash))
                    return toast.error("Ảnh đã bị trùng");

                values.imgHash = hash;
                values.DOB = values.dob;
            }

            const saved = await addEmployee(values);

            if (role === "ADMIN") {
                toast.success("Thêm quản trị viên thành công!");
                return navigate("/employees");
            }

            setUploading(true);
            const cloud = await uploadToCloudinary();
            await updateEmployeeImage(saved.id, cloud.secure_url, values.imgHash);

            toast.success("Thêm nhân viên thành công!");
            navigate("/employees");

        } catch (err) {
            if (typeof err === "string") {
                setErrors({username: err});
                return;
            }

            if (err?.message) {
                setErrors({username: err.message});
                return;
            }

            if (typeof err === "object") {
                setErrors(err);
                return;
            }

            toast.error("Thêm nhân viên thất bại");
        } finally {
            setUploading(false);
        }
    };


    return (
        <div className="bg-light mt-2">
            <div className="container py-2">
                <div className="mb-3 border-bottom pb-2">
                    <h3 className="fw-bold text-primary">
                        <i className="bi bi-person-plus-fill"/> Thêm nhân viên
                    </h3>
                </div>

                <Formik
                    initialValues={initialValues}
                    validationSchema={Yup.lazy((v) => validationSchema(v.targetRole))}
                    onSubmit={handleSubmit}
                >
                    {({values, setFieldValue}) => {
                        const role = values.targetRole;

                        return (
                            <Form>
                                <div className="row g-3">

                                    {role === "EMPLOYEE" && (
                                        <div className="col-md-4 d-flex flex-column align-items-center">
                                            <label className="fw-semibold mb-2">Ảnh <Required/></label>
                                            <div
                                                className="rounded-circle shadow-sm d-flex align-items-center justify-content-center"
                                                style={{width: 150, height: 150, backgroundColor: "#eee"}}>
                                                {preview ?
                                                    <img src={preview} className="w-100 h-100"
                                                         style={{objectFit: "cover"}} alt=""/> :
                                                    <i className="bi bi-person fs-1 text-muted"></i>}
                                            </div>

                                            <input type="file" accept="image/*" className="form-control mt-2"
                                                   style={{width: 200}}
                                                   onChange={(e) => {
                                                       const file = e.target.files[0];
                                                       setSelectedFile(file);
                                                       setPreview(file ? URL.createObjectURL(file) : null);
                                                   }}/>
                                        </div>
                                    )}

                                    <div className={role === "EMPLOYEE" ? "col-md-8" : "col-md-12"}>
                                        <div className="row g-2">

                                            {/* Họ tên */}
                                            <div className="col-md-6">
                                                <label>Họ tên <Required/></label>
                                                <Field name="fullName" className="form-control form-control-sm"/>
                                                <ErrorMessage name="fullName" component="div"
                                                              className="text-danger small"/>
                                            </div>

                                            {/* SĐT */}
                                            <div className="col-md-6">
                                                <label>SĐT <Required/></label>
                                                <Field name="phoneNumber" className="form-control form-control-sm"/>
                                                <div className="text-danger small">{errorsServer.phoneNumber}</div>
                                                <ErrorMessage name="phoneNumber" component="div"
                                                              className="text-danger small"/>
                                            </div>

                                            {/* Email hiển thị cho cả Admin */}
                                            <div className="col-md-6">
                                                <label>Email <Required/></label>
                                                <Field name="email" className="form-control form-control-sm"/>
                                                <div className="text-danger small">{errorsServer.email}</div>
                                                <ErrorMessage name="email" component="div"
                                                              className="text-danger small"/>
                                            </div>

                                            {role === "EMPLOYEE" && (
                                                <>
                                                    <div className="col-md-6">
                                                        <label>CCCD <Required/></label>
                                                        <Field name="identificationId"
                                                               className="form-control form-control-sm"/>
                                                        <ErrorMessage name="identificationId"
                                                                      className="text-danger small" component="div"/>
                                                    </div>

                                                    <div className="col-md-6">
                                                        <label>Ngày sinh <Required/></label>
                                                        <Field type="date" name="dob"
                                                               className="form-control form-control-sm"/>
                                                        <ErrorMessage name="dob" className="text-danger small"
                                                                      component="div"/>
                                                    </div>

                                                    <div className="col-md-6">
                                                        <label>Giới tính <Required/></label>
                                                        <label className="ms-2"><Field type="radio" name="gender"
                                                                                       value="Nam"/> Nam</label>
                                                        <label className="ms-3"><Field type="radio" name="gender"
                                                                                       value="Nữ"/> Nữ</label>
                                                        <ErrorMessage name="gender" className="text-danger small"
                                                                      component="div"/>
                                                    </div>

                                                    <div className="col-12">
                                                        <label>Địa chỉ <Required/></label>
                                                        <Field name="address" className="form-control form-control-sm"/>
                                                        <ErrorMessage name="address" className="text-danger small"
                                                                      component="div"/>
                                                    </div>
                                                </>
                                            )}

                                            <div className="col-md-4">
                                                <label>Tài khoản <Required/></label>
                                                <Field name="username" className="form-control form-control-sm"/>
                                                <div className="text-danger small">{errorsServer.username}</div>
                                                <ErrorMessage name="username" className="text-danger small"
                                                              component="div"/>
                                            </div>

                                            <div className="col-md-4">
                                                <label>Mật khẩu <Required/></label>
                                                <Field type="password" name="password"
                                                       className="form-control form-control-sm"/>
                                                <ErrorMessage name="password" className="text-danger small"
                                                              component="div"/>
                                            </div>

                                            <div className="col-md-4">
                                                <label>Phân quyền <Required/></label>
                                                <Field as="select"
                                                       name="targetRole"
                                                       className="form-select form-select-sm"
                                                       onChange={(e) => setFieldValue("targetRole", e.target.value)}>
                                                    <option value="EMPLOYEE">Nhân viên</option>
                                                    <option value="ADMIN">Quản trị viên</option>
                                                </Field>
                                            </div>

                                        </div>

                                    </div>

                                </div>

                                <div className="d-flex justify-content-end gap-2 mt-3 pt-3 border-top">
                                    <button
                                        type="button"
                                        className="btn btn-secondary btn-sm px-2"
                                        style={{width: "75px", flex: "0 0 auto"}}
                                        onClick={() => navigate("/employees")}
                                    >
                                        Quay lại
                                    </button>

                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-sm px-2"
                                        style={{width: "75px", flex: "0 0 auto"}}
                                        disabled={uploading}
                                    >
                                        {uploading ? "..." : "Lưu"}
                                    </button>
                                </div>
                            </Form>
                        );
                    }}
                </Formik>
            </div>
        </div>
    );
};

export default AddEmployee;
