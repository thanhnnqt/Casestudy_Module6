import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function PaymentResult() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('processing'); // processing, success, failed, error
    const [resultData, setResultData] = useState(null);

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                // Lấy toàn bộ tham số từ URL để gửi về Backend verify
                const params = Object.fromEntries(searchParams.entries());

                // Gọi tới API callback của Backend để verify và cập nhật DB
                const response = await axios.get('http://localhost:8080/api/payment/callback', { params });

                if (response.data.code === '00') {
                    setStatus('success');
                    setResultData(response.data);
                } else {
                    setStatus('failed');
                }
            } catch (error) {
                console.error('Verify error:', error);
                setStatus('error');
            }
        };

        verifyPayment();
    }, [searchParams]);

    return (
        <div className="container py-5 text-center">
            <div className="card shadow p-5 mx-auto" style={{ maxWidth: '600px', borderRadius: '20px' }}>
                {status === 'processing' && (
                    <div>
                        <div className="spinner-border text-primary mb-3" role="status"></div>
                        <h3>Đang xác thực giao dịch...</h3>
                        <p className="text-muted">Vui lòng không đóng trình duyệt.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="success">
                        <div className="display-1 text-success mb-3">✅</div>
                        <h1 className="fw-bold mb-3">Thanh toán thành công!</h1>
                        <div className="bg-light p-3 rounded mb-4">
                            <p className="mb-1 text-muted">Mã booking:</p>
                            <h4 className="fw-bold">{searchParams.get('vnp_TxnRef')}</h4>
                            <p className="mb-1 text-muted mt-3">Số tiền:</p>
                            <h4 className="fw-bold text-danger">
                                {(parseInt(searchParams.get('vnp_Amount')) / 100).toLocaleString()} VND
                            </h4>
                        </div>
                        <div className="d-grid gap-2">
                            <button className="btn btn-primary btn-lg" onClick={() => navigate('/bookings')}>
                                📜 Xem lịch sử đặt vé
                            </button>
                            <button className="btn btn-outline-secondary" onClick={() => navigate('/')}>
                                Quay lại trang chủ
                            </button>
                        </div>
                    </div>
                )}

                {status === 'failed' && (
                    <div className="failed">
                        <div className="display-1 text-danger mb-3">❌</div>
                        <h1 className="fw-bold mb-3">Thanh toán thất bại</h1>
                        <p className="text-muted mb-4">Giao dịch không thành công hoặc đã bị hủy.</p>
                        <div className="alert alert-warning">
                            Mã lỗi: {searchParams.get('vnp_ResponseCode')}
                        </div>
                        <button className="btn btn-primary btn-lg w-100" onClick={() => navigate('/')}>
                            Quay lại trang chủ để thử lại
                        </button>
                    </div>
                )}

                {status === 'error' && (
                    <div className="error">
                        <div className="display-1 text-warning mb-3">⚠️</div>
                        <h1 className="fw-bold mb-3">Lỗi xác thực</h1>
                        <p className="text-muted mb-4">Không thể kết nối với hệ thống để xác nhận thanh toán.</p>
                        <button className="btn btn-primary btn-lg w-100 mb-2" onClick={() => window.location.reload()}>
                            Thử lại
                        </button>
                        <button className="btn btn-outline-secondary w-100" onClick={() => navigate('/bookings')}>
                            Kiểm tra lịch sử đặt vé
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}