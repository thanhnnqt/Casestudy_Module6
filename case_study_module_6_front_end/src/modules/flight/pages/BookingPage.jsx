import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getAllFlights } from "../service/flightService";
import { getAirports } from "../service/masterDataService";
import BookingDetailModal from "./BookingDetailModal";
import PassengerInputPage from "./PassengerInputPage";
import { toast } from "react-toastify";
import "./FlightBooking.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const BookingPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const location = useLocation();
    const [step, setStep] = useState(1);

    // --- MỚI: Hàm lấy ngày hiện tại (YYYY-MM-DD) để làm mốc so sánh ---
    const getTodayStr = () => {
        // Lưu ý: toISOString lấy giờ UTC. Nếu muốn chính xác giờ Việt Nam nên dùng logic khác.
        // Ở đây dùng new Date() cơ bản để đơn giản hóa.
        return new Date().toISOString().split('T')[0];
    };

    const [searchParams, setSearchParams] = useState({
        origin: "SGN",
        destination: "HAN",
        date: "2026-01-10",
        returnDate: "2026-01-11",
        tripType: "ROUND_TRIP"
    });

    const [outboundFlights, setOutboundFlights] = useState([]);
    const [inboundFlights, setInboundFlights] = useState([]);
    const [minPricesOut, setMinPricesOut] = useState({});
    const [minPricesIn, setMinPricesIn] = useState({});

    const [selectedOutbound, setSelectedOutbound] = useState(null);
    const [selectedInbound, setSelectedInbound] = useState(null);
    const [bookingConfig, setBookingConfig] = useState(null);
    const [airports, setAirports] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: 'price', direction: 'asc' });

    const getRangeDates = (centerDateStr) => {
        const center = new Date(centerDateStr);
        const start = new Date(center); start.setDate(center.getDate() - 2);
        const end = new Date(center); end.setDate(center.getDate() + 2);
        return { startStr: start.toISOString().split('T')[0], endStr: end.toISOString().split('T')[0] };
    };

    const filterAvailableFlights = (flights) => {
        if (!flights || flights.length === 0) return [];
        return flights.filter(f => {
            const hasSeats = f.seatDetails && f.seatDetails.some(s => s.availableSeats > 0);
            return hasSeats && f.status === "SCHEDULED";
        });
    };

    const handleSearch = async (targetDateOut, targetDateIn) => {
        setStep(1);
        const dateOut = targetDateOut || searchParams.date;
        const dateIn = targetDateIn || searchParams.returnDate;

        if (!targetDateOut) setSelectedOutbound(null);
        if (!targetDateIn) setSelectedInbound(null);

        const rangeOut = getRangeDates(dateOut);
        try {
            // 1. TÌM CHIỀU ĐI
            const resOut = await getAllFlights({
                origin: searchParams.origin,
                destination: searchParams.destination,
                startDate: rangeOut.startStr,
                endDate: rangeOut.endStr,
                size: 500
            });
            const allFlightsOut = filterAvailableFlights(resOut.content || []);

            const priceMapOut = {};
            allFlightsOut.forEach(f => {
                const d = f.departureTime.split('T')[0];
                const minP = Math.min(...f.seatDetails.map(s => s.price));
                if (!priceMapOut[d] || minP < priceMapOut[d]) priceMapOut[d] = minP;
            });
            setMinPricesOut(priceMapOut);

            let displayOut = allFlightsOut.filter(f => f.departureTime.startsWith(dateOut));
            sortFlights(displayOut);
            setOutboundFlights(displayOut);

            // 2. TÌM CHIỀU VỀ
            if (searchParams.tripType === "ROUND_TRIP" && dateIn) {
                const rangeIn = getRangeDates(dateIn);
                const resIn = await getAllFlights({
                    origin: searchParams.destination,
                    destination: searchParams.origin,
                    startDate: rangeIn.startStr,
                    endDate: rangeIn.endStr,
                    size: 500
                });
                const allFlightsIn = filterAvailableFlights(resIn.content || []);

                const priceMapIn = {};
                allFlightsIn.forEach(f => {
                    const d = f.departureTime.split('T')[0];
                    const minP = Math.min(...f.seatDetails.map(s => s.price));
                    if (!priceMapIn[d] || minP < priceMapIn[d]) priceMapIn[d] = minP;
                });
                setMinPricesIn(priceMapIn);

                let displayIn = allFlightsIn.filter(f => f.departureTime.startsWith(dateIn));
                sortFlights(displayIn);
                setInboundFlights(displayIn);
            } else {
                setInboundFlights([]);
            }
        } catch (e) {
            console.error(e);
            toast.error("Lỗi tìm kiếm chuyến bay!");
        }
    };

    const sortFlights = (list) => {
        list.sort((a, b) => {
            if (sortConfig.key === 'price') {
                const pA = Math.min(...a.seatDetails.map(s => s.price));
                const pB = Math.min(...b.seatDetails.map(s => s.price));
                return sortConfig.direction === 'asc' ? pA - pB : pB - pA;
            } else {
                return sortConfig.direction === 'asc'
                    ? new Date(a.departureTime) - new Date(b.departureTime)
                    : new Date(b.departureTime) - new Date(a.departureTime);
            }
        });
    };

    useEffect(() => {
        const sortedOut = [...outboundFlights]; sortFlights(sortedOut); setOutboundFlights(sortedOut);
        const sortedIn = [...inboundFlights]; sortFlights(sortedIn); setInboundFlights(sortedIn);
    }, [sortConfig]);

    useEffect(() => {
        const init = async () => {
            const aps = await getAirports();
            setAirports(aps || []);

            if (location.state) {
                const { origin, destination, date, returnDate, tripType } = location.state;
                setSearchParams({
                    origin: origin || "HAN",
                    destination: destination || "SGN",
                    date: date || getTodayStr(),
                    returnDate: returnDate || "",
                    tripType: tripType || "ONE_WAY"
                });
                handleSearch(date, returnDate);
            } else {
                handleSearch();
            }
        };
        init();
    }, [location.state]);

    const handleSelectFlight = (flight, type) => {
        if (type === 'OUT') setSelectedOutbound(selectedOutbound?.id === flight.id ? null : flight);
        else setSelectedInbound(selectedInbound?.id === flight.id ? null : flight);
    };

    const handleConfirmModal = (configData) => {
        if (!user) {
            toast.warning("Vui lòng đăng nhập để tiếp tục đặt vé!");
            setStep(1);
            navigate("/login");
            return;
        }
        setBookingConfig(configData);
        setStep(3);
    };

    const renderFlightCard = (flight, type) => {
        const isSelected = type === 'OUT' ? selectedOutbound?.id === flight.id : selectedInbound?.id === flight.id;
        const start = new Date(flight.departureTime);
        const end = new Date(flight.arrivalTime);
        const duration = (end - start) / 3600000;

        return (
            <div key={flight.id} className={`flight-card-custom ${isSelected ? 'selected' : ''}`}>
                <div className="row g-0 align-items-center">
                    <div className="col-3 text-center border-end p-2">
                        <img src={flight.aircraft?.airline?.logoUrl} className="airline-logo-md" alt="Logo" />
                        <div className="fw-bold small">{flight.aircraft?.airline?.name}</div>
                        <span className="badge bg-light text-dark border">{flight.flightNumber}</span>
                    </div>
                    <div className="col-5 text-center px-3 border-end">
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="text-start">
                                <div className="fs-4 fw-bold">{start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                <div className="small fw-bold text-muted">{flight.departureAirport.code}</div>
                            </div>
                            <div className="flex-grow-1 mx-2 position-relative">
                                <small className="text-muted">{duration.toFixed(1)}h</small>
                                <div className="flight-line"><i className="bi bi-airplane-fill plane-icon-center"></i></div>
                                <small className="text-muted">Bay thẳng</small>
                            </div>
                            <div className="text-end">
                                <div className="fs-4 fw-bold">{end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                <div className="small fw-bold text-muted">{flight.arrivalAirport.code}</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-4 px-3 py-2">
                        <div className="d-flex flex-column gap-2 mb-2">
                            {flight.seatDetails.map(s => (
                                <div key={s.id} className="d-flex justify-content-between small border-bottom border-dashed pb-1">
                                    <span className="text-muted">{s.seatClass} ({s.availableSeats} chỗ)</span>
                                    <span className="fw-bold text-danger">{s.price.toLocaleString()}đ</span>
                                </div>
                            ))}
                        </div>
                        <button
                            className={`btn w-100 fw-bold btn-sm ${isSelected ? 'btn-success' : 'btn-outline-primary'}`}
                            onClick={() => handleSelectFlight(flight, type)}
                        >
                            {isSelected ? <><i className="bi bi-check-lg"></i> Đã chọn</> : "Chọn chuyến bay"}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // --- CẬP NHẬT DateBar: Nhận prop minDate để ẩn ngày quá khứ ---
    const DateBar = ({ baseDate, minPrices, onSelect, minDate }) => (
        <div className="date-bar-container mb-3">
            <div className="d-flex gap-2 justify-content-center">
                {[-2, -1, 0, 1, 2].map(offset => {
                    const d = new Date(baseDate);
                    d.setDate(d.getDate() + offset);
                    const dStr = d.toISOString().split('T')[0];

                    const isSelected = offset === 0;
                    const price = minPrices[dStr];

                    // Logic: Nếu có minDate và ngày hiện tại nhỏ hơn minDate -> Ẩn đi
                    const isHidden = minDate && dStr < minDate;

                    return (
                        <div
                            key={offset}
                            className={`date-cell ${isSelected ? 'active' : ''}`}
                            // Nếu ẩn thì dùng visibility: hidden để giữ khoảng trống layout không bị giật
                            style={{ visibility: isHidden ? 'hidden' : 'visible' }}
                            onClick={() => !isHidden && onSelect(dStr)}
                        >
                            <div className="small fw-bold">Thứ {d.getDay() + 1}, {d.getDate()}/{d.getMonth() + 1}</div>
                            {price ? (
                                <div className="text-success fw-bold small mt-1">
                                    Chỉ từ {price.toLocaleString()}đ
                                </div>
                            ) : (
                                <div className="text-muted small mt-1">--</div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    );

    if (step === 3) {
        return <PassengerInputPage bookingConfig={bookingConfig} selectedOutbound={selectedOutbound} selectedInbound={selectedInbound} onBack={() => setStep(2)} />;
    }

    const isRoundTrip = searchParams.tripType === "ROUND_TRIP";
    const canContinue = isRoundTrip ? (selectedOutbound && selectedInbound) : (selectedOutbound);

    return (
        <div className="flight-list-container">
            <div className="sky-container">
                <i className="bi bi-cloud-fill cloud c1"></i>
                <i className="bi bi-cloud-fill cloud c2"></i>
                <i className="bi bi-cloud-fill cloud c3"></i>
                <i className="bi bi-airplane-fill plane-fly"></i>
            </div>

            {step === 2 && (
                <BookingDetailModal
                    outboundFlight={selectedOutbound}
                    inboundFlight={selectedInbound}
                    tripType={searchParams.tripType}
                    onClose={() => setStep(1)}
                    onConfirm={handleConfirmModal}
                />
            )}

            <div className="container-fluid pt-4 px-4 position-relative" style={{ zIndex: 10 }}>
                <div className="row">
                    {/* LEFT CONTENT */}
                    <div className="col-md-9">
                        <div className="d-flex justify-content-end mb-3 gap-2">
                            <span className="text-white fw-bold align-self-center">Sắp xếp:</span>
                            <button className={`btn btn-sm btn-light ${sortConfig.key === 'price' ? 'active-sort' : ''}`} onClick={() => setSortConfig({ key: 'price', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' })}>Giá</button>
                            <button className={`btn btn-sm btn-light ${sortConfig.key === 'time' ? 'active-sort' : ''}`} onClick={() => setSortConfig({ key: 'time', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' })}>Giờ</button>
                        </div>

                        {/* LIST OUTBOUND */}
                        <div className="section-header"><i className="bi bi-airplane-fill me-2"></i> CHIỀU ĐI: {searchParams.origin} ➝ {searchParams.destination}</div>
                        {/* --- CẬP NHẬT: Truyền minDate = ngày hiện tại --- */}
                        <DateBar
                            baseDate={searchParams.date}
                            minPrices={minPricesOut}
                            minDate={getTodayStr()}
                            onSelect={(d) => { setSearchParams(prev => ({ ...prev, date: d })); handleSearch(d, null); }}
                        />
                        <div className="flight-list-scroll mb-4">
                            {outboundFlights.length > 0 ? outboundFlights.map(f => renderFlightCard(f, 'OUT')) : <div className="empty-state">Không tìm thấy chuyến bay.</div>}
                        </div>

                        {/* LIST INBOUND */}
                        {isRoundTrip && (
                            <>
                                <div className="section-header bg-success mt-4"><i className="bi bi-airplane-engines-fill me-2"></i> CHIỀU VỀ: {searchParams.destination} ➝ {searchParams.origin}</div>
                                {searchParams.returnDate ? (
                                    <>
                                        {/* --- CẬP NHẬT: Truyền minDate = ngày đi --- */}
                                        <DateBar
                                            baseDate={searchParams.returnDate}
                                            minPrices={minPricesIn}
                                            minDate={searchParams.date}
                                            onSelect={(d) => { setSearchParams(prev => ({ ...prev, returnDate: d })); handleSearch(null, d); }}
                                        />
                                        <div className="flight-list-scroll mb-4">
                                            {inboundFlights.length > 0 ? inboundFlights.map(f => renderFlightCard(f, 'IN')) : <div className="empty-state">Không tìm thấy chuyến bay về.</div>}
                                        </div>
                                    </>
                                ) : <div className="empty-state">Vui lòng chọn ngày về.</div>}
                            </>
                        )}
                    </div>

                    {/* RIGHT SIDEBAR */}
                    <div className="col-md-3">
                        <div className="glass-card p-3 sticky-top" style={{ top: '20px' }}>
                            <h5 className="fw-bold mb-3"><i className="bi bi-search me-2"></i>TÌM KIẾM</h5>
                            {/* ... (Các ô input Điểm đi/đến giữ nguyên) ... */}
                            <div className="mb-3">
                                <label className="form-label small fw-bold">Điểm đi</label>
                                <select className="form-select custom-input" value={searchParams.origin} onChange={e => setSearchParams({ ...searchParams, origin: e.target.value })}>
                                    {airports.map(a => <option key={a.id} value={a.code}>{a.city} ({a.code})</option>)}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label small fw-bold">Điểm đến</label>
                                <select className="form-select custom-input" value={searchParams.destination} onChange={e => setSearchParams({ ...searchParams, destination: e.target.value })}>
                                    {airports.map(a => <option key={a.id} value={a.code}>{a.city} ({a.code})</option>)}
                                </select>
                            </div>

                            {/* --- CẬP NHẬT NGÀY ĐI --- */}
                            <div className="mb-3">
                                <label className="form-label small fw-bold">Ngày đi</label>
                                <input
                                    type="date"
                                    className="form-control custom-input"
                                    value={searchParams.date}
                                    min={getTodayStr()} // Không chọn được ngày quá khứ
                                    onChange={e => {
                                        const newDate = e.target.value;
                                        setSearchParams(prev => ({
                                            ...prev,
                                            date: newDate,
                                            // Nếu ngày đi mới lớn hơn ngày về hiện tại -> Cập nhật ngày về
                                            returnDate: (prev.returnDate && prev.returnDate < newDate) ? newDate : prev.returnDate
                                        }));
                                    }}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label small fw-bold">Loại vé</label>
                                <select className="form-select custom-input" value={searchParams.tripType} onChange={e => setSearchParams({ ...searchParams, tripType: e.target.value })}>
                                    <option value="ONE_WAY">Một chiều</option>
                                    <option value="ROUND_TRIP">Khứ hồi</option>
                                </select>
                            </div>

                            {/* --- CẬP NHẬT NGÀY VỀ --- */}
                            {isRoundTrip && (
                                <div className="mb-3">
                                    <label className="form-label small fw-bold">Ngày về</label>
                                    <input
                                        type="date"
                                        className="form-control custom-input"
                                        value={searchParams.returnDate}
                                        min={searchParams.date} // Không chọn được ngày nhỏ hơn ngày đi
                                        onChange={e => setSearchParams({ ...searchParams, returnDate: e.target.value })}
                                    />
                                </div>
                            )}

                            <button className="btn btn-warning w-100 fw-bold mb-3" onClick={() => handleSearch()}>TÌM KIẾM</button>

                            <hr />
                            <div className="small fw-bold mb-2">Đã chọn:</div>
                            <div className="d-flex justify-content-between small mb-1">
                                <span>Chiều đi:</span>
                                <span className={selectedOutbound ? "text-success fw-bold" : "text-muted"}>{selectedOutbound ? selectedOutbound.flightNumber : "--"}</span>
                            </div>
                            {isRoundTrip && (
                                <div className="d-flex justify-content-between small mb-3">
                                    <span>Chiều về:</span>
                                    <span className={selectedInbound ? "text-success fw-bold" : "text-muted"}>{selectedInbound ? selectedInbound.flightNumber : "--"}</span>
                                </div>
                            )}

                            <button
                                className={`btn w-100 py-2 fw-bold shadow-lg ${canContinue ? 'btn-success' : 'btn-secondary disabled'}`}
                                onClick={() => canContinue && setStep(2)}
                            >
                                TIẾP TỤC ĐẶT VÉ <i className="bi bi-arrow-right-circle ms-2"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;