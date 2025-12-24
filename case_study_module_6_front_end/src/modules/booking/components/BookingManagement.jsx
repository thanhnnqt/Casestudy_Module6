import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlightService } from '../service/BookingService.jsx';

const BookingManagement = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- 1. HÀM LOAD DỮ LIỆU ---
    const fetchBookings = () => {
        setLoading(true);
        FlightService.getAllBookings()
            .then(res => {
                console.log("🔥 Dữ liệu Booking từ API:", res.data);
                const data = Array.isArray(res.data) ? res.data : [];
                // Sắp xếp: ID giảm dần
                const sortedData = data.sort((a, b) => b.id - a.id);
                setBookings(sortedData);
            })
            .catch(err => {
                console.error("Lỗi tải danh sách:", err);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    // --- 2. HÀM XỬ LÝ ---
    const handleStatusChange = (id, newStatus) => {
        const confirmMsg = newStatus === 'PAID'
            ? "Xác nhận khách đã thanh toán?"
            : "Bạn có chắc muốn HỦY vé này không?";

        if (window.confirm(confirmMsg)) {
            FlightService.updateBookingStatus(id, newStatus)
                .then(() => {
                    alert("Cập nhật thành công!");
                    fetchBookings();
                })
                .catch(err => {
                    alert("Lỗi: " + (err.response?.data || "Không thể cập nhật"));
                });
        }
    };

    // --- 3. FORMAT ---
    const formatCurrency = (val) => val ? val.toLocaleString('vi-VN') + ' đ' : '0 đ';
    const formatDate = (dateString) => {
        if (!dateString) return '---';
        return new Date(dateString).toLocaleString('vi-VN', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        const s = (status || '').toUpperCase();
        switch (s) {
            case 'PENDING':
            case 'UNPAID': return <span className="badge bg-warning text-dark">⏳ Chờ thanh toán</span>;
            case 'PAID': return <span className="badge bg-success">✅ Đã thanh toán</span>;
            case 'CANCELLED': return <span className="badge bg-danger">❌ Đã hủy</span>;
            default: return <span className="badge bg-secondary">{s}</span>;
        }
    };

    return (
        // THAY ĐỔI 1: Thêm marginTop 100px để tránh bị thanh Menu trên cùng che mất
        <div className="container" style={{ fontFamily: 'Arial, sans-serif', maxWidth: '1200px', marginTop: '100px', paddingBottom: '50px' }}>

            {/* --- KHU VỰC HEADER (Đã thêm màu nền để dễ nhìn thấy) --- */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                backgroundColor: '#fff3cd', // Màu vàng nhạt để nổi bật
                padding: '15px',
                borderRadius: '8px',
                border: '1px solid #ffeeba'
            }}>
                <h2 style={{ color: '#856404', margin: 0, fontWeight: 'bold' }}>
                    ✈ Quản Lý Vé
                </h2>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={fetchBookings}
                        style={{
                            padding: '10px 15px',
                            cursor: 'pointer',
                            backgroundColor: 'white',
                            border: '1px solid #ccc',
                            borderRadius: '5px'
                        }}
                    >
                        ↻ Tải lại
                    </button>

                    {/* NÚT BÁN VÉ QUAN TRỌNG */}
                    <button
                        onClick={() => navigate('/new-sale')}
                        style={{
                            backgroundColor: '#0d6efd',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '5px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                        }}
                    >
                        + Bán Vé Tại Quầy
                    </button>
                </div>
            </div>
            {/* ------------------------------------------------------- */}

            {loading ? (
                <div className="text-center p-5">Đang tải dữ liệu...</div>
            ) : (
                <div className="table-responsive shadow-sm rounded">
                    <table className="table table-hover table-bordered mb-0">
                        <thead className="table-light">
                        <tr>
                            <th className="text-center">#ID</th>
                            <th>Mã Vé</th>
                            <th>Khách Hàng</th>
                            <th>Chuyến Bay</th>
                            <th>Ngày Đặt</th>
                            <th className="text-end">Tổng Tiền</th>
                            <th className="text-center">Trạng Thái</th>
                            <th className="text-center">Hành Động</th>
                        </tr>
                        </thead>
                        <tbody>
                        {bookings.length === 0 ? (
                            <tr><td colSpan="8" className="text-center p-4 text-muted">Chưa có dữ liệu.</td></tr>
                        ) : (
                            bookings.map(b => (
                                <tr key={b.id}>
                                    <td className="text-center">{b.id}</td>
                                    <td style={{ color: '#0056b3', fontWeight: 'bold' }}>{b.bookingCode}</td>
                                    <td>
                                        <div className="fw-bold">{b.contactName || 'Vãng lai'}</div>
                                        <small className="text-muted">{b.contactEmail}</small>
                                    </td>
                                    <td><span className="badge bg-info text-dark">{b.flight?.flightNumber || 'N/A'}</span></td>
                                    <td>{formatDate(b.bookingDate)}</td>
                                    <td className="text-end fw-bold text-danger">{formatCurrency(b.totalAmount)}</td>
                                    <td className="text-center">{getStatusBadge(b.status)}</td>
                                    <td className="text-center">
                                        {b.status !== 'CANCELLED' && (
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleStatusChange(b.id, 'CANCELLED')}>Hủy</button>
                                        )}
                                        {['PENDING', 'UNPAID'].includes(b.status) && (
                                            <button className="btn btn-sm btn-outline-success ms-1" onClick={() => handleStatusChange(b.id, 'PAID')}>TT</button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default BookingManagement;