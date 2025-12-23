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
    const [selectedAircraft, setSelectedAircraft] = useState(null);

    const [initialValues, setInitialValues] = useState({
        flightNumber: "", airlineId: "", aircraftId: "",
        departureAirportId: "", arrivalAirportId: "",
        departureTime: "", arrivalTime: "", status: "SCHEDULED",
        seats: {
            ECONOMY: { price: 0, totalSeats: 0 },
            BUSINESS: { price: 0, totalSeats: 0 },
            FIRST_CLASS: { price: 0, totalSeats: 0 }
        }
    });

    useEffect(() => {
        const initData = async () => {
            setAirports(await getAirports());
            setAirlines(await getAirlines());

            if (id) {
                try {
                    const data = await getFlightById(id);
                    // Load danh sách máy bay để hiển thị đúng tên (dù bị disable)
                    const acList = await getAircraftsByAirline(data.aircraft.airline.id);
                    setAircrafts(acList);

                    const currentAc = acList.find(a => a.id === data.aircraft.id);
                    setSelectedAircraft(currentAc);

                    const formatDateTimeLocal = (dateTimeString) => {
                        if (!dateTimeString) return "";
                        const d = new Date(dateTimeString);
                        return new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
                    };

                    const seatsMap = {
                        ECONOMY: { price: 0, totalSeats: 0 },
                        BUSINESS: { price: 0, totalSeats: 0 },
                        FIRST_CLASS: { price: 0, totalSeats: 0 }
                    };

                    if(data.seatDetails) {
                        data.seatDetails.forEach(sd => {
                            seatsMap[sd.seatClass] = { price: sd.price, totalSeats: sd.totalSeats };
                        });
                    }

                    setInitialValues({
                        flightNumber: data.flightNumber,
                        airlineId: data.aircraft.airline.id,
                        aircraftId: data.aircraft.id,
                        departureAirportId: data.departureAirport.id,
                        arrivalAirportId: data.arrivalAirport.id,
                        departureTime: formatDateTimeLocal(data.departureTime),
                        arrivalTime: formatDateTimeLocal(data.arrivalTime),
                        status: data.status,
                        seats: seatsMap
                    });
                } catch (error) {
                    toast.error("Không thể tải thông tin chuyến bay");
                    navigate("/flights");
                }
            }
        };
        initData();
    }, [id, navigate]);

    const handleAirlineChange = async (e, setFieldValue) => {
        const val = e.target.value;
        setFieldValue("airlineId", val);
        setFieldValue("aircraftId", "");
        setSelectedAircraft(null);
        setAircrafts(val ? await getAircraftsByAirline(val) : []);
    };

    const handleAircraftChange = (e, setFieldValue) => {
        const val = parseInt(e.target.value);
        setFieldValue("aircraftId", val);
        const ac = aircrafts.find(a => a.id === val);
        setSelectedAircraft(ac);
    };

    const handleSubmit = async (values) => {
        // Transform data
        const seatConfigs = [];
        if (values.seats.ECONOMY.totalSeats > 0) seatConfigs.push({ seatClass: 'ECONOMY', ...values.seats.ECONOMY });
        if (values.seats.BUSINESS.totalSeats > 0) seatConfigs.push({ seatClass: 'BUSINESS', ...values.seats.BUSINESS });
        if (values.seats.FIRST_CLASS.totalSeats > 0) seatConfigs.push({ seatClass: 'FIRST_CLASS', ...values.seats.FIRST_CLASS });

        // Nếu tạo mới thì bắt buộc phải có ghế. Nếu sửa thì không quan trọng vì backend không cập nhật ghế.
        if (!id && seatConfigs.length === 0) {
            toast.error("Phải cấu hình ít nhất một hạng ghế!");
            return;
        }

        const payload = { ...values, seatConfigs: seatConfigs };
        delete payload.seats;

        try {
            await saveFlight(payload, id);
            toast.success(id ? "Cập nhật giờ & trạng thái thành công" : "Tạo chuyến bay thành công");
            navigate("/flights");
        } catch (err) {
            toast.error(typeof err === 'string' ? err : "Lỗi hệ thống");
        }
    };

    const calculateAllocatedSeats = (values) => {
        return (values.seats.ECONOMY.totalSeats || 0) +
            (values.seats.BUSINESS.totalSeats || 0) +
            (values.seats.FIRST_CLASS.totalSeats || 0);
    };

    const validationSchema = Yup.object({
        flightNumber: Yup.string().required("Nhập số hiệu"),
        airlineId: Yup.string().required("Chọn hãng"),
        aircraftId: Yup.string().required("Chọn máy bay"),
        departureAirportId: Yup.string().required("Chọn nơi đi"),
        arrivalAirportId: Yup.string().required("Chọn nơi đến").notOneOf([Yup.ref('departureAirportId')], 'Trùng nơi đi'),

        departureTime: Yup.date().required("Chọn giờ đi")
            .min(new Date(Date.now() + 24 * 60 * 60 * 1000), "Giờ đi phải sau hiện tại ít nhất 24h"),
        arrivalTime: Yup.date().required("Chọn giờ đến")
            .min(Yup.ref('departureTime'), "Giờ đến phải sau giờ đi"),

        // Validate ghế (Chỉ quan trọng khi tạo mới, khi sửa UI đã disable)
        seats: Yup.object().shape({
            ECONOMY: Yup.object().shape({ price: Yup.number().min(0), totalSeats: Yup.number().min(0) }),
            BUSINESS: Yup.object().shape({ price: Yup.number().min(0), totalSeats: Yup.number().min(0) }),
            FIRST_CLASS: Yup.object().shape({ price: Yup.number().min(0), totalSeats: Yup.number().min(0) })
        })
    });

    return (
        <div className="container mt-4 mb-5">
            <h3 className="text-center text-primary mb-4">{id ? "Sửa Giờ & Trạng Thái" : "Tạo Chuyến Bay Mới"}</h3>
            <Formik enableReinitialize initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ setFieldValue, values }) => {
                    const allocated = calculateAllocatedSeats(values);
                    const maxCapacity = selectedAircraft ? selectedAircraft.totalSeats : 0;
                    const isOverCapacity = maxCapacity > 0 && allocated > maxCapacity;

                    return (
                        <Form className="card p-4 shadow-lg mx-auto bg-white border-0" style={{maxWidth: 900, borderRadius: '16px'}}>

                            {/* THÔNG TIN CƠ BẢN (DISABLED KHI SỬA) */}
                            <div className="row g-3 mb-4">
                                <h5 className="text-muted border-bottom pb-2"><i className="bi bi-airplane me-2"></i>Thông tin cơ bản</h5>
                                <div className="col-md-4">
                                    <label className="form-label fw-bold">Số hiệu chuyến bay</label>
                                    <Field name="flightNumber" className="form-control" disabled={!!id} placeholder="VD: VN123" />
                                    <ErrorMessage name="flightNumber" component="small" className="text-danger"/>
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label fw-bold">Hãng Hàng Không</label>
                                    <Field as="select" name="airlineId" className="form-select" disabled={!!id}
                                           onChange={(e) => handleAirlineChange(e, setFieldValue)}>
                                        <option value="">-- Chọn Hãng --</option>
                                        {airlines.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                    </Field>
                                    <ErrorMessage name="airlineId" component="small" className="text-danger"/>
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label fw-bold">Máy Bay</label>
                                    <Field as="select" name="aircraftId" className="form-select" disabled={!!id || !values.airlineId}
                                           onChange={(e) => handleAircraftChange(e, setFieldValue)}>
                                        <option value="">-- Chọn Máy Bay --</option>
                                        {aircrafts.map(ac => <option key={ac.id} value={ac.id}>{ac.name} ({ac.registrationCode})</option>)}
                                    </Field>
                                    <ErrorMessage name="aircraftId" component="small" className="text-danger"/>
                                    {selectedAircraft && (
                                        <small className="text-primary d-block mt-1">Sức chứa: <strong>{selectedAircraft.totalSeats} ghế</strong></small>
                                    )}
                                </div>
                            </div>

                            {/* LỊCH TRÌNH (SÂN BAY DISABLED KHI SỬA, GIỜ MỞ) */}
                            <div className="row g-3 mb-4">
                                <h5 className="text-muted border-bottom pb-2"><i className="bi bi-geo-alt me-2"></i>Lịch trình</h5>
                                <div className="col-md-6">
                                    <label className="form-label">Sân bay đi</label>
                                    <Field as="select" name="departureAirportId" className="form-select" disabled={!!id}>
                                        <option value="">-- Chọn --</option>
                                        {airports.map(ap => <option key={ap.id} value={ap.id}>{ap.city} ({ap.code}) - {ap.name}</option>)}
                                    </Field>
                                    <ErrorMessage name="departureAirportId" component="small" className="text-danger"/>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Sân bay đến</label>
                                    <Field as="select" name="arrivalAirportId" className="form-select" disabled={!!id}>
                                        <option value="">-- Chọn --</option>
                                        {airports.map(ap => <option key={ap.id} value={ap.id}>{ap.city} ({ap.code}) - {ap.name}</option>)}
                                    </Field>
                                    <ErrorMessage name="arrivalAirportId" component="small" className="text-danger"/>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold text-success">Giờ đi (Được sửa)</label>
                                    <Field name="departureTime" type="datetime-local" className="form-control border-success" />
                                    <ErrorMessage name="departureTime" component="small" className="text-danger"/>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold text-success">Giờ đến (Được sửa)</label>
                                    <Field name="arrivalTime" type="datetime-local" className="form-control border-success" />
                                    <ErrorMessage name="arrivalTime" component="small" className="text-danger"/>
                                </div>
                            </div>

                            {/* CẤU HÌNH GHẾ (DISABLED TOÀN BỘ KHI SỬA) */}
                            <div className="mb-4">
                                <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                                    <h5 className="text-muted mb-0"><i className="bi bi-cash-coin me-2"></i>Cấu hình Hạng Ghế & Giá</h5>
                                    {id && <span className="badge bg-secondary">Không được sửa</span>}
                                </div>

                                {/* HEADER ROW */}
                                <div className="row g-2 mb-2 fw-bold text-secondary small text-center">
                                    <div className="col-3 text-start ps-4">Hạng ghế</div>
                                    <div className="col-4">Giá vé (VNĐ)</div>
                                    <div className="col-4">Số lượng ghế</div>
                                </div>

                                {/* ECONOMY ROW */}
                                <div className="row g-2 align-items-center mb-3 p-2 rounded bg-light border">
                                    <div className="col-3 fw-bold text-primary ps-3">ECONOMY</div>
                                    <div className="col-4">
                                        <div className="input-group input-group-sm">
                                            <Field name="seats.ECONOMY.price" type="number" className="form-control" disabled={!!id} placeholder="0" />
                                            <span className="input-group-text">đ</span>
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <Field name="seats.ECONOMY.totalSeats" type="number" className="form-control form-control-sm" disabled={!!id} placeholder="0" />
                                    </div>
                                </div>

                                {/* BUSINESS ROW */}
                                <div className="row g-2 align-items-center mb-3 p-2 rounded bg-light border">
                                    <div className="col-3 fw-bold text-warning ps-3">BUSINESS</div>
                                    <div className="col-4">
                                        <div className="input-group input-group-sm">
                                            <Field name="seats.BUSINESS.price" type="number" className="form-control" disabled={!!id} placeholder="0" />
                                            <span className="input-group-text">đ</span>
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <Field name="seats.BUSINESS.totalSeats" type="number" className="form-control form-control-sm" disabled={!!id} placeholder="0" />
                                    </div>
                                </div>

                                {/* FIRST CLASS ROW */}
                                <div className="row g-2 align-items-center mb-2 p-2 rounded bg-light border">
                                    <div className="col-3 fw-bold text-danger ps-3">FIRST CLASS</div>
                                    <div className="col-4">
                                        <div className="input-group input-group-sm">
                                            <Field name="seats.FIRST_CLASS.price" type="number" className="form-control" disabled={!!id} placeholder="0" />
                                            <span className="input-group-text">đ</span>
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <Field name="seats.FIRST_CLASS.totalSeats" type="number" className="form-control form-control-sm" disabled={!!id} placeholder="0" />
                                    </div>
                                </div>

                                {!id && isOverCapacity && (
                                    <div className="alert alert-danger mt-2 py-2 small">
                                        Tổng số ghế ({allocated}) vượt quá sức chứa ({maxCapacity}).
                                    </div>
                                )}
                            </div>

                            {/* TRẠNG THÁI (CHỈ HIỆN KHI SỬA) */}
                            {id && (
                                <div className="mb-4 bg-light p-3 rounded border">
                                    <label className="form-label fw-bold text-primary">Trạng thái chuyến bay (Được sửa)</label>
                                    <Field as="select" name="status" className="form-select border-primary">
                                        <option value="SCHEDULED">SCHEDULED (Theo lịch)</option>
                                        <option value="DELAYED">DELAYED (Hoãn)</option>
                                        <option value="IN_FLIGHT">IN_FLIGHT (Đang bay)</option>
                                        <option value="COMPLETED">COMPLETED (Đã hạ cánh)</option>
                                        <option value="CANCELLED">CANCELLED (Đã hủy)</option>
                                    </Field>
                                </div>
                            )}

                            <div className="d-flex justify-content-center gap-3 mt-3">
                                <button type="button" className="btn btn-light border px-4" onClick={() => navigate("/flights")}>Hủy bỏ</button>
                                <button type="submit" className="btn btn-primary px-5 fw-bold shadow" disabled={!id && isOverCapacity}>
                                    {id ? "Lưu Thay Đổi" : "Tạo Chuyến Bay"}
                                </button>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
};

export default FlightForm;