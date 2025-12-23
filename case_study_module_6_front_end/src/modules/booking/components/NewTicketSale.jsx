import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlightService } from '../service/BookingService.jsx';

const NewTicketSale = () => {
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useState({
        from: 'DAD', to: 'HAN', date: new Date().toISOString().split('T')[0]
    });
    const [flights, setFlights] = useState([]);
    const [searched, setSearched] = useState(false);

    const handleSearch = () => {
        setSearched(true);
        FlightService.searchFlights(searchParams.from, searchParams.to, searchParams.date)
            .then(res => setFlights(res.data))
            .catch(err => alert("Lỗi kết nối server!"));
    };

    const handleSellTicket = (flight) => {
        navigate('/booking-details', { state: { flight: flight } });
    };

    return (
        <div className="booking-wrapper">
            <h1>Bán Vé Tại Quầy</h1>

            <fieldset>
                <legend>🔍 Tìm kiếm chuyến bay</legend>
                <div className="row">
                    <div className="input-group">
                        <label>Nơi đi</label>
                        <select onChange={(e) => setSearchParams({...searchParams, from: e.target.value})} value={searchParams.from}>
                            <option value="DAD">Đà Nẵng (DAD)</option>
                            <option value="HAN">Hà Nội (HAN)</option>
                            <option value="SGN">TP.HCM (SGN)</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <label>Nơi đến</label>
                        <select onChange={(e) => setSearchParams({...searchParams, to: e.target.value})} value={searchParams.to}>
                            <option value="HAN">Hà Nội (HAN)</option>
                            <option value="DAD">Đà Nẵng (DAD)</option>
                            <option value="SGN">TP.HCM (SGN)</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <label>Ngày đi</label>
                        <input type="date" value={searchParams.date} onChange={(e) => setSearchParams({...searchParams, date: e.target.value})} />
                    </div>
                    <div className="input-group" style={{justifyContent: 'flex-end'}}>
                        <button className="btn-booking btn-primary" onClick={handleSearch} style={{height: '42px', marginTop: '18px'}}>
                            Tìm Chuyến Bay
                        </button>
                    </div>
                </div>
            </fieldset>

            {searched && (
                <div style={{marginTop: '30px'}}>
                    <h2>Kết quả tìm kiếm</h2>
                    <table>
                        <thead>
                        <tr>
                            <th>Chuyến bay</th>
                            <th>Thời gian</th>
                            <th>Hành trình</th>
                            <th>Giá vé</th>
                            <th>Ghế trống</th>
                            <th className="center-align">Thao tác</th>
                        </tr>
                        </thead>
                        <tbody>
                        {flights.length === 0 ? (
                            <tr><td colSpan="6" className="center-align">Không tìm thấy chuyến bay phù hợp.</td></tr>
                        ) : (
                            flights.map(flight => (
                                <tr key={flight.id}>
                                    <td style={{fontWeight: 'bold', color:'#1a3b5d'}}>{flight.flightNumber}</td>
                                    <td>
                                        {new Date(flight.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        <br/>
                                        <small style={{color:'#666'}}>{new Date(flight.departureTime).toLocaleDateString()}</small>
                                    </td>
                                    <td>{searchParams.from} ➝ {searchParams.to}</td>
                                    <td style={{fontWeight:'bold', color: '#d9534f'}}>{flight.price ? flight.price.toLocaleString() : "1,500,000"} đ</td>
                                    <td style={{color: 'green', fontWeight: 'bold'}}>{flight.availableSeats || 50}</td>
                                    <td className="center-align">
                                        <button className="btn-booking btn-success" onClick={() => handleSellTicket(flight)}>
                                            Chọn Bán
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="footer-action">
                <button className="btn-booking btn-secondary" onClick={() => navigate('/management')}>‹ Quay lại Dashboard</button>
            </div>
        </div>
    );
};

export default NewTicketSale;