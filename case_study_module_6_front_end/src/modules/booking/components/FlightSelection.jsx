import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FlightService } from '../service/BookingService.jsx'; // Sửa lại đường dẫn import nếu cần

const FlightSelection = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Lấy state an toàn
    const searchParams = location.state || {};

    const [flights, setFlights] = useState([]);
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [loading, setLoading] = useState(false); // Thêm loading

    useEffect(() => {
        // Nếu không có dữ liệu tìm kiếm (ví dụ F5 lại trang), quay về trang tìm kiếm
        if (!searchParams.from || !searchParams.to || !searchParams.date) {
            navigate('/search'); // Hoặc đường dẫn trang chủ của ông
            return;
        }

        setLoading(true);
        FlightService.searchFlights(searchParams.from, searchParams.to, searchParams.date)
            .then(res => {
                // Spring Boot trả về Page thì lấy .content, List thì lấy data
                const flightList = res.data.content ? res.data.content : res.data;
                setFlights(flightList || []);
            })
            .catch(err => {
                console.error("Lỗi tải chuyến bay:", err);
                setFlights([]);
            })
            .finally(() => {
                setLoading(false); // Tắt loading dù thành công hay thất bại
            });
    }, [searchParams, navigate]);

    // HÀM MỚI: Tính giá hiển thị (Lấy giá rẻ nhất trong các hạng ghế)
    const getDisplayPrice = (flight) => {
        if (!flight.seatDetails || flight.seatDetails.length === 0) return 0;
        // Map ra mảng giá, sau đó tìm min
        const prices = flight.seatDetails.map(s => s.price);
        return Math.min(...prices);
    };

    const handleContinue = () => {
        if (!selectedFlight) return alert("Vui lòng chọn chuyến bay!");
        navigate('/booking-details', { state: { flight: selectedFlight } });
    };

    return (
        <div className="booking-wrapper">
            <h2>Kết Quả: {searchParams.from} ➝ {searchParams.to}</h2>
            <p>
                Ngày khởi hành:
                <strong> {searchParams.date ? new Date(searchParams.date).toLocaleDateString('vi-VN') : '...'}</strong>
            </p>

            {loading ? (
                <div className="center-align" style={{padding: '50px'}}>
                    <h3>Đang tìm kiếm chuyến bay...</h3>
                </div>
            ) : (
                <table>
                    <thead>
                    <tr>
                        <th style={{width: '60px'}}>Hãng</th>
                        <th>Chuyến bay</th>
                        <th>Giờ bay</th>
                        <th>Giá vé (Từ)</th>
                        <th className="center-align">Chọn</th>
                    </tr>
                    </thead>
                    <tbody>
                    {flights.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="center-align" style={{padding: '20px', color: 'red'}}>
                                Không tìm thấy chuyến bay nào phù hợp!
                            </td>
                        </tr>
                    ) : (
                        flights.map(flight => {
                            const price = getDisplayPrice(flight);
                            return (
                                <tr key={flight.id}
                                    onClick={() => setSelectedFlight(flight)}
                                    style={{
                                        cursor: 'pointer',
                                        backgroundColor: selectedFlight?.id === flight.id ? '#e6f7ff' : ''
                                    }}>

                                    <td className="center-align">
                                        <div style={{fontSize: '24px'}}>✈</div>
                                        <small>{flight.aircraft?.airline?.name || 'Vietnam Air'}</small>
                                    </td>

                                    <td>
                                        <strong>{flight.flightNumber}</strong><br/>
                                        <span style={{color: '#666'}}>{flight.aircraft?.name}</span>
                                    </td>

                                    <td>
                                        <div style={{fontWeight: 'bold', color: '#007bff'}}>
                                            {new Date(flight.departureTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                                        </div>
                                        <div style={{fontSize: '0.9em', color: '#555'}}>
                                            Đến: {new Date(flight.arrivalTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                                        </div>
                                    </td>

                                    {/* SỬA PHẦN HIỂN THỊ GIÁ */}
                                    <td style={{color: '#d9534f', fontWeight: 'bold', fontSize: '1.1em'}}>
                                        {price > 0 ? price.toLocaleString('vi-VN') : "Liên hệ"} đ
                                    </td>

                                    <td className="center-align">
                                        <input
                                            type="radio"
                                            name="selectFlight"
                                            checked={selectedFlight?.id === flight.id}
                                            readOnly
                                        />
                                    </td>
                                </tr>
                            );
                        })
                    )}
                    </tbody>
                </table>
            )}

            <div className="footer-action">
                <button className="btn-booking btn-secondary" onClick={() => navigate(-1)}>Quay lại</button>
                <button
                    className="btn-booking btn-primary"
                    onClick={handleContinue}
                    disabled={!selectedFlight} // Disable nếu chưa chọn
                    style={{opacity: !selectedFlight ? 0.6 : 1}}
                >
                    Tiếp tục Đặt vé
                </button>
            </div>
        </div>
    );
};

export default FlightSelection;