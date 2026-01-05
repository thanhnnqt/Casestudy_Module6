import React, { useState, useMemo } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { createOnlineBooking, createPaymentUrl } from "../service/bookingService"; // Import thêm createPaymentUrl
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


const PassengerInputPage = ({
                                bookingConfig,
                                selectedOutbound,
                                selectedInbound,
                                onBack
                            }) => {
    const navigate = useNavigate();
    const [paying, setPaying] = useState(false);

    /* ================= INITIAL VALUES ================= */
    const initialValues = {
        passengers: Array.from({ length: bookingConfig.quantity }).map(() => ({
            fullName: "",
            gender: "Nam",
            email: "",
            phone: "",
            identityCard: "",
            isChild: false,
            hasInfant: false
        }))
    };

    /* ================= VALIDATION ================= */

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

    /* ================= PRICE CALCULATION ================= */
    const getSeatPrice = (flight, seatClass) => {
        if (!flight || !flight.seatDetails) return 0;
        const seat = flight.seatDetails.find(
            (s) => s.seatClass === seatClass
        );
        return seat ? seat.price : 0;
    };

    const totalAmount = useMemo(() => {
        const seatPriceOut = getSeatPrice(
            selectedOutbound,
            bookingConfig.seatClassOut
        );

        const seatPriceIn = selectedInbound
            ? getSeatPrice(
                selectedInbound,
                bookingConfig.seatClassIn
            )
            : 0;

        return (seatPriceOut + seatPriceIn) * bookingConfig.quantity;
    }, [selectedOutbound, selectedInbound, bookingConfig]);

    /* ================= SUBMIT (VNPAY) ================= */
    /* ================= SUBMIT (VNPAY) ================= */
    const handleSubmit = async (values) => {
        if (totalAmount <= 0) {
            toast.error("Tổng tiền không hợp lệ");
            return;
        }
        try {
            setPaying(true);
            // 1. Tạo Booking trước (Giữ nguyên payload cũ của bạn)
            const payload = {
                flightId: selectedOutbound?.id || null,
                returnFlightId: selectedInbound?.id || null,
                tripType: selectedOutbound && selectedInbound ? "ROUND_TRIP" : "ONE_WAY",
                seatClassOut: bookingConfig.seatClassOut,
                seatClassIn: bookingConfig.seatClassIn,
                contactName: values.passengers[0].fullName,
                contactEmail: values.passengers[0].email || "no-email@system.com",
                contactPhone: values.passengers[0].phone || "0000000000",
                paymentMethod: "VNPAY",
                totalAmount: totalAmount,
                passengers: values.passengers
            };
            const bookingRes = await createOnlineBooking(payload);
            // 2. [MỚI] Có Booking ID -> Gọi tiếp API lấy link thanh toán
            if (bookingRes && bookingRes.bookingCode) {
                const paymentRes = await createPaymentUrl(bookingRes.totalAmount, bookingRes.bookingCode);

                if (paymentRes.url) {
                    // 👉 Redirect sang VNPay
                    window.location.href = paymentRes.url;
                } else {
                    throw new Error("Không lấy được link thanh toán");
                }
            } else {
                throw new Error("Lỗi khi tạo Booking");
            }
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Đã có lỗi xảy ra");
            setPaying(false);
        }
    };

    /* ================= RENDER ================= */
    return (
        <div
            className="container py-4 bg-white rounded shadow-sm mt-3"
            style={{ maxWidth: "900px" }}
        >
            <h4 className="text-center text-primary fw-bold mb-4">
                THÔNG TIN HÀNH KHÁCH
            </h4>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, setFieldValue }) => (
                    <Form>
                        <FieldArray name="passengers">
                            {() =>
                                values.passengers.map((p, i) => (
                                    <div
                                        key={i}
                                        className="card mb-4 border-secondary shadow-sm"
                                    >
                                        <div className="card-header fw-bold bg-light">
                                            Hành khách số {i + 1}
                                        </div>

                                        <div className="card-body">
                                            {/* CHECKBOX */}
                                            <div className="d-flex gap-4 mb-3 border-bottom pb-2">
                                                <div className="form-check">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        id={`child-${i}`}
                                                        checked={p.isChild}
                                                        onChange={(e) => {
                                                            const checked =
                                                                e.target.checked;
                                                            setFieldValue(
                                                                `passengers.${i}.isChild`,
                                                                checked
                                                            );
                                                            if (checked) {
                                                                setFieldValue(
                                                                    `passengers.${i}.hasInfant`,
                                                                    false
                                                                );
                                                                setFieldValue(
                                                                    `passengers.${i}.identityCard`,
                                                                    ""
                                                                );
                                                            }
                                                        }}
                                                    />
                                                    <label
                                                        className="form-check-label"
                                                        htmlFor={`child-${i}`}
                                                    >
                                                        Là trẻ em đi kèm
                                                        (2–12T)
                                                    </label>
                                                </div>

                                                <div className="form-check">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        id={`infant-${i}`}
                                                        checked={p.hasInfant}
                                                        disabled={p.isChild}
                                                        onChange={(e) =>
                                                            setFieldValue(
                                                                `passengers.${i}.hasInfant`,
                                                                e.target.checked
                                                            )
                                                        }
                                                    />
                                                    <label
                                                        className="form-check-label"
                                                        htmlFor={`infant-${i}`}
                                                    >
                                                        Có kèm em bé (&lt;2T)
                                                    </label>
                                                </div>
                                            </div>

                                            {/* FORM */}
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <label className="form-label small fw-bold">
                                                        Họ và tên{" "}
                                                        <span className="text-danger">
                                                            *
                                                        </span>
                                                    </label>
                                                    <Field
                                                        name={`passengers.${i}.fullName`}
                                                        className="form-control"
                                                    />
                                                    <ErrorMessage
                                                        name={`passengers.${i}.fullName`}
                                                        component="small"
                                                        className="text-danger"
                                                    />
                                                </div>

                                                <div className="col-md-6">
                                                    <label className="form-label small fw-bold">
                                                        Giới tính{" "}
                                                        <span className="text-danger">
                                                            *
                                                        </span>
                                                    </label>
                                                    <Field
                                                        as="select"
                                                        name={`passengers.${i}.gender`}
                                                        className="form-select"
                                                    >
                                                        <option value="Nam">
                                                            Nam
                                                        </option>
                                                        <option value="Nữ">
                                                            Nữ
                                                        </option>
                                                        <option value="Khác">
                                                            Khác
                                                        </option>
                                                    </Field>
                                                </div>

                                                <div className="col-md-6">
                                                    <label className="form-label small">
                                                        Điện thoại
                                                    </label>
                                                    <Field
                                                        name={`passengers.${i}.phone`}
                                                        className="form-control"
                                                    />
                                                    <ErrorMessage
                                                        name={`passengers.${i}.phone`}
                                                        component="small"
                                                        className="text-danger"
                                                    />
                                                </div>

                                                <div className="col-md-6">
                                                    <label className="form-label small">
                                                        Email
                                                    </label>
                                                    <Field
                                                        name={`passengers.${i}.email`}
                                                        className="form-control"
                                                    />
                                                    <ErrorMessage
                                                        name={`passengers.${i}.email`}
                                                        component="small"
                                                        className="text-danger"
                                                    />
                                                </div>

                                                <div className="col-12">
                                                    <label className="form-label small fw-bold">
                                                        CMND/Passport{" "}
                                                        {p.isChild ? (
                                                            "(Không bắt buộc)"
                                                        ) : (
                                                            <span className="text-danger">
                                                                *
                                                            </span>
                                                        )}
                                                    </label>
                                                    <Field
                                                        name={`passengers.${i}.identityCard`}
                                                        className="form-control"
                                                        disabled={p.isChild}
                                                    />
                                                    <ErrorMessage
                                                        name={`passengers.${i}.identityCard`}
                                                        component="small"
                                                        className="text-danger"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </FieldArray>

                        {/* TOTAL + BUTTON */}
                        <div className="d-flex justify-content-between align-items-center mt-4 mb-5">
                            <button
                                type="button"
                                className="btn btn-secondary px-4"
                                onClick={onBack}
                                disabled={paying}
                            >
                                Quay lại
                            </button>

                            <div className="text-end">
                                <div className="fw-bold text-danger mb-2 fs-5">
                                    Tổng tiền:{" "}
                                    {totalAmount.toLocaleString()} VNĐ
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-success fw-bold px-5"
                                    disabled={paying}
                                >
                                    {paying
                                        ? "ĐANG CHUYỂN SANG VNPay..."
                                        : "THANH TOÁN VNPay"}
                                </button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default PassengerInputPage;
