import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlightService } from '../service/BookingService.jsx';

const BookingManagement = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);

    const loadBookings = () => {
        FlightService.getAllBookings()
            .then(res => setBookings(res.data))
            .catch(err => console.error("Không tải được danh sách booking", err));
    };

    useEffect(() => {
        loadBookings();
    }, []);

    return (
        <div className="booking-wrapper">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                <h1>Danh Sách Vé Đã Đặt</h1>
                <button className="btn-booking btn-primary" onClick={() => navigate('/new-sale')}>
                    + Tạo Vé Mới
                </button>
            </div>

            <table>
                <thead>
                <tr>
                    <th>Mã PNR</th>
                    <th>Khách Hàng</th>
                    <th>Ngày đặt</th>
                    <th>Thanh toán</th>
                    <th>Tổng tiền</th>
                    <th className="center-align">Trạng thái</th>
                </tr>
                </thead>
                <tbody>
                {bookings.length === 0 ? (
                    <tr><td colSpan="6" className="center-align">Chưa có dữ liệu vé nào.</td></tr>
                ) : (
                    bookings.map(b => (
                        <tr key={b.id}>
                            <td style={{fontWeight: 'bold', color: '#1a3b5d'}}>{b.bookingCode}</td>
                            <td>
                                <div>{b.contactEmail}</div>
                                <small style={{color: '#888'}}>Khách vãng lai</small>
                            </td>
                            <td>{new Date(b.bookingDate).toLocaleDateString()}</td>
                            <td>{b.paymentMethod}</td>
                            <td style={{fontWeight: 'bold'}}>{b.totalAmount?.toLocaleString()} đ</td>
                            <td className="center-align">
                                <span className={`badge ${b.status === 'PAID' ? 'status-paid' : 'status-pending'}`}>
                                    {b.status}
                                </span>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
};

export default BookingManagement;