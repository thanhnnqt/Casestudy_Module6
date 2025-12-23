import {Field, Form, Formik} from "formik";
import {addEmployee} from "../service/employeeService.js";
import {toast} from "react-toastify";

const AddEmployee = () => {
    const init = {
        employeeCode: "",
        fullName: "",
        address: "",
        phoneNumber: "",
        email: "",
        dob: "",
        gender: "",
        userName: "",
        password: ""
    }
    const handleAdd = (values) => {
        const fetchData = async () => {
            const isAdded = await addEmployee(values);
            if (isAdded) {
                toast.success("Thêm mới nhân viên thành công!", {
                    theme: "colored",
                    autoClose: 2000,
                    closeOnClick: true
                });
            } else {
                toast.error("Thêm mới nhân viên thất bại!", {
                    theme: "colored",
                    autoClose: 2000,
                    closeOnClick: true
                });
            }
        }
        fetchData();
        console.log(values)
    }
    return (
        <div className={'bg-light'}>
            <div className="container py-5">
                <div className="text-center mb-4">
                    <h3 className="fw-bold text-primary mb-1">
                        <i className="bi bi-person-plus-fill me-2"></i>
                        Thêm mới nhân viên bán vé máy bay
                    </h3>
                    <small className="text-muted">
                        <i className="bi bi-info-circle me-1"></i>
                        Vui lòng nhập đầy đủ thông tin để tạo tài khoản nhân viên
                    </small>
                </div>

                <div className="card shadow-sm border-0 border-start border-4 border-primary border-opacity-25">
                    <div className="card-body px-4 py-4">
                        <Formik initialValues={init} onSubmit={handleAdd}>

                            <Form>

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">
                                            <i className="bi bi-hash me-1"></i>
                                            Mã nhân viên
                                        </label>
                                        <Field name={"employeeCode"} type="text" className="form-control"
                                               placeholder="VD: NV001"/>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">
                                            <i className="bi bi-person me-1"></i>
                                            Họ và tên
                                        </label>
                                        <Field name={"fullName"} type="text" className="form-control"
                                               placeholder="VD: Nguyen Van A"/>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">
                                            <i className="bi bi-person me-1"></i>
                                            Số điện thoại
                                        </label>
                                        <Field name={"phoneNumber"} type="text" className="form-control"
                                               placeholder="VD: 0908123456"/>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">
                                            <i className="bi bi-person me-1"></i>
                                            Email
                                        </label>
                                        <Field name={"email"} type="text" className="form-control"
                                               placeholder="VD: example@gmail.com"/>
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">
                                            <i className="bi bi-calendar-event me-1"></i>
                                            Ngày sinh
                                        </label>
                                        <Field name={"dob"} type="date" className="form-control"/>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">
                                            <i className="bi bi-gender-ambiguous me-1"></i>
                                            Giới tính
                                        </label>
                                        <div className="d-flex gap-4 mt-2">
                                            <div className="form-check">
                                                <Field className="form-check-input" type="radio" name="gender" id="male"
                                                       value={"Nam"}/>
                                                <label className="form-check-label" htmlFor="male">Nam</label>
                                            </div>
                                            <div className="form-check">
                                                <Field className="form-check-input" type="radio" name="gender"
                                                       id="female" value={"Nữ"}/>
                                                <label className="form-check-label" htmlFor="female">Nữ</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">
                                            <i className="bi bi-person-circle me-1"></i>
                                            Tài khoản
                                        </label>
                                        <Field name={"userName"} type="text" className="form-control"
                                               placeholder="Tên đăng nhập hệ thống"/>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">
                                            <i className="bi bi-key me-1"></i>
                                            Mật khẩu
                                        </label>
                                        <Field name={"password"} type="password" className="form-control"
                                               placeholder="Ít nhất 8 ký tự"/>
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">
                                            <i className="bi bi-key me-1"></i>
                                            Địa chỉ
                                        </label>
                                        <Field name={"address"} className="form-control"
                                               placeholder="VD: Ha Noi"/>
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
                                    <button type="button" className="btn btn-outline-secondary px-4">
                                        <i className="bi bi-arrow-left me-1"></i>
                                        Quay lại
                                    </button>

                                    <div className="d-flex gap-3">
                                        <button type="button" className="btn btn-outline-danger px-4">
                                            <i className="bi bi-trash me-1"></i>
                                            Xóa
                                        </button>
                                        <button type="submit" className="btn btn-primary px-5 fw-semibold">
                                            <i className="bi bi-save me-1"></i>
                                            Lưu
                                        </button>
                                    </div>
                                </div>

                            </Form>
                        </Formik>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddEmployee;
