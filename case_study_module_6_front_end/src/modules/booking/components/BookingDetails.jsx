import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FlightService } from '../service/BookingService.jsx';

// Hàm helper tính tuổi
const getAge = (dateString) => {
    if (!dateString) return 99;
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

const BookingDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { tripType, flightOut: stateFlightOut, flightIn: stateFlightIn, editingBooking } = location.state || {};
    const isEditMode = !!editingBooking;

    const [flightOut, setFlightOut] = useState(stateFlightOut || editingBooking?.flight);
    const [flightIn, setFlightIn]   = useState(stateFlightIn || editingBooking?.returnFlight);

    const [contactInfo, setContactInfo] = useState({ fullName: '', email: '', phone: '', paymentMethod: 'CASH' });
    const [classOut, setClassOut] = useState('ECONOMY');
    const [classIn, setClassIn] = useState('ECONOMY');

    const [passengersOut, setPassengersOut] = useState([{ fullName: '', dob: '' }]);
    const [passengersIn, setPassengersIn] = useState([{ fullName: '', dob: '' }]);

    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        if (isEditMode && editingBooking) {
            setContactInfo({
                fullName: editingBooking.contactName,
                email: editingBooking.contactEmail || '',
                phone: editingBooking.contactPhone,
                paymentMethod: editingBooking.paymentMethod || 'CASH'
            });

            const ticketsOut = editingBooking.tickets.filter(t => t.flight.id === editingBooking.flight.id);
            if (ticketsOut.length > 0) {
                setPassengersOut(ticketsOut.map(t => ({ fullName: t.passengerName, dob: t.passengerDob || '' })));
                setClassOut(ticketsOut[0].seatClass);
            }

            if (editingBooking.returnFlight) {
                const ticketsIn = editingBooking.tickets.filter(t => t.flight.id === editingBooking.returnFlight.id);
                setPassengersIn(ticketsIn.map(t => ({ fullName: t.passengerName, dob: t.passengerDob || '' })));
                setClassIn(ticketsIn[0].seatClass);
            }
        } else {
            if (!stateFlightOut && !editingBooking) {
                navigate('/search-flight');
            }
            if (stateFlightOut?.seatDetails?.length > 0) setClassOut(stateFlightOut.seatDetails[0].seatClass);
            if (stateFlightIn?.seatDetails?.length > 0) setClassIn(stateFlightIn.seatDetails[0].seatClass);
        }
    }, [isEditMode, editingBooking, stateFlightOut, stateFlightIn, navigate]);

    // [QUAN TRỌNG] Logic tính tổng tiền (Đã sửa để luôn tính toán lại kể cả khi đang Edit)
    const totalAmount = (() => {
        // Tôi đã xóa dòng chặn update giá cũ ở đây

        let total = 0;
        const seatOutDetail = flightOut?.seatDetails?.find(s => s.seatClass === classOut);
        const seatInDetail = flightIn?.seatDetails?.find(s => s.seatClass === classIn);

        // Chiều đi
        if (seatOutDetail) {
            passengersOut.forEach(p => {
                const isChild = getAge(p.dob) < 5;
                const price = isChild ? (seatOutDetail.price * 0.5) : seatOutDetail.price;
                total += price;
            });
        }
        // Chiều về
        if (flightIn && seatInDetail) {
            passengersIn.forEach(p => {
                const isChild = getAge(p.dob) < 5;
                const price = isChild ? (seatInDetail.price * 0.5) : seatInDetail.price;
                total += price;
            });
        }
        return total;
    })();

    // Helper hiển thị thông tin ghế
    const currentSeatOut = flightOut?.seatDetails?.find(s => s.seatClass === classOut);
    const maxOut = currentSeatOut ? currentSeatOut.availableSeats : 0;

    const currentSeatIn = flightIn?.seatDetails?.find(s => s.seatClass === classIn);
    const maxIn = currentSeatIn ? currentSeatIn.availableSeats : 0;


    // --- HANDLERS ---
    const handleQtyOutChange = (e) => {
        if(isEditMode) return;
        const qty = parseInt(e.target.value);
        if (isNaN(qty) || qty < 1) return;
        if (qty > maxOut) return alert(`Hạng ${classOut} chỉ còn ${maxOut} ghế!`);

        const newArr = [...passengersOut];
        while (newArr.length < qty) newArr.push({ fullName: '', dob: '' });
        while (newArr.length > qty) newArr.pop();
        setPassengersOut(newArr);
    };

    const handleQtyInChange = (e) => {
        if(isEditMode) return;
        const qty = parseInt(e.target.value);
        if (isNaN(qty) || qty < 1) return;
        if (qty > maxIn) return alert(`Hạng ${classIn} chỉ còn ${maxIn} ghế!`);

        const newArr = [...passengersIn];
        while (newArr.length < qty) newArr.push({ fullName: '', dob: '' });
        while (newArr.length > qty) newArr.pop();
        setPassengersIn(newArr);
    };

    const handlePassengerChange = (isOutbound, index, field, value) => {
        const arr = isOutbound ? [...passengersOut] : [...passengersIn];
        arr[index][field] = field === 'fullName' ? value.toUpperCase() : value;
        if (isOutbound) setPassengersOut(arr); else setPassengersIn(arr);
    };

    const handleSubmit = () => {
        if (!contactInfo.fullName || !contactInfo.phone) return setErrorMessage("Thiếu thông tin liên hệ");

        const payload = {
            id: isEditMode ? editingBooking.id : null,
            flightId: flightOut.id,
            returnFlightId: flightIn ? flightIn.id : null,
            tripType: tripType || (flightIn ? 'ROUND_TRIP' : 'ONE_WAY'),
            seatClassOut: classOut,
            seatClassIn: flightIn ? classIn : null,
            contactName: contactInfo.fullName,
            contactPhone: contactInfo.phone,
            contactEmail: contactInfo.email,
            paymentMethod: contactInfo.paymentMethod,
            passengersOut: passengersOut.map(p => ({ fullName: p.fullName, dob: p.dob })),
            passengersIn: flightIn ? passengersIn.map(p => ({ fullName: p.fullName, dob: p.dob })) : null
        };

        const apiCall = isEditMode
            ? FlightService.updateBookingInfo(payload)
            : FlightService.createBooking(payload);

        apiCall.then(() => {
            navigate('/management', { state: { updated: isEditMode, newBooking: !isEditMode } });
        }).catch(err => setErrorMessage(err.response?.data || "Lỗi xử lý"));
    };

    if (!flightOut) return null;

    return (
        <div className="booking-wrapper" style={{fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '1200px', margin: '0 auto'}}>
            <h2 style={{color: '#0056b3', borderBottom: '2px solid #eee', paddingBottom: '10px'}}>
                {isEditMode ? 'Cập Nhật Thông Tin Vé' : 'Xác Nhận & Thanh Toán'}
            </h2>

            <div style={{display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px'}}>
                {/* --- CỘT TRÁI --- */}
                <div className="left-col">
                    <fieldset style={{border: '1px solid #ddd', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)'}}>
                        <legend style={{fontWeight: 'bold', color: '#555', fontSize:'1.1em'}}>✈ Tùy chọn Vé</legend>

                        {/* === CHIỀU ĐI === */}
                        <div className="mb-4 p-3 bg-white border rounded">
                            <h5 className="text-primary fw-bold">🛫 CHIỀU ĐI: {flightOut.flightNumber}</h5>
                            <div className="text-muted small mb-2">{flightOut.departureAirport?.city} ➝ {flightOut.arrivalAirport?.city} | {flightOut.departureTime}</div>
                            <div className="mb-2">
                                <label className="small fw-bold">Hạng ghế:</label>
                                <select className="form-control" value={classOut} onChange={(e) => setClassOut(e.target.value)} disabled={isEditMode}>
                                    {flightOut.seatDetails?.map((seat) => (
                                        <option key={seat.id} value={seat.seatClass} disabled={seat.availableSeats <= 0}>
                                            {seat.seatClass} - {seat.price.toLocaleString()} đ (Còn {seat.availableSeats} ghế)
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="small fw-bold">Số khách:</label>
                                <input type="number" className="form-control" value={passengersOut.length} onChange={handleQtyOutChange} disabled={isEditMode} />
                            </div>
                        </div>

                        {/* === CHIỀU VỀ === */}
                        {flightIn && (
                            <div className="mb-4 p-3 bg-white border rounded">
                                <h5 className="text-success fw-bold">🛬 CHIỀU VỀ: {flightIn.flightNumber}</h5>
                                <div className="text-muted small mb-2">{flightIn.departureAirport?.city} ➝ {flightIn.arrivalAirport?.city} | {flightIn.departureTime}</div>
                                <div className="mb-2">
                                    <label className="small fw-bold">Hạng ghế:</label>
                                    <select className="form-control" value={classIn} onChange={(e) => setClassIn(e.target.value)} disabled={isEditMode}>
                                        {flightIn.seatDetails?.map((seat) => (
                                            <option key={seat.id} value={seat.seatClass} disabled={seat.availableSeats <= 0}>
                                                {seat.seatClass} - {seat.price.toLocaleString()} đ (Còn {seat.availableSeats} ghế)
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="small fw-bold">Số khách:</label>
                                    <input type="number" className="form-control" value={passengersIn.length} onChange={handleQtyInChange} disabled={isEditMode} />
                                </div>
                            </div>
                        )}

                        {/* TỔNG TIỀN */}
                        <div className="bg-light p-3 border rounded d-flex justify-content-between align-items-center">
                            <span className="fw-bold">TỔNG CỘNG:</span>
                            <span className="text-danger fw-bold fs-4">{totalAmount.toLocaleString()} VND</span>
                        </div>
                    </fieldset>
                </div>

                {/* --- CỘT PHẢI --- */}
                <div className="right-col">
                    <fieldset className="mb-4 p-3 border rounded bg-white">
                        <legend className="fw-bold text-primary">👤 Người liên hệ</legend>
                        <input type="text" className="form-control mb-2" value={contactInfo.fullName} onChange={e => setContactInfo({...contactInfo, fullName: e.target.value})} placeholder="Họ tên" />
                        <input type="text" className="form-control mb-2" value={contactInfo.phone} onChange={e => setContactInfo({...contactInfo, phone: e.target.value})} placeholder="SĐT" />
                        <input type="text" className="form-control" value={contactInfo.email} onChange={e => setContactInfo({...contactInfo, email: e.target.value})} placeholder="Email" />
                    </fieldset>

                    {/* DANH SÁCH KHÁCH CHIỀU ĐI */}
                    <fieldset className="mb-4 p-3 border rounded bg-white">
                        <legend className="fw-bold text-info">👥 Khách Chiều Đi</legend>
                        {passengersOut.map((p, index) => (
                            <div key={index} className="d-flex gap-2 mb-2 align-items-center">
                                <div style={{flex: 2}}>
                                    <input type="text" className="form-control" placeholder={`Tên khách ${index+1}`}
                                           value={p.fullName} onChange={e => handlePassengerChange(true, index, 'fullName', e.target.value)} style={{textTransform:'uppercase'}} />
                                </div>
                                <div style={{flex: 1}}>
                                    <input type="date" className="form-control" title="Ngày sinh"
                                           value={p.dob} onChange={e => handlePassengerChange(true, index, 'dob', e.target.value)} />
                                </div>
                                {getAge(p.dob) < 5 && p.dob && <span className="badge bg-success">-50%</span>}
                            </div>
                        ))}
                    </fieldset>

                    {/* DANH SÁCH KHÁCH CHIỀU VỀ */}
                    {flightIn && (
                        <fieldset className="mb-4 p-3 border rounded bg-white">
                            <legend className="fw-bold text-warning">👥 Khách Chiều Về</legend>
                            {passengersIn.map((p, index) => (
                                <div key={index} className="d-flex gap-2 mb-2 align-items-center">
                                    <div style={{flex: 2}}>
                                        <input type="text" className="form-control" placeholder={`Tên khách ${index+1}`}
                                               value={p.fullName} onChange={e => handlePassengerChange(false, index, 'fullName', e.target.value)} style={{textTransform:'uppercase'}} />
                                    </div>
                                    <div style={{flex: 1}}>
                                        <input type="date" className="form-control" title="Ngày sinh"
                                               value={p.dob} onChange={e => handlePassengerChange(false, index, 'dob', e.target.value)} />
                                    </div>
                                    {getAge(p.dob) < 5 && p.dob && <span className="badge bg-success">-50%</span>}
                                </div>
                            ))}
                        </fieldset>
                    )}

                    <fieldset className="mb-4 p-3 border rounded bg-white">
                        <legend className="fw-bold">💳 Thanh toán</legend>
                        <select className="form-control" value={contactInfo.paymentMethod} onChange={e => setContactInfo({...contactInfo, paymentMethod: e.target.value})}>
                            <option value="CASH">Tiền mặt tại quầy</option>
                            <option value="BANK_TRANSFER">Chuyển khoản</option>
                        </select>
                    </fieldset>

                    <div className="mt-4">
                        <button onClick={handleSubmit} className={`btn w-100 py-2 fw-bold ${isEditMode ? 'btn-warning' : 'btn-success'}`}>
                            {isEditMode ? 'CẬP NHẬT VÉ' : 'XÁC NHẬN & THANH TOÁN'}
                        </button>
                        <button onClick={() => navigate(-1)} className="btn btn-outline-secondary w-100 mt-2">Quay lại</button>
                    </div>
                </div>
            </div>

            {errorMessage && (
                <div style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.5)', display:'flex', justifyContent:'center', alignItems:'center'}}>
                    <div className="bg-white p-4 rounded shadow text-center">
                        <h3 className="text-danger">Thông báo</h3>
                        <p>{errorMessage}</p>
                        <button onClick={() => setErrorMessage(null)} className="btn btn-secondary">Đóng</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingDetails;