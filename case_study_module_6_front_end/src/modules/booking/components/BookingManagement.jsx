import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlightService } from '../service/BookingService.jsx';

const BookingManagement = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = () => {
        setLoading(true);
        FlightService.getAllBookings()
            .then(res => {
                const data = Array.isArray(res.data) ? res.data : [];
                // Sắp xếp vé mới nhất lên đầu
                setBookings(data.sort((a, b) => b.id - a.id));
            })
            .catch(err => console.error("Lỗi tải danh sách:", err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleStatusChange = (id, newStatus) => {
        const confirmMsg = newStatus === 'PAID' ? "Xác nhận khách đã thanh toán?" : "Bạn có chắc muốn HỦY vé này không?";
        if (window.confirm(confirmMsg)) {
            FlightService.updateBookingStatus(id, newStatus)
                .then(() => { alert("Cập nhật thành công!"); fetchBookings(); })
                .catch(err => alert("Lỗi: " + (err.response?.data || "Không thể cập nhật")));
        }
    };

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
            case 'PENDING': case 'UNPAID': return <span className="badge bg-warning text-dark">⏳ Chờ TT</span>;
            case 'PAID': return <span className="badge bg-success">✅ Đã TT</span>;
            case 'CANCELLED': return <span className="badge bg-danger">❌ Đã hủy</span>;
            default: return <span className="badge bg-secondary">{s}</span>;
        }
    };

    return (
        <div className="container-fluid" style={{ fontFamily: 'Arial, sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', backgroundColor: '#fff3cd', padding: '15px', borderRadius: '8px', border: '1px solid #ffeeba' }}>
                <h2 style={{ color: '#856404', margin: 0, fontWeight: 'bold' }}>✈ Quản Lý Vé</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={fetchBookings} style={{ padding: '8px 15px', cursor: 'pointer', backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '5px' }}>↻ Tải lại</button>
                    <button onClick={() => navigate('/new-sale')} style={{ backgroundColor: '#0d6efd', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>+ Bán Vé Tại Quầy</button>
                </div>
            </div>

            {loading ? <div className="text-center p-5">Đang tải dữ liệu...</div> : (
                <div className="table-responsive shadow-sm rounded">
                    <table className="table table-hover table-bordered mb-0">
                        <thead className="table-light">
                        <tr>
                            <th className="text-center">#ID</th>
                            <th>Mã Vé</th>
                            <th>Khách Hàng (SĐT)</th> {/* Sửa tiêu đề cột */}
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

                                    {/* --- CỘT KHÁCH HÀNG: ĐÃ THÊM SĐT --- */}
                                    <td>
                                        <div className="fw-bold">{b.contactName || 'Vãng lai'}</div>
                                        {/* Hiển thị số điện thoại màu xanh đậm */}
                                        <div style={{color: '#006400', fontWeight: 'bold', fontSize: '0.95em'}}>
                                            📞 {b.contactPhone || b.contact_phone || '---'}
                                        </div>
                                        {/* Email hiển thị nhạt hơn */}
                                        <small className="text-muted">{b.contactEmail}</small>
                                    </td>
                                    {/* ----------------------------------- */}

                                    <td><span className="badge bg-info text-dark">{b.flight?.flightNumber || 'N/A'}</span></td>
                                    <td>{formatDate(b.bookingDate)}</td>
                                    <td className="text-end fw-bold text-danger">{formatCurrency(b.totalAmount)}</td>
                                    <td className="text-center">{getStatusBadge(b.status)}</td>
                                    <td className="text-center">
                                        {b.status !== 'CANCELLED' && <button className="btn btn-sm btn-outline-danger" onClick={() => handleStatusChange(b.id, 'CANCELLED')}>Hủy</button>}
                                        {['PENDING', 'UNPAID'].includes(b.status) && <button className="btn btn-sm btn-outline-success ms-1" onClick={() => handleStatusChange(b.id, 'PAID')}>TT</button>}
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