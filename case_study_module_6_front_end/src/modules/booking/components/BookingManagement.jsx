import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlightService } from '../service/BookingService.jsx';
// --- 1. IMPORT THƯ VIỆN PDF ---
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
// ------------------------------

const BookingManagement = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // State cho Popup
    const [showInvoice, setShowInvoice] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const fetchBookings = () => {
        setLoading(true);
        FlightService.getAllBookings()
            .then(res => {
                const data = Array.isArray(res.data) ? res.data : [];
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

    // --- MỞ POPUP ---
    const handlePrintClick = (booking) => {
        setSelectedBooking(booking);
        setShowInvoice(true);
    };

    // --- HÀM XUẤT PDF (MỚI) ---
    const generatePDF = () => {
        const input = document.getElementById('invoice-content'); // Lấy cái khung hóa đơn theo ID

        // Dùng html2canvas chụp lại giao diện
        html2canvas(input, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');

            // Tạo file PDF khổ A4
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            // Đưa ảnh vào PDF
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

            // Tải về máy
            pdf.save(`Ve_May_Bay_${selectedBooking.bookingCode}.pdf`);
        });
    };

    const closeInvoice = () => {
        setShowInvoice(false);
        setSelectedBooking(null);
    };

    // --- FORMATTERS ---
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

            {/* Header Quản Lý */}
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
                            <th>Khách Hàng (SĐT)</th>
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
                                        <div style={{color: '#006400', fontWeight: 'bold', fontSize: '0.95em'}}>
                                            📞 {b.contactPhone || '---'}
                                        </div>
                                    </td>
                                    <td><span className="badge bg-info text-dark">{b.flight?.flightNumber || 'N/A'}</span></td>
                                    <td>{formatDate(b.bookingDate)}</td>
                                    <td className="text-end fw-bold text-danger">{formatCurrency(b.totalAmount)}</td>
                                    <td className="text-center">{getStatusBadge(b.status)}</td>
                                    <td className="text-center">
                                        <div className="d-flex justify-content-center gap-2">
                                            {b.status === 'PAID' && (
                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() => handlePrintClick(b)}
                                                >
                                                    🖨 In Vé
                                                </button>
                                            )}
                                            {b.status !== 'CANCELLED' && (
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleStatusChange(b.id, 'CANCELLED')}>Hủy</button>
                                            )}
                                            {['PENDING', 'UNPAID'].includes(b.status) && (
                                                <button className="btn btn-sm btn-outline-success" onClick={() => handleStatusChange(b.id, 'PAID')}>TT</button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* --- POPUP HÓA ĐƠN --- */}
            {showInvoice && selectedBooking && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999,
                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '10px', overflow: 'hidden', maxWidth: '650px', width: '100%' }}>

                        {/* --- PHẦN NÀY SẼ ĐƯỢC IN RA PDF (CÓ ID) --- */}
                        <div id="invoice-content" style={{ padding: '40px', backgroundColor: 'white', color: '#333' }}>

                            {/* Header Vé */}
                            <div style={{ borderBottom: '2px solid #0056b3', paddingBottom: '15px', marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                                <div>
                                    <h2 style={{ margin: 0, color: '#0056b3', textTransform: 'uppercase', fontWeight: '800' }}>VÉ MÁY BAY ĐIỆN TỬ</h2>
                                    <p style={{ margin: '5px 0 0 0', fontSize: '0.9em', color: '#666' }}>Ngày xuất vé: {new Date().toLocaleDateString('vi-VN')}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.8em', textTransform: 'uppercase', color: '#888' }}>Mã đặt chỗ</div>
                                    <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#d9534f', letterSpacing: '1px' }}>{selectedBooking.bookingCode}</div>
                                </div>
                            </div>

                            {/* Thông tin chuyến bay */}
                            <div style={{ marginBottom: '30px', backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
                                <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>
                                    ✈ {selectedBooking.flight?.departureAirport?.city} <span style={{color:'#999'}}>➝</span> {selectedBooking.flight?.arrivalAirport?.city}
                                </h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '0.95em' }}>
                                    <div><strong>Chuyến bay:</strong> {selectedBooking.flight?.flightNumber}</div>
                                    <div><strong>Ngày bay:</strong> {new Date(selectedBooking.flight?.departureTime).toLocaleDateString('vi-VN')}</div>
                                    <div><strong>Giờ đi:</strong> {new Date(selectedBooking.flight?.departureTime).toLocaleTimeString('vi-VN', {hour:'2-digit', minute:'2-digit'})}</div>
                                    <div><strong>Giờ đến:</strong> {new Date(selectedBooking.flight?.arrivalTime).toLocaleTimeString('vi-VN', {hour:'2-digit', minute:'2-digit'})}</div>
                                </div>
                            </div>

                            {/* Danh sách vé */}
                            <div style={{ marginBottom: '20px' }}>
                                <h5 style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px', marginBottom: '15px' }}>THÔNG TIN HÀNH KHÁCH</h5>
                                {selectedBooking.tickets && selectedBooking.tickets.length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {selectedBooking.tickets.map((ticket, idx) => (
                                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', border: '1px solid #eee', borderRadius: '5px' }}>
                                                <div>
                                                    <div style={{ fontWeight: 'bold', fontSize: '1.1em' }}>{ticket.passengerName}</div>
                                                    <div style={{ fontSize: '0.85em', color: '#666' }}>Hạng vé: {ticket.seatClass}</div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontSize: '0.8em', color: '#888' }}>Ghế ngồi</div>
                                                    <div style={{ fontSize: '1.3em', fontWeight: 'bold', color: '#0056b3' }}>{ticket.seatNumber}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p style={{fontStyle: 'italic', color: '#999'}}>(Đang cập nhật danh sách vé...)</p>
                                )}
                            </div>

                            {/* Tổng tiền */}
                            <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '2px solid #0056b3', textAlign: 'right' }}>
                                <span style={{ fontSize: '1.1em', marginRight: '15px' }}>TỔNG THANH TOÁN:</span>
                                <strong style={{ fontSize: '1.6em', color: '#d9534f' }}>{formatCurrency(selectedBooking.totalAmount)}</strong>
                            </div>

                            {/* Footer Vé */}
                            <div style={{ textAlign: 'center', marginTop: '40px', fontSize: '0.8em', color: '#999' }}>
                                <p style={{margin: '2px'}}>Cảm ơn quý khách đã bay cùng Fly Fast!</p>
                                <p style={{margin: '2px'}}>Website: www.flyfast.vn | Hotline: 1900 1234</p>
                            </div>
                        </div>
                        {/* ------------------------------------------- */}

                        {/* Footer Popup (Nút bấm) */}
                        <div style={{ padding: '20px', backgroundColor: '#f1f1f1', display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #ddd' }}>
                            <button onClick={closeInvoice} className="btn btn-secondary">Đóng</button>
                            <button onClick={generatePDF} className="btn btn-primary" style={{fontWeight: 'bold'}}>
                                📥 Tải Vé PDF
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingManagement;