import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getEmployeeById } from '../services/EmployeeService';
import "../modules/flight/components/FlightList.css";

const EmployeeInfo = () => {
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

    const currentEmployeeId = 1;

    useEffect(() => {
        const fetchEmployeeInfo = async () => {
            try {
                const data = await getEmployeeById(currentEmployeeId);
                setEmployee({
                    ...data,
                    dateOfBirth: data.dob
                });
            } catch (error) {
                // toast.error("Không thể tải thông tin nhân viên!");
            }
        };
        fetchEmployeeInfo();
    }, []);

    return (
        // Xóa className "flight-list-container" nếu nó chứa style flex gây vỡ layout
        <div className="container-fluid" style={{ padding: 0 }}>

            {/* Nếu ông muốn giữ hiệu ứng mây trời thì để lại, không thì xóa div sky-container này đi */}
            <div className="sky-container" style={{ position: 'fixed', zIndex: -1 }}>
                <i className="bi bi-cloud-fill cloud" style={{ top: '10%', fontSize: '120px', opacity: 0.4 }}></i>
            </div>

            {/* --- ĐÃ XÓA SIDEBAR Ở ĐÂY --- */}

            {/* Main Content */}
            <div className="d-flex justify-content-center" style={{ paddingTop: '20px' }}>

                <div className="glass-card p-0 shadow-lg overflow-hidden" style={{ maxWidth: '1000px', width: '100%', borderRadius: '20px', backgroundColor: 'rgba(255,255,255,0.9)' }}>

                    {/* Header Card */}
                    <div className="bg-primary text-white p-4 d-flex justify-content-between align-items-center bg-gradient">
                        <h3 className="mb-0 fw-bold">
                            <i className="bi bi-person-vcard-fill me-3"></i>
                            Thông Tin Nhân Viên
                        </h3>
                        <button className="btn btn-light text-primary rounded-pill fw-bold shadow-sm">
                            <i className="bi bi-pencil-square me-2"></i>Cập nhật hồ sơ
                        </button>
                    </div>

                    <div className="row g-0">
                        {/* Cột trái */}
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

                        {/* Cột phải */}
                        <div className="col-md-8 p-5 bg-white">
                            <h5 className="text-primary fw-bold mb-4 border-bottom pb-2">
                                <i className="bi bi-info-circle me-2"></i>Chi tiết cá nhân
                            </h5>
                            <div className="row g-4">
                                <div className="col-md-6">
                                    <label className="text-muted small fw-bold text-uppercase mb-1">Giới tính</label>
                                    <div className="fs-5 fw-medium">
                                        {employee.gender === 'Nam' ? <span className="text-primary"><i className="bi bi-gender-male me-2"></i>Nam</span> :
                                            employee.gender === 'Nữ' ? <span className="text-danger"><i className="bi bi-gender-female me-2"></i>Nữ</span> :
                                                <span>Khác</span>}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label className="text-muted small fw-bold text-uppercase mb-1">Ngày sinh</label>
                                    <div className="fs-5 fw-medium text-dark">{employee.dateOfBirth}</div>
                                </div>
                                <div className="col-md-6">
                                    <label className="text-muted small fw-bold text-uppercase mb-1">Email</label>
                                    <div className="fs-5 fw-medium text-dark">{employee.email}</div>
                                </div>
                                <div className="col-md-6">
                                    <label className="text-muted small fw-bold text-uppercase mb-1">SĐT</label>
                                    <div className="fs-5 fw-medium text-dark">{employee.phoneNumber}</div>
                                </div>
                                <div className="col-12">
                                    <label className="text-muted small fw-bold text-uppercase mb-1">Địa chỉ</label>
                                    <div className="p-3 bg-light rounded border-start border-4 border-primary">
                                        <i className="bi bi-geo-alt-fill me-2 text-danger"></i>{employee.address}
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