import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getEmployeeById } from '../services/EmployeeService';
import "../modules/flight/components/FlightList.css";

const EmployeeInfo = () => {
    // 1. State thông tin nhân viên
    const [employee, setEmployee] = useState({
        employeeCode: '',
        fullName: '',
        dateOfBirth: '',
        gender: '',
        phoneNumber: '',
        email: '',
        address: '',
        account: { username: '' }
    });

    // 2. State cho Modal
    const [showModal, setShowModal] = useState(false);

    // 3. State form đổi mật khẩu
    const [passForm, setPassForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const currentEmployeeId = 1;

    useEffect(() => {
        const fetchEmployeeInfo = async () => {
            try {
                const data = await getEmployeeById(currentEmployeeId);
                setEmployee({ ...data, dateOfBirth: data.dob });
            } catch (error) {
                console.error("Lỗi tải thông tin:", error);
            }
        };
        fetchEmployeeInfo();
    }, []);

    // --- HANDLERS ---
    const handleChangePass = (e) => {
        const { name, value } = e.target;
        setPassForm({ ...passForm, [name]: value });
    };

    const handleSubmitPass = (e) => {
        e.preventDefault();
        const { currentPassword, newPassword, confirmPassword } = passForm;

        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.warning("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Mật khẩu xác nhận không khớp!");
            return;
        }

        console.log("Dữ liệu gửi đi:", passForm);
        toast.success("Đổi mật khẩu thành công!");
        setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setShowModal(false);
    };

    return (
        <div className="container-fluid p-0" style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>

            {/* Background */}
            <div className="sky-container" style={{ position: 'fixed', zIndex: 0 }}>
                <i className="bi bi-cloud-fill cloud" style={{ top: '10%', fontSize: '100px', opacity: 0.2 }}></i>
            </div>

            {/* MAIN CONTENT */}
            <div className="d-flex justify-content-center pt-5 position-relative" style={{ zIndex: 1 }}>
                <div className="card border-0 shadow-lg overflow-hidden" style={{ maxWidth: '1000px', width: '95%', borderRadius: '15px' }}>

                    {/* Header Card */}
                    <div className="card-header bg-primary text-white p-4 d-flex justify-content-between align-items-center">
                        <h3 className="mb-0 fw-bold">
                            <i className="bi bi-person-badge-fill me-2"></i> Thông Tin Nhân Viên
                        </h3>
                        <div className="d-flex gap-2">
                            <button className="btn btn-warning fw-bold shadow-sm" onClick={() => setShowModal(true)}>
                                <i className="bi bi-key-fill me-2"></i>Đổi mật khẩu
                            </button>
                            <button className="btn btn-light text-primary fw-bold shadow-sm">
                                <i className="bi bi-pencil-square me-2"></i>Cập nhật
                            </button>
                        </div>
                    </div>

                    <div className="row g-0">
                        {/* Cột trái */}
                        <div className="col-md-4 bg-light d-flex flex-column align-items-center justify-content-center p-5 border-end">
                            <div className="mb-3 position-relative">
                                <div className="rounded-circle bg-white shadow d-flex align-items-center justify-content-center text-primary fw-bold display-1"
                                     style={{ width: '140px', height: '140px', border: '5px solid #fff' }}>
                                    {employee.fullName ? employee.fullName.charAt(0) : 'U'}
                                </div>
                            </div>
                            <h4 className="fw-bold mb-1">{employee.fullName}</h4>
                            <span className="text-muted mb-3">@{employee.account?.username}</span>
                            <span className="badge bg-primary px-3 py-2 rounded-pill">
                                {employee.employeeCode || 'NV-XXXX'}
                            </span>
                        </div>

                        {/* Cột phải */}
                        <div className="col-md-8 p-5 bg-white">
                            <h5 className="text-primary fw-bold border-bottom pb-2 mb-4">
                                <i className="bi bi-info-circle-fill me-2"></i>Chi tiết hồ sơ
                            </h5>
                            <div className="row g-4">
                                <div className="col-md-6">
                                    <label className="text-muted small fw-bold text-uppercase">Giới tính</label>
                                    <div className="fs-5">{employee.gender || '---'}</div>
                                </div>
                                <div className="col-md-6">
                                    <label className="text-muted small fw-bold text-uppercase">Ngày sinh</label>
                                    <div className="fs-5">{employee.dateOfBirth || '---'}</div>
                                </div>
                                <div className="col-md-6">
                                    <label className="text-muted small fw-bold text-uppercase">Email</label>
                                    <div className="fs-5">{employee.email || '---'}</div>
                                </div>
                                <div className="col-md-6">
                                    <label className="text-muted small fw-bold text-uppercase">Số điện thoại</label>
                                    <div className="fs-5">{employee.phoneNumber || '---'}</div>
                                </div>
                                <div className="col-12">
                                    <label className="text-muted small fw-bold text-uppercase">Địa chỉ</label>
                                    <div className="p-3 bg-light rounded border-start border-4 border-primary mt-1">
                                        <i className="bi bi-geo-alt-fill text-danger me-2"></i>
                                        {employee.address || '---'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MODAL ĐỔI MẬT KHẨU (FIXED CENTER) --- */}
            {showModal && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', // Nền đen mờ
                    zIndex: 9999,
                    display: 'flex',             // Flexbox để căn giữa
                    alignItems: 'center',        // Căn giữa dọc
                    justifyContent: 'center'     // Căn giữa ngang
                }}>
                    {/* Hộp thoại chính */}
                    <div className="bg-white rounded-4 shadow-lg overflow-hidden"
                         style={{ width: '500px', maxWidth: '90%', animation: 'fadeIn 0.3s' }}>

                        {/* Header Modal */}
                        <div className="d-flex justify-content-between align-items-center p-3 px-4 border-bottom">
                            <h5 className="mb-0 fw-bold fs-5 text-dark">Đổi mật khẩu mới</h5>
                            <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                        </div>

                        {/* Body Modal */}
                        <div className="p-4">
                            <form onSubmit={handleSubmitPass}>
                                <div className="mb-3">
                                    <label className="form-label fw-bold small text-muted">Mật khẩu hiện tại:</label>
                                    <input
                                        type="password"
                                        className="form-control bg-light"
                                        name="currentPassword"
                                        value={passForm.currentPassword}
                                        onChange={handleChangePass}
                                        placeholder="••••••"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold small text-muted">Nhập mật khẩu mới:</label>
                                    <input
                                        type="password"
                                        className="form-control bg-light"
                                        name="newPassword"
                                        value={passForm.newPassword}
                                        onChange={handleChangePass}
                                        placeholder="••••••"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-bold small text-muted">Xác nhận mật khẩu:</label>
                                    <input
                                        type="password"
                                        className="form-control bg-light"
                                        name="confirmPassword"
                                        value={passForm.confirmPassword}
                                        onChange={handleChangePass}
                                        placeholder="••••••"
                                    />
                                </div>

                                <div className="d-flex justify-content-end gap-2">
                                    <button type="button" className="btn btn-light fw-bold px-3" onClick={() => setShowModal(false)}>
                                        Hủy bỏ
                                    </button>
                                    <button type="submit" className="btn btn-dark fw-bold px-4">
                                        Đổi mật khẩu
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeInfo;