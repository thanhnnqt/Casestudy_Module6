import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FlightService } from '../service/BookingService.jsx';

const PASSENGER_TYPES = {
    ADULT: { label: 'Người lớn (>12T)', priceRate: 1.0 },
    CHILD: { label: 'Trẻ em (2-12T)', priceRate: 0.5 },
    INFANT: { label: 'Em bé (<2T)', priceRate: 0.1 }
};

// Component con
const PassengerList = React.memo(({ list, isOutbound, onPassengerChange, onToggleInfant, onInfantNameChange }) => (
    <fieldset className="mb-4 p-3 border rounded bg-white">
        <legend className={`fw-bold ${isOutbound ? 'text-info' : 'text-warning'}`}>
            👥 Khách Chiều {isOutbound ? 'Đi' : 'Về'}
        </legend>
        {list.map((p, index) => (
            <div key={index} className="mb-3 pb-3 border-bottom">
                <div className="d-flex gap-2 align-items-center mb-2">
                    <div style={{ width: '150px' }}>
                        <select className="form-select fw-bold" value={p.type} onChange={(e) => onPassengerChange(isOutbound, index, 'type', e.target.value)}
                                style={{ color: p.type === 'ADULT' ? '#0d6efd' : '#198754', borderColor: p.type === 'ADULT' ? '#0d6efd' : '#198754' }}>
                            <option value="ADULT">Người lớn</option>
                            <option value="CHILD">Trẻ em (2-12T)</option>
                        </select>
                    </div>
                    <div style={{ flex: 1 }}>
                        <input type="text" className="form-control" placeholder={`Họ tên khách ${index + 1}`} value={p.fullName}
                               onChange={(e) => onPassengerChange(isOutbound, index, 'fullName', e.target.value)} style={{ textTransform: 'uppercase' }} />
                    </div>
                    {p.type === 'ADULT' && (
                        <button className={`btn ${p.infant ? 'btn-outline-danger' : 'btn-outline-primary'}`}
                                onClick={() => onToggleInfant(isOutbound, index)} style={{ whiteSpace: 'nowrap', minWidth: '130px' }}>
                            {p.infant ? <span><i className="fa-solid fa-xmark"></i> Hủy bé</span> : <span><i className="fa-solid fa-baby"></i> + Kèm bé</span>}
                        </button>
                    )}
                </div>
                {p.infant && (
                    <div className="ms-5 mt-2 p-2 bg-light rounded border d-flex gap-2 align-items-center" style={{ borderLeft: '4px solid #6c757d' }}>
                        <span className="fw-bold text-secondary"><i className="fa-solid fa-baby-carriage"></i> Em bé:</span>
                        <input type="text" className="form-control form-control-sm" placeholder="Nhập tên em bé (Dưới 2 tuổi)"
                               value={p.infant.fullName} onChange={(e) => onInfantNameChange(isOutbound, index, e.target.value)} style={{ textTransform: 'uppercase', maxWidth: '300px' }} />
                        <span className="badge bg-secondary">Chung ghế</span><span className="text-danger small fw-bold">+10% giá vé</span>
                    </div>
                )}
            </div>
        ))}
    </fieldset>
));

const BookingDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { tripType, flightOut: stateFlightOut, flightIn: stateFlightIn, editingBooking } = location.state || {};
    const isEditMode = !!editingBooking;

    const [flightOut, setFlightOut] = useState(stateFlightOut || editingBooking?.flight);
    const [flightIn, setFlightIn] = useState(stateFlightIn || editingBooking?.returnFlight);
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

            const mapTicketsToPassengers = (tickets) => {
                if (!tickets || tickets.length === 0) return [{ fullName: '', type: 'ADULT', infant: null }];

                const mainPassengers = [];
                const infants = [];

                tickets.forEach(t => {
                    if (t.passengerType === 'INFANT' || t.isInfant || t.passengerDob === '2025-09-01') {
                        infants.push({ fullName: t.passengerName, id: t.id });
                    } else {
                        mainPassengers.push({
                            id: t.id,
                            fullName: t.passengerName,
                            type: (t.isChild || t.passengerType === 'CHILD' || t.passengerDob === '2022-01-01') ? 'CHILD' : 'ADULT',
                            infant: null
                        });
                    }
                });

                let infantIdx = 0;
                mainPassengers.forEach(p => {
                    if (p.type === 'ADULT' && infantIdx < infants.length) {
                        p.infant = { fullName: infants[infantIdx].fullName, id: infants[infantIdx].id };
                        infantIdx++;
                    } else if (p.type === 'ADULT' && (p.hasInfant || p.infantName)) {
                        p.infant = { fullName: p.infantName || '' };
                    }
                });

                if (mainPassengers.length === 0) return [{ fullName: '', type: 'ADULT', infant: null }];
                return mainPassengers;
            };

            const ticketsOut = editingBooking.tickets
                ? editingBooking.tickets.filter(t => t.flight && t.flight.id === flightOut.id)
                : [];

            if (ticketsOut.length > 0) {
                if (editingBooking.seatClassOut) setClassOut(editingBooking.seatClassOut);
                setPassengersOut(mapTicketsToPassengers(ticketsOut));
            }

            if (flightIn) {
                const ticketsIn = editingBooking.tickets
                    ? editingBooking.tickets.filter(t => t.flight && t.flight.id === flightIn.id)
                    : [];
                if (ticketsIn.length > 0) {
                    if (editingBooking.seatClassIn) setClassIn(editingBooking.seatClassIn);
                    setPassengersIn(mapTicketsToPassengers(ticketsIn));
                }
            }

        } else {
            if (!stateFlightOut && !editingBooking) navigate('/search-flight');
            if (stateFlightOut?.seatDetails?.length > 0) setClassOut(stateFlightOut.seatDetails[0].seatClass);
            if (stateFlightIn?.seatDetails?.length > 0) setClassIn(stateFlightIn.seatDetails[0].seatClass);
        }
    }, [isEditMode, editingBooking, stateFlightOut, stateFlightIn, navigate, flightOut, flightIn]);

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
    const handleQtyChange = (e, isOutbound) => {
        if (isEditMode) return;
        const qty = parseInt(e.target.value);
        if (isNaN(qty) || qty < 1) return;
        const seatDetail = isOutbound ? flightOut?.seatDetails?.find(s => s.seatClass === classOut) : flightIn?.seatDetails?.find(s => s.seatClass === classIn);
        const max = seatDetail ? seatDetail.availableSeats : 0;
        if (qty > max) return alert(`Hạng ghế này chỉ còn ${max} chỗ!`);
        const currentList = isOutbound ? passengersOut : passengersIn;
        const newList = [...currentList];
        while (newList.length < qty) newList.push({ fullName: '', type: 'ADULT', infant: null });
        while (newList.length > qty) newList.pop();
        if (isOutbound) setPassengersOut(newList); else setPassengersIn(newList);
    };
    const handlePassengerChange = useCallback((isOutbound, index, field, value) => {
        const setter = isOutbound ? setPassengersOut : setPassengersIn;
        setter(prev => {
            const newList = [...prev];
            const newItem = { ...newList[index] };
            if (field === 'type') {
                newItem.type = value;
                if (value === 'CHILD') newItem.infant = null;
            } else { newItem[field] = value.toUpperCase(); }
            newList[index] = newItem;
            return newList;
        });
    }, []);
    const toggleInfant = useCallback((isOutbound, index) => {
        const setter = isOutbound ? setPassengersOut : setPassengersIn;
        setter(prev => {
            const newList = [...prev];
            const newItem = { ...newList[index] };
            if (newItem.infant) newItem.infant = null;
            else newItem.infant = { fullName: '' };
            newList[index] = newItem;
            return newList;
        });
    }, []);
    const handleInfantNameChange = useCallback((isOutbound, parentIndex, value) => {
        const setter = isOutbound ? setPassengersOut : setPassengersIn;
        setter(prev => {
            const newList = [...prev];
            const newItem = { ...newList[parentIndex] };
            if (newItem.infant) newItem.infant = { ...newItem.infant, fullName: value.toUpperCase() };
            newList[parentIndex] = newItem;
            return newList;
        });
    }, []);

    const handleSubmit = async () => {
        if (!contactInfo.fullName || !contactInfo.phone) return setErrorMessage("Thiếu thông tin liên hệ");

        const flattenPassengers = (list) => {
            return list.flatMap(p => {
                const main = {
                    id: p.id,
                    fullName: p.fullName,
                    isChild: p.type === 'CHILD',
                    hasInfant: false,
                    infantName: null,
                    passengerType: p.type,
                    dob: p.type === 'CHILD' ? '2022-01-01' : '1990-01-01'
                };
                const result = [main];
                if (p.infant) {
                    result.push({
                        id: p.infant.id || null,
                        fullName: p.infant.fullName,
                        isChild: false,
                        isInfant: true,
                        hasInfant: false,
                        passengerType: 'INFANT',
                        dob: '2025-09-01'
                    });
                }
                return result;
            });
        };

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
            passengersOut: flattenPassengers(passengersOut),
            passengersIn: flightIn ? flattenPassengers(passengersIn) : null
        };

        try {
            if (isEditMode) {
                await FlightService.updateBookingInfo(payload);
                navigate('/management', { state: { updated: true } });
                return;
            }

            const res = await FlightService.createCounterBooking(payload);
            const savedBooking = res.data;

            if (contactInfo.paymentMethod === 'VNPAY') {
                const paymentRes = await FlightService.createPaymentUrl(savedBooking.totalAmount, savedBooking.bookingCode);
                const redirectUrl = paymentRes.data.url || paymentRes.data;
                if (redirectUrl) window.location.href = redirectUrl;
                else console.error("URL VNPAY không tồn tại");
            } else {
                navigate('/management', { state: { newBooking: true } });
            }

        } catch (err) {
            console.error("Lỗi đặt vé:", err);
            setErrorMessage(err.response?.data?.message || err.response?.data || "Lỗi xử lý đặt vé!");
        }
    };

    if (!flightOut) return null;

    return (
        <div className="booking-wrapper" style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '1200px', margin: '0 auto' }} >
            <h2 style={{ color: '#0056b3', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                {isEditMode ? 'Cập Nhật Thông Tin Vé' : 'Xác Nhận & Thanh Toán'}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px' }}>
                <div className="left-col">
                    <fieldset style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <legend style={{ fontWeight: 'bold', color: '#555', fontSize: '1.1em' }}>✈ Tùy chọn Vé</legend>
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
                <div className="right-col">
                    <fieldset className="mb-4 p-3 border rounded bg-white">
                        <legend className="fw-bold text-primary">👤 Người liên hệ</legend>
                        <input type="text" className="form-control mb-2" value={contactInfo.fullName} onChange={e => setContactInfo({ ...contactInfo, fullName: e.target.value })} placeholder="Họ tên" />
                        <input type="text" className="form-control mb-2" value={contactInfo.phone} onChange={e => setContactInfo({ ...contactInfo, phone: e.target.value })} placeholder="SĐT" />
                        <input type="text" className="form-control" value={contactInfo.email} onChange={e => setContactInfo({ ...contactInfo, email: e.target.value })} placeholder="Email" />
                    </fieldset>
                    <PassengerList list={passengersOut} isOutbound={true} onPassengerChange={handlePassengerChange} onToggleInfant={toggleInfant} onInfantNameChange={handleInfantNameChange} />
                    {flightIn && <PassengerList list={passengersIn} isOutbound={false} onPassengerChange={handlePassengerChange} onToggleInfant={toggleInfant} onInfantNameChange={handleInfantNameChange} />}
                    <fieldset className="mb-4 p-3 border rounded bg-white">
                        <legend className="fw-bold">💳 Thanh toán</legend>
                        <select className="form-control" value={contactInfo.paymentMethod} onChange={e => setContactInfo({ ...contactInfo, paymentMethod: e.target.value })}>
                            <option value="VNPAY">💳 Cổng thanh toán VNPAY</option>
                            <option value="CASH">💵 Tiền mặt tại quầy</option>
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
            {
                errorMessage && (
                    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div className="bg-white p-4 rounded shadow text-center">
                            <h3 className="text-danger">Thông báo</h3>
                            <p>{errorMessage}</p>
                            <button onClick={() => setErrorMessage(null)} className="btn btn-secondary">Đóng</button>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default BookingDetails;