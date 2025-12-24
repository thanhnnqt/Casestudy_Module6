import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FlightSearch = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useState({
        from: 'DAD', to: 'HAN', date: new Date().toISOString().split('T')[0]
    });

    const handleSearch = () => {
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
                        <select onChange={(e) => setSearchParams({...searchParams, from: e.target.value})}>
                            <option value="DAD">Đà Nẵng (DAD)</option>
                            <option value="HAN">Hà Nội (HAN)</option>
                            <option value="SGN">TP.HCM (SGN)</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <label>Nơi đến</label>
                        <select onChange={(e) => setSearchParams({...searchParams, to: e.target.value})}>
                            <option value="HAN">Hà Nội (HAN)</option>
                            <option value="DAD">Đà Nẵng (DAD)</option>
                            <option value="SGN">TP.HCM (SGN)</option>
                        </select>
                    </div>
                </div>

                <div className="input-group">
                    <label>Ngày khởi hành</label>
                    <input type="date" value={searchParams.date} onChange={(e) => setSearchParams({...searchParams, date: e.target.value})} />
                </div>

                <div className="center-align" style={{marginTop: '20px'}}>
                    <button className="btn-booking btn-primary" onClick={handleSearch} style={{width: '100%'}}>Tìm Kiếm Ngay</button>
                </div>
            </fieldset>

            {/*<div className="center-align" style={{marginTop: '20px'}}>*/}
            {/*    <a href="#" onClick={(e) => {e.preventDefault(); navigate('/management')}} style={{color: '#1a3b5d'}}>Đăng nhập quản lý</a>*/}
            {/*</div>*/}
        </div>
    );
};

export default FlightSearch;