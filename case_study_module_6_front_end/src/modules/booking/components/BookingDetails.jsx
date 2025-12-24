import React, {useEffect, useState} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FlightService } from '../service/BookingService.jsx';

const BookingDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Lấy dữ liệu chuyến bay từ trang trước
    const flight = location.state?.flight;

    // --- STATE QUẢN LÝ ---
    // 1. Thông tin người liên hệ
    const [contactInfo, setContactInfo] = useState({
        fullName: '',
        email: '',
        phone: '', // Trường quan trọng mới thêm
        paymentMethod: 'CASH'
    });

    // 2. Hạng ghế đang chọn
    const [selectedSeat, setSelectedSeat] = useState(() => {
        if (flight && flight.seatDetails && flight.seatDetails.length > 0) {
            // Sắp xếp giá từ thấp đến cao, chọn cái rẻ nhất mặc định
            const sortedSeats = [...flight.seatDetails].sort((a, b) => a.price - b.price);
            return sortedSeats[0];
        }
        return null;
    });

    // 3. Danh sách hành khách
    const [passengers, setPassengers] = useState([{ fullName: '' }]);

    // --- EFFECT ---
    useEffect(() => {
        if (!flight) {
            alert("Vui lòng chọn chuyến bay trước!");
            navigate('/new-sale');
        }
    }, [flight, navigate]);

    // --- HANDLERS ---

    // Đổi hạng ghế
    const handleClassChange = (e) => {
        const newClass = flight.seatDetails.find(s => s.seatClass === e.target.value);
        if (newClass) {
            setSelectedSeat(newClass);
            if (passengers.length > newClass.availableSeats) {
                setPassengers([{ fullName: '' }]);
                alert(`Hạng ghế này chỉ còn ${newClass.availableSeats} chỗ!`);
            }
        }
    };

    // Đổi số lượng khách
    const handleQuantityChange = (e) => {
        const newQuantity = parseInt(e.target.value);
        if (newQuantity < 1) return;
        if (selectedSeat && newQuantity > selectedSeat.availableSeats) {
            alert(`Chỉ còn ${selectedSeat.availableSeats} ghế cho hạng này!`);
            return;
        }

        const newPassengers = [...passengers];
        if (newQuantity > passengers.length) {
            for (let i = 0; i < newQuantity - passengers.length; i++) {
                newPassengers.push({ fullName: '' });
            }
        } else {
            newPassengers.length = newQuantity;
        }
        setPassengers(newPassengers);
    };

    // Nhập tên hành khách
    const handlePassengerNameChange = (index, value) => {
        const updatedPassengers = [...passengers];
        updatedPassengers[index].fullName = value.toUpperCase(); // Tự động viết hoa cho đẹp
        setPassengers(updatedPassengers);
    };

    // Tính tổng tiền
    const unitPrice = selectedSeat ? selectedSeat.price : 0;
    const totalPrice = unitPrice * passengers.length;

    // --- SUBMIT (QUAN TRỌNG) ---
    const handleSubmit = () => {
        // 1. Validate: BẮT BUỘC SỐ ĐIỆN THOẠI & TÊN
        if (!contactInfo.fullName || !contactInfo.phone) {
            alert("Vui lòng nhập Tên và Số điện thoại người liên hệ!");
            return;
        }

        // Validate tên hành khách
        if (passengers.some(p => !p.fullName.trim())) {
            alert("Vui lòng nhập đầy đủ tên của tất cả hành khách!");
            return;
        }

        // Lấy user từ localStorage (nếu có)
        let user = null;
        try {
            const storedUser = localStorage.getItem("user"); // Hoặc "account" tùy ông lưu
            if (storedUser) {
                user = JSON.parse(storedUser);
            }
        } catch (error) {
            console.log("Khách vãng lai (chưa đăng nhập)");
        }

        // 2. Tạo Payload chuẩn cho API Bán Tại Quầy
        const payload = {
            flightId: flight.id,
            accountId: user ? user.id : null,

            contactName: contactInfo.fullName,
            contactPhone: contactInfo.phone, // QUAN TRỌNG: Gửi SĐT
            contactEmail: contactInfo.email, // Email có thể rỗng

            paymentMethod: contactInfo.paymentMethod,
            passengers: passengers.map(p => ({
                fullName: p.fullName,
                seatClass: selectedSeat.seatClass
            }))
        };

        console.log("Payload gửi đi:", payload);

        // 3. Gọi API Bán Tại Quầy (createCounterBooking)
        FlightService.createCounterBooking(payload)
            .then(res => {
                const code = res.data.bookingCode || res.data.booking_code || "OK";
                alert(`✅ Bán vé thành công!\nMã vé: ${code}\nTổng tiền: ${totalPrice.toLocaleString()} VND`);
                navigate('/management');
            })
            .catch(err => {
                console.error("Lỗi API:", err);
                let errorMessage = "Lỗi hệ thống";
                if (err.response && err.response.data) {
                    const data = err.response.data;
                    errorMessage = typeof data === 'string' ? data : (data.message || JSON.stringify(data));
                }
                alert("❌ Lỗi đặt vé: " + errorMessage);
            });
    };

    if (!flight) return null;

    return (
        <div className="booking-wrapper" style={{fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '1000px', margin: '0 auto'}}>
            <h2 style={{color: '#0056b3', marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '10px'}}>
                Xác Nhận Bán Vé
            </h2>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px'}}>
                {/* CỘT TRÁI: THÔNG TIN VÉ */}
                <div className="left-col">
                    <fieldset style={{border: '1px solid #ddd', padding: '15px', borderRadius: '8px'}}>
                        <legend style={{fontWeight: 'bold', color: '#555'}}>✈ Tùy chọn vé</legend>

                        <div className="mb-3">
                            <label style={{display: 'block', fontWeight: 'bold', marginBottom: '5px'}}>Hạng ghế & Giá vé:</label>
                            <select
                                className="form-control"
                                style={{width: '100%', padding: '8px'}}
                                value={selectedSeat?.seatClass || ''}
                                onChange={handleClassChange}
                            >
                                {flight.seatDetails.map((seat) => (
                                    <option key={seat.id} value={seat.seatClass} disabled={seat.availableSeats === 0}>
                                        {seat.seatClass} - {seat.price.toLocaleString()} đ (Còn {seat.availableSeats})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label style={{display: 'block', fontWeight: 'bold', marginBottom: '5px'}}>Số lượng khách:</label>
                            <input
                                type="number"
                                className="form-control"
                                style={{width: '100%', padding: '8px'}}
                                min="1"
                                max={selectedSeat?.availableSeats || 1}
                                value={passengers.length}
                                onChange={handleQuantityChange}
                            />
                        </div>

                        <div style={{marginTop: '20px', paddingTop: '15px', borderTop: '1px dashed #ccc', backgroundColor: '#f9f9f9', padding: '15px'}}>
                            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
                                <span>Đơn giá:</span>
                                <strong>{unitPrice.toLocaleString()} VND</strong>
                            </div>
                            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
                                <span>Số lượng:</span>
                                <strong>x {passengers.length}</strong>
                            </div>
                            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '1.2em', color: '#d9534f', marginTop: '10px', borderTop: '2px solid #ddd', paddingTop: '10px'}}>
                                <span>TỔNG CỘNG:</span>
                                <strong>{totalPrice.toLocaleString()} VND</strong>
                            </div>
                        </div>
                    </fieldset>

                    <fieldset style={{marginTop: '20px', border: '1px solid #ddd', padding: '15px', borderRadius: '8px'}}>
                        <legend style={{fontWeight: 'bold', color: '#555'}}>💳 Thanh toán</legend>
                        <div>
                            <label style={{display: 'block', fontWeight: 'bold', marginBottom: '5px'}}>Phương thức</label>
                            <select
                                className="form-control"
                                style={{width: '100%', padding: '8px'}}
                                value={contactInfo.paymentMethod}
                                onChange={(e) => setContactInfo({...contactInfo, paymentMethod: e.target.value})}>
                                <option value="CASH">Tiền mặt tại quầy</option>
                                <option value="VNPAY">VNPAY QR</option>
                                <option value="CREDIT">Thẻ tín dụng</option>
                            </select>
                        </div>
                    </fieldset>
                </div>

                {/* CỘT PHẢI: THÔNG TIN KHÁCH HÀNG */}
                <div className="right-col">
                    <fieldset style={{border: '1px solid #ddd', padding: '15px', borderRadius: '8px', backgroundColor: '#eef6fc'}}>
                        <legend style={{fontWeight: 'bold', color: '#0056b3'}}>👤 Người liên hệ (Bắt buộc)</legend>

                        <div className="mb-3">
                            <label style={{display: 'block', fontWeight: 'bold', marginBottom: '5px'}}>Họ tên người mua <span style={{color:'red'}}>*</span></label>
                            <input type="text" className="form-control" style={{width: '100%', padding: '8px'}}
                                   placeholder="Nguyễn Văn A"
                                   value={contactInfo.fullName}
                                   onChange={(e) => setContactInfo({...contactInfo, fullName: e.target.value})} />
                        </div>

                        {/* TRƯỜNG SỐ ĐIỆN THOẠI QUAN TRỌNG */}
                        <div className="mb-3">
                            <label style={{display: 'block', fontWeight: 'bold', marginBottom: '5px'}}>Số điện thoại <span style={{color:'red'}}>*</span></label>
                            <input type="text" className="form-control" style={{width: '100%', padding: '8px'}}
                                   placeholder="09xx xxx xxx"
                                   value={contactInfo.phone}
                                   onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})} />
                        </div>

                        <div className="mb-3">
                            <label style={{display: 'block', fontWeight: 'bold', marginBottom: '5px'}}>Email (Tùy chọn)</label>
                            <input type="email" className="form-control" style={{width: '100%', padding: '8px'}}
                                   placeholder="khachhang@email.com"
                                   value={contactInfo.email}
                                   onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})} />
                        </div>
                    </fieldset>

                    <fieldset style={{marginTop: '20px', border: '1px solid #ddd', padding: '15px', borderRadius: '8px'}}>
                        <legend style={{fontWeight: 'bold', color: '#555'}}>👥 Danh sách hành khách</legend>
                        <div style={{maxHeight: '300px', overflowY: 'auto', paddingRight:'5px'}}>
                            {passengers.map((p, index) => (
                                <div key={index} style={{marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #eee'}}>
                                    <label style={{fontSize: '0.9em', color: '#666', display: 'block'}}>Hành khách #{index + 1}</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        style={{width: '100%', padding: '8px', textTransform: 'uppercase'}}
                                        placeholder={`TÊN KHÁCH ${index + 1}`}
                                        value={p.fullName}
                                        onChange={(e) => handlePassengerNameChange(index, e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>
                    </fieldset>
                </div>
            </div>

            <div className="footer-action" style={{marginTop: '30px', display: 'flex', justifyContent: 'flex-end', gap: '10px'}}>
                <button
                    onClick={() => navigate(-1)}
                    style={{padding: '10px 20px', border: '1px solid #ccc', backgroundColor: '#fff', cursor: 'pointer', borderRadius: '5px'}}
                >
                    ‹ Quay lại
                </button>
                <button
                    onClick={handleSubmit}
                    style={{padding: '10px 20px', border: 'none', backgroundColor: '#28a745', color: '#fff', fontWeight: 'bold', cursor: 'pointer', borderRadius: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)'}}
                >
                    💰 Xác nhận & Thanh toán
                </button>
            </div>
        </div>
    );
};

export default BookingDetails;