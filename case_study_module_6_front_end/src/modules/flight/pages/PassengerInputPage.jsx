import React, { useState } from "react"; // 1. Import useState
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { createOnlineBooking } from "../service/bookingService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const PassengerInputPage = ({ bookingConfig, selectedOutbound, selectedInbound, onBack }) => {
    const navigate = useNavigate();

    // --- STATE MỚI: Quản lý Modal QR và Dữ liệu vé sau khi đặt thành công ---
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [bookingResponse, setBookingResponse] = useState(null);

    const initialValues = {
        passengers: Array.from({ length: bookingConfig.quantity }).map(() => ({
            fullName: "", gender: "Nam", email: "", phone: "", identityCard: "", isChild: false, hasInfant: false
        }))
    };

    const nameRegex = /^[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*(\s[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*)*$/;
    const idCardOrPassportRegex = /^(\d{12}|[A-Z]\d{7})$/;
    const phoneRegex = /^0\d{9}$/;

    const validationSchema = Yup.object().shape({
        passengers: Yup.array().of(
            Yup.object().shape({
                fullName: Yup.string()
                    .required("Họ tên là bắt buộc")
                    .min(2, "Tên phải từ 2 ký tự trở lên")
                    .max(50, "Tên không quá 50 ký tự")
                    .matches(nameRegex, "Tên phải in hoa chữ cái đầu, không chứa số/ký tự đặc biệt"),
                gender: Yup.string().required("Giới tính là bắt buộc"),
                identityCard: Yup.string().when("isChild", {
                    is: false,
                    then: () => Yup.string()
                        .required("Cần nhập CMND hoặc Passport cho người lớn")
                        .matches(idCardOrPassportRegex, "Định dạng sai: CCCD (12 số) hoặc Passport (1 chữ hoa + 7 số)"),
                    otherwise: () => Yup.string().nullable()
                }),
                email: Yup.string().email("Email sai định dạng").nullable(),
                phone: Yup.string().matches(phoneRegex, "SĐT phải có 10 chữ số và bắt đầu bằng số 0").nullable()
            })
        )
    });

    // --- SỬA LOGIC SUBMIT ---
    const handleSubmit = async (values) => {
        try {
            const payload = {
                flightId: selectedOutbound ? selectedOutbound.id : null,
                returnFlightId: selectedInbound ? selectedInbound.id : null,
                tripType: (selectedOutbound && selectedInbound) ? "ROUND_TRIP" : "ONE_WAY",
                seatClassOut: bookingConfig.seatClassOut,
                seatClassIn: bookingConfig.seatClassIn,
                contactName: values.passengers[0].fullName,
                contactEmail: values.passengers[0].email || "no-email@system.com",
                contactPhone: values.passengers[0].phone || "0000000000",
                paymentMethod: "CASH",
                passengers: values.passengers
            };

            const res = await createOnlineBooking(payload);

            // THAY ĐỔI: Không toast ngay, mà lưu response và mở Modal QR
            setBookingResponse(res);
            setShowPaymentModal(true);

        } catch (err) {
            console.error(err);
            toast.error("Lỗi đặt vé: " + (err.message || "Vui lòng thử lại"));
        }
    };

    // --- HÀM XỬ LÝ KHI BẤM XÁC NHẬN THANH TOÁN ---
    const handleConfirmPayment = () => {
        setShowPaymentModal(false); // Đóng modal ngay lập tức

        // Hiện thông báo thành công
        toast.success("ĐẶT VÉ THÀNH CÔNG! Mã vé: " + bookingResponse?.bookingCode, {
            autoClose: 2000 // Tự đóng toast sau 2s (khớp với thời gian chuyển trang)
        });

        // --- SỬA: Delay 2.5 giây để người dùng kịp đọc thông báo ---
        setTimeout(() => {
            // Cách 1: Reload lại trang hiện tại (Reset toàn bộ)
            window.location.reload();

            // Cách 2: Hoặc nếu bạn muốn chuyển về trang chủ thì dùng dòng dưới:
            // navigate("/");
        }, 2500);
    };

    return (
        <div className="container py-4 bg-white rounded shadow-sm mt-3" style={{maxWidth: '900px', position: 'relative'}}>
            <h4 className="text-center text-primary fw-bold mb-4">THÔNG TIN HÀNH KHÁCH</h4>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ values, setFieldValue }) => (
                    <Form>
                        <FieldArray name="passengers">
                            {() => values.passengers.map((p, i) => (
                                <div key={i} className="card mb-4 border-secondary shadow-sm">
                                    <div className="card-header fw-bold bg-light">Hành khách số {i + 1}</div>
                                    <div className="card-body">
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
                                                            setFieldValue(`passengers.${i}.hasInfant`, false);
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
                                                    disabled={p.isChild}
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
                                                <label className="form-label small fw-bold">CCCD/Passport {p.isChild ? '(Không bắt buộc)' : <span className="text-danger">*</span>}</label>
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

            {/* --- MODAL THANH TOÁN (QR CODE) --- */}
            {showPaymentModal && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                     style={{backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999}}>
                    <div className="bg-white p-4 rounded shadow-lg text-center" style={{maxWidth: '400px', width: '90%'}}>
                        <h4 className="text-success fw-bold mb-3">Thanh Toán Giữ Chỗ</h4>
                        <p className="text-muted small">Vui lòng quét mã bên dưới để thanh toán.</p>

                        {/* Ảnh QR Tạm thời */}
                        <div className="border p-2 d-inline-block mb-3 rounded">
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=BOOKING_${bookingResponse?.bookingCode}`}
                                alt="QR Code"
                                style={{width: '200px', height: '200px'}}
                            />
                        </div>

                        <div className="alert alert-info py-2 small">
                            Mã vé của bạn: <strong>{bookingResponse?.bookingCode}</strong>
                        </div>

                        <button
                            className="btn btn-success w-100 fw-bold py-2 mt-2"
                            onClick={handleConfirmPayment}
                        >
                            <i className="bi bi-check-circle-fill me-2"></i>
                            XÁC NHẬN ĐÃ THANH TOÁN
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PassengerInputPage;