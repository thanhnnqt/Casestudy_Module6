import React, {useEffect, useState} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FlightService } from '../service/BookingService.jsx';

const BookingDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Lấy dữ liệu chuyến bay
    const flight = location.state?.flight;

    // --- STATE QUẢN LÝ ---
    // 1. Thông tin người liên hệ (người trả tiền/nhận email)
    const [contactInfo, setContactInfo] = useState({
        fullName: '',
        email: '',
        phone: '', // Nên có thêm sđt
        paymentMethod: 'CASH'
    });

    // 2. Hạng ghế đang chọn (Lưu nguyên object seatDetail để lấy giá và số lượng)
    const [selectedSeat, setSelectedSeat] = useState(() => {
        if (flight && flight.seatDetails && flight.seatDetails.length > 0) {
            // Sắp xếp giá từ thấp đến cao
            const sortedSeats = [...flight.seatDetails].sort((a, b) => a.price - b.price);
            // Chọn cái rẻ nhất làm mặc định
            return sortedSeats[0];
        }
        return null;
    });

    // 3. Danh sách hành khách (Mảng chứa tên các hành khách)
    // Mặc định có 1 người
    const [passengers, setPassengers] = useState([{ fullName: '' }]);

    // --- EFFECT ---
    useEffect(() => {
        if (!flight) {
            // navigate('/'); // Uncomment khi chạy thật
        }
        // Đã xóa phần setSelectedSeat ở đây vì đã chuyển lên useState rồi
    }, [flight, navigate]);

    // --- HANDLERS ---

    // Xử lý khi đổi hạng ghế
    const handleClassChange = (e) => {
        const seatId = parseInt(e.target.value); // Giả sử dùng ID hoặc index, ở đây tôi dùng index trong mảng seatDetails của flight
        // Tuy nhiên tốt nhất là find theo seatClass
        const newClass = flight.seatDetails.find(s => s.seatClass === e.target.value);
        if (newClass) {
            setSelectedSeat(newClass);
            // Reset số lượng về 1 nếu số lượng khách > số ghế còn trống của hạng mới
            if (passengers.length > newClass.availableSeats) {
                setPassengers([{ fullName: '' }]);
                alert(`Hạng ghế này chỉ còn ${newClass.availableSeats} chỗ!`);
            }
        }
    };

    // Xử lý khi đổi số lượng khách
    const handleQuantityChange = (e) => {
        const newQuantity = parseInt(e.target.value);
        if (newQuantity < 1) return;
        if (selectedSeat && newQuantity > selectedSeat.availableSeats) {
            alert(`Chỉ còn ${selectedSeat.availableSeats} ghế cho hạng này!`);
            return;
        }

        // Tạo mảng mới: Giữ nguyên tên cũ, thêm ô trống nếu tăng, cắt bớt nếu giảm
        const newPassengers = [...passengers];
        if (newQuantity > passengers.length) {
            // Thêm người
            for (let i = 0; i < newQuantity - passengers.length; i++) {
                newPassengers.push({ fullName: '' });
            }
        } else {
            // Giảm người (cắt bớt đuôi)
            newPassengers.length = newQuantity;
        }
        setPassengers(newPassengers);
    };

    // Xử lý nhập tên từng hành khách
    const handlePassengerNameChange = (index, value) => {
        const updatedPassengers = [...passengers];
        updatedPassengers[index].fullName = value;
        setPassengers(updatedPassengers);
    };

    // Tính tổng tiền
    const unitPrice = selectedSeat ? selectedSeat.price : 0;
    const totalPrice = unitPrice * passengers.length;

    // --- SUBMIT ---
    const handleSubmit = () => {
        // Validate cơ bản
        if (!contactInfo.fullName || !contactInfo.email) {
            alert("Vui lòng nhập thông tin người liên hệ!");
            return;
        }
        if (passengers.some(p => !p.fullName.trim())) {
            alert("Vui lòng nhập đầy đủ tên của tất cả hành khách!");
            return;
        }

        // --- SỬA LỖI Ở ĐÂY: Lấy user từ localStorage ---
        // Giả sử khi đăng nhập ông lưu key là 'user' hoặc 'account'
        // Nếu chưa làm đăng nhập thì cứ để null
        let user = null;
        try {
            // "user" ở đây là KEY ông dùng để lưu thông tin đăng nhập.
            // Nếu lúc Login ông lưu là localStorage.setItem("account", ...), thì đổi chữ "user" thành "account" nhé.
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                user = JSON.parse(storedUser);
            }
        } catch (error) {
            console.log("Chưa đăng nhập hoặc lỗi parse user");
        }

        // 2. Tạo Payload
        const payload = {
            flightId: flight.id,

            // Giờ biến 'user' đã được khai báo ở trên, nên dòng này sẽ hết lỗi
            // Nếu user tồn tại -> lấy user.id (chính là accountId), ngược lại -> null
            accountId: user ? user.id : null,

            contactEmail: contactInfo.email,
            contactPhone: contactInfo.phone,
            contactName: contactInfo.fullName,
            paymentMethod: contactInfo.paymentMethod,
            passengers: passengers.map(p => ({
                fullName: p.fullName,
                seatClass: selectedSeat.seatClass
            }))
        };

        console.log("Payload gửi đi:", payload);

        FlightService.createCounterBooking(payload)
            .then(res => {
                alert(`✅ Đặt vé thành công!\nMã vé: ${res.data.bookingCode || "OK"}\nTổng tiền: ${totalPrice.toLocaleString()} VND`);
                navigate('/management');
            })
            .catch(err => {
                console.error("Chi tiết lỗi API:", err); // In ra console để dev xem

                let errorMessage = "Lỗi không xác định";

                // Kiểm tra xem có phản hồi từ Server không
                if (err.response && err.response.data) {
                    const data = err.response.data;

                    // TRƯỜNG HỢP 1: Backend trả về chuỗi text đơn giản
                    if (typeof data === 'string') {
                        errorMessage = data;
                    }
                    // TRƯỜNG HỢP 2: Backend trả về JSON Object
                    else if (typeof data === 'object') {
                        // Nếu Backend ông return ResponseEntity.badRequest().body("Lỗi gì đó") -> Spring bọc lại
                        if (data.message) {
                            errorMessage = data.message;
                        }
                        // Nếu là lỗi mặc định của Spring Boot (400 Bad Request, 500 Internal Server Error)
                        else if (data.error) {
                            errorMessage = `${data.status} - ${data.error}`;
                            // Nếu có message chi tiết hơn
                            if (data.path) errorMessage += ` (tại ${data.path})`;
                        }
                        // Trường hợp dự phòng: Ép kiểu JSON ra chuỗi để đọc tạm
                        else {
                            errorMessage = JSON.stringify(data);
                        }
                    }
                } else {
                    errorMessage = err.message || "Không thể kết nối đến Server";
                }

                alert("❌ Lỗi đặt vé: " + errorMessage);
            });
    };

    if (!flight) return null; // Hoặc loading...

    return (
        <div className="booking-wrapper">
            <h1>Xác Nhận Đặt Vé</h1>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px'}}>
                {/* CỘT TRÁI: THÔNG TIN VÉ & CHỌN HẠNG */}
                <div className="left-col">
                    <fieldset>
                        <legend>✈ Tùy chọn vé</legend>

                        {/* 1. Chọn hạng ghế (Dropdown Dynamic) */}
                        <div className="input-group">
                            <label>Hạng ghế & Giá vé:</label>
                            <select
                                className="form-control"
                                value={selectedSeat?.seatClass || ''}
                                onChange={handleClassChange}
                            >
                                {flight.seatDetails.map((seat) => (
                                    <option key={seat.id} value={seat.seatClass} disabled={seat.availableSeats === 0}>
                                        {seat.seatClass} - {seat.price.toLocaleString()} đ (Còn {seat.availableSeats} chỗ)
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* 2. Chọn số lượng khách */}
                        <div className="input-group" style={{marginTop: '15px'}}>
                            <label>Số lượng hành khách:</label>
                            <input
                                type="number"
                                className="form-control"
                                min="1"
                                max={selectedSeat?.availableSeats || 1}
                                value={passengers.length}
                                onChange={handleQuantityChange}
                            />
                        </div>

                        <div style={{marginTop: '20px', paddingTop: '15px', borderTop: '1px dashed #ccc'}}>
                            <div className="row">
                                <span>Đơn giá:</span>
                                <strong>{unitPrice.toLocaleString()} VND</strong>
                            </div>
                            <div className="row">
                                <span>Số lượng:</span>
                                <strong>x {passengers.length}</strong>
                            </div>
                            <div className="row" style={{fontSize: '1.2em', color: '#d9534f', marginTop: '10px'}}>
                                <span>TỔNG CỘNG:</span>
                                <strong>{totalPrice.toLocaleString()} VND</strong>
                            </div>
                        </div>
                    </fieldset>

                    <fieldset style={{marginTop: '20px'}}>
                        <legend>💳 Thanh toán</legend>
                        <div className="input-group">
                            <label>Phương thức</label>
                            <select
                                className="form-control"
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
                    <fieldset>
                        <legend>👤 Người liên hệ (Nhận vé)</legend>
                        <div className="input-group">
                            <label>Họ tên người liên hệ</label>
                            <input type="text" className="form-control"
                                   placeholder="Nguyễn Văn A"
                                   value={contactInfo.fullName}
                                   onChange={(e) => setContactInfo({...contactInfo, fullName: e.target.value})} />
                        </div>
                        <div className="input-group">
                            <label>Email</label>
                            <input type="email" className="form-control"
                                   value={contactInfo.email}
                                   onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})} />
                        </div>
                    </fieldset>

                    <fieldset style={{marginTop: '20px'}}>
                        <legend>👥 Danh sách hành khách ({passengers.length} người)</legend>
                        <div style={{maxHeight: '300px', overflowY: 'auto', paddingRight:'5px'}}>
                            {passengers.map((p, index) => (
                                <div key={index} className="passenger-item" style={{marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #eee'}}>
                                    <label style={{fontSize: '0.9em', color: '#666'}}>Hành khách #{index + 1}</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder={`Tên khách ${index + 1} (In hoa, không dấu)`}
                                        value={p.fullName}
                                        onChange={(e) => handlePassengerNameChange(index, e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>
                    </fieldset>
                </div>
            </div>

            <div className="footer-action">
                <button className="btn-booking btn-secondary" onClick={() => navigate(-1)}>‹ Quay lại</button>
                <button className="btn-booking btn-primary" onClick={handleSubmit}>
                    Thanh toán {totalPrice.toLocaleString()} đ
                </button>
            </div>
        </div>
    );
};

export default BookingDetails;