import React, { useEffect, useState } from "react";
import { addNewFlight, getFlightById, updateFlight } from "../service/flightService"; // Đổi tên hàm
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";

const FlightForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [flight, setFlight] = useState({
        flightCode: "",
        airline: "",
        origin: "",
        destination: "",
        departureTime: "",
        arrivalTime: "",
        price: "",
        status: "SCHEDULED" // Default
    });

    useEffect(() => {
        const loadData = async () => {
            if (id) {
                const data = await getFlightById(id);
                if (data) {
                    setFlight(data);
                }
            }
        }
        loadData();
    }, [id]);

    const handleSubmit = async (values) => {
        const payload = { ...values, price: parseFloat(values.price) };
        let isSuccess = false;

        if (id) {
            // Logic sửa: Gửi cả Time + Status
            isSuccess = await updateFlight(id, {
                departureTime: values.departureTime,
                arrivalTime: values.arrivalTime,
                status: values.status
            });
        } else {
            isSuccess = await addNewFlight(payload);
        }

        if (isSuccess) {
            toast.success(id ? "Cập nhật thành công" : "Thêm mới thành công");
            navigate("/flights");
        } else {
            toast.error("Đã có lỗi xảy ra");
        }
    }

    const validation = Yup.object({
        flightCode: Yup.string().required("Mã chuyến bay không được để trống"),
        airline: Yup.string().required("Vui lòng chọn hãng hàng không"),
        origin: Yup.string().required("Nơi đi không được để trống"),
        destination: Yup.string().required("Nơi đến không được để trống")
            .notOneOf([Yup.ref('origin')], 'Nơi đến không được trùng nơi đi'),
        departureTime: Yup.date().required("Chọn giờ khởi hành"),
        arrivalTime: Yup.date().required("Chọn giờ hạ cánh")
            .min(Yup.ref('departureTime'), "Giờ hạ cánh phải sau giờ khởi hành"),
        price: Yup.number().required("Nhập giá vé").min(0, "Giá vé không được âm"),
        status: Yup.string().required("Trạng thái không được để trống") // Validate status
    });

    const AIRLINES = [
        "PACIFIC AIRLINES", "BAMBOO AIRWAYS", "JEJU AIR", "VIETJET AIR",
        "VIETNAM AIRLINES", "AIR ASIA", "SINGAPORE AIRLINES"
    ];

    const STATUSES = [
        { value: "SCHEDULED", label: "Sắp bay (Scheduled)" },
        { value: "DELAYED", label: "Hoãn (Delayed)" },
        { value: "IN_FLIGHT", label: "Đang bay (In Flight)" },
        { value: "COMPLETED", label: "Hoàn thành (Completed)" },
        { value: "CANCELLED", label: "Đã hủy (Cancelled)" }
    ];

    return (
        <div className="container mt-4">
            <h2 className="text-center text-primary">{id ? "Chỉnh Sửa Chuyến Bay" : "Thêm Mới Chuyến Bay"}</h2>

            <Formik
                enableReinitialize={true}
                initialValues={flight}
                validationSchema={validation}
                onSubmit={handleSubmit}
            >
                {({ values }) => (
                    <Form className="w-100 mx-auto border p-4 rounded shadow bg-white">
                        {!id && (
                            <>
                                <div className="mb-3">
                                    <label className="form-label">Mã chuyến bay</label>
                                    <Field type="text" name="flightCode" className="form-control" />
                                    <ErrorMessage name="flightCode" component="small" className="text-danger" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Hãng hàng không</label>
                                    <Field as="select" name="airline" className="form-select">
                                        <option value="">-- Chọn hãng --</option>
                                        {AIRLINES.map(airline => <option key={airline} value={airline}>{airline}</option>)}
                                    </Field>
                                    <ErrorMessage name="airline" component="small" className="text-danger" />
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Nơi đi</label>
                                        <Field type="text" name="origin" className="form-control" />
                                        <ErrorMessage name="origin" component="small" className="text-danger" />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Nơi đến</label>
                                        <Field type="text" name="destination" className="form-control" />
                                        <ErrorMessage name="destination" component="small" className="text-danger" />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Giá vé</label>
                                    <Field type="number" name="price" className="form-control" />
                                    <ErrorMessage name="price" component="small" className="text-danger" />
                                </div>
                            </>
                        )}

                        {/* Chỉ hiện chỉnh sửa Trạng thái khi ở chế độ Edit (có id) */}
                        {id && (
                            <div className="mb-3">
                                <label className="form-label fw-bold text-danger">Trạng thái (Admin)</label>
                                <Field as="select" name="status" className="form-select">
                                    {STATUSES.map(st => (
                                        <option key={st.value} value={st.value}>{st.label}</option>
                                    ))}
                                </Field>
                            </div>
                        )}

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Giờ khởi hành</label>
                                <Field type="datetime-local" name="departureTime" className="form-control" />
                                <ErrorMessage name="departureTime" component="small" className="text-danger" />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Giờ hạ cánh</label>
                                <Field type="datetime-local" name="arrivalTime" className="form-control" />
                                <ErrorMessage name="arrivalTime" component="small" className="text-danger" />
                            </div>
                        </div>

                        <div className="text-center mt-3">
                            <button type="submit" className="btn btn-success px-4">
                                {id ? "Lưu thay đổi" : "Tạo chuyến bay"}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default FlightForm;