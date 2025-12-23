import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FlightService } from '../service/BookingService.jsx';

const FlightSelection = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Lấy dữ liệu tìm kiếm từ trang trước. Nếu không có (F5) thì dùng object rỗng để tránh lỗi
    const searchParams = location.state || {};

    const [flights, setFlights] = useState([]);
    const [selectedFlight, setSelectedFlight] = useState(null);

    useEffect(() => {
        // Chỉ gọi API khi có đủ thông tin tìm kiếm
        if (searchParams.from && searchParams.to && searchParams.date) {
            FlightService.searchFlights(searchParams.from, searchParams.to, searchParams.date)
                .then(res => {
                    // --- QUAN TRỌNG: XỬ LÝ DỮ LIỆU TỪ SPRING BOOT ---
                    // Spring Boot trả về Page<Flight> -> Dữ liệu nằm trong biến 'content'
                    // Nếu trả về List<Flight> -> Dữ liệu là chính nó
                    const flightList = res.data.content ? res.data.content : res.data;
                    setFlights(flightList);
                })
                .catch(err => {
                    console.error("Lỗi tải chuyến bay:", err);
                    setFlights([]); // Xóa danh sách nếu lỗi
                });
        }
    }, [searchParams]);

    const handleContinue = () => {
        if (!selectedFlight) return alert("Vui lòng chọn chuyến bay!");
        navigate('/booking-details', { state: { flight: selectedFlight } });
    };

    return (
        <div className="booking-wrapper">
            <h2>Kết Quả: {searchParams.from || '...'} ➝ {searchParams.to || '...'}</h2>
            <p>
                Ngày khởi hành:
                <strong> {searchParams.date ? new Date(searchParams.date).toLocaleDateString('vi-VN') : '...'}</strong>
            </p>

            <table>
                <thead>
                <tr>
                    <th style={{width: '60px'}}>Hãng</th>
                    <th>Chuyến bay</th>
                    <th>Giờ bay</th>
                    <th>Giá vé</th>
                    <th className="center-align">Chọn</th>
                </tr>
                </thead>
                <tbody>
                {flights.length === 0 ? (
                    <tr>
                        <td colSpan="5" className="center-align" style={{padding: '20px', color: 'red'}}>
                            Không tìm thấy chuyến bay nào hoặc chưa có dữ liệu!
                        </td>
                    </tr>
                ) : (
                    flights.map(flight => (
                        <tr key={flight.id}
                            onClick={() => setSelectedFlight(flight)}
                            style={{backgroundColor: selectedFlight?.id === flight.id ? '#e6f7ff' : ''}}>

                            <td className="center-align">✈</td>

                            <td>
                                <strong>{flight.flightNumber}</strong><br/>
                                <small>{flight.aircraft?.name}</small>
                            </td>

                            <td>
                                {new Date(flight.departureTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                                {' - '}
                                {new Date(flight.arrivalTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                            </td>

                            {/* HIỂN THỊ GIÁ THẬT */}
                            <td style={{color: '#d9534f', fontWeight: 'bold'}}>
                                {flight.price
                                    ? flight.price.toLocaleString('vi-VN')
                                    : "1.500.000" /* Giá mặc định nếu DB chưa config */
                                } đ
                            </td>

                            <td className="center-align">
                                <input
                                    type="radio"
                                    name="selectFlight" // Thêm name để radio hoạt động đúng nhóm
                                    checked={selectedFlight?.id === flight.id}
                                    readOnly
                                />
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>

            <div className="footer-action">
                <button className="btn-booking btn-secondary" onClick={() => navigate(-1)}>Quay lại</button>
                <button className="btn-booking btn-primary" onClick={handleContinue}>Tiếp tục Đặt vé</button>
            </div>
        </div>
    );
};

export default FlightSelection;