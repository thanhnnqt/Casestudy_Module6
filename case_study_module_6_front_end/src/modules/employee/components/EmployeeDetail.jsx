import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';

import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {
    editEmployee,
    findEmployeeById,
    checkImageHashExistsExceptSelf,
    updateEmployeeImage
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

    const [detail, setDetail] = useState({});
    const [preview, setPreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [errorsServer, setErrorsServer] = useState({});
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        async function loadDetail() {
            const data = await findEmployeeById(id);

            setDetail({
                id: data.id,
                fullName: data.fullName ?? "",
                phoneNumber: data.phoneNumber ?? "",
                identificationId: data.identificationId ?? "",
                email: data.email ?? "",
                dob: data.dob ?? "",
                gender: data.gender ?? "",
                address: data.address ?? "",
                imgURL: data.imgURL ?? "",
                imgHash: data.imgHash ?? "",
                account: JSON.stringify(data.account) ?? ""
            });

            setPreview(data.imgURL);
        }

        loadDetail();
    }, [id]);


    const validationSchema = Yup.object({
        fullName: Yup.string().required("Không để trống"),
        phoneNumber: Yup.string().required("Không để trống").matches(/^0\d{9}$/, "10 số"),
        identificationId: Yup.string().required("Không để trống").matches(/^\d{9}(\d{3})?$/, "9 hoặc 12 số"),
        email: Yup.string().required("Không để trống").email("Email không hợp lệ"),
        dob: Yup.date().required("Không để trống"),
        gender: Yup.string().required("Chọn giới tính"),
        address: Yup.string().required("Không để trống")
    });

    const createImageHash = async (file) => {
        const buffer = await file.arrayBuffer();
        return CryptoJS.SHA256(CryptoJS.lib.WordArray.create(buffer)).toString();
    };

    const uploadCloudinary = async () => {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("upload_preset", "employee_preset");

        const res = await fetch("https://api.cloudinary.com/v1_1/dfduj6hiv/image/upload", {
            method: "POST",
            body: formData
        });

        return await res.json();
    };

    const handleImageSelect = (file) => {
        if (!file) return;
        setPreview(URL.createObjectURL(file));
        setSelectedFile(file);
        setErrorsServer(prev => ({...prev, imgURL: ""}));
    };


    const handleSubmit = async (values) => {
        const updatedValues = {...detail, ...values, account: JSON.parse(values.account)};
        const hasNewImage = !!selectedFile;
        console.log(updatedValues)
        if (hasNewImage) {
            const newHash = await createImageHash(selectedFile);

            if (newHash !== detail.imgHash) {
                const exists = await checkImageHashExistsExceptSelf(newHash, values.id);
                if (exists) {
                    setErrorsServer({imgURL: "Ảnh đã được sử dụng bởi nhân viên khác"});
                    return;
                }
                updatedValues.imgHash = newHash;
            }
        }

        const ok = await editEmployee(updatedValues);
        if (!ok) {
            toast.error("Cập nhật thất bại");
            return;
        }

        if (!hasNewImage) {
            toast.success("Cập nhật thành công");
            return navigate("/employees");
        }

        toast.info("Đang upload ảnh...");
        setUploading(true);

        try {
            const cloud = await uploadCloudinary();
            await updateEmployeeImage(updatedValues.id, cloud.secure_url, updatedValues.imgHash);

            toast.success("Cập nhật thành công");
            navigate("/employees");

        } catch (err) {
            toast.error("Upload ảnh thất bại");
            console.error(err);
        } finally {
            setUploading(false);
        }
    };


    return (
        <div className="bg-light mt-3">
            <div className="container py-3">

                <div className="mb-3 pb-2 border-bottom text-center">
                    <h4 className="fw-bold text-primary">Cập nhật nhân viên</h4>
                </div>

                <div className="card shadow-sm border-start border-4 border-primary">
                    <div className="card-body px-4 py-4">

                        <Formik enableReinitialize
                                initialValues={detail}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}>
                            {() => (
                                <Form>

                                    <Field type="hidden" name="account"/>

                                    <div className="row g-4">
                                        <div className="col-md-4 d-flex flex-column align-items-center">

                                            <label className="fw-semibold">Ảnh nhân viên <Required/></label>

                                            <div
                                                className="rounded-circle shadow-sm mt-1 d-flex align-items-center justify-content-center"
                                                style={{
                                                    width: 180,
                                                    height: 180,
                                                    background: "#EEE",
                                                    overflow: "hidden"
                                                }}>
                                                {preview ? (
                                                    <img src={preview}
                                                         className="w-100 h-100"
                                                         style={{objectFit: "cover"}}
                                                         alt="avatar"/>
                                                ) : (
                                                    <i className="bi bi-person fs-1 text-muted"/>
                                                )}
                                            </div>

                                            <input type="file"
                                                   accept="image/*"
                                                   className="form-control mt-3"
                                                   style={{width: 250}}
                                                   onChange={(e) => handleImageSelect(e.target.files[0])}
                                            />

                                            {errorsServer.imgURL &&
                                                <div className="text-danger small mt-1">{errorsServer.imgURL}</div>}
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
                                                    <Field name="phoneNumber" className="form-control"/>
                                                    <ErrorMessage name="phoneNumber" className="text-danger small"
                                                                  component="div"/>
                                                </div>

                                                <div className="col-md-6 mb-2">
                                                    <label>CCCD/CMND <Required/></label>
                                                    <Field name="identificationId" className="form-control"/>
                                                    <ErrorMessage name="identificationId" className="text-danger small"
                                                                  component="div"/>
                                                </div>

                                                <div className="col-md-6 mb-2">
                                                    <label>Email <Required/></label>
                                                    <Field name="email" className="form-control"/>
                                                    <ErrorMessage name="email" className="text-danger small"
                                                                  component="div"/>
                                                </div>

                                                <div className="col-md-6 mb-2">
                                                    <label>Ngày sinh <Required/></label>
                                                    <Field type="date" name="dob" className="form-control"/>
                                                    <ErrorMessage name="dob" className="text-danger small"
                                                                  component="div"/>
                                                </div>

                                                <div className="col-md-6 mb-2">
                                                    <label>Giới tính <Required/></label>
                                                    <div className="d-flex gap-3 mt-2">
                                                        <label><Field type="radio" name="gender"
                                                                      value="Nam"/> Nam</label>
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

                                            </div>
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-end border-top pt-3 gap-3 mt-3">
                                        <Button variant="secondary" onClick={() => navigate("/employees")}>
                                            Quay lại
                                        </Button>
                                        <Button type="submit" variant="primary" disabled={uploading}>
                                            {uploading ? "Đang lưu..." : "Lưu"}
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
