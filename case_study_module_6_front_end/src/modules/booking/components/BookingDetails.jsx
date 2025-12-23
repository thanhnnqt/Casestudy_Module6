import React, {useEffect, useState} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FlightService } from '../service/BookingService.jsx';

const BookingDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // --- LẤY DỮ LIỆU THẬT ---
    // Chỉ lấy từ state truyền sang. Nếu F5 mất state thì biến này sẽ null.
    const flight = location.state?.flight;

    const [bookingData, setBookingData] = useState({
        contactEmail: '',
        passengerName: '',
        paymentMethod: 'CASH'
    });

    // Nếu không có dữ liệu chuyến bay (do F5 hoặc vào trực tiếp link), đá về trang chủ hoặc báo lỗi
    useEffect(() => {
        if (!flight) {
            // Có thể navigate('/') ngay lập tức nếu muốn
            // navigate('/');
        }
    }, [flight, navigate]);

    // Nếu flight chưa có dữ liệu (null/undefined), hiển thị màn hình báo lỗi
    if (!flight) {
        return (
            <div className="booking-wrapper center-align" style={{padding: '50px'}}>
                <h3 style={{color: 'red'}}>⚠️ Không tìm thấy thông tin chuyến bay!</h3>
                <p>Có thể bạn đã tải lại trang hoặc chưa chọn chuyến bay.</p>
                <button className="btn-booking btn-primary" onClick={() => navigate('/')}>
                    🔍 Về trang tìm kiếm
                </button>
            </div>
        );
    }

    const handleSubmit = () => {
        // Chuẩn bị dữ liệu gửi xuống Backend
        // Đảm bảo cấu trúc JSON này khớp với BookingRequestDTO bên Java
        const payload = {
            flightId: flight.id, // ID thật từ DB
            contactEmail: bookingData.contactEmail,
            paymentMethod: bookingData.paymentMethod,
            passengers: [
                {
                    fullName: bookingData.passengerName,
                    seatClass: "ECONOMY" // Hardcode hoặc làm thêm select box chọn hạng vé
                }
            ]
        };

        console.log("Đang gửi booking:", payload);

        FlightService.createBooking(payload)
            .then(res => {
                alert("✅ Đặt vé thành công! Mã vé: " + (res.data.bookingCode || "Mới"));
                navigate('/management');
            })
            .catch(err => {
                console.error(err);
                // Hiển thị thông báo lỗi từ Backend trả về
                const message = err.response?.data || err.message || "Lỗi kết nối Server";
                alert("❌ Lỗi đặt vé: " + message);
            });
    };

    return (
        <div className="booking-wrapper">
            <h1>Xác Nhận Đặt Vé</h1>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
                {/* Cột Trái: Thông tin chuyến bay (Dữ liệu thật) */}
                <fieldset>
                    <legend>✈ Thông tin chuyến bay</legend>
                    <div className="row">
                        <strong>Mã chuyến:</strong>
                        <span style={{color: '#1a3b5d', fontWeight: 'bold'}}>{flight.flightNumber}</span>
                    </div>
                    <div className="row">
                        <strong>Hành trình:</strong>
                        <span>
                            {/* Chú ý: Backend trả về object Airport hay chỉ ID?
                                Nếu Backend trả về object Flight có lồng Airport thì dùng flight.departureAirport.code
                                Nếu trong DTO chỉ có string thì sửa tương ứng */}
                            {flight.departureAirport?.city || flight.departureAirport?.code || 'Đi'}
                            ➝
                            {flight.arrivalAirport?.city || flight.arrivalAirport?.code || 'Đến'}
                        </span>
                    </div>
                    <div className="row">
                        <strong>Khởi hành:</strong>
                        <span>
                            {new Date(flight.departureTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                            {' - '}
                            {new Date(flight.departureTime).toLocaleDateString('vi-VN')}
                        </span>
                    </div>
                    <div className="row">
                        <strong>Máy bay:</strong>
                        <span>{flight.aircraft?.name}</span>
                    </div>
                </fieldset>

                {/* Cột Phải: Thông tin thanh toán */}
                <fieldset>
                    <legend>💳 Thanh toán</legend>
                    <div className="input-group">
                        <label>Phương thức</label>
                        <select
                            value={bookingData.paymentMethod}
                            onChange={(e) => setBookingData({...bookingData, paymentMethod: e.target.value})}>
                            <option value="CASH">Tiền mặt tại quầy</option>
                            <option value="VNPAY">VNPAY QR</option>
                        </select>
                    </div>

                    {/* Hiển thị giá thật (Nếu trong Flight có trường price cho vé Economy) */}
                    {/* Lưu ý: Trong DB, giá vé nằm ở bảng flight_seat_details.
                        Nếu API getAllFlights của bạn chưa trả về giá, bạn cần sửa DTO Java.
                        Tạm thời tôi lấy flight.price nếu có, không thì hiển thị "Liên hệ" */}
                    <div style={{marginTop: '15px', fontStyle: 'italic', color:'#666'}}>
                        Giá vé cơ bản:
                        <strong style={{color: '#d9534f', fontSize: '18px', marginLeft: '5px'}}>
                            {flight.price ? flight.price.toLocaleString() : "---"} VND
                        </strong>
                    </div>
                </fieldset>
            </div>

            <fieldset>
                <legend>👤 Thông tin khách hàng</legend>
                <div className="row">
                    <div className="input-group">
                        <label>Họ và Tên hành khách</label>
                        <input type="text" placeholder="VD: NGUYEN VAN A"
                               value={bookingData.passengerName}
                               onChange={(e) => setBookingData({...bookingData, passengerName: e.target.value})} />
                    </div>
                    <div className="input-group">
                        <label>Email liên hệ</label>
                        <input type="email" placeholder="email@example.com"
                               value={bookingData.contactEmail}
                               onChange={(e) => setBookingData({...bookingData, contactEmail: e.target.value})} />
                    </div>
                </div>
            </fieldset>

            <div className="footer-action">
                <button className="btn-booking btn-secondary" onClick={() => navigate(-1)}>‹ Quay lại</button>
                <button className="btn-booking btn-primary" onClick={handleSubmit}>Xác Nhận & Xuất Vé</button>
            </div>
        </div>
    );
};

export default BookingDetails;