import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FlightService } from '../service/BookingService.jsx';

const FlightSelection = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = location.state || {};

    const [loading, setLoading] = useState(false);

    // Danh sách chuyến bay
    const [outboundList, setOutboundList] = useState([]);
    const [inboundList, setInboundList] = useState([]);

    // Vé đã chọn
    const [selectedOutbound, setSelectedOutbound] = useState(null);
    const [selectedInbound, setSelectedInbound] = useState(null);

    useEffect(() => {
        if (!searchParams.from || !searchParams.to) {
            navigate('/new-sale');
            return;
        }
        fetchAllFlights();
    }, [searchParams]);

    const fetchAllFlights = async () => {
        setLoading(true);
        try {
            // 1. Tìm chiều đi
            const resOut = await FlightService.searchFlights(searchParams.from, searchParams.to, searchParams.date);
            setOutboundList(resOut.data.content ? resOut.data.content : resOut.data);

            // 2. Tìm chiều về (nếu là Khứ hồi)
            if (searchParams.tripType === 'ROUND_TRIP' && searchParams.returnDate) {
                // Đảo ngược From/To cho chiều về
                const resIn = await FlightService.searchFlights(searchParams.to, searchParams.from, searchParams.returnDate);
                setInboundList(resIn.data.content ? resIn.data.content : resIn.data);
            }
        } catch (err) {
            console.error("Lỗi tìm kiếm:", err);
        } finally {
            setLoading(false);
        }
    };

    const getPrice = (flight) => {
        if (!flight.seatDetails?.length) return 0;
        return Math.min(...flight.seatDetails.map(s => s.price));
    };

    const handleContinue = () => {
        // Validate
        if (!selectedOutbound) return alert("Vui lòng chọn chuyến bay chiều đi!");

        if (searchParams.tripType === 'ROUND_TRIP' && !selectedInbound) {
            return alert("Vui lòng chọn chuyến bay chiều về!");
        }

        // Chuyển sang BookingDetails với ĐỦ thông tin
        navigate('/booking-details', {
            state: {
                tripType: searchParams.tripType,
                flightOut: selectedOutbound,
                flightIn: selectedInbound // Có thể null nếu 1 chiều
            }
        });
    };

    // Component con để render bảng (cho gọn code)
    const FlightTable = ({ title, flights, selectedId, onSelect, color }) => (
        <div className="card mb-4 shadow-sm">
            <div className={`card-header text-white fw-bold`} style={{backgroundColor: color}}>
                {title}
            </div>
            <div className="table-responsive">
                <table className="table table-hover mb-0 align-middle">
                    <thead className="table-light">
                    <tr><th>Hãng</th><th>Số hiệu</th><th>Giờ bay</th><th className="text-end">Giá vé</th><th className="text-center">Chọn</th></tr>
                    </thead>
                    <tbody>
                    {flights.length === 0 ? (
                        <tr><td colSpan="5" className="text-center py-4 text-muted">Không tìm thấy chuyến bay.</td></tr>
                    ) : (
                        flights.map(f => (
                            <tr key={f.id} onClick={() => onSelect(f)} style={{cursor:'pointer', backgroundColor: selectedId === f.id ? '#e8f4ff' : ''}}>
                                <td>{f.aircraft?.airline?.name}</td>
                                <td><span className="badge bg-secondary">{f.flightNumber}</span></td>
                                <td>
                                    <div>{new Date(f.departureTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
                                    <small className="text-muted">đến {new Date(f.arrivalTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</small>
                                </td>
                                <td className="text-end fw-bold text-danger">{getPrice(f).toLocaleString()} đ</td>
                                <td className="text-center">
                                    <input type="radio" checked={selectedId === f.id} readOnly style={{transform: 'scale(1.5)'}} />
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
        <div className="container mt-4" style={{maxWidth: '1000px'}}>
            <h2 className="text-center mb-4" style={{color: '#0056b3'}}>Kết Quả Tìm Kiếm</h2>

            {loading ? <div className="text-center p-5">Đang tải dữ liệu...</div> : (
                <>
                    {/* Bảng Chiều Đi */}
                    <FlightTable
                        title={`🛫 CHIỀU ĐI: ${searchParams.from} ➝ ${searchParams.to} (${new Date(searchParams.date).toLocaleDateString()})`}
                        flights={outboundList}
                        selectedId={selectedOutbound?.id}
                        onSelect={setSelectedOutbound}
                        color="#0d6efd" // Xanh dương
                    />

                    {/* Bảng Chiều Về (Chỉ hiện nếu Khứ hồi) */}
                    {searchParams.tripType === 'ROUND_TRIP' && (
                        <FlightTable
                            title={`🛬 CHIỀU VỀ: ${searchParams.to} ➝ ${searchParams.from} (${new Date(searchParams.returnDate).toLocaleDateString()})`}
                            flights={inboundList}
                            selectedId={selectedInbound?.id}
                            onSelect={setSelectedInbound}
                            color="#198754" // Xanh lá
                        />
                    )}

                    <div className="d-flex justify-content-between mt-4 pb-5">
                        <button className="btn btn-secondary px-4" onClick={() => navigate(-1)}>⬅ Quay lại</button>
                        <button className="btn btn-primary px-4 fw-bold" onClick={handleContinue}>
                            Tiếp tục đặt vé ✅
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default FlightSelection;