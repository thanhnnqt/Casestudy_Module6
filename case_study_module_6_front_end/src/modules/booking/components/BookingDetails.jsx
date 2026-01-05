import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FlightService } from '../service/BookingService.jsx';

// Định nghĩa các loại khách
const PASSENGER_TYPES = {
    ADULT: { label: 'Người lớn (>12T)', priceRate: 1.0 },
    CHILD: { label: 'Trẻ em (2-12T)', priceRate: 0.5 },
    INFANT: { label: 'Em bé (<2T)', priceRate: 0.1 }
};

const BookingDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { tripType, flightOut: stateFlightOut, flightIn: stateFlightIn, editingBooking } = location.state || {};
    const isEditMode = !!editingBooking;

    const [flightOut, setFlightOut] = useState(stateFlightOut || editingBooking?.flight);
    const [flightIn, setFlightIn]   = useState(stateFlightIn || editingBooking?.returnFlight);

    // Mặc định chọn VNPAY để test cho sướng
    const [contactInfo, setContactInfo] = useState({ fullName: '', email: '', phone: '', paymentMethod: 'VNPAY' });

    const [classOut, setClassOut] = useState('ECONOMY');
    const [classIn, setClassIn] = useState('ECONOMY');

    const [passengersOut, setPassengersOut] = useState([{ fullName: '', type: 'ADULT', infant: null }]);
    const [passengersIn, setPassengersIn] = useState([{ fullName: '', type: 'ADULT', infant: null }]);

    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        if (isEditMode && editingBooking) {
            setContactInfo({
                fullName: editingBooking.contactName,
                email: editingBooking.contactEmail || '',
                phone: editingBooking.contactPhone,
                paymentMethod: editingBooking.paymentMethod || 'VNPAY'
            });
        } else {
            if (!stateFlightOut && !editingBooking) navigate('/search-flight');
            if (stateFlightOut?.seatDetails?.length > 0) setClassOut(stateFlightOut.seatDetails[0].seatClass);
            if (stateFlightIn?.seatDetails?.length > 0) setClassIn(stateFlightIn.seatDetails[0].seatClass);
        }
    }, [isEditMode, editingBooking, stateFlightOut, stateFlightIn, navigate]);

    // ... (Giữ nguyên các hàm tính tiền calculateTotalPrice, totalAmount, handleQtyChange, handlePassengerChange...)
    // Tôi ẩn đi để code ngắn gọn, ông cứ giữ nguyên logic cũ nhé.
    const calculateTotalPrice = (seatDetail, passengerList) => {
        if (!seatDetail) return 0;
        let total = 0;
        passengerList.forEach(p => {
            const rate = PASSENGER_TYPES[p.type].priceRate;
            total += seatDetail.price * rate;
            if (p.infant) total += seatDetail.price * PASSENGER_TYPES.INFANT.priceRate;
        });
        return total;
    };

    const totalAmount = (() => {
        const seatOutDetail = flightOut?.seatDetails?.find(s => s.seatClass === classOut);
        const seatInDetail = flightIn?.seatDetails?.find(s => s.seatClass === classIn);
        let total = calculateTotalPrice(seatOutDetail, passengersOut);
        if (flightIn) total += calculateTotalPrice(seatInDetail, passengersIn);
        return total;
    })();

    const currentSeatOut = flightOut?.seatDetails?.find(s => s.seatClass === classOut);
    const maxOut = currentSeatOut ? currentSeatOut.availableSeats : 0;
    const currentSeatIn = flightIn?.seatDetails?.find(s => s.seatClass === classIn);
    const maxIn = currentSeatIn ? currentSeatIn.availableSeats : 0;

    const handleQtyChange = (e, isOutbound) => { /* Giữ nguyên code cũ */
        if(isEditMode) return;
        const qty = parseInt(e.target.value);
        const max = isOutbound ? maxOut : maxIn;
        if (isNaN(qty) || qty < 1) return;
        if (qty > max) return alert(`Hạng ghế này chỉ còn ${max} chỗ!`);
        const currentList = isOutbound ? passengersOut : passengersIn;
        const newList = [...currentList];
        while (newList.length < qty) newList.push({ fullName: '', type: 'ADULT', infant: null });
        while (newList.length > qty) newList.pop();
        if (isOutbound) setPassengersOut(newList); else setPassengersIn(newList);
    };

    const handlePassengerChange = (isOutbound, index, field, value) => { /* Giữ nguyên code cũ */
        const currentList = isOutbound ? passengersOut : passengersIn;
        const newList = [...currentList];
        if (field === 'type') {
            newList[index].type = value;
            if (value === 'CHILD') newList[index].infant = null;
        } else { newList[index][field] = value.toUpperCase(); }
        if (isOutbound) setPassengersOut(newList); else setPassengersIn(newList);
    };

    const toggleInfant = (isOutbound, index) => { /* Giữ nguyên code cũ */
        const currentList = isOutbound ? passengersOut : passengersIn;
        const newList = [...currentList];
        if (newList[index].infant) newList[index].infant = null;
        else newList[index].infant = { fullName: '' };
        if (isOutbound) setPassengersOut(newList); else setPassengersIn(newList);
    };

    const handleInfantNameChange = (isOutbound, parentIndex, value) => { /* Giữ nguyên code cũ */
        const currentList = isOutbound ? passengersOut : passengersIn;
        const newList = [...currentList];
        if (newList[parentIndex].infant) newList[parentIndex].infant.fullName = value.toUpperCase();
        if (isOutbound) setPassengersOut(newList); else setPassengersIn(newList);
    };

    // --- [QUAN TRỌNG] HÀM SUBMIT MỚI CÓ VNPAY ---
    const handleSubmit = async () => {
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
            paymentMethod: contactInfo.paymentMethod, // VNPAY, CASH, BANK_TRANSFER

            passengersOut: passengersOut.map(p => ({
                fullName: p.fullName,
                isChild: p.type === 'CHILD',
                hasInfant: !!p.infant,
                infantName: p.infant ? p.infant.fullName : null
            })),

            passengersIn: flightIn ? passengersIn.map(p => ({
                fullName: p.fullName,
                isChild: p.type === 'CHILD',
                hasInfant: !!p.infant,
                infantName: p.infant ? p.infant.fullName : null
            })) : null
        };

        try {
            // Bước 1: Tạo Booking trước (Trạng thái PENDING/UNPAID)
            const res = isEditMode
                ? await FlightService.updateBookingInfo(payload)
                : await FlightService.createBooking(payload);

            const savedBooking = res.data; // Lấy thông tin booking đã lưu

            // Bước 2: Kiểm tra phương thức thanh toán
            if (contactInfo.paymentMethod === 'VNPAY') {
                // Gọi API lấy link thanh toán
                const paymentRes = await FlightService.createPaymentUrl(savedBooking.totalAmount, savedBooking.bookingCode);

                // Chuyển hướng sang VNPAY
                window.location.href = paymentRes.data;
            } else {
                // Nếu là Tiền mặt/CK thì chuyển về trang quản lý
                navigate('/management', { state: { updated: isEditMode, newBooking: !isEditMode } });
            }

        } catch (err) {
            console.error(err);
            setErrorMessage(err.response?.data || "Lỗi xử lý đặt vé!");
        }
    };

    if (!flightOut) return null;

    // Component render danh sách hành khách (Giữ nguyên)
    const PassengerList = ({ list, isOutbound }) => (
        <fieldset className="mb-4 p-3 border rounded bg-white">
            <legend className={`fw-bold ${isOutbound ? 'text-info' : 'text-warning'}`}>
                👥 Khách Chiều {isOutbound ? 'Đi' : 'Về'}
            </legend>
            {list.map((p, index) => (
                <div key={index} className="mb-3 pb-3 border-bottom">
                    <div className="d-flex gap-2 align-items-center mb-2">
                        <div style={{width: '150px'}}>
                            <select className="form-select fw-bold" value={p.type} onChange={(e) => handlePassengerChange(isOutbound, index, 'type', e.target.value)}
                                    style={{color: p.type === 'ADULT' ? '#0d6efd' : '#198754', borderColor: p.type === 'ADULT' ? '#0d6efd' : '#198754'}}>
                                <option value="ADULT">Người lớn</option>
                                <option value="CHILD">Trẻ em (2-12T)</option>
                            </select>
                        </div>
                        <div style={{flex: 1}}>
                            <input type="text" className="form-control" placeholder={`Họ tên khách ${index+1}`} value={p.fullName} onChange={(e) => handlePassengerChange(isOutbound, index, 'fullName', e.target.value)} style={{textTransform:'uppercase'}} />
                        </div>
                        {p.type === 'ADULT' && (
                            <button className={`btn ${p.infant ? 'btn-outline-danger' : 'btn-outline-primary'}`} onClick={() => toggleInfant(isOutbound, index)} style={{whiteSpace: 'nowrap', minWidth: '130px'}}>
                                {p.infant ? <span><i className="fa-solid fa-xmark"></i> Hủy bé</span> : <span><i className="fa-solid fa-baby"></i> + Kèm bé</span>}
                            </button>
                        )}
                    </div>
                    {p.infant && (
                        <div className="ms-5 mt-2 p-2 bg-light rounded border d-flex gap-2 align-items-center" style={{borderLeft: '4px solid #6c757d'}}>
                            <span className="fw-bold text-secondary"><i className="fa-solid fa-baby-carriage"></i> Em bé:</span>
                            <input type="text" className="form-control form-control-sm" placeholder="Nhập tên em bé (Dưới 2 tuổi)" value={p.infant.fullName} onChange={(e) => handleInfantNameChange(isOutbound, index, e.target.value)} style={{textTransform:'uppercase', maxWidth: '300px'}} />
                            <span className="badge bg-secondary">Chung ghế</span><span className="text-danger small fw-bold">+10% giá vé</span>
                        </div>
                    )}
                </div>
            ))}
        </fieldset>
    );

    return (
        <div className="booking-wrapper" style={{fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '1200px', margin: '0 auto'}}>
            <h2 style={{color: '#0056b3', borderBottom: '2px solid #eee', paddingBottom: '10px'}}>
                {isEditMode ? 'Cập Nhật Thông Tin Vé' : 'Xác Nhận & Thanh Toán'}
            </h2>

            <div style={{display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px'}}>
                {/* CỘT TRÁI (Giữ nguyên) */}
                <div className="left-col">
                    <fieldset style={{border: '1px solid #ddd', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)'}}>
                        <legend style={{fontWeight: 'bold', color: '#555', fontSize:'1.1em'}}>✈ Tùy chọn Vé</legend>
                        {/* Chiều đi */}
                        <div className="mb-4 p-3 bg-white border rounded">
                            <h5 className="text-primary fw-bold">🛫 CHIỀU ĐI: {flightOut.flightNumber}</h5>
                            <div className="text-muted small mb-2">{flightOut.departureAirport?.city} ➝ {flightOut.arrivalAirport?.city}</div>
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
                                <label className="small fw-bold">Số lượng (Ghế ngồi):</label>
                                <input type="number" className="form-control" value={passengersOut.length} onChange={(e) => handleQtyChange(e, true)} disabled={isEditMode} />
                            </div>
                        </div>
                        {/* Chiều về */}
                        {flightIn && (
                            <div className="mb-4 p-3 bg-white border rounded">
                                <h5 className="text-success fw-bold">🛬 CHIỀU VỀ: {flightIn.flightNumber}</h5>
                                <div className="text-muted small mb-2">{flightIn.departureAirport?.city} ➝ {flightIn.arrivalAirport?.city}</div>
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
                                    <label className="small fw-bold">Số lượng (Ghế ngồi):</label>
                                    <input type="number" className="form-control" value={passengersIn.length} onChange={(e) => handleQtyChange(e, false)} disabled={isEditMode} />
                                </div>
                            </div>
                        )}
                        <div className="bg-light p-3 border rounded d-flex justify-content-between align-items-center">
                            <span className="fw-bold">TỔNG CỘNG:</span>
                            <span className="text-danger fw-bold fs-4">{totalAmount.toLocaleString()} VND</span>
                        </div>
                    </fieldset>
                </div>

                {/* CỘT PHẢI */}
                <div className="right-col">
                    <fieldset className="mb-4 p-3 border rounded bg-white">
                        <legend className="fw-bold text-primary">👤 Người liên hệ</legend>
                        <input type="text" className="form-control mb-2" value={contactInfo.fullName} onChange={e => setContactInfo({...contactInfo, fullName: e.target.value})} placeholder="Họ tên" />
                        <input type="text" className="form-control mb-2" value={contactInfo.phone} onChange={e => setContactInfo({...contactInfo, phone: e.target.value})} placeholder="SĐT" />
                        <input type="text" className="form-control" value={contactInfo.email} onChange={e => setContactInfo({...contactInfo, email: e.target.value})} placeholder="Email" />
                    </fieldset>

                    <PassengerList list={passengersOut} isOutbound={true} />
                    {flightIn && <PassengerList list={passengersIn} isOutbound={false} />}

                    <fieldset className="mb-4 p-3 border rounded bg-white">
                        <legend className="fw-bold">💳 Thanh toán</legend>
                        <select className="form-control" value={contactInfo.paymentMethod} onChange={e => setContactInfo({...contactInfo, paymentMethod: e.target.value})}>
                            <option value="VNPAY">💳 Cổng thanh toán VNPAY</option>
                            <option value="CASH">💵 Tiền mặt tại quầy</option>
                            <option value="BANK_TRANSFER">🏦 Chuyển khoản ngân hàng</option>
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