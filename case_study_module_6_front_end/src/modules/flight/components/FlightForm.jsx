import React, { useEffect, useState } from "react";
import { getFlightById, saveFlight } from "../service/flightService";
import { getAirports, getAirlines, getAircraftsByAirline } from "../service/masterDataService";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const FlightForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [airports, setAirports] = useState([]);
    const [airlines, setAirlines] = useState([]);
    const [aircrafts, setAircrafts] = useState([]);

    const [initialValues, setInitialValues] = useState({
        flightNumber: "", airlineId: "", aircraftId: "",
        departureAirportId: "", arrivalAirportId: "",
        departureTime: "", arrivalTime: "", basePrice: "", status: "SCHEDULED"
    });


    useEffect(() => {
        const initData = async () => {
            setAirports(await getAirports());
            setAirlines(await getAirlines());
            if (id) {
                const data = await getFlightById(id);
                const acList = await getAircraftsByAirline(data.aircraft.airline.id);
                setAircrafts(acList);

                // Helper function để chuyển đổi datetime sang định dạng datetime-local
                const formatDateTimeLocal = (dateTimeString) => {
                    if (!dateTimeString) return "";
                    const date = new Date(dateTimeString);
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    const hours = String(date.getHours()).padStart(2, '0');
                    const minutes = String(date.getMinutes()).padStart(2, '0');
                    return `${year}-${month}-${day}T${hours}:${minutes}`;
                };

                setInitialValues({
                    flightNumber: data.flightNumber,
                    airlineId: data.aircraft.airline.id,
                    aircraftId: data.aircraft.id,
                    departureAirportId: data.departureAirport.id,
                    arrivalAirportId: data.arrivalAirport.id,
                    departureTime: formatDateTimeLocal(data.departureTime),
                    arrivalTime: formatDateTimeLocal(data.arrivalTime),
                    basePrice: data.basePrice,
                    status: data.status
                });
            }
        };
        initData();
    }, [id]);

    const handleAirlineChange = async (e, setFieldValue) => {
        const val = e.target.value;
        setFieldValue("airlineId", val);
        setFieldValue("aircraftId", "");
        setAircrafts(val ? await getAircraftsByAirline(val) : []);
    };

    const handleSubmit = async (values) => {
        try {
            await saveFlight(values, id);
            toast.success(id ? "Cập nhật thành công" : "Tạo thành công");
            navigate("/flights");
        } catch (err) {
            toast.error(typeof err === 'string' ? err : "Lỗi hệ thống");
        }
    };

    // LOGIC VALIDATION
    const validationSchema = Yup.object({
        departureTime: Yup.date()
            .required("Chọn giờ đi")
            .min(new Date(Date.now() + 24 * 60 * 60 * 1000), "Giờ đi phải sau hiện tại ít nhất 24h"),
        arrivalTime: Yup.date()
            .required("Chọn giờ đến")
            .min(Yup.ref('departureTime'), "Giờ đến phải sau giờ đi"),

        // Nếu là thêm mới (!id) thì bắt buộc nhập giá. Nếu sửa (id) thì không cần check.
        basePrice: id ? Yup.number() : Yup.number().required("Nhập giá").min(0),

        flightNumber: Yup.string().required("Nhập số hiệu"),
        airlineId: Yup.string().required("Chọn hãng"),
        aircraftId: Yup.string().required("Chọn máy bay"),
        departureAirportId: Yup.string().required("Chọn nơi đi"),
        arrivalAirportId: Yup.string().required("Chọn nơi đến")
            .notOneOf([Yup.ref('departureAirportId')], 'Nơi đến trùng nơi đi')
    });

    return (
        <div className="container mt-4">
            <h3 className="text-center text-primary">{id ? "Sửa Giờ Bay (Admin)" : "Tạo Chuyến Bay"}</h3>
            <Formik enableReinitialize initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ setFieldValue, values }) => (
                    <Form className="card p-4 shadow-sm mx-auto bg-white" style={{maxWidth: 800}}>

                        <div className="row mb-3">

                            <div className="alert alert-info py-2">
                                {id ? "Chế độ Sửa: Chỉ được thay đổi thời gian và trạng thái." : "Chế độ Tạo mới: Vui lòng nhập đầy đủ thông tin."}
                            </div>


                            <div className="col-md-4">
                                <label className="form-label">Số hiệu</label>
                                <Field name="flightNumber" className="form-control" disabled={!!id} />
                                <ErrorMessage name="flightNumber" component="small" className="text-danger"/>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Hãng</label>
                                <Field as="select" name="airlineId" className="form-select" disabled={!!id}
                                       onChange={(e) => handleAirlineChange(e, setFieldValue)}>
                                    <option value="">-- Chọn Hãng --</option>
                                    {airlines.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                </Field>
                                <ErrorMessage name="airlineId" component="small" className="text-danger"/>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Máy Bay</label>
                                <Field as="select" name="aircraftId" className="form-select" disabled={!!id || !values.airlineId}>
                                    <option value="">-- Chọn Máy Bay --</option>
                                    {aircrafts.map(ac => <option key={ac.id} value={ac.id}>{ac.name} ({ac.registrationCode})</option>)}
                                </Field>
                                <ErrorMessage name="aircraftId" component="small" className="text-danger"/>
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Nơi đi</label>
                                <Field as="select" name="departureAirportId" className="form-select" disabled={!!id}>
                                    <option value="">-- Chọn nơi đi --</option>
                                    {airports.map(ap => <option key={ap.id} value={ap.id}>{ap.city} ({ap.code})</option>)}
                                </Field>
                                <ErrorMessage name="departureAirportId" component="small" className="text-danger"/>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Nơi đến</label>
                                <Field as="select" name="arrivalAirportId" className="form-select" disabled={!!id}>
                                    <option value="">-- Chọn nơi đến --</option>
                                    {airports.map(ap => <option key={ap.id} value={ap.id}>{ap.city} ({ap.code})</option>)}
                                </Field>
                                <ErrorMessage name="arrivalAirportId" component="small" className="text-danger"/>
                            </div>
                        </div>

                        {/* KHI SỬA: KHÔNG HIỆN Ô GIÁ HOẶC DISABLE */}
                        {!id && (
                            <div className="mb-3">
                                <label className="form-label">Giá vé</label>
                                <Field name="basePrice" type="number" className="form-control" />
                                <ErrorMessage name="basePrice" component="small" className="text-danger"/>
                            </div>
                        )}



                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Giờ khởi hành</label>
                                <Field name="departureTime" type="datetime-local" className="form-control" />
                                <ErrorMessage name="departureTime" component="small" className="text-danger"/>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Giờ hạ cánh</label>
                                <Field name="arrivalTime" type="datetime-local" className="form-control" />
                                <ErrorMessage name="arrivalTime" component="small" className="text-danger"/>
                            </div>
                        </div>

                        {id && (
                            <div className="mb-3">
                                <label className="form-label fw-bold">Trạng thái</label>
                                <Field as="select" name="status" className="form-select">
                                    <option value="SCHEDULED">SCHEDULED</option>
                                    <option value="DELAYED">DELAYED</option>
                                    <option value="IN_FLIGHT">IN_FLIGHT</option>
                                    <option value="COMPLETED">COMPLETED</option>
                                    <option value="CANCELLED">CANCELLED</option>
                                </Field>
                            </div>
                        )}

                        <div className="text-center mt-3">
                            <button type="button" className="btn btn-secondary me-2" onClick={() => navigate("/flights")}>Quay lại</button>
                            <button type="submit" className="btn btn-primary">{id ? "Lưu Thay Đổi" : "Tạo Mới"}</button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};
export default FlightForm;