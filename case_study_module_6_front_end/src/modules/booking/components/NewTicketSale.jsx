import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlightService } from '../service/BookingService.jsx';

const NewTicketSale = () => {
    const navigate = useNavigate();
    const [airports, setAirports] = useState([]);
    const [searchParams, setSearchParams] = useState({
        from: '', to: '', date: new Date().toISOString().split('T')[0]
    });
    const [flights, setFlights] = useState([]);
    const [searched, setSearched] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        FlightService.getAllAirports()
            .then(res => setAirports(res.data))
            .catch(err => console.error("Lỗi tải sân bay:", err));
    }, []);

    const handleSearch = () => {
        if (!searchParams.from || !searchParams.to) { alert("Vui lòng chọn Nơi đi và Nơi đến!"); return; }
        if (searchParams.from === searchParams.to) { alert("Nơi đi và Nơi đến không được trùng nhau!"); return; }

        setLoading(true);
        setSearched(true);
        setFlights([]);

        FlightService.searchFlights(searchParams.from, searchParams.to, searchParams.date)
            .then(res => {
                console.log("Dữ liệu API trả về:", res.data);
                const flightList = res.data.content ? res.data.content : res.data;
                setFlights(Array.isArray(flightList) ? flightList : []);
            })
            .catch(err => {
                console.error(err);
                alert("Lỗi hệ thống khi tìm vé.");
            })
            .finally(() => setLoading(false));
    };

    // --- SỬA QUAN TRỌNG TẠI ĐÂY ---
    const calculateTotalSeats = (flight) => {
        // Thêm 'flight.seatDetails' vào đầu danh sách kiểm tra vì Java ông đặt tên là seatDetails
        const seats = flight.seatDetails || flight.flightSeatDetails || flight.flight_seat_details;

        if (Array.isArray(seats) && seats.length > 0) {
            return seats.reduce((total, item) => {
                const available = item.availableSeats !== undefined ? item.availableSeats : (item.available_seats || 0);
                return total + available;
            }, 0);
        }
        return 0;
    };

    const getMinPrice = (flight) => {
        // Thêm 'flight.seatDetails' vào đây nữa
        const seats = flight.seatDetails || flight.flightSeatDetails || flight.flight_seat_details;

        if (Array.isArray(seats) && seats.length > 0) {
            const prices = seats.map(item => item.price).filter(p => p > 0);
            return prices.length > 0 ? Math.min(...prices) : null;
        }
        return null;
    };

    const handleSellTicket = (flight) => {
        navigate('/booking-details', { state: { flight: flight } });
    };

    return (
        <div className="booking-wrapper" style={{padding: '20px', fontFamily: 'Arial, sans-serif'}}>
            <h1 style={{color: '#1a3b5d', marginBottom: '20px'}}>Bán Vé Tại Quầy</h1>

            <fieldset style={{border: '1px solid #e0e0e0', padding: '25px', borderRadius: '12px', backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)'}}>
                <legend style={{padding: '0 10px', fontWeight: 'bold', color: '#007bff', fontSize: '1.1rem'}}>✈️ Tìm kiếm chuyến bay</legend>
                <div className="row" style={{display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap'}}>
                    <div className="input-group" style={{flex: 1, minWidth: '200px'}}>
                        <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', color: '#555'}}>Nơi đi</label>
                        <select className="form-control" style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc'}} onChange={(e) => setSearchParams({...searchParams, from: e.target.value})} value={searchParams.from}>
                            <option value="">-- Chọn điểm đi --</option>
                            {airports.map(airport => (
                                <option key={airport.id} value={airport.code}>
                                    {airport.location || airport.city} ({airport.code}) - {airport.name || airport.airportName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="input-group" style={{flex: 1, minWidth: '200px'}}>
                        <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', color: '#555'}}>Nơi đến</label>
                        <select className="form-control" style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc'}} onChange={(e) => setSearchParams({...searchParams, to: e.target.value})} value={searchParams.to}>
                            <option value="">-- Chọn điểm đến --</option>
                            {airports.map(airport => (
                                <option key={airport.id} value={airport.code}>
                                    {airport.location || airport.city} ({airport.code}) - {airport.name || airport.airportName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="input-group" style={{flex: 1, minWidth: '150px'}}>
                        <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', color: '#555'}}>Ngày đi</label>
                        <input type="date" className="form-control" style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc'}} value={searchParams.date} onChange={(e) => setSearchParams({...searchParams, date: e.target.value})} />
                    </div>
                    <div className="input-group" style={{flex: 0.5, minWidth: '100px', display: 'flex', alignItems: 'flex-end'}}>
                        <button className="btn btn-primary" onClick={handleSearch} style={{height: '42px', marginTop: '28px', width: '100%', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'}}>Tìm kiếm</button>
                    </div>
                </div>
            </fieldset>

            {searched && (
                <div style={{marginTop: '30px'}}>
                    <h3 style={{marginBottom: '20px', color: '#1a3b5d', borderLeft: '5px solid #007bff', paddingLeft: '10px'}}>Kết quả chuyến bay</h3>
                    {loading ? (
                        <div style={{textAlign: 'center', padding: '40px', color: '#666'}}>Đang tải dữ liệu...</div>
                    ) : (
                        <div style={{overflowX: 'auto'}}>
                            <table className="table" style={{width: '100%', borderCollapse: 'separate', borderSpacing: '0', borderRadius: '8px', overflow: 'hidden', border: '1px solid #eee'}}>
                                <thead style={{backgroundColor: '#f8f9fa', color: '#495057'}}>
                                <tr>
                                    <th style={{padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6'}}>Chuyến bay</th>
                                    <th style={{padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6'}}>Giờ bay</th>
                                    <th style={{padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6'}}>Hành trình</th>
                                    <th style={{padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6'}}>Giá vé (Từ)</th>
                                    <th style={{padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6'}}>Ghế trống</th>
                                    <th style={{padding: '15px', textAlign: 'center', borderBottom: '2px solid #dee2e6'}}>Thao tác</th>
                                </tr>
                                </thead>
                                <tbody>
                                {flights.length === 0 ? (
                                    <tr><td colSpan="6" style={{textAlign: 'center', padding: '30px', color: '#666'}}>Không tìm thấy chuyến bay phù hợp.</td></tr>
                                ) : (
                                    flights.map((flight, index) => {
                                        const totalSeats = calculateTotalSeats(flight);
                                        const minPrice = getMinPrice(flight);
                                        const depName = flight.departureAirport?.location || searchParams.from;
                                        const arrName = flight.arrivalAirport?.location || searchParams.to;
                                        const depDate = new Date(flight.departureTime);

                                        return (
                                            <tr key={flight.id || index} style={{backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9'}}>
                                                <td style={{padding: '15px', borderBottom: '1px solid #eee', fontWeight: 'bold', color:'#0056b3'}}>{flight.flightNumber}</td>
                                                <td style={{padding: '15px', borderBottom: '1px solid #eee'}}>
                                                    <div style={{fontWeight: 'bold', fontSize: '1.1em', color: '#333'}}>{depDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                                                    <small style={{color:'#888'}}>{depDate.toLocaleDateString()}</small>
                                                </td>
                                                <td style={{padding: '15px', borderBottom: '1px solid #eee'}}>{depName} <span style={{color: '#999'}}>➝</span> {arrName}</td>
                                                <td style={{padding: '15px', borderBottom: '1px solid #eee', fontWeight:'bold', color: '#d9534f'}}>{minPrice ? minPrice.toLocaleString() + " đ" : "Liên hệ"}</td>
                                                <td style={{padding: '15px', borderBottom: '1px solid #eee', color: totalSeats > 0 ? '#28a745' : '#dc3545', fontWeight: 'bold'}}>{totalSeats > 0 ? totalSeats : "Hết vé"}</td>
                                                <td style={{padding: '15px', borderBottom: '1px solid #eee', textAlign: 'center'}}>
                                                    <button className="btn" disabled={totalSeats === 0} onClick={() => handleSellTicket(flight)} style={{backgroundColor: totalSeats > 0 ? '#28a745' : '#6c757d', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '50px', cursor: totalSeats > 0 ? 'pointer' : 'not-allowed', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', fontWeight: '600'}}>
                                                        {totalSeats > 0 ? "Chọn Bán" : "Đã đầy"}
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
            <div className="footer-action" style={{marginTop: '30px'}}>
                <button className="btn btn-secondary" onClick={() => navigate('/management')} style={{backgroundColor: '#6c757d', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px'}}><span>‹</span> Quay lại Dashboard</button>
            </div>
        </div>
    );
};

export default NewTicketSale;