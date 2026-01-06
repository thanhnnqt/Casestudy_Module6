import React from 'react';
import { useNavigate } from 'react-router-dom';

const ComingSoon = () => {
    const navigate = useNavigate();

    return (
        <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
            <div className="text-center p-5 shadow rounded-4 bg-white" style={{ maxWidth: '600px' }}>

                {/* Icon trang trí (dùng Bootstrap Icons) */}
                <div className="mb-4 text-warning">
                    <i className="bi bi-cone-striped" style={{ fontSize: '5rem' }}></i>
                </div>

                <h2 className="fw-bold text-primary mb-3">Tính năng đang phát triển</h2>

                <p className="text-muted lead mb-4">
                    Xin lỗi vì sự bất tiện này! <br />
                    Chúng tôi đang nỗ lực hoàn thiện chức năng này để mang đến trải nghiệm tốt nhất cho bạn.
                </p>

                <div className="d-flex justify-content-center gap-3">
                    <button
                        className="btn btn-outline-secondary px-4 py-2 fw-bold"
                        onClick={() => navigate(-1)} // Quay lại trang trước
                    >
                        <i className="bi bi-arrow-left me-2"></i> Quay lại
                    </button>

                    <button
                        className="btn btn-primary px-4 py-2 fw-bold"
                        onClick={() => navigate('/')} // Về trang chủ
                    >
                        <i className="bi bi-house-fill me-2"></i> Về trang chủ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ComingSoon;