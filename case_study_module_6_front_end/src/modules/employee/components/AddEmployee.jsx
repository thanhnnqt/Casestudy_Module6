import {ErrorMessage, Field, Form, Formik} from "formik";
import {
    addEmployee,
    checkIdentificationExists,
    checkEmailExists,
    checkPhoneExists,
    checkImageHashExists,
    updateEmployeeImage
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
    const [selectedFile, setSelectedFile] = useState(null);
    const [errorsServer, setErrorsServer] = useState({});

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
        enabled: true,
        createAt: new Date().toISOString(),
    };

    const min18 = new Date();
    min18.setFullYear(min18.getFullYear() - 18);

    const validationSchema = Yup.object({
        fullName: Yup.string().required("Không để trống"),
        phoneNumber: Yup.string().required("Không để trống").matches(/^0\d{9}$/, "10 số"),
        identificationId: Yup.string().required("Không để trống").matches(/^\d{9}(\d{3})?$/, "9 hoặc 12 số"),
        email: Yup.string().required("Không để trống").email("Sai định dạng"),
        dob: Yup.date().required("Không trống").max(min18, "Phải ≥ 18 tuổi"),
        gender: Yup.string().required("Chọn giới tính"),
        address: Yup.string().required("Không để trống"),
        username: Yup.string().required("Không trống").min(4),
        password: Yup.string().required("Không trống").min(6),
    });

    const debounce = (fn, delay = 600) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn(...args), delay);
        };
    };

    const validateRealtime = debounce(async (field, value) => {
        if (!value) return;
        const checkMap = {
            identificationId: checkIdentificationExists,
            email: checkEmailExists,
            phoneNumber: checkPhoneExists
        };
        if (checkMap[field]) {
            const exists = await checkMap[field](value);
            setErrorsServer(prev => ({
                ...prev,
                [field]: exists ? "Đã tồn tại trong hệ thống" : ""
            }));
        }
    });

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
            body: formData
        });
        return res.json();
    };

    const handleImageSelect = (file) => {
        if (!file) return;
        setPreview(URL.createObjectURL(file));
        setSelectedFile(file);
        setErrorsServer(prev => ({...prev, imgURL: ""}));
    };

    const handleSubmit = async (values) => {
        console.log(values)
        if (!selectedFile) return toast.error("Vui lòng chọn ảnh nhân viên");

        const hash = await createImageHash(selectedFile);
        if (await checkImageHashExists(hash)) {
            return toast.error("Ảnh đã bị trùng bởi nhân viên khác");
        }
        values.imgHash = hash;

        const savedEmployee = await addEmployee(values);
        if (!savedEmployee) {
            toast.error("Thêm thất bại");
            return;
        }

        setUploading(true);

        try {
            const cloud = await uploadToCloudinary();
            await updateEmployeeImage(savedEmployee.id, cloud.secure_url, hash);

            toast.success("Thêm nhân viên thành công!");
            navigate("/employees");

        } catch (err) {
            toast.error("Upload ảnh thất bại");
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-light mt-2">
            <div className="container py-2">
                <div className="mb-3 pb-2 border-bottom">
                    <h3 className="fw-bold text-primary d-flex gap-2">
                        <i className="bi bi-person-plus-fill"></i> Thêm nhân viên
                    </h3>
                </div>

                <div className="card shadow-sm border-start border-4 border-primary">
                    <div className="card-body px-4 py-3">
                        <Formik initialValues={initialValues}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}>

                            <Form>
                                <div className="row g-4">

                                    <div className="col-md-4 d-flex flex-column align-items-center">
                                        <label className="fw-semibold">Ảnh <Required/></label>

                                        <div
                                            className="rounded-circle shadow-sm mt-1 d-flex align-items-center justify-content-center"
                                            style={{
                                                width: 180,
                                                height: 180,
                                                backgroundColor: "#f1f3f5",
                                                overflow: "hidden"
                                            }}>
                                            {preview ?
                                                <img src={preview} className="w-100 h-100" style={{objectFit: "cover"}}
                                                     alt="avatar"/> :
                                                <i className="bi bi-person fs-1 text-muted"/>
                                            }
                                        </div>

                                        <input type="file"
                                               accept="image/*"
                                               className={`form-control mt-3 ${errorsServer.imgURL && "is-invalid"}`}
                                               style={{width: 250}}
                                               onChange={(e) => handleImageSelect(e.target.files[0])}
                                        />

                                        <div className="text-danger small">{errorsServer.imgURL}</div>
                                    </div>

                                    <div className="col-md-8">
                                        <div className="row">

                                            <div className="col-md-6 mb-2">
                                                <label>Họ tên <Required/></label>
                                                <Field name="fullName" className="form-control"/>
                                                <ErrorMessage name="fullName" className="text-danger small"
                                                              component="div"/>
                                            </div>

                                            <div className="col-md-6 mb-2">
                                                <label>SĐT <Required/></label>
                                                <Field name="phoneNumber" className="form-control"
                                                       onKeyUp={(e) => validateRealtime("phoneNumber", e.target.value)}/>
                                                <ErrorMessage name={'phoneNumber'} component={'div'}
                                                              className={'text-danger'}/>
                                            </div>

                                            <div className="col-md-6 mb-2">
                                                <label>CCCD/CMND <Required/></label>
                                                <Field name="identificationId" className="form-control"
                                                       onKeyUp={(e) => validateRealtime("identificationId", e.target.value)}/>
                                                <ErrorMessage name={'identificationId'} component={'div'}
                                                              className={'text-danger'}/>
                                            </div>

                                            <div className="col-md-6 mb-2">
                                                <label>Email <Required/></label>
                                                <Field name="email" className="form-control"
                                                       onKeyUp={(e) => validateRealtime("email", e.target.value)}/>
                                                <ErrorMessage name={'email'} component={'div'}
                                                              className={'text-danger'}/>
                                            </div>

                                            <div className="col-md-6 mb-2">
                                                <label>Ngày sinh <Required/></label>
                                                <Field type="date" name="dob" className="form-control"/>
                                                <ErrorMessage name="dob" className="text-danger small" component="div"/>
                                            </div>

                                            <div className="col-md-6 mb-2">
                                                <label>Giới tính <Required/></label>
                                                <div className="d-flex gap-3 mt-2">
                                                    <label><Field type="radio" name="gender" value="Nam"/> Nam</label>
                                                    <label><Field type="radio" name="gender" value="Nữ"/> Nữ</label>
                                                </div>
                                                <ErrorMessage name="gender" className="text-danger small"
                                                              component="div"/>
                                            </div>

                                            <div className="mb-2">
                                                <label>Địa chỉ <Required/></label>
                                                <Field name="address" className="form-control"/>
                                                <ErrorMessage name="address" className="text-danger small"
                                                              component="div"/>
                                            </div>


                                            <div className="row">
                                                <div className="col-md-6 mb-2">
                                                    <label>Tài khoản <Required/></label>
                                                    <Field name="username" className="form-control"/>
                                                    <ErrorMessage name="username" className="text-danger small"
                                                                  component="div"/>
                                                </div>

                                                <div className="col-md-6 mb-2">
                                                    <label>Mật khẩu <Required/></label>
                                                    <Field type="password" name="password" className="form-control"/>
                                                    <ErrorMessage name="password" className="text-danger small"
                                                                  component="div"/>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>

                                <div className="d-flex justify-content-end border-top pt-3 mt-3">
                                    <div className="d-flex gap-2 w-auto">
                                        <Button
                                            variant="secondary"
                                            className="px-3"
                                            onClick={() => navigate("/employees")}
                                        >
                                            Quay lại
                                        </Button>

                                        <Button
                                            type="submit"
                                            variant="primary"
                                            className="px-3"
                                            disabled={uploading}
                                        >
                                            {uploading ? "Đang lưu..." : "Lưu"}
                                        </Button>
                                    </div>
                                </div>


                            </Form>
                        </Formik>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AddEmployee;
