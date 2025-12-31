import React from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { createOnlineBooking } from "../service/bookingService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const PassengerInputPage = ({ bookingConfig, selectedOutbound, selectedInbound, onBack }) => {
    const navigate = useNavigate();

    const initialValues = {
        passengers: Array.from({ length: bookingConfig.quantity }).map(() => ({
            fullName: "", gender: "Nam", email: "", phone: "", identityCard: "", isChild: false, hasInfant: false
        }))
    };

    const validationSchema = Yup.object().shape({
        passengers: Yup.array().of(
            Yup.object().shape({
                fullName: Yup.string().min(5, "Tên quá ngắn").required("Họ tên là bắt buộc"),
                gender: Yup.string().required("Bắt buộc"),
                // Validate CMND nếu KHÔNG phải trẻ em
                identityCard: Yup.string().when("isChild", {
                    is: false,
                    then: () => Yup.string().required("Bắt buộc với người lớn"),
                    otherwise: () => Yup.string().nullable()
                }),
                email: Yup.string().email("Email sai định dạng").nullable(),
                phone: Yup.string().matches(/^\+84\d{9,11}$/, "SĐT không hợp lệ").nullable()
            })
        )
    });

    const handleSubmit = async (values) => {
        try {
            // Chuẩn bị payload
            const payload = {
                flightId: selectedOutbound ? selectedOutbound.id : null,
                returnFlightId: selectedInbound ? selectedInbound.id : null,
                tripType: (selectedOutbound && selectedInbound) ? "ROUND_TRIP" : "ONE_WAY",

                seatClassOut: bookingConfig.seatClassOut,
                seatClassIn: bookingConfig.seatClassIn,

                contactName: values.passengers[0].fullName,
                contactEmail: values.passengers[0].email || "no-email@system.com",
                contactPhone: values.passengers[0].phone || "0000000000",

                // Sửa lỗi 9.2: Dùng giá trị String chuẩn cho Enum
                // Đảm bảo Backend Enum PaymentMethod có giá trị 'CASH' hoặc 'BANK_TRANSFER'
                paymentMethod: "CASH",

                passengers: values.passengers
            };

            const res = await createOnlineBooking(payload);
            toast.success("ĐẶT VÉ THÀNH CÔNG! Mã vé: " + res.bookingCode);
            // navigate("/");
        } catch (err) {
            console.error(err);
            toast.error("Lỗi đặt vé: " + (err.message || "Vui lòng thử lại"));
        }
    };

    return (
        <div className="container py-4 bg-white rounded shadow-sm mt-3" style={{maxWidth: '900px'}}>
            <h4 className="text-center text-primary fw-bold mb-4">THÔNG TIN HÀNH KHÁCH</h4>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ values, setFieldValue }) => (
                    <Form>
                        <FieldArray name="passengers">
                            {() => values.passengers.map((p, i) => (
                                <div key={i} className="card mb-4 border-secondary shadow-sm">
                                    <div className="card-header fw-bold bg-light">Hành khách số {i + 1}</div>
                                    <div className="card-body">

                                        {/* Sửa lỗi 9.1: Logic Checkbox loại trừ nhau */}
                                        <div className="d-flex gap-4 mb-3 border-bottom pb-2">
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id={`child-${i}`}
                                                    checked={p.isChild}
                                                    onChange={(e) => {
                                                        const checked = e.target.checked;
                                                        setFieldValue(`passengers.${i}.isChild`, checked);
                                                        if(checked) {
                                                            // Nếu là trẻ em -> Bỏ chọn "Kèm em bé"
                                                            setFieldValue(`passengers.${i}.hasInfant`, false);
                                                            // Clear CMND
                                                            setFieldValue(`passengers.${i}.identityCard`, "");
                                                        }
                                                    }}
                                                />
                                                <label className="form-check-label" htmlFor={`child-${i}`}>Là trẻ em đi kèm (2-12T)</label>
                                            </div>

                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id={`infant-${i}`}
                                                    checked={p.hasInfant}
                                                    disabled={p.isChild} // Nếu là trẻ em thì ko được chọn kèm em bé
                                                    onChange={(e) => setFieldValue(`passengers.${i}.hasInfant`, e.target.checked)}
                                                />
                                                <label className="form-check-label" htmlFor={`infant-${i}`}>Có kèm em bé (&lt;2T)</label>
                                            </div>
                                        </div>

                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold">Họ và tên <span className="text-danger">*</span></label>
                                                <Field name={`passengers.${i}.fullName`} className="form-control" />
                                                <ErrorMessage name={`passengers.${i}.fullName`} component="small" className="text-danger" />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold">Giới tính <span className="text-danger">*</span></label>
                                                <Field as="select" name={`passengers.${i}.gender`} className="form-select">
                                                    <option value="Nam">Nam</option><option value="Nữ">Nữ</option><option value="Khác">Khác</option>
                                                </Field>
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label small">Điện thoại</label>
                                                <Field name={`passengers.${i}.phone`} className="form-control" />
                                                <ErrorMessage name={`passengers.${i}.phone`} component="small" className="text-danger" />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label small">Email</label>
                                                <Field name={`passengers.${i}.email`} className="form-control" />
                                                <ErrorMessage name={`passengers.${i}.email`} component="small" className="text-danger" />
                                            </div>
                                            <div className="col-12">
                                                <label className="form-label small fw-bold">CMND/Passport {p.isChild ? '(Không bắt buộc)' : <span className="text-danger">*</span>}</label>
                                                <Field name={`passengers.${i}.identityCard`} className="form-control" disabled={p.isChild} />
                                                <ErrorMessage name={`passengers.${i}.identityCard`} component="small" className="text-danger" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </FieldArray>
                        <div className="d-flex justify-content-between mt-4 mb-5">
                            <button type="button" className="btn btn-secondary px-4" onClick={onBack}>Quay lại</button>
                            <button type="submit" className="btn btn-primary fw-bold px-5">HOÀN TẤT ĐẶT VÉ</button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default PassengerInputPage;