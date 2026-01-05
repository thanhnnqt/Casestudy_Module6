import React, { useEffect, useState } from 'react';
import { FlightService } from '../modules/booking/service/BookingService.jsx';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const BookingHistory = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [paymentLoading, setPaymentLoading] = useState(null); // id của booking đang thanh toán

    useEffect(() => {
        const fetchMyBookings = async () => {
            try {
                const response = await FlightService.getMyBookings();
                setBookings(response.data);
            } catch (error) {
                console.error("Error fetching bookings:", error);
                if (error.response?.status === 401) {
                    toast.error("Vui lòng đăng nhập để xem lịch sử!");
                    navigate('/login');
                } else {
                    toast.error("Không thể tải lịch sử đặt vé.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchMyBookings();
    }, [navigate]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        const styles = {
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: '600',
            textTransform: 'uppercase'
        };

        switch (status) {
            case 'PAID':
                return <span style={{ ...styles, backgroundColor: '#e6f4ea', color: '#1e7e34' }}>Đã thanh toán</span>;
            case 'PENDING':
                return <span style={{ ...styles, backgroundColor: '#fff4e5', color: '#b76e00' }}>Chờ thanh toán</span>;
            case 'CANCELLED':
                return <span style={{ ...styles, backgroundColor: '#fdeaea', color: '#d93025' }}>Đã hủy</span>;
            default:
                return <span style={{ ...styles, backgroundColor: '#f1f3f4', color: '#5f6368' }}>{status}</span>;
        }
    };

    const handlePayment = async (booking) => {
        setPaymentLoading(booking.id);
        try {
            const response = await FlightService.createPaymentUrl(booking.totalAmount, booking.bookingCode);
            if (response && response.url) {
                window.location.href = response.url;
            } else {
                toast.error("Không thể tạo liên kết thanh toán.");
            }
        } catch (error) {
            toast.error("Lỗi hệ thống khi thanh toán.");
        } finally {
            setPaymentLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <button
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/profile")}
                >
                    <i className="bi bi-arrow-left me-1"></i>
                    Thông tin cá nhân
                </button>
                <h2 className="fw-bold" style={{ color: '#1a73e8' }}>
                    <i className="bi bi-clock-history me-2"></i>
                    Lịch sử đặt vé
                </h2>
                <button className="btn btn-outline-primary" onClick={() => navigate('/')}>
                    Tiếp tục đặt vé
                </button>
            </div>

            {bookings.length === 0 ? (
                <div className="text-center py-5 bg-white rounded shadow-sm border">
                    <i className="bi bi-ticket-perforated mb-3" style={{ fontSize: '4rem', color: '#e0e0e0' }}></i>
                    <h3>Bạn chưa có đơn đặt vé nào</h3>
                    <p className="text-muted">Cùng bắt đầu hành trình của bạn với Fly Fast ngay hôm nay!</p>
                    <button className="btn btn-primary btn-lg mt-3" onClick={() => navigate('/')}>
                        Tìm chuyến bay ngay
                    </button>
                </div>
            ) : (
                <div className="row g-4">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="col-12">
                            <div className="card shadow-sm border-0 hover-lift"
                                style={{ borderRadius: '15px', overflow: 'hidden' }}>
                                <div
                                    className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                                    <div>
                                        <span className="text-muted small">Mã booking:</span>
                                        <strong className="ms-2 text-primary">{booking.bookingCode}</strong>
                                    </div>
                                    {getStatusBadge(booking.status)}
                                </div>
                                <div className="card-body p-4">
                                    <div className="row align-items-center">
                                        {/* Chi tiết Flight */}
                                        <div className="col-12 col-md-5 mb-3 mb-md-0">
                                            <div className="d-flex align-items-center justify-content-between mb-2">
                                                <div className="text-center">
                                                    <h4 className="mb-0 fw-bold">{booking.flight?.departureAirport?.code}</h4>
                                                    <div className="small text-muted">{booking.flight?.departureAirport?.city}</div>
                                                </div>
                                                <div className="flex-grow-1 mx-3 position-relative text-center d-none d-sm-block">
                                                    <div style={{
                                                        borderTop: '2px dashed #e0e0e0',
                                                        width: '100%',
                                                        position: 'absolute',
                                                        top: '50%',
                                                        zIndex: 0
                                                    }}></div>
                                                    <i className="bi bi-airplane-fill text-primary " style={{
                                                        backgroundColor: '#fff',
                                                        padding: '0 10px',
                                                        position: 'relative',
                                                        zIndex: 1
                                                    }}></i>
                                                </div>
                                                <div className="d-sm-none text-primary mx-2">
                                                    <i className="bi bi-arrow-right"></i>
                                                </div>
                                                <div className="text-center">
                                                    <h4 className="mb-0 fw-bold">{booking.flight?.arrivalAirport?.code}</h4>
                                                    <div className="small text-muted">{booking.flight?.arrivalAirport?.city}</div>
                                                </div>
                                            </div>
                                            <div className="text-center small text-muted">
                                                Ngày khởi hành: {new Date(booking.flight?.departureTime).toLocaleDateString('vi-VN')}
                                            </div>
                                        </div>

                                        {/* Phân tách giữa chuyến về (nếu có) */}
                                        <div className="col-md-1 d-none d-md-block text-center border-start border-end py-3">
                                            {booking.tripType === 'ROUND_TRIP' ?
                                                <i className="bi bi-arrow-left-right text-muted"></i> :
                                                <i className="bi bi-arrow-right text-muted"></i>}
                                        </div>

                                        {/* Chuyến về hoặc thông tin thêm */}
                                        <div className="col-12 col-md-4 mb-3 mb-md-0">
                                            {booking.returnFlight ? (
                                                <div className="d-flex align-items-center justify-content-between px-3 px-md-0">
                                                    <div className="text-center">
                                                        <h5 className="mb-0 fw-bold">{booking.returnFlight.departureAirport?.code}</h5>
                                                    </div>
                                                    <i className="bi bi-airplane-fill text-warning"></i>
                                                    <div className="text-center">
                                                        <h5 className="mb-0 fw-bold">{booking.returnFlight.arrivalAirport?.code}</h5>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center py-2 bg-light rounded"
                                                    style={{ fontSize: '0.9rem' }}>
                                                    <i className="bi bi-check2-circle me-1 text-success"></i>
                                                    Vé 1 chiều
                                                </div>
                                            )}
                                            <div className="mt-3 small text-center text-md-start">
                                                <p className="mb-1"><i className="bi bi-person me-2"></i>Hành khách: <strong>{booking.contactName}</strong></p>
                                                <p className="mb-0 text-muted"><i className="bi bi-calendar-event me-2"></i>Ngày đặt: {formatDate(booking.bookingDate)}</p>
                                            </div>
                                        </div>

                                        {/* Tổng tiền */}
                                        <div className="col-12 col-md-2 text-md-end text-center mt-2 mt-md-0 border-top pt-3 pt-md-0 border-md-0">
                                            <div className="text-muted small">Tổng tiền</div>
                                            <h4 className="fw-bold text-danger mb-0">{formatCurrency(booking.totalAmount)}</h4>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="card-footer bg-light border-0 py-2 px-4 d-flex justify-content-between align-items-center">
                                    <span
                                        className="small text-muted">Loại: {booking.tripType === 'ROUND_TRIP' ? 'Khứ hồi' : 'Một chiều'}</span>

                                    {booking.status === 'PAID' ? (
                                        <span className="text-success small fw-bold">
                                            <i className="bi bi-check-circle-fill me-1"></i>
                                            Đã xác nhận chỗ
                                        </span>
                                    ) : booking.status === 'PENDING' ? (
                                        <button
                                            className="btn btn-primary btn-sm px-3"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Ngăn sự kiện click vào card (nếu có)
                                                handlePayment(booking);
                                            }}
                                            disabled={paymentLoading === booking.id}
                                        >
                                            {paymentLoading === booking.id ? (
                                                <span className="spinner-border spinner-border-sm me-1"></span>
                                            ) : (
                                                <i className="bi bi-credit-card me-1"></i>
                                            )}
                                            Thanh toán ngay
                                        </button>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style>{`
                .hover-lift {
                    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
                    cursor: pointer;
                }
                .hover-lift:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
                }
            `}</style>
        </div>
    );
};

export default BookingHistory;
