import React from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";

const PassengerForm = ({ passengerCount, onBack, onSubmit, flightInfo }) => {

    // Tạo giá trị mặc định cho số lượng hành khách
    const initialValues = {
        passengers: Array.from({ length: passengerCount }).map(() => ({
            fullName: "",
            gender: "Nam",
            email: "",
            phone: "",
            identityCard: "",
            isChild: false,
            hasInfant: false
        }))
    };

    // VALIDATION SCHEMA (Theo yêu cầu của bạn)
    const validationSchema = Yup.object().shape({
        passengers: Yup.array().of(
            Yup.object().shape({
                fullName: Yup.string()
                    .min(10, "Tên phải từ 10 ký tự")
                    .max(50, "Tên tối đa 50 ký tự")
                    .required("Họ tên là bắt buộc"),

                gender: Yup.string().required("Bắt buộc"),

                email: Yup.string().email("Email không đúng định dạng").nullable(),

                phone: Yup.string()
                    .matches(/^\+84\d{9,11}$/, "SĐT phải dạng +84xxxxxxxxx (9-11 số)")
                    .nullable(),

                // Logic: Nếu KHÔNG phải trẻ em thì BẮT BUỘC nhập CMND
                identityCard: Yup.string().when("isChild", {
                    is: false,
                    then: () => Yup.string().required("CMND/Passport là bắt buộc với người lớn"),
                    otherwise: () => Yup.string().nullable()
                })
            })
        )
    });

    return (
        <div className="container mt-4 mb-5">
            <h4 className="mb-3 text-primary"><i className="bi bi-people-fill me-2"></i>Thông tin hành khách</h4>

            {/* Tóm tắt chuyến bay đã chọn */}
            <div className="alert alert-info d-flex justify-content-between align-items-center">
                <div>
                    <strong>Chiều đi:</strong> {flightInfo.out?.flightNumber} ({flightInfo.out?.departureTime})
                    {flightInfo.in && <span className="ms-4"><strong>Chiều về:</strong> {flightInfo.in?.flightNumber}</span>}
                </div>
                <div className="fw-bold text-danger">
                    Tổng: {passengerCount} vé
                </div>
            </div>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    onSubmit(values.passengers); // Gửi list passengers ra ngoài
                }}
            >
                {({ values, setFieldValue }) => (
                    <Form>
                        <FieldArray name="passengers">
                            {() => (
                                <>
                                    {values.passengers.map((p, index) => (
                                        <div key={index} className="card shadow-sm mb-4 border-0">
                                            <div className="card-header bg-light fw-bold text-dark">
                                                Hành khách số {index + 1}
                                            </div>
                                            <div className="card-body">
                                                {/* CHECKBOXES */}
                                                <div className="d-flex gap-4 mb-3">
                                                    <div className="form-check">
                                                        <Field type="checkbox" name={`passengers.${index}.hasInfant`} className="form-check-input" id={`infant-${index}`} />
                                                        <label className="form-check-label" htmlFor={`infant-${index}`}>Có kèm em bé (&lt;2 tuổi)</label>
                                                    </div>
                                                    <div className="form-check">
                                                        <Field
                                                            type="checkbox"
                                                            name={`passengers.${index}.isChild`}
                                                            className="form-check-input"
                                                            id={`child-${index}`}
                                                            // Khi tick trẻ em -> Clear CMND để tránh validate lỗi
                                                            onChange={(e) => {
                                                                setFieldValue(`passengers.${index}.isChild`, e.target.checked);
                                                                if(e.target.checked) setFieldValue(`passengers.${index}.identityCard`, "");
                                                            }}
                                                        />
                                                        <label className="form-check-label" htmlFor={`child-${index}`}>Là trẻ em đi kèm (2-12 tuổi)</label>
                                                    </div>
                                                </div>

                                                <div className="row g-3">
                                                    {/* HỌ TÊN */}
                                                    <div className="col-md-6">
                                                        <label className="form-label fw-bold">Họ và tên <span className="text-danger">*</span></label>
                                                        <Field name={`passengers.${index}.fullName`} className="form-control" placeholder="VD: NGUYEN VAN A" />
                                                        <ErrorMessage name={`passengers.${index}.fullName`} component="small" className="text-danger" />
                                                    </div>

                                                    {/* GIỚI TÍNH */}
                                                    <div className="col-md-6">
                                                        <label className="form-label fw-bold">Giới tính <span className="text-danger">*</span></label>
                                                        <Field as="select" name={`passengers.${index}.gender`} className="form-select">
                                                            <option value="Nam">Nam</option>
                                                            <option value="Nữ">Nữ</option>
                                                            <option value="Khác">Khác</option>
                                                        </Field>
                                                    </div>

                                                    {/* EMAIL */}
                                                    <div className="col-md-6">
                                                        <label className="form-label">Email</label>
                                                        <Field name={`passengers.${index}.email`} className="form-control" placeholder="example@mail.com" />
                                                        <ErrorMessage name={`passengers.${index}.email`} component="small" className="text-danger" />
                                                    </div>

                                                    {/* ĐIỆN THOẠI */}
                                                    <div className="col-md-6">
                                                        <label className="form-label">Điện thoại</label>
                                                        <Field name={`passengers.${index}.phone`} className="form-control" placeholder="+84xxxxxxxxx" />
                                                        <ErrorMessage name={`passengers.${index}.phone`} component="small" className="text-danger" />
                                                    </div>

                                                    {/* CMND/PASSPORT */}
                                                    <div className="col-12">
                                                        <label className="form-label fw-bold">
                                                            CMND - Passport {values.passengers[index].isChild ? "(Không bắt buộc)" : <span className="text-danger">*</span>}
                                                        </label>
                                                        <Field
                                                            name={`passengers.${index}.identityCard`}
                                                            className="form-control"
                                                            disabled={values.passengers[index].isChild} // Disable nếu là trẻ em
                                                            placeholder="Nhập số CMND/Passport"
                                                        />
                                                        <ErrorMessage name={`passengers.${index}.identityCard`} component="small" className="text-danger" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </FieldArray>

                        {/* ACTION BUTTONS */}
                        <div className="d-flex justify-content-between mt-4">
                            <button type="button" className="btn btn-secondary px-4" onClick={onBack}>
                                Chọn lại chuyến bay
                            </button>
                            <button type="submit" className="btn btn-primary px-5 fw-bold">
                                Đặt vé
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default PassengerForm;