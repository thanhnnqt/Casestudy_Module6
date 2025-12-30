import React, {useEffect, useState, useRef} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import {FlightService} from '../service/BookingService.jsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {toast} from 'react-toastify';

// Helper tính tuổi
const getAge = (dateString) => {
    if (!dateString) return 99;
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

const BookingManagement = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- STATE BỘ LỌC ---
    const [filterType, setFilterType] = useState('ALL');

    // --- State Modal ---
    const [showInvoice, setShowInvoice] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const [confirmModal, setConfirmModal] = useState({
        show: false,
        booking: null,
        actionType: null,
        title: '',
        message: ''
    });

    const toastProcessed = useRef(false);

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
        if (!toastProcessed.current) {
            if (location.state?.updated) {
                toast.success("Cập nhật vé thành công!");
                fetchBookings();
                toastProcessed.current = true;
                window.history.replaceState({}, document.title);
            }
            else if (location.state?.newBooking) {
                toast.success("Đã tạo vé mới thành công!");
                fetchBookings();
                toastProcessed.current = true;
                window.history.replaceState({}, document.title);
            }
        }
    }, [location]);

    const filteredBookings = bookings.filter(b => {
        if (filterType === 'ALL') return true;
        if (filterType === 'ROUND_TRIP') return b.tripType === 'ROUND_TRIP' || b.returnFlight;
        if (filterType === 'ONE_WAY') return b.tripType === 'ONE_WAY' && !b.returnFlight;
        return true;
    });

    // --- CÁC HÀM XỬ LÝ ---
    const handleRequestAction = (booking, type) => {
        let title = "", message = "";
        if (type === 'PAID') { title = "💰 Xác Nhận Thanh Toán"; message = "Xác nhận khách đã thanh toán?"; }
        else if (type === 'CANCELLED') { title = "⚠️ Xác Nhận Hủy Vé"; message = "Hủy vé sẽ hoàn trả ghế vào hệ thống."; }
        else if (type === 'DELETE') { title = "🗑 Xác Nhận Xóa Vé"; message = "CẢNH BÁO: Vé sẽ bị xóa vĩnh viễn."; }
        setConfirmModal({ show: true, booking, actionType: type, title, message });
    };

    const confirmAction = () => {
        const {booking, actionType} = confirmModal;
        if (!booking) return;

        const apiCall = actionType === 'DELETE'
            ? FlightService.deleteBooking(booking.id)
            : FlightService.updateBookingStatus(booking.id, actionType);

        apiCall.then(() => {
            setConfirmModal({...confirmModal, show: false});
            fetchBookings();
            toast.success(actionType === 'DELETE' ? "Đã xóa vé!" : "Cập nhật thành công!");
        }).catch(err => {
            toast.error("Lỗi: " + (err.response?.data || "Thất bại"));
            setConfirmModal({...confirmModal, show: false});
        });
    };

    const handleEditClick = (booking) => {
        navigate('/booking-details', {state: {editingBooking: booking}});
    };

    const handlePrintClick = (booking) => {
        setSelectedBooking(booking);
        setShowInvoice(true);
    };

    // --- IN VÉ PDF (ĐÃ NÂNG CẤP) ---
    const generatePDF = () => {
        const input = document.getElementById('invoice-content');

        // Tăng scale lên 3 để ảnh nét hơn, không bị vỡ font
        html2canvas(input, {scale: 3, useCORS: true}).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Ve_May_Bay_${selectedBooking.bookingCode}.pdf`);
        });
    };

    const closeInvoice = () => { setShowInvoice(false); setSelectedBooking(null); };
    const formatCurrency = (val) => val ? val.toLocaleString('vi-VN') + ' đ' : '0 đ';

    const formatDate = (dateString) => {
        if (!dateString) return '---';
        return new Date(dateString).toLocaleString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    };

    const getStatusBadge = (status) => {
        switch ((status || '').toUpperCase()) {
            case 'PENDING': case 'UNPAID': return <span className="badge bg-warning text-dark">⏳ Chờ TT</span>;
            case 'PAID': return <span className="badge bg-success">✅ Đã TT</span>;
            case 'CANCELLED': return <span className="badge bg-danger">❌ Đã hủy</span>;
            default: return <span className="badge bg-secondary">{status}</span>;
        }
    };

    const getTicketsByFlight = (booking, flightId) => {
        if (!booking || !booking.tickets) return [];
        return booking.tickets.filter(t => t.flight?.id === flightId);
    };

    // --- COMPONENT CON: GIAO DIỆN VÉ MÁY BAY ---
    const TicketSection = ({ flight, tickets, title, colorClass, icon }) => (
        <div className="mb-4" style={{border: '1px dashed #ccc', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#fff'}}>
            <div className={`p-2 text-white d-flex align-items-center gap-2 ${colorClass}`} style={{background: colorClass === 'blue' ? '#0056b3' : '#d9534f'}}>
                <span style={{fontSize: '1.2em'}}>{icon}</span>
                <h6 className="m-0 fw-bold text-uppercase">{title}</h6>
            </div>

            <div className="p-3">
                {/* Thông tin chuyến bay */}
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1.5fr 1.5fr', gap: '15px', paddingBottom: '15px', borderBottom: '1px solid #eee', marginBottom: '15px'}}>
                    <div>
                        <div className="text-muted small text-uppercase">Chuyến bay</div>
                        <div className="fw-bold fs-5 text-primary">{flight?.flightNumber}</div>
                    </div>
                    <div>
                        <div className="text-muted small text-uppercase">Khởi hành</div>
                        <div className="fw-bold">{flight?.departureAirport?.city} ({flight?.departureAirport?.code})</div>
                        {/* [ĐÃ SỬA] Hiển thị cả Ngày & Giờ */}
                        <div className="text-dark fw-bold" style={{fontSize: '1.1em'}}>
                            {new Date(flight?.departureTime).toLocaleString('vi-VN', {
                                hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric'
                            })}
                        </div>
                    </div>
                    <div>
                        <div className="text-muted small text-uppercase">Đến</div>
                        <div className="fw-bold">{flight?.arrivalAirport?.city} ({flight?.arrivalAirport?.code})</div>
                        {/* [ĐÃ SỬA] Hiển thị cả Ngày & Giờ */}
                        <div className="text-dark fw-bold" style={{fontSize: '1.1em'}}>
                            {new Date(flight?.arrivalTime).toLocaleString('vi-VN', {
                                hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric'
                            })}
                        </div>
                    </div>
                </div>

                {/* Danh sách khách - Giữ nguyên */}
                <table className="table table-sm table-bordered mb-0" style={{fontSize: '0.9em'}}>
                    <thead className="table-light">
                    <tr>
                        <th>Hành khách</th>
                        <th>Loại vé</th>
                        <th>Hạng ghế</th>
                        <th className="text-end">Giá vé</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tickets.map((t, i) => {
                        const isChild = getAge(t.passengerDob) < 5;
                        return (
                            <tr key={i}>
                                <td>
                                    <strong>{t.passengerName}</strong>
                                    <div className="text-muted small" style={{fontSize: '0.8em'}}>
                                        DOB: {t.passengerDob ? new Date(t.passengerDob).toLocaleDateString('vi-VN') : 'N/A'}
                                    </div>
                                </td>
                                <td>
                                    {isChild ?
                                        <span className="badge bg-success">TRẺ EM (-50%)</span> :
                                        <span className="badge bg-secondary">NGƯỜI LỚN</span>
                                    }
                                </td>
                                <td className="text-center">{t.seatClass}</td>
                                <td className="text-end fw-bold">{formatCurrency(t.price)}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="container-fluid" style={{fontFamily: 'Arial, sans-serif'}}>
            {/* HEADER */}
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', backgroundColor: '#fff3cd', padding: '15px', borderRadius: '8px', border: '1px solid #ffeeba'}}>
                <h2 style={{color: '#856404', margin: 0, fontWeight: 'bold'}}>✈ Quản Lý Vé</h2>
                <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                    <select className="form-select" style={{width: '150px', cursor:'pointer'}} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                        <option value="ALL">📋 Tất cả</option>
                        <option value="ONE_WAY">➡ Một chiều</option>
                        <option value="ROUND_TRIP">🔁 Khứ hồi</option>
                    </select>
                    <button onClick={fetchBookings} className="btn btn-light border">↻ Tải lại</button>
                    <button onClick={() => navigate('/search-flight')} className="btn btn-primary fw-bold">+ Bán Vé Tại Quầy</button>
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
                            <th className="text-center" style={{minWidth: '150px'}}>Hành Động</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredBookings.length === 0 ? (
                            <tr><td colSpan="9" className="text-center p-4 text-muted">Chưa có dữ liệu phù hợp.</td></tr>
                        ) : filteredBookings.map(b => (
                            <tr key={b.id}>
                                <td className="text-center">{b.id}</td>
                                <td className="fw-bold text-primary">{b.bookingCode}</td>
                                <td>{b.tripType === 'ROUND_TRIP' || b.returnFlight ?
                                    <span className="badge bg-light text-primary border border-primary">🔁 Khứ hồi</span> :
                                    <span className="badge bg-light text-info border border-info">➡ 1 Chiều</span>}
                                </td>
                                <td>
                                    <div className="fw-bold">{b.contactName || 'Vãng lai'}</div>
                                    <small className="text-success">📞 {b.contactPhone}</small>
                                </td>
                                <td>
                                    <div className="d-flex flex-column gap-1">
                                        <div className="d-flex align-items-center gap-2">
                                            <span className="badge bg-info text-dark" style={{minWidth: '35px'}}>Đi</span>
                                            <span className="fw-bold text-primary">{b.flight?.flightNumber}</span>
                                        </div>
                                        {b.returnFlight && (
                                            <div className="d-flex align-items-center gap-2">
                                                <span className="badge bg-warning text-dark" style={{minWidth: '35px'}}>Về</span>
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
                                            <button className="btn btn-sm btn-outline-secondary" onClick={() => handleEditClick(b)} title="Sửa thông tin">✏️</button>
                                        )}
                                        {['PENDING', 'UNPAID'].includes(b.status) && (
                                            <>
                                                <button className="btn btn-sm btn-outline-success" onClick={() => handleRequestAction(b, 'PAID')} title="Thanh Toán">💰</button>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleRequestAction(b, 'DELETE')} title="Xóa vé">🗑</button>
                                            </>
                                        )}
                                        {b.status === 'PAID' && (
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleRequestAction(b, 'CANCELLED')} title="Hủy">❌</button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* MODAL XÁC NHẬN */}
            {confirmModal.show && confirmModal.booking && (
                <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <div className="card shadow-lg" style={{width: '500px', border: 'none', borderRadius: '10px'}}>
                        <div className={`card-header text-white ${confirmModal.actionType === 'DELETE' ? 'bg-danger' : (confirmModal.actionType === 'PAID' ? 'bg-success' : 'bg-secondary')}`}>
                            <h5 className="m-0 fw-bold">{confirmModal.title}</h5>
                        </div>
                        <div className="card-body p-4">
                            <p className="text-center fs-5 mb-4">{confirmModal.message}</p>
                            <div className="alert alert-light border">
                                <div>Khách: <strong>{confirmModal.booking.contactName}</strong></div>
                                <div>Tổng tiền: <strong className="text-danger">{formatCurrency(confirmModal.booking.totalAmount)}</strong></div>
                            </div>
                        </div>
                        <div className="card-footer bg-white text-end">
                            <button className="btn btn-secondary me-2" onClick={() => setConfirmModal({...confirmModal, show: false})}>Hủy</button>
                            <button className={`btn ${confirmModal.actionType === 'DELETE' ? 'btn-danger' : 'btn-primary'}`} onClick={confirmAction}>Xác nhận</button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- MODAL IN VÉ ĐẸP (FIXED FONT & STYLE) --- */}
            {showInvoice && selectedBooking && (
                <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <div className="bg-light rounded shadow-lg d-flex flex-column" style={{maxWidth: '850px', width: '95%', maxHeight: '95vh'}}>

                        {/* NỘI DUNG VÉ ĐỂ IN */}
                        <div style={{overflowY: 'auto', flex: 1, padding: '20px'}}>
                            <div id="invoice-content" style={{padding: '30px', backgroundColor: 'white', color: '#333', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto', boxShadow: '0 0 10px rgba(0,0,0,0.1)'}}>

                                {/* Header Vé */}
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px solid #0056b3', paddingBottom: '15px', marginBottom: '20px'}}>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                                        <div style={{width: '50px', height: '50px', backgroundColor: '#0056b3', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '24px'}}>✈</div>
                                        <div>
                                            <h2 style={{margin: 0, color: '#0056b3', textTransform: 'uppercase', fontWeight: '800', fontSize: '24px'}}>FLY FAST AIRLINES</h2>
                                            <p style={{margin: 0, fontSize: '14px', color: '#666'}}>Vé Điện Tử / Electronic Ticket</p>
                                        </div>
                                    </div>
                                    <div style={{textAlign: 'right'}}>
                                        <div style={{fontSize: '12px', color: '#888', textTransform: 'uppercase'}}>MÃ ĐẶT CHỖ (PNR)</div>
                                        <div style={{fontSize: '28px', fontWeight: 'bold', color: '#d9534f', letterSpacing: '2px'}}>{selectedBooking.bookingCode}</div>
                                    </div>
                                </div>

                                {/* Thông tin Người đặt */}
                                <div style={{backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #e9ecef'}}>
                                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '14px'}}>
                                        <div><strong>Người liên hệ:</strong> {selectedBooking.contactName}</div>
                                        <div><strong>Ngày đặt:</strong> {new Date(selectedBooking.bookingDate).toLocaleString('vi-VN')}</div>
                                        <div><strong>Số điện thoại:</strong> {selectedBooking.contactPhone}</div>
                                        <div><strong>Trạng thái:</strong> {selectedBooking.status === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}</div>
                                    </div>
                                </div>

                                {/* Chi tiết Chuyến Bay */}
                                <TicketSection
                                    flight={selectedBooking.flight}
                                    tickets={getTicketsByFlight(selectedBooking, selectedBooking.flight?.id)}
                                    title={`CHIỀU ĐI: ${selectedBooking.flight?.departureAirport?.city} ➝ ${selectedBooking.flight?.arrivalAirport?.city}`}
                                    colorClass="blue"
                                    icon="🛫"
                                />

                                {selectedBooking.returnFlight && (
                                    <TicketSection
                                        flight={selectedBooking.returnFlight}
                                        tickets={getTicketsByFlight(selectedBooking, selectedBooking.returnFlight?.id)}
                                        title={`CHIỀU VỀ: ${selectedBooking.returnFlight?.departureAirport?.city} ➝ ${selectedBooking.returnFlight?.arrivalAirport?.city}`}
                                        colorClass="red"
                                        icon="🛬"
                                    />
                                )}

                                {/* Tổng kết */}
                                <div style={{borderTop: '3px solid #eee', paddingTop: '20px', marginTop: '10px', textAlign: 'right'}}>
                                    <span style={{fontSize: '18px', marginRight: '20px', color: '#555'}}>TỔNG THANH TOÁN:</span>
                                    <strong style={{fontSize: '32px', color: '#d9534f', fontWeight: '800'}}>{formatCurrency(selectedBooking.totalAmount)}</strong>
                                </div>

                                <div style={{textAlign: 'center', marginTop: '30px', fontSize: '12px', color: '#999', fontStyle: 'italic'}}>
                                    <p style={{margin: '2px'}}>Cảm ơn quý khách đã sử dụng dịch vụ của Fly Fast Airlines!</p>
                                    <p style={{margin: '2px'}}>Vui lòng có mặt tại sân bay trước giờ khởi hành 120 phút để làm thủ tục.</p>
                                </div>
                            </div>
                        </div>

                        {/* Footer Modal */}
                        <div className="p-3 bg-white border-top text-end">
                            <button className="btn btn-secondary me-2" onClick={closeInvoice}>Đóng</button>
                            <button className="btn btn-primary fw-bold" onClick={generatePDF}>
                                <i className="fa-solid fa-download me-2"></i> Tải PDF Vé
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingManagement;