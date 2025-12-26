import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FlightService } from '../service/BookingService.jsx';

const BookingDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Lấy dữ liệu từ trang trước
    // Lưu ý: Dùng 'tripType' để khớp với DTO của backend
    const { tripType, flightOut, flightIn } = location.state || {};

    // --- QUẢN LÝ TRẠNG THÁI (STATE) ---
    const [contactInfo, setContactInfo] = useState({ fullName: '', email: '', phone: '', paymentMethod: 'CASH' });

    // Hạng ghế riêng cho từng chiều
    const [classOut, setClassOut] = useState(() => flightOut?.seatDetails?.[0]?.seatClass || 'ECONOMY');
    const [classIn, setClassIn] = useState(() => flightIn?.seatDetails?.[0]?.seatClass || 'ECONOMY');

    // >>> TÁCH RIÊNG DANH SÁCH KHÁCH (QUAN TRỌNG) <<<
    // Mặc định mỗi chiều có 1 khách ban đầu
    const [passengersOut, setPassengersOut] = useState([{ fullName: '' }]);
    const [passengersIn, setPassengersIn] = useState([{ fullName: '' }]);

    const [successData, setSuccessData] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        if (!flightOut) {
            navigate('/search-flight'); // Quay về nếu không có dữ liệu vé
        }
    }, [flightOut, navigate]);

    // --- LOGIC TÍNH TOÁN GIÁ & GHẾ TRỐNG ---

    // 1. Lấy thông tin ghế chi tiết
    const seatOutDetail = flightOut?.seatDetails.find(s => s.seatClass === classOut);
    const seatInDetail = flightIn?.seatDetails.find(s => s.seatClass === classIn);

    // 2. Lấy giá và số ghế trống tối đa của từng chiều
    const priceOut = seatOutDetail ? seatOutDetail.price : 0;
    const priceIn = seatInDetail ? seatInDetail.price : 0;

    const maxOut = seatOutDetail ? seatOutDetail.availableSeats : 0;
    const maxIn = seatInDetail ? seatInDetail.availableSeats : 0;

    // 3. Tính tổng tiền = (Giá đi * Số khách đi) + (Giá về * Số khách về)
    // Lưu ý: Chỉ tính tiền chiều về nếu có chuyến về (flightIn)
    const totalAmount = (priceOut * passengersOut.length) + (flightIn ? (priceIn * passengersIn.length) : 0);

    // --- XỬ LÝ SỰ KIỆN: CHIỀU ĐI ---
    const handleQtyOutChange = (e) => {
        const qty = parseInt(e.target.value);
        if (isNaN(qty) || qty < 1) return;

        if (qty > maxOut) {
            setErrorMessage(`Chiều đi chỉ còn ${maxOut} ghế hạng ${classOut}!`);
            return;
        }

        // Cập nhật mảng khách chiều đi
        const newArr = [...passengersOut];
        while (newArr.length < qty) newArr.push({ fullName: '' }); // Thêm khách nếu tăng số lượng
        while (newArr.length > qty) newArr.pop(); // Bớt khách nếu giảm số lượng
        setPassengersOut(newArr);
    };

    const handleNameOutChange = (index, val) => {
        const newArr = [...passengersOut];
        newArr[index].fullName = val.toUpperCase();
        setPassengersOut(newArr);
    };

    // --- XỬ LÝ SỰ KIỆN: CHIỀU VỀ ---
    const handleQtyInChange = (e) => {
        const qty = parseInt(e.target.value);
        if (isNaN(qty) || qty < 1) return;

        if (qty > maxIn) {
            setErrorMessage(`Chiều về chỉ còn ${maxIn} ghế hạng ${classIn}!`);
            return;
        }

        // Cập nhật mảng khách chiều về
        const newArr = [...passengersIn];
        while (newArr.length < qty) newArr.push({ fullName: '' });
        while (newArr.length > qty) newArr.pop();
        setPassengersIn(newArr);
    };

    const handleNameInChange = (index, val) => {
        const newArr = [...passengersIn];
        newArr[index].fullName = val.toUpperCase();
        setPassengersIn(newArr);
    };

    // --- GỬI ĐƠN HÀNG (SUBMIT) ---
    const handleSubmit = () => {
        // 1. Kiểm tra thông tin liên hệ
        if (!contactInfo.fullName || !contactInfo.phone) {
            return setErrorMessage("Vui lòng nhập đầy đủ thông tin người liên hệ!");
        }

        // 2. Kiểm tra tên hành khách
        if (passengersOut.some(p => !p.fullName.trim())) {
            return setErrorMessage("Vui lòng nhập đầy đủ tên hành khách Chiều Đi!");
        }
        if (flightIn && passengersIn.some(p => !p.fullName.trim())) {
            return setErrorMessage("Vui lòng nhập đầy đủ tên hành khách Chiều Về!");
        }

        // 3. Chuẩn bị dữ liệu gửi xuống Backend
        const payload = {
            flightId: flightOut.id,
            returnFlightId: flightIn ? flightIn.id : null,
            tripType: tripType, // Đã sửa thành tripType để khớp với backend

            // Gửi hạng ghế riêng
            seatClassOut: classOut,
            seatClassIn: flightIn ? classIn : null,

            contactName: contactInfo.fullName,
            contactPhone: contactInfo.phone,
            contactEmail: contactInfo.email,
            paymentMethod: contactInfo.paymentMethod,

            // >>> QUAN TRỌNG: Gửi 2 danh sách khách riêng biệt <<<
            passengersOut: passengersOut.map(p => ({ fullName: p.fullName })),
            passengersIn: flightIn ? passengersIn.map(p => ({ fullName: p.fullName })) : null
        };

        // 4. Gọi API tạo đơn hàng
        FlightService.createBooking(payload)
            .then(res => {
                setSuccessData({
                    bookingCode: res.data.bookingCode,
                    contactName: contactInfo.fullName,
                    totalPrice: totalAmount // Hiển thị tổng tiền chính xác
                });
            })
            .catch(err => {
                console.error("Lỗi đặt vé:", err);
                const msg = err.response?.data || "Lỗi hệ thống hoặc hết vé!";
                setErrorMessage(typeof msg === 'string' ? msg : JSON.stringify(msg));
            });
    };

    if (!flightOut) return null;

    return (
        <div className="booking-wrapper" style={{fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '1200px', margin: '0 auto'}}>
            <h2 style={{color: '#0056b3', borderBottom: '2px solid #eee', paddingBottom: '10px'}}>
                Xác Nhận & Thanh Toán
            </h2>

            <div style={{display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px'}}>

                {/* === CỘT TRÁI: THÔNG TIN VÉ & CẤU HÌNH === */}
                <div className="left-col">
                    <fieldset style={{border: '1px solid #ddd', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)'}}>
                        <legend style={{fontWeight: 'bold', color: '#555', fontSize:'1.1em'}}>✈ Tùy chọn Vé</legend>

                        {/* --- KHỐI 1: CHIỀU ĐI --- */}
                        <div className="mb-4 p-3 bg-white border rounded">
                            <h5 className="text-primary fw-bold">🛫 CHIỀU ĐI: {flightOut.flightNumber}</h5>
                            <div className="text-muted small mb-2">
                                {flightOut.departureAirport.city} ➝ {flightOut.arrivalAirport.city} | {new Date(flightOut.departureTime).toLocaleString('vi-VN')}
                            </div>

                            <div className="row align-items-center">
                                <div className="col-8">
                                    <label className="fw-bold small">Hạng ghế:</label>
                                    <select className="form-control" value={classOut} onChange={(e) => setClassOut(e.target.value)}>
                                        {flightOut.seatDetails.map(s => (
                                            <option key={s.id} value={s.seatClass} disabled={s.availableSeats === 0}>
                                                {s.seatClass} - {s.price.toLocaleString()} đ (Còn {s.availableSeats})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-4">
                                    <label className="fw-bold small">Số khách:</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        min="1"
                                        max={maxOut}
                                        value={passengersOut.length}
                                        onChange={handleQtyOutChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* --- KHỐI 2: CHIỀU VỀ (Chỉ hiện nếu có) --- */}
                        {flightIn && (
                            <div className="mb-4 p-3 bg-white border rounded">
                                <h5 className="text-success fw-bold">🛬 CHIỀU VỀ: {flightIn.flightNumber}</h5>
                                <div className="text-muted small mb-2">
                                    {flightIn.departureAirport.city} ➝ {flightIn.arrivalAirport.city} | {new Date(flightIn.departureTime).toLocaleString('vi-VN')}
                                </div>

                                <div className="row align-items-center">
                                    <div className="col-8">
                                        <label className="fw-bold small">Hạng ghế:</label>
                                        <select className="form-control" value={classIn} onChange={(e) => setClassIn(e.target.value)}>
                                            {flightIn.seatDetails.map(s => (
                                                <option key={s.id} value={s.seatClass} disabled={s.availableSeats === 0}>
                                                    {s.seatClass} - {s.price.toLocaleString()} đ (Còn {s.availableSeats})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-4">
                                        <label className="fw-bold small">Số khách:</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            min="1"
                                            max={maxIn}
                                            value={passengersIn.length}
                                            onChange={handleQtyInChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* --- BẢNG TỔNG TIỀN --- */}
                        <div style={{backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px dashed #ccc'}}>
                            <div className="d-flex justify-content-between mb-1">
                                <span>Chiều đi ({classOut}): {priceOut.toLocaleString()} x {passengersOut.length}</span>
                                <span className="fw-bold">{(priceOut * passengersOut.length).toLocaleString()} đ</span>
                            </div>

                            {flightIn && (
                                <div className="d-flex justify-content-between mb-1">
                                    <span>Chiều về ({classIn}): {priceIn.toLocaleString()} x {passengersIn.length}</span>
                                    <span className="fw-bold">{(priceIn * passengersIn.length).toLocaleString()} đ</span>
                                </div>
                            )}

                            <hr style={{margin:'10px 0'}}/>

                            <div className="d-flex justify-content-between align-items-center">
                                <span className="fw-bold text-dark" style={{fontSize:'1.1em'}}>TỔNG CỘNG:</span>
                                <strong style={{fontSize: '1.6em', color: '#d9534f'}}>{totalAmount.toLocaleString()} VND</strong>
                            </div>
                        </div>
                    </fieldset>
                </div>

                {/* === CỘT PHẢI: NHẬP THÔNG TIN KHÁCH === */}
                <div className="right-col">
                    {/* Người liên hệ */}
                    <fieldset className="mb-4" style={{border: '1px solid #ddd', padding: '15px', borderRadius: '8px', backgroundColor: '#eef6fc'}}>
                        <legend style={{fontWeight: 'bold', color: '#0056b3', fontSize: '1em'}}>👤 Người liên hệ</legend>
                        <input type="text" className="form-control mb-2" placeholder="Họ tên" value={contactInfo.fullName} onChange={(e) => setContactInfo({...contactInfo, fullName: e.target.value})} />
                        <input type="text" className="form-control mb-2" placeholder="Số điện thoại" value={contactInfo.phone} onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})} />
                        <input type="text" className="form-control" placeholder="Email" value={contactInfo.email} onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})} />
                    </fieldset>

                    {/* DANH SÁCH KHÁCH CHIỀU ĐI */}
                    <fieldset className="mb-4" style={{border: '1px solid #ddd', padding: '15px', borderRadius: '8px'}}>
                        <legend style={{fontWeight: 'bold', color: '#0d6efd', fontSize: '1em'}}>
                            👥 Khách Chiều Đi ({passengersOut.length})
                        </legend>
                        <div style={{maxHeight: '250px', overflowY: 'auto', paddingRight:'5px'}}>
                            {passengersOut.map((p, index) => (
                                <div key={index} className="mb-2">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder={`Họ tên khách ${index+1} (Chiều đi)`}
                                        value={p.fullName}
                                        onChange={(e) => handleNameOutChange(index, e.target.value)}
                                        style={{textTransform: 'uppercase'}}
                                    />
                                </div>
                            ))}
                        </div>
                    </fieldset>

                    {/* DANH SÁCH KHÁCH CHIỀU VỀ (Nếu có) */}
                    {flightIn && (
                        <fieldset className="mb-4" style={{border: '1px solid #ddd', padding: '15px', borderRadius: '8px'}}>
                            <legend style={{fontWeight: 'bold', color: '#198754', fontSize: '1em'}}>
                                👥 Khách Chiều Về ({passengersIn.length})
                            </legend>
                            <div style={{maxHeight: '250px', overflowY: 'auto', paddingRight:'5px'}}>
                                {passengersIn.map((p, index) => (
                                    <div key={index} className="mb-2">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder={`Họ tên khách ${index+1} (Chiều về)`}
                                            value={p.fullName}
                                            onChange={(e) => handleNameInChange(index, e.target.value)}
                                            style={{textTransform: 'uppercase'}}
                                        />
                                    </div>
                                ))}
                            </div>
                        </fieldset>
                    )}

                    {/* Thanh toán & Submit */}
                    <fieldset style={{border: '1px solid #ddd', padding: '15px', borderRadius: '8px'}}>
                        <legend style={{fontWeight: 'bold', color: '#555', fontSize: '1em'}}>💳 Thanh toán</legend>
                        <select className="form-control" value={contactInfo.paymentMethod} onChange={(e) => setContactInfo({...contactInfo, paymentMethod: e.target.value})}>
                            <option value="CASH">Tiền mặt tại quầy</option>
                            <option value="BANK_TRANSFER">Chuyển khoản</option>
                        </select>
                    </fieldset>

                    <div className="mt-4">
                        <button onClick={handleSubmit} className="btn btn-success w-100 py-2 fw-bold" style={{fontSize: '1.1em'}}>
                            XÁC NHẬN & THANH TOÁN
                        </button>
                        <button onClick={() => navigate(-1)} className="btn btn-outline-secondary w-100 mt-2">
                            Quay lại
                        </button>
                    </div>
                </div>
            </div>

            {/* --- MODAL THÀNH CÔNG --- */}
            {successData && (
                <div style={overlayStyle}>
                    <div style={modalStyle}>
                        <div style={{fontSize: '3em', marginBottom: '10px'}}>🎉</div>
                        <h3 className="text-success fw-bold">THÀNH CÔNG!</h3>
                        <div className="alert alert-light border mt-3 text-start">
                            <p className="mb-1"><strong>Mã đặt chỗ:</strong> <span className="text-primary fs-5">{successData.bookingCode}</span></p>
                            <p className="mb-1"><strong>Người liên hệ:</strong> {successData.contactName}</p>
                            <p className="mb-0"><strong>Tổng tiền:</strong> <span className="text-danger fw-bold">{successData.totalPrice.toLocaleString()} VND</span></p>
                        </div>
                        <button onClick={() => navigate('/management', {state: {newBooking: true}})} className="btn btn-primary px-4 mt-2">
                            Về trang quản lý
                        </button>
                    </div>
                </div>
            )}

            {/* --- MODAL LỖI --- */}
            {errorMessage && (
                <div style={overlayStyle}>
                    <div style={modalStyle}>
                        <h3 className="text-danger fw-bold">LỖI!</h3>
                        <p className="text-muted my-3">{errorMessage}</p>
                        <button onClick={() => setErrorMessage(null)} className="btn btn-secondary px-4">Đóng</button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Style cho Modal
const overlayStyle = { position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.5)', zIndex: 1000, display:'flex', justifyContent:'center', alignItems:'center' };
const modalStyle = { background:'white', padding:'30px', borderRadius:'12px', textAlign:'center', maxWidth:'400px', width:'90%', boxShadow: '0 5px 15px rgba(0,0,0,0.2)' };

export default BookingDetails;