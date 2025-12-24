import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Sidebar from './Sidebar'; // Import Sidebar dùng chung
import { getEmployeeById } from '../services/EmployeeService'; // Import Service
import "../modules/flight/components/FlightList.css"; // Import CSS chung

const EmployeeInfo = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // State lưu thông tin nhân viên
    const [employee, setEmployee] = useState({
        employeeCode: '',
        fullName: '',
        dateOfBirth: '',
        gender: '',
        phoneNumber: '',
        email: '',
        address: '',
        account: { username: '' } // Để tránh lỗi undefined khi chưa load xong
    });

    // Giả lập ID nhân viên đang đăng nhập (Sau này bạn lấy từ Token hoặc LocalStorage)
    const currentEmployeeId = 1;

    useEffect(() => {
        const fetchEmployeeInfo = async () => {
            try {
                const data = await getEmployeeById(currentEmployeeId);
                // Mapping dữ liệu từ Entity Java sang State React
                setEmployee({
                    ...data,
                    // Lưu ý: Entity Java là 'dob', React state đặt tên cho khớp
                    dateOfBirth: data.dob
                });
                // eslint-disable-next-line no-unused-vars
            } catch (error) {
                toast.error("Không thể tải thông tin nhân viên!");
            }
        };

        fetchEmployeeInfo();
    }, []);

    return (
        <div className="flight-list-container">
            {/* 1. Background Bầu trời */}
            <div className="sky-container">
                <i className="bi bi-cloud-fill cloud" style={{ top: '10%', fontSize: '120px', animationDuration: '45s', opacity: 0.4 }}></i>
                <i className="bi bi-cloud-fill cloud" style={{ top: '60%', fontSize: '150px', animationDuration: '55s', animationDelay: '-5s', opacity: 0.2 }}></i>
            </div>

            {/* 2. Sidebar */}
            <Sidebar
                isCollapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            />

            {/* 3. Main Content */}
            <div className="main d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', paddingTop: '20px' }}>

                <div className="glass-card p-0 shadow-lg overflow-hidden" style={{ maxWidth: '1000px', width: '95%', borderRadius: '20px' }}>

                    {/* Header Card */}
                    <div className="bg-primary text-white p-4 d-flex justify-content-between align-items-center bg-gradient">
                        <h3 className="mb-0 fw-bold">
                            <i className="bi bi-person-vcard-fill me-3"></i>
                            Thông Tin Nhân Viên
                        </h3>
                        {/* Nút chỉnh sửa (Placeholder) */}
                        <button className="btn btn-light text-primary rounded-pill fw-bold shadow-sm">
                            <i className="bi bi-pencil-square me-2"></i>Cập nhật hồ sơ
                        </button>
                    </div>

                    <div className="row g-0">
                        {/* Cột trái: Avatar & Thông tin cơ bản */}
                        <div className="col-md-4 bg-light border-end d-flex flex-column align-items-center justify-content-center p-5 text-center">
                            <div className="position-relative mb-4">
                                <div className="rounded-circle bg-white shadow d-flex align-items-center justify-content-center text-primary fw-bold display-1"
                                     style={{ width: '150px', height: '150px', border: '4px solid #fff' }}>
                                    {employee.fullName ? employee.fullName.charAt(0) : 'E'}
                                </div>
                                <span className="position-absolute bottom-0 end-0 badge rounded-pill bg-success border border-white p-2">
                                    <i className="bi bi-check-circle-fill"></i> Hoạt động
                                </span>
                            </div>

                            <h4 className="fw-bold text-dark mb-1">{employee.fullName || 'Đang tải...'}</h4>
                            <p className="text-muted mb-3">{employee.account?.username || '---'}</p>

                            <div className="badge bg-primary px-3 py-2 rounded-pill mb-2 fs-6">
                                <i className="bi bi-qr-code me-2"></i>{employee.employeeCode}
                            </div>
                        </div>

                        {/* Cột phải: Thông tin chi tiết */}
                        <div className="col-md-8 p-5 bg-white">
                            <h5 className="text-primary fw-bold mb-4 border-bottom pb-2">
                                <i className="bi bi-info-circle me-2"></i>Chi tiết cá nhân
                            </h5>

                            <div className="row g-4">
                                {/* Hàng 1 */}
                                <div className="col-md-6">
                                    <label className="text-muted small fw-bold text-uppercase mb-1">Giới tính</label>
                                    <div className="fs-5 fw-medium">
                                        {employee.gender === 'Nam' ? (
                                            <span className="text-primary"><i className="bi bi-gender-male me-2"></i>Nam</span>
                                        ) : employee.gender === 'Nữ' ? (
                                            <span className="text-danger"><i className="bi bi-gender-female me-2"></i>Nữ</span>
                                        ) : (
                                            <span className="text-warning"><i className="bi bi-gender-ambiguous me-2"></i>Khác</span>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label className="text-muted small fw-bold text-uppercase mb-1">Ngày sinh</label>
                                    <div className="fs-5 fw-medium text-dark">
                                        <i className="bi bi-cake2 me-2 text-muted"></i>
                                        {employee.dateOfBirth || '---'}
                                    </div>
                                </div>

                                {/* Hàng 2 */}
                                <div className="col-md-6">
                                    <label className="text-muted small fw-bold text-uppercase mb-1">Email liên hệ</label>
                                    <div className="fs-5 fw-medium text-dark text-break">
                                        <i className="bi bi-envelope me-2 text-muted"></i>
                                        {employee.email || '---'}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label className="text-muted small fw-bold text-uppercase mb-1">Số điện thoại</label>
                                    <div className="fs-5 fw-medium text-dark">
                                        <i className="bi bi-telephone me-2 text-muted"></i>
                                        {employee.phoneNumber || '---'}
                                    </div>
                                </div>

                                {/* Hàng 3 - Địa chỉ full width */}
                                <div className="col-12">
                                    <label className="text-muted small fw-bold text-uppercase mb-1">Địa chỉ thường trú</label>
                                    <div className="p-3 bg-light rounded border-start border-4 border-primary">
                                        <i className="bi bi-geo-alt-fill me-2 text-danger"></i>
                                        {employee.address || 'Chưa cập nhật địa chỉ'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeInfo;