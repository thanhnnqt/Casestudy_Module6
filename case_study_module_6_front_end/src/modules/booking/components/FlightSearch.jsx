import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlightService } from '../service/BookingService.jsx';

const FlightSearch = () => {
    const navigate = useNavigate();
    const [airports, setAirports] = useState([]);

    // State quản lý Modal Lỗi
    const [errorModal, setErrorModal] = useState({
        show: false,
        message: ''
    });

    const getTodayDate = () => {
        return new Date().toISOString().split('T')[0];
    };

    const [searchParams, setSearchParams] = useState({
        from: '',
        to: '',
        date: getTodayDate(),
        returnDate: '',
        tripType: 'ROUND_TRIP'
    });

    useEffect(() => {
        FlightService.getAllAirports()
            .then(res => {
                setAirports(res.data);
                if(res.data.length >= 2) {
                    setSearchParams(prev => ({
                        ...prev,
                        from: res.data[0].code,
                        to: res.data[1].code
                    }));
                }
            })
            .catch(err => console.error("Lỗi tải sân bay:", err));
    }, []);

    // Hàm hiển thị Modal thay vì alert
    const showError = (msg) => {
        setErrorModal({ show: true, message: msg });
    };

    const handleSearch = () => {
        // Validate cơ bản
        if (!searchParams.from || !searchParams.to) return showError("Vui lòng chọn Điểm đi và Điểm đến!");
        if (searchParams.from === searchParams.to) return showError("Điểm đi và Điểm đến không được trùng nhau!");
        if (!searchParams.date) return showError("Vui lòng chọn ngày đi!");

        // Validate ngày tháng logic
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset giờ về 0h00
        const selectedDate = new Date(searchParams.date);

        // 1. Check ngày quá khứ (Cho trường hợp cố tình nhập tay)
        if (selectedDate < today) {
            return showError("Ngày đi không hợp lệ! Bạn không thể chọn ngày trong quá khứ.");
        }

        // 2. Check logic Khứ hồi
        if (searchParams.tripType === 'ROUND_TRIP') {
            if (!searchParams.returnDate) return showError("Vui lòng chọn Ngày về!");

            const returnDate = new Date(searchParams.returnDate);
            if (returnDate < selectedDate) {
                return showError("Ngày về không được phép nhỏ hơn Ngày đi!");
            }
        }

        // Nếu mọi thứ OK -> Chuyển trang
        navigate('/select-flight', { state: searchParams });
    };

    return (
        <div style={{display: 'flex', justifyContent: 'center', marginTop: '50px'}}>
            <div style={{width: '100%', maxWidth: '800px', padding: '30px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)'}}>
                <h2 className="text-center" style={{marginBottom: '25px', color: '#0056b3', fontWeight: 'bold'}}>✈ Tìm Kiếm Chuyến Bay</h2>

                {/* Chọn loại vé */}
                <div style={{display: 'flex', justifyContent: 'center', gap: '40px', marginBottom: '25px'}}>
                    <label style={{cursor:'pointer', fontSize: '1.1em', fontWeight: searchParams.tripType === 'ROUND_TRIP' ? 'bold' : 'normal', color: searchParams.tripType === 'ROUND_TRIP' ? '#0056b3' : '#555'}}>
                        <input type="radio" name="type" checked={searchParams.tripType === 'ROUND_TRIP'} onChange={() => setSearchParams({...searchParams, tripType: 'ROUND_TRIP'})} style={{marginRight: '8px', transform: 'scale(1.2)'}} />
                        Khứ hồi
                    </label>
                    <label style={{cursor:'pointer', fontSize: '1.1em', fontWeight: searchParams.tripType === 'ONE_WAY' ? 'bold' : 'normal', color: searchParams.tripType === 'ONE_WAY' ? '#0056b3' : '#555'}}>
                        <input type="radio" name="type" checked={searchParams.tripType === 'ONE_WAY'} onChange={() => setSearchParams({...searchParams, tripType: 'ONE_WAY', returnDate: ''})} style={{marginRight: '8px', transform: 'scale(1.2)'}} />
                        Một chiều
                    </label>
                </div>

                {/* Form Inputs */}
                <div className="row mb-4">
                    <div className="col-md-6">
                        <label className="form-label fw-bold">Nơi đi</label>
                        <select className="form-control" value={searchParams.from} onChange={(e) => setSearchParams({...searchParams, from: e.target.value})} style={{padding: '10px'}}>
                            <option value="">-- Chọn điểm đi --</option>
                            {airports.map(a => <option key={a.id} value={a.code}>{a.city} ({a.code})</option>)}
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-bold">Nơi đến</label>
                        <select className="form-control" value={searchParams.to} onChange={(e) => setSearchParams({...searchParams, to: e.target.value})} style={{padding: '10px'}}>
                            <option value="">-- Chọn điểm đến --</option>
                            {airports.map(a => <option key={a.id} value={a.code}>{a.city} ({a.code})</option>)}
                        </select>
                    </div>
                </div>

                <div className="row mb-4">
                    <div className={searchParams.tripType === 'ROUND_TRIP' ? "col-md-6" : "col-md-12"}>
                        <label className="form-label fw-bold">Ngày đi</label>
                        <input
                            type="date"
                            className="form-control"
                            value={searchParams.date}
                            min={getTodayDate()}
                            onChange={(e) => setSearchParams({...searchParams, date: e.target.value})}
                            style={{padding: '10px'}}
                        />
                    </div>

                    {searchParams.tripType === 'ROUND_TRIP' && (
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Ngày về</label>
                            <input
                                type="date"
                                className="form-control"
                                value={searchParams.returnDate}
                                min={searchParams.date || getTodayDate()}
                                onChange={(e) => setSearchParams({...searchParams, returnDate: e.target.value})}
                                style={{padding: '10px'}}
                            />
                        </div>
                    )}
                </div>

                <div className="text-center mt-4">
                    <button className="btn btn-primary px-5 py-2" onClick={handleSearch} style={{fontWeight: 'bold', fontSize: '1.2em', borderRadius: '30px', boxShadow: '0 4px 6px rgba(0,0,0,0.2)'}}>
                        🔍 Tìm Kiếm Ngay
                    </button>
                </div>
            </div>

            {/* --- MODAL THÔNG BÁO LỖI --- */}
            {errorModal.show && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050,
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    animation: 'fadeIn 0.2s'
                }}>
                    <div className="card shadow" style={{ width: '400px', maxWidth: '90%', border: 'none', borderRadius: '10px', overflow: 'hidden' }}>
                        <div className="card-header bg-danger text-white text-center py-3">
                            <h5 style={{ margin: 0, fontWeight: 'bold' }}>⚠️ Thông Báo</h5>
                        </div>
                        <div className="card-body p-4 text-center">
                            <p style={{ fontSize: '1.1em', color: '#333' }}>{errorModal.message}</p>
                            <button
                                className="btn btn-secondary px-4 mt-3"
                                onClick={() => setErrorModal({ ...errorModal, show: false })}
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default FlightSearch;