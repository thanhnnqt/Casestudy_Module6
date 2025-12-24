import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlightService } from '../service/BookingService.jsx';

const FlightSearch = () => {
    const navigate = useNavigate();
    const [airports, setAirports] = useState([]);

    // Bỏ hardcode DAD/HAN để tránh lỗi nếu DB chưa có dữ liệu đó
    const [searchParams, setSearchParams] = useState({
        from: '',
        to: '',
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        FlightService.getAllAirports()
            .then(res => {
                setAirports(res.data);
                // (Tùy chọn) Tự động chọn 2 sân bay đầu tiên cho tiện test
                if(res.data.length >= 2) {
                    setSearchParams(prev => ({
                        ...prev,
                        from: res.data[0].code, // Code sân bay thứ nhất
                        to: res.data[1].code    // Code sân bay thứ hai
                    }));
                }
            })
            .catch(err => console.error("Lỗi tải sân bay:", err));
    }, []);

    const handleSearch = () => {
        // 1. Validate dữ liệu
        if (!searchParams.from || !searchParams.to) {
            alert("Vui lòng chọn Điểm đi và Điểm đến!");
            return;
        }
        if (searchParams.from === searchParams.to) {
            alert("Điểm đi và Điểm đến không được trùng nhau!");
            return;
        }
        if (!searchParams.date) {
            alert("Vui lòng chọn ngày đi!");
            return;
        }

        // 2. Chuyển trang
        navigate('/select-flight', { state: searchParams });
    };

    return (
        <div className="booking-wrapper" style={{maxWidth: '600px', marginTop: '50px'}}>
            <h1 className="center-align">Tìm Kiếm Chuyến Bay</h1>

            <fieldset>
                <div style={{display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '20px'}}>
                    <label style={{cursor:'pointer'}}><input type="radio" name="type" defaultChecked /> Khứ hồi</label>
                    <label style={{cursor:'pointer'}}><input type="radio" name="type" /> Một chiều</label>
                </div>

                <div className="row">
                    <div className="input-group">
                        <label>Nơi đi</label>
                        <select
                            className="form-control"
                            value={searchParams.from}
                            onChange={(e) => setSearchParams({...searchParams, from: e.target.value})}
                        >
                            <option value="">-- Chọn điểm đi --</option>
                            {airports.map(airport => (
                                <option key={airport.id} value={airport.code}>
                                    {airport.city} ({airport.code})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group">
                        <label>Nơi đến</label>
                        <select
                            className="form-control"
                            value={searchParams.to}
                            onChange={(e) => setSearchParams({...searchParams, to: e.target.value})}
                        >
                            <option value="">-- Chọn điểm đến --</option>
                            {airports.map(airport => (
                                <option key={airport.id} value={airport.code}>
                                    {airport.city} ({airport.code})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="input-group">
                    <label>Ngày khởi hành</label>
                    <input
                        type="date"
                        className="form-control"
                        value={searchParams.date}
                        // Chặn chọn ngày quá khứ

                        onChange={(e) => setSearchParams({...searchParams, date: e.target.value})}
                    />
                </div>

                <div className="center-align" style={{marginTop: '20px'}}>
                    <button className="btn-booking btn-primary" onClick={handleSearch} style={{width: '100%'}}>
                        Tìm Kiếm Ngay
                    </button>
                </div>
            </fieldset>
        </div>
    );
};

export default FlightSearch;