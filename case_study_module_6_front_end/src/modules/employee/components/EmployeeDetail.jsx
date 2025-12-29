import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';

import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {
    editEmployee,
    findEmployeeById,
    checkImageHashExistsExceptSelf
} from "../service/employeeService.js";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {Button} from "react-bootstrap";
import * as Yup from "yup";
import CryptoJS from "crypto-js";
import {toast} from "react-toastify";


const Required = () => <span className="text-danger"> *</span>;

const EmployeeDetail = () => {

    const navigate = useNavigate();
    const {id} = useParams();

    const [initialImageURL, setInitialImageURL] = useState(null);
    const [errorsServer, setErrorsServer] = useState({});
    const [detail, setDetail] = useState({});
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        findEmployeeById(id).then(data => {
            setDetail({
                id: data.id,
                fullName: data.fullName || "",
                phoneNumber: data.phoneNumber || "",
                identificationId: data.identificationId || "",
                email: data.email || "",
                dob: data.dob || "",
                gender: data.gender || "",
                address: data.address || "",
                imgURL: data.imgURL || "",
                imgHash: data.imgHash || ""
            });
            setInitialImageURL(data.imgURL);
            setPreview(data.imgURL);
        });
    }, [id]);


    const validationSchema = Yup.object({
        fullName: Yup.string().required("Vui lòng không để trống họ và tên"),
        phoneNumber: Yup.string().required("Không để trống").matches(/^0\d{9}$/, "10 số"),
        identificationId: Yup.string().required("Không để trống").matches(/^\d{9}(\d{3})?$/, "9 hoặc 12 số"),
        email: Yup.string().required("Không để trống").email("Email sai định dạng"),
        dob: Yup.date().required("Không để trống"),
        gender: Yup.string().required("Vui lòng chọn giới tính"),
        address: Yup.string().required("Không để trống địa chỉ"),
        imgURL: Yup.string().required("Vui lòng tải ảnh nhân viên"),
        imgHash: Yup.string().nullable()
    });


    const createImageHash = async (file) => {
        const reader = new FileReader();
        return new Promise((resolve) => {
            reader.onload = () => {
                const hash = CryptoJS.SHA256(
                    CryptoJS.lib.WordArray.create(reader.result)
                ).toString();
                resolve(hash);
            };
            reader.readAsArrayBuffer(file);
        });
    };


    const uploadImage = async (file, setFieldValue) => {
        if (!file) return;

        setUploading(true);
        setPreview(URL.createObjectURL(file));
        setErrorsServer({imgURL: ""}); // clear lỗi ảnh trùng

        const hash = await createImageHash(file);
        setFieldValue("imgHash", hash);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "employee_preset");

        const res = await fetch("https://api.cloudinary.com/v1_1/dfduj6hiv/image/upload", {
            method: "POST",
            body: formData
        });
        const data = await res.json();

        setFieldValue("imgURL", data.secure_url);
        setUploading(false);
    };


    const handleSubmit = async (values) => {

        const changedImage = values.imgHash !== detail.imgHash;

        if (changedImage && values.imgHash) {
            const exists = await checkImageHashExistsExceptSelf(values.imgHash, values.id);
            if (exists) {
                setErrorsServer({imgURL: "Ảnh này đã được sử dụng cho nhân viên khác"});
                return;
            }
        }

        const ok = await editEmployee(values);
        if (ok) {
            setDetail(prev => ({ ...prev, imgHash: values.imgHash }));
            toast.success("Cập nhật thành công");
            navigate("/employees");
        }
    };

    return (
        <div className="bg-light mt-3">
            <div className="container py-3">

                <div className="mb-3 pb-2 border-bottom text-center">
                    <h4 className="fw-bold text-primary">Cập nhật nhân viên</h4>
                    <small className="text-muted">
                        Trường có <Required/> là bắt buộc nhập thông tin
                    </small>
                </div>

                <div className="card shadow-sm border-0 border-start border-4 border-primary">
                    <div className="card-body px-4 py-4">

                        <Formik enableReinitialize
                                initialValues={detail}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}>
                            {({setFieldValue}) => (
                                <Form>

                                    <Field type="hidden" name="id"/>

                                    <div className="row g-4">

                                        <div className="col-md-4 d-flex flex-column align-items-center">
                                            <div className="rounded overflow-hidden shadow-sm"
                                                 style={{width: 180, height: 220, backgroundColor: "#f1f3f5"}}>
                                                {preview ? (
                                                    <img src={preview} alt="avatar"
                                                         className="w-100 h-100"
                                                         style={{objectFit: 'cover'}}/>
                                                ) : (
                                                    <i className="bi bi-person fs-1 text-muted"/>
                                                )}
                                            </div>

                                            <label className="fw-semibold mt-3">
                                                Ảnh nhân viên <Required/>
                                            </label>
                                            <input type="file" accept="image/*" className="form-control"
                                                   onChange={(e) => uploadImage(e.target.files[0], setFieldValue)}/>

                                            {errorsServer.imgURL &&
                                                <div className="text-danger small mt-1">{errorsServer.imgURL}</div>}

                                            <ErrorMessage name="imgURL"
                                                          component="div"
                                                          className="text-danger small"/>

                                            {uploading && <small className="text-muted">Đang upload...</small>}
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
                                                    <Field name="phoneNumber" className="form-control"/>
                                                    <ErrorMessage name="phoneNumber" component="div"
                                                                  className="text-danger small"/>
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <div className="col-md-6">
                                                    <label>CCCD/CMND <Required/></label>
                                                    <Field name="identificationId" className="form-control"/>
                                                    <ErrorMessage name="identificationId" component="div"
                                                                  className="text-danger small"/>
                                                </div>
                                                <div className="col-md-6">
                                                    <label>Email <Required/></label>
                                                    <Field name="email" className="form-control"/>
                                                    <ErrorMessage name="email" component="div"
                                                                  className="text-danger small"/>
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
                                                </div>
                                            </div>

                                            <label>Địa chỉ <Required/></label>
                                            <Field name="address" className="form-control"/>
                                            <ErrorMessage name="address" component="div"
                                                          className="text-danger small"/>
                                        </div>
                                    </div>


                                    <div className="d-flex justify-content-end gap-3 border-top pt-4 mt-4">
                                        <Button
                                            type="button"
                                            variant="outline-secondary"
                                            className="px-4 fw-semibold rounded-2"
                                            onClick={() => navigate("/employees")}
                                        >
                                            Quay lại
                                        </Button>

                                        <Button
                                            type="submit"
                                            variant="primary"
                                            className="px-5 fw-semibold rounded-2 shadow-sm"
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
