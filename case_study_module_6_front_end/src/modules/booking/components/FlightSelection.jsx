import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FlightService } from '../service/BookingService.jsx';

const FlightSelection = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = location.state || {};

    const [dateOut, setDateOut] = useState(searchParams.date);
    const [dateIn, setDateIn] = useState(searchParams.returnDate);
    const [loadingOut, setLoadingOut] = useState(false);
    const [loadingIn, setLoadingIn] = useState(false);
    const [outboundList, setOutboundList] = useState([]);
    const [inboundList, setInboundList] = useState([]);
    const [selectedOutbound, setSelectedOutbound] = useState(null);
    const [selectedInbound, setSelectedInbound] = useState(null);

    useEffect(() => {
        if (!searchParams.from || !searchParams.to) {
            navigate('/new-sale');
        }
    }, [searchParams, navigate]);

    useEffect(() => {
        if (searchParams.from && searchParams.to && dateOut) {
            setLoadingOut(true);
            setSelectedOutbound(null);
            FlightService.searchFlights(searchParams.from, searchParams.to, dateOut)
                .then(res => setOutboundList(res.data.content ? res.data.content : res.data))
                .catch(err => console.error(err))
                .finally(() => setLoadingOut(false));
        }
    }, [dateOut, searchParams.from, searchParams.to]);

    useEffect(() => {
        if (searchParams.tripType === 'ROUND_TRIP' && searchParams.to && searchParams.from && dateIn) {
            setLoadingIn(true);
            setSelectedInbound(null);
            FlightService.searchFlights(searchParams.to, searchParams.from, dateIn)
                .then(res => setInboundList(res.data.content ? res.data.content : res.data))
                .catch(err => console.error(err))
                .finally(() => setLoadingIn(false));
        }
    }, [dateIn, searchParams.tripType, searchParams.to, searchParams.from]);

    const getPrice = (flight) => {
        if (!flight.seatDetails?.length) return 0;
        return Math.min(...flight.seatDetails.map(s => s.price));
    };

    // [MỚI] Hàm render chi tiết ghế trống từng hạng
    const renderSeatAvailability = (flight) => {
        if (!flight.seatDetails || flight.seatDetails.length === 0) {
            return <span className="text-muted small">Hết ghế</span>;
        }

        // Sắp xếp thứ tự ưu tiên: ECONOMY -> BUSINESS -> FIRST_CLASS
        const sortedSeats = [...flight.seatDetails].sort((a, b) => {
            const order = { 'ECONOMY': 1, 'BUSINESS': 2, 'FIRST_CLASS': 3 };
            return (order[a.seatClass] || 99) - (order[b.seatClass] || 99);
        });

        return (
            <div className="d-flex flex-column gap-1">
                {sortedSeats.map(seat => (
                    <div key={seat.id} className="d-flex justify-content-between align-items-center" style={{fontSize: '0.85em'}}>
                        <span className="fw-bold text-muted" style={{minWidth: '80px'}}>{seat.seatClass}</span>
                        {seat.availableSeats > 0 ? (
                            <span className={`badge ${seat.availableSeats < 10 ? 'bg-danger' : 'bg-success'}`}>
                                {seat.availableSeats} ghế
                            </span>
                        ) : (
                            <span className="badge bg-secondary">Hết</span>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    const handleContinue = () => {
        if (!selectedOutbound) return alert("Vui lòng chọn chuyến bay chiều đi!");
        if (searchParams.tripType === 'ROUND_TRIP' && !selectedInbound) return alert("Vui lòng chọn chuyến bay chiều về!");

        navigate('/booking-details', {
            state: {
                tripType: searchParams.tripType,
                flightOut: selectedOutbound,
                flightIn: selectedInbound
            }
        });
    };

    const FlightTable = ({ title, currentDate, onDateChange, flights, selectedId, onSelect, color, isLoading }) => (
        <div className="card mb-4 shadow-sm" style={{border: `1px solid ${color}`}}>
            <div className={`card-header text-white d-flex justify-content-between align-items-center`} style={{backgroundColor: color, padding: '10px 15px'}}>
                <span className="fw-bold" style={{fontSize: '1.1em'}}>{title}</span>
                <div className="d-flex align-items-center bg-white rounded px-2 py-1">
                    <span className="text-muted small me-2" style={{fontWeight:'normal'}}>Ngày bay:</span>
                    <input type="date" className="form-control form-control-sm border-0 p-0" style={{width: '130px', fontWeight: 'bold', color: color, cursor:'pointer'}}
                           value={currentDate} min={new Date().toISOString().split('T')[0]} onChange={(e) => onDateChange(e.target.value)} />
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-hover mb-0 align-middle">
                    <thead className="table-light">
                    <tr>
                        <th style={{width: '15%'}}>Hãng</th>
                        <th style={{width: '10%'}}>Số hiệu</th>
                        <th style={{width: '20%'}}>Giờ bay</th>
                        {/* [MỚI] Cột Chi tiết ghế trống */}
                        <th className="text-center" style={{width: '25%'}}>Tình trạng ghế</th>
                        <th className="text-end" style={{width: '20%'}}>Giá vé (Từ)</th>
                        <th className="text-center" style={{width: '10%'}}>Chọn</th>
                    </tr>
                    </thead>
                    <tbody>
                    {isLoading ? (
                        <tr><td colSpan="6" className="text-center py-5">⏳ Đang tìm chuyến bay...</td></tr>
                    ) : flights.length === 0 ? (
                        <tr><td colSpan="6" className="text-center py-5 text-muted">🚫 Không tìm thấy chuyến bay nào trong ngày này.<div className="small mt-2">Vui lòng chọn ngày khác ở góc trên bên phải. ↗️</div></td></tr>
                    ) : (
                        flights.map(f => (
                            <tr key={f.id} onClick={() => onSelect(f)} style={{cursor:'pointer', backgroundColor: selectedId === f.id ? '#e8f4ff' : ''}}>
                                <td>{f.aircraft?.airline?.name}</td>
                                <td><span className="badge bg-secondary">{f.flightNumber}</span></td>
                                <td>
                                    <div className="fw-bold">{new Date(f.departureTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
                                    <small className="text-muted">đến {new Date(f.arrivalTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</small>
                                </td>

                                {/* [MỚI] Hiển thị chi tiết từng hạng ghế */}
                                <td className="text-center">
                                    <div className="d-inline-block text-start p-2 bg-light rounded border">
                                        {renderSeatAvailability(f)}
                                    </div>
                                </td>

                                <td className="text-end fw-bold text-danger fs-5">{getPrice(f).toLocaleString()} đ</td>
                                <td className="text-center">
                                    <input type="radio" checked={selectedId === f.id} readOnly style={{transform: 'scale(1.5)', cursor:'pointer'}} />
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="container mt-4" style={{maxWidth: '1100px'}}> {/* Tăng width một chút cho thoải mái */}
            <h2 className="text-center mb-4" style={{color: '#0056b3'}}>Kết Quả Tìm Kiếm</h2>
            <FlightTable
                title={`🛫 CHIỀU ĐI: ${searchParams.from} ➝ ${searchParams.to}`}
                currentDate={dateOut} onDateChange={setDateOut} flights={outboundList} isLoading={loadingOut}
                selectedId={selectedOutbound?.id} onSelect={setSelectedOutbound} color="#0d6efd"
            />
            {searchParams.tripType === 'ROUND_TRIP' && (
                <FlightTable
                    title={`🛬 CHIỀU VỀ: ${searchParams.to} ➝ ${searchParams.from}`}
                    currentDate={dateIn} onDateChange={setDateIn} flights={inboundList} isLoading={loadingIn}
                    selectedId={selectedInbound?.id} onSelect={setSelectedInbound} color="#198754"
                />
            )}
            <div className="d-flex justify-content-between mt-4 pb-5">
                <button className="btn btn-secondary px-4" onClick={() => navigate(-1)}>⬅ Quay lại Tìm kiếm</button>
                <button className="btn btn-primary px-4 fw-bold shadow" onClick={handleContinue} disabled={loadingOut || loadingIn}>Tiếp tục đặt vé ✅</button>
            </div>
        </div>
    );
};

export default FlightSelection;