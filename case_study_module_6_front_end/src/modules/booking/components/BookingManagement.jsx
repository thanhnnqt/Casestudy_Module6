import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FlightService } from '../service/BookingService.jsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from 'react-toastify'; // Import thư viện Toast

const BookingManagement = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- State cho Modal Hoá đơn ---
    const [showInvoice, setShowInvoice] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    // --- State cho Modal Xác nhận ---
    const [confirmModal, setConfirmModal] = useState({
        show: false,
        booking: null,
        newStatus: null,
        title: '',
        message: ''
    });

    const fetchBookings = () => {
        setLoading(true);
        FlightService.getAllBookings()
            .then(res => {
                const data = Array.isArray(res.data) ? res.data : [];
                setBookings(data.sort((a, b) => b.id - a.id));
            })
            .catch(err => {
                console.error("Lỗi tải danh sách:", err);
                toast.error("Không thể tải danh sách vé!");
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchBookings();
        // Check nếu vừa tạo vé xong từ trang khác chuyển về
        if (location.state?.newBooking) {
            toast.success("Đã tạo vé mới thành công!");
            // Xóa state để F5 không hiện lại
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    // --- 1. Hàm mở Modal xác nhận ---
    const handleRequestUpdate = (booking, newStatus) => {
        let title = "";
        let message = "";

        if (newStatus === 'PAID') {
            title = "💰 Xác Nhận Thanh Toán";
            message = "Bạn xác nhận khách hàng này đã thanh toán đầy đủ?";
        } else if (newStatus === 'CANCELLED') {
            title = "⚠️ Xác Nhận Hủy Vé";
            message = "Hành động này không thể hoàn tác. Bạn chắc chắn muốn hủy?";
        }

        setConfirmModal({
            show: true,
            booking: booking,
            newStatus: newStatus,
            title: title,
            message: message
        });
    };

    // --- 2. Hàm thực thi gọi API ---
    const confirmUpdate = () => {
        const { booking, newStatus } = confirmModal;
        if (!booking) return;

        FlightService.updateBookingStatus(booking.id, newStatus)
            .then(() => {
                setConfirmModal({ ...confirmModal, show: false });
                fetchBookings();
                // Dùng Toast xịn của thư viện
                toast.success("Cập nhật trạng thái thành công!");
            })
            .catch(err => {
                // Thay alert bằng Toast error
                toast.error("Lỗi: " + (err.response?.data || "Không thể cập nhật"));
                setConfirmModal({ ...confirmModal, show: false });
            });
    };

    // --- Logic in ấn ---
    const handlePrintClick = (booking) => { setSelectedBooking(booking); setShowInvoice(true); };

    const generatePDF = () => {
        const input = document.getElementById('invoice-content');
        html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Ve_May_Bay_${selectedBooking.bookingCode}.pdf`);
        });
    };

    const closeInvoice = () => { setShowInvoice(false); setSelectedBooking(null); };

    // --- Format helper ---
    const formatCurrency = (val) => val ? val.toLocaleString('vi-VN') + ' đ' : '0 đ';
    const formatDate = (dateString) => {
        if (!dateString) return '---';
        return new Date(dateString).toLocaleString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
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

    // Helper lấy vé theo chuyến (Dùng cho Modal In)
    const getTicketsByFlight = (booking, flightId) => {
        if (!booking || !booking.tickets) return [];
        return booking.tickets.filter(t => t.flight?.id === flightId);
    };

    return (
        <div className="container-fluid" style={{ fontFamily: 'Arial, sans-serif' }}>

            {/* Đã xóa Toast thủ công ở đây. ToastContainer global ở App.js sẽ hiển thị. */}

            {/* HEADER */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', backgroundColor: '#fff3cd', padding: '15px', borderRadius: '8px', border: '1px solid #ffeeba' }}>
                <h2 style={{ color: '#856404', margin: 0, fontWeight: 'bold' }}>✈ Quản Lý Vé</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={fetchBookings} style={{ padding: '8px 15px', cursor: 'pointer', backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '5px' }}>↻ Tải lại</button>
                    <button onClick={() => navigate('/search-flight')} style={{ backgroundColor: '#0d6efd', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>+ Bán Vé Tại Quầy</button>
                </div>
            </div>

            {loading ? <div className="text-center p-5">Đang tải dữ liệu...</div> : (
                <div className="table-responsive shadow-sm rounded">
                    <table className="table table-hover table-bordered mb-0 align-middle">
                        <thead className="table-light">
                        <tr>
                            <th className="text-center">#ID</th>
                            <th>Mã Vé</th>
                            <th>Loại Vé</th>
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
                            <tr><td colSpan="9" className="text-center p-4 text-muted">Chưa có dữ liệu.</td></tr>
                        ) : (
                            bookings.map(b => (
                                <tr key={b.id}>
                                    <td className="text-center">{b.id}</td>
                                    <td style={{ color: '#0056b3', fontWeight: 'bold' }}>{b.bookingCode}</td>
                                    <td>{b.tripType === 'ROUND_TRIP' || b.returnFlight ? <span className="badge rounded-pill bg-light text-primary border border-primary"><i className="fa-solid fa-repeat"></i> Khứ hồi</span> : <span className="badge rounded-pill bg-light text-info border border-info"><i className="fa-solid fa-arrow-right"></i> 1 Chiều</span>}</td>
                                    <td>
                                        <div className="fw-bold">{b.contactName || 'Vãng lai'}</div>
                                        <div style={{color: '#006400', fontSize: '0.9em'}}>📞 {b.contactPhone}</div>
                                    </td>
                                    <td>
                                        <div className="d-flex flex-column gap-1">
                                            <div className="d-flex align-items-center gap-2">
                                                <span className="badge bg-info text-dark" style={{minWidth:'35px'}}>Đi</span>
                                                <span className="fw-bold text-primary">{b.flight?.flightNumber}</span>
                                            </div>
                                            {b.returnFlight && (
                                                <div className="d-flex align-items-center gap-2">
                                                    <span className="badge bg-warning text-dark" style={{minWidth:'35px'}}>Về</span>
                                                    <span className="fw-bold text-danger">{b.returnFlight.flightNumber}</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td>{formatDate(b.bookingDate)}</td>
                                    <td className="text-end fw-bold text-danger">{formatCurrency(b.totalAmount)}</td>
                                    <td className="text-center">{getStatusBadge(b.status)}</td>
                                    <td className="text-center">
                                        <div className="d-flex justify-content-center gap-2">
                                            {(b.status === 'PAID' || b.status === 'PENDING') && (
                                                <button className="btn btn-sm btn-outline-primary" onClick={() => handlePrintClick(b)} title="In Vé">🖨</button>
                                            )}
                                            {b.status !== 'CANCELLED' && (
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleRequestUpdate(b, 'CANCELLED')} title="Hủy">❌</button>
                                            )}
                                            {['PENDING', 'UNPAID'].includes(b.status) && (
                                                <button className="btn btn-sm btn-outline-success" onClick={() => handleRequestUpdate(b, 'PAID')} title="Thanh Toán">💰</button>
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

            {/* --- MODAL XÁC NHẬN --- */}
            {confirmModal.show && confirmModal.booking && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050, display: 'flex', justifyContent: 'center', alignItems: 'center', animation: 'fadeIn 0.2s' }}>
                    <div className="card shadow-lg" style={{ width: '500px', maxWidth: '90%', border: 'none', borderRadius: '10px', overflow: 'hidden' }}>
                        <div className={`card-header text-white ${confirmModal.newStatus === 'PAID' ? 'bg-success' : 'bg-danger'}`} style={{ padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h5 style={{ margin: 0, fontWeight: 'bold' }}>{confirmModal.title}</h5>
                            <button onClick={() => setConfirmModal({ ...confirmModal, show: false })} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', lineHeight: 1 }}>&times;</button>
                        </div>
                        <div className="card-body p-4">
                            <p className="text-center mb-4" style={{fontSize: '1.1em'}}>{confirmModal.message}</p>
                            <div style={{backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #eee'}}>
                                <div className="d-flex justify-content-between mb-2"><span className="text-muted">Khách hàng:</span><span className="fw-bold">{confirmModal.booking.contactName}</span></div>
                                <div className="d-flex justify-content-between mb-2"><span className="text-muted">Mã đặt chỗ:</span><span className="fw-bold text-primary">{confirmModal.booking.bookingCode}</span></div>
                                <div className="d-flex justify-content-between border-top pt-2 mt-2"><span className="text-muted">Tổng tiền:</span><span className="fw-bold text-danger fs-5">{formatCurrency(confirmModal.booking.totalAmount)}</span></div>
                            </div>
                        </div>
                        <div className="card-footer bg-white d-flex justify-content-end gap-2 p-3">
                            <button className="btn btn-secondary" onClick={() => setConfirmModal({ ...confirmModal, show: false })}>Quay lại</button>
                            <button className={`btn ${confirmModal.newStatus === 'PAID' ? 'btn-success' : 'btn-danger'}`} onClick={confirmUpdate}>{confirmModal.newStatus === 'PAID' ? 'Xác nhận Thanh Toán' : 'Xác nhận Hủy Vé'}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- MODAL IN VÉ --- */}
            {showInvoice && selectedBooking && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999,
                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', maxWidth: '750px', width: '95%', maxHeight:'95vh', display:'flex', flexDirection:'column' }}>
                        <div style={{overflowY:'auto', flex: 1}}>
                            <div id="invoice-content" style={{ padding: '40px', backgroundColor: 'white', color: '#333' }}>
                                {/* HEADER HÓA ĐƠN */}
                                <div style={{ borderBottom: '2px solid #0056b3', paddingBottom: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                                    <div>
                                        <h2 style={{ margin: 0, color: '#0056b3', textTransform: 'uppercase', fontWeight: '800' }}>VÉ MÁY BAY ĐIỆN TỬ</h2>
                                        <p style={{ margin: '5px 0 0 0', fontSize: '0.9em', color: '#666' }}>Ngày xuất: {new Date().toLocaleDateString('vi-VN')}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '0.8em', textTransform: 'uppercase', color: '#888' }}>Mã đặt chỗ (PNR)</div>
                                        <div style={{ fontSize: '1.8em', fontWeight: 'bold', color: '#d9534f', letterSpacing: '1px' }}>{selectedBooking.bookingCode}</div>
                                    </div>
                                </div>

                                {/* --- BLOCK 1: CHIỀU ĐI --- */}
                                <div style={{marginBottom: '30px'}}>
                                    <div style={{backgroundColor: '#e3f2fd', padding: '10px 15px', borderRadius: '5px 5px 0 0', borderLeft: '5px solid #0d6efd'}}>
                                        <h5 style={{margin:0, color:'#0d6efd', fontWeight:'bold'}}>🛫 CHIỀU ĐI: {selectedBooking.flight?.departureAirport?.city} ➝ {selectedBooking.flight?.arrivalAirport?.city}</h5>
                                    </div>
                                    <div style={{border:'1px solid #e3f2fd', padding:'15px', borderRadius:'0 0 5px 5px'}}>
                                        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', fontSize:'0.95em', marginBottom:'15px'}}>
                                            <div><strong>Chuyến bay:</strong> {selectedBooking.flight?.flightNumber}</div>
                                            <div><strong>Hãng bay:</strong> {selectedBooking.flight?.aircraft?.airline?.name}</div>
                                            <div><strong>Khởi hành:</strong> {new Date(selectedBooking.flight?.departureTime).toLocaleString('vi-VN')}</div>
                                            <div><strong>Hạ cánh:</strong> {new Date(selectedBooking.flight?.arrivalTime).toLocaleString('vi-VN')}</div>
                                        </div>

                                        <h6 style={{fontWeight:'bold', borderBottom:'1px dashed #ccc', paddingBottom:'5px'}}>Danh sách hành khách:</h6>
                                        {getTicketsByFlight(selectedBooking, selectedBooking.flight?.id).map((ticket, idx) => (
                                            <div key={idx} style={{display:'flex', justifyContent:'space-between', padding:'5px 0', borderBottom:'1px solid #eee'}}>
                                                <span>{idx + 1}. <strong>{ticket.passengerName}</strong> ({ticket.seatClass})</span>
                                                {/* XỬ LÝ HIỂN THỊ GHẾ */}
                                                <span style={{color:'#0d6efd', fontWeight:'bold'}}>Ghế: {ticket.seatNumber || 'TBA'}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* --- BLOCK 2: CHIỀU VỀ (NẾU CÓ) --- */}
                                {selectedBooking.returnFlight && (
                                    <div style={{marginBottom: '30px'}}>
                                        <div style={{backgroundColor: '#fff3cd', padding: '10px 15px', borderRadius: '5px 5px 0 0', borderLeft: '5px solid #ffc107'}}>
                                            <h5 style={{margin:0, color:'#856404', fontWeight:'bold'}}>🛬 CHIỀU VỀ: {selectedBooking.returnFlight?.departureAirport?.city} ➝ {selectedBooking.returnFlight?.arrivalAirport?.city}</h5>
                                        </div>
                                        <div style={{border:'1px solid #fff3cd', padding:'15px', borderRadius:'0 0 5px 5px'}}>
                                            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', fontSize:'0.95em', marginBottom:'15px'}}>
                                                <div><strong>Chuyến bay:</strong> {selectedBooking.returnFlight?.flightNumber}</div>
                                                <div><strong>Hãng bay:</strong> {selectedBooking.returnFlight?.aircraft?.airline?.name}</div>
                                                <div><strong>Khởi hành:</strong> {new Date(selectedBooking.returnFlight?.departureTime).toLocaleString('vi-VN')}</div>
                                                <div><strong>Hạ cánh:</strong> {new Date(selectedBooking.returnFlight?.arrivalTime).toLocaleString('vi-VN')}</div>
                                            </div>

                                            <h6 style={{fontWeight:'bold', borderBottom:'1px dashed #ccc', paddingBottom:'5px'}}>Danh sách hành khách:</h6>
                                            {getTicketsByFlight(selectedBooking, selectedBooking.returnFlight?.id).map((ticket, idx) => (
                                                <div key={idx} style={{display:'flex', justifyContent:'space-between', padding:'5px 0', borderBottom:'1px solid #eee'}}>
                                                    <span>{idx + 1}. <strong>{ticket.passengerName}</strong> ({ticket.seatClass})</span>
                                                    {/* XỬ LÝ HIỂN THỊ GHẾ */}
                                                    <span style={{color:'#d9534f', fontWeight:'bold'}}>Ghế: {ticket.seatNumber || 'TBA'}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* --- TỔNG KẾT --- */}
                                <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '2px solid #0056b3', textAlign: 'right' }}>
                                    <div style={{marginBottom:'5px'}}>Người liên hệ: <strong>{selectedBooking.contactName}</strong> - SĐT:<strong> {selectedBooking.contactPhone} </strong></div>
                                    <span style={{ fontSize: '1.2em', marginRight: '15px' }}>TỔNG CỘNG:</span>
                                    <strong style={{ fontSize: '1.8em', color: '#d9534f' }}>{formatCurrency(selectedBooking.totalAmount)}</strong>
                                </div>
                                <div style={{ textAlign: 'center', marginTop: '30px', fontSize: '0.8em', color: '#999' }}>
                                    <p style={{margin: '2px'}}>Cảm ơn quý khách đã bay cùng Fly Fast!</p>
                                    <p style={{margin: '2px'}}>Vui lòng có mặt tại sân bay trước giờ khởi hành 120 phút.</p>
                                </div>
                            </div>
                        </div>

                        {/* BUTTONS */}
                        <div style={{ padding: '15px', backgroundColor: '#f8f9fa', display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #ddd' }}>
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