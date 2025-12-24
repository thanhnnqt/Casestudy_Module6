import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/dist/css/bootstrap.css';
import {Link, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {editEmployee, findEmployeeById} from "../service/employeeService.js";
import {Field, Form, Formik} from "formik";
import {toast} from "react-toastify";
import {Button} from "react-bootstrap";

const EmployeeDetail = () => {
    const [detail, setDetail] = useState({
        id: 0,
        employeeCode: "",
        fullName: "",
        address: "",
        phoneNumber: "",
        email: "",
        dob: "",
        gender: ""

    });
    const navigate = useNavigate();
    const {id} = useParams();
    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                const data = await findEmployeeById(id);
                console.log(data);
                setDetail(data)
            }
            fetchData();
        }
    }, [id])

    const handleEdit = (values) => {
        const isEdited = editEmployee(values);
        if (isEdited) {
            toast.success("Cập nhật thành công", {
                theme: "colored",
                autoClose: 2000,
                closeOnClick: true
            })
            navigate("/employees");
        } else {
            toast.error("Cập nhật thất bại", {
                theme: "colored",
                autoClose: 2000,
                closeOnClick: true
            })
        }
        console.log(values);
    }
    return (
        <div className={'bg-light'}>
            <div className="container py-5">

                <div className="text-center mb-4">
                    <h3 className="fw-bold text-primary mb-1">
                        <i className="bi bi-pencil-square me-2"></i>
                        Cập nhật nhân viên bán vé máy bay
                    </h3>
                    <small className="text-muted">
                        <i className="bi bi-info-circle me-1"></i>
                        Chỉnh sửa thông tin nhân viên trong hệ thống
                    </small>
                </div>

                <div className="card shadow-sm border-0 border-start border-4 border-primary border-opacity-25">
                    <div className="card-body px-4 py-4">
                        <Formik enableReinitialize={true} initialValues={detail} onSubmit={handleEdit}>
                            <Form>
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <Field type={"hidden"} name={"id"}/>
                                        <label className="form-label fw-semibold">
                                            <i className="bi bi-hash me-1"></i>
                                            Mã nhân viên
                                        </label>
                                        <Field name={"employeeCode"}
                                               className="form-control"
                                               readOnly/>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">
                                            <i className="bi bi-person me-1"></i>
                                            Họ và tên
                                        </label>
                                        <Field name={"fullName"}
                                               className="form-control"
                                        />
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">
                                            <i className="bi bi-calendar-event me-1"></i>
                                            Ngày sinh
                                        </label>
                                        <Field name={"dob"}
                                               type="date"
                                               className="form-control"
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">
                                            <i className="bi bi-gender-ambiguous me-1"></i>
                                            Giới tính
                                        </label>
                                        <div className="d-flex gap-4 mt-2">
                                            <div className="form-check">
                                                <Field className="form-check-input"
                                                       type="radio"
                                                       name="gender"
                                                       id="male"
                                                       value={"Nam"}
                                                />

                                                <label className="form-check-label" htmlFor="male">
                                                    Nam
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <Field className="form-check-input"
                                                       type="radio"
                                                       name="gender"
                                                       id="female"
                                                       value={"Nữ"}
                                                />

                                            </div>
                                            <label className="form-check-label" htmlFor="female">
                                                Nữ
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/*<div className="mb-4 col-md-6">*/}
                                {/*    <label className="form-label fw-semibold">*/}
                                {/*        <i className="bi bi-shield-lock me-1"></i>*/}
                                {/*        Phân quyền*/}
                                {/*    </label>*/}
                                {/*    <select className="form-select">*/}
                                {/*        <option selected>Nhân viên bán vé</option>*/}
                                {/*        <option>Quản trị hệ thống</option>*/}
                                {/*    </select>*/}
                                {/*</div>*/}

                                <div className="d-flex justify-content-between align-items-center border-top pt-4">
                                    <Link to={'/employees'} type="button" className="btn btn-outline-secondary px-4">
                                        <i className="bi bi-arrow-left me-1"></i>
                                        Quay lại
                                    </Link>

                                    <Button type="submit" className="btn btn-primary px-5 fw-semibold">
                                        <i className="bi bi-save me-1"></i>
                                        Lưu thay đổi
                                    </Button>
                                </div>

                            </Form>
                        </Formik>
                    </div>
                </div>

            </div>
        </div>
    )
}
export default EmployeeDetail;