import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createCustomer, getCustomerById, updateCustomer } from '../services/CustomerService';
import Sidebar from './Sidebar'; // Import Sidebar mới tạo
import "../modules/flight/components/FlightList.css";

const CustomerForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const [customer, setCustomer] = useState({
        customerCode: '',
        fullName: '',
        dateOfBirth: '',
        gender: 'NAM',
        phoneNumber: '',
        identityCard: '',
        address: ''
    });

    useEffect(() => {
        if (isEditMode) {
            const loadData = async () => {
                try {
                    const data = await getCustomerById(id);
                    setCustomer(data);
                } catch (error) {
                    toast.error('Không tìm thấy thông tin khách hàng!');
                    navigate('/customers');
                }
            };
            loadData();
        }
    }, [id, isEditMode, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomer({ ...customer, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                await updateCustomer(id, customer);
                toast.success('Cập nhật thông tin thành công!');
            } else {
                await createCustomer(customer);
                toast.success('Thêm mới khách hàng thành công!');
            }
            navigate('/customers');
        } catch (error) {
            const errorMsg = error.response?.data || 'Có lỗi xảy ra, vui lòng thử lại!';
            toast.error(errorMsg);
        }
    };

    return (
        <div className="flight-list-container">
            {/* Background Bầu trời */}
            <div className="sky-container">
                <i className="bi bi-cloud-fill cloud" style={{ top: '10%', fontSize: '120px', animationDuration: '45s', opacity: 0.4 }}></i>
                <i className="bi bi-cloud-fill cloud" style={{ top: '60%', fontSize: '150px', animationDuration: '55s', animationDelay: '-5s', opacity: 0.2 }}></i>
            </div>

            {/* === SIDEBAR COMPONENT === */}
            <Sidebar
                isCollapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            />

            {/* Main Content */}
            <div className="main d-flex flex-column justify-content-center align-items-center" style={{minHeight: '100vh'}}>

                <div className="glass-card p-5 shadow-lg" style={{ maxWidth: '900px', width: '100%' }}>
                    <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                        <h3 className="fw-bold text-dark m-0">
                            <i className={`bi ${isEditMode ? 'bi-pencil-square' : 'bi-person-plus-fill'} me-2 text-primary`}></i>
                            {isEditMode ? 'Cập Nhật Hồ Sơ' : 'Thêm Khách Hàng Mới'}
                        </h3>
                        <Link to="/customers" className="btn btn-outline-secondary rounded-pill btn-sm">
                            <i className="bi bi-x-lg"></i> Đóng
                        </Link>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="row g-4">
                            {/* Cột trái */}
                            <div className="col-md-6">
                                <label className="form-label text-muted small fw-bold">MÃ KHÁCH HÀNG <span className="text-danger">*</span></label>
                                <div className="input-group">
                                    <span className="input-group-text border-0 bg-light"><i className="bi bi-qr-code"></i></span>
                                    <input
                                        type="text"
                                        className="form-control custom-input bg-light"
                                        name="customerCode"
                                        value={customer.customerCode}
                                        onChange={handleChange}
                                        required
                                        disabled={isEditMode}
                                        placeholder="VD: KH001"
                                    />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label text-muted small fw-bold">HỌ VÀ TÊN <span className="text-danger">*</span></label>
                                <div className="input-group">
                                    <span className="input-group-text border-0 bg-light"><i className="bi bi-person"></i></span>
                                    <input
                                        type="text"
                                        className="form-control custom-input bg-light"
                                        name="fullName"
                                        value={customer.fullName}
                                        onChange={handleChange}
                                        required
                                        placeholder="Nhập họ tên đầy đủ"
                                    />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label text-muted small fw-bold">NGÀY SINH <span className="text-danger">*</span></label>
                                <div className="input-group">
                                    <span className="input-group-text border-0 bg-light"><i className="bi bi-calendar-event"></i></span>
                                    <input
                                        type="date"
                                        className="form-control custom-input bg-light"
                                        name="dateOfBirth"
                                        value={customer.dateOfBirth}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label text-muted small fw-bold">GIỚI TÍNH</label>
                                <div className="input-group">
                                    <span className="input-group-text border-0 bg-light"><i className="bi bi-gender-ambiguous"></i></span>
                                    <select
                                        className="form-select custom-input bg-light"
                                        name="gender"
                                        value={customer.gender}
                                        onChange={handleChange}
                                    >
                                        <option value="NAM">Nam</option>
                                        <option value="NU">Nữ</option>
                                        <option value="KHAC">Khác</option>
                                    </select>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label text-muted small fw-bold">SỐ ĐIỆN THOẠI <span className="text-danger">*</span></label>
                                <div className="input-group">
                                    <span className="input-group-text border-0 bg-light"><i className="bi bi-telephone"></i></span>
                                    <input
                                        type="text"
                                        className="form-control custom-input bg-light"
                                        name="phoneNumber"
                                        value={customer.phoneNumber}
                                        onChange={handleChange}
                                        required
                                        placeholder="09xx..."
                                    />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label text-muted small fw-bold">CMND/CCCD <span className="text-danger">*</span></label>
                                <div className="input-group">
                                    <span className="input-group-text border-0 bg-light"><i className="bi bi-card-heading"></i></span>
                                    <input
                                        type="text"
                                        className="form-control custom-input bg-light"
                                        name="identityCard"
                                        value={customer.identityCard}
                                        onChange={handleChange}
                                        required
                                        placeholder="Số thẻ căn cước"
                                    />
                                </div>
                            </div>

                            <div className="col-12">
                                <label className="form-label text-muted small fw-bold">ĐỊA CHỈ</label>
                                <div className="input-group">
                                    <span className="input-group-text border-0 bg-light"><i className="bi bi-geo-alt"></i></span>
                                    <textarea
                                        className="form-control custom-input bg-light"
                                        name="address"
                                        rows="2"
                                        value={customer.address}
                                        onChange={handleChange}
                                        placeholder="Địa chỉ liên hệ..."
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="d-flex justify-content-end gap-3 mt-5">
                            <Link to="/customers" className="btn btn-light rounded-pill px-4 fw-bold">
                                Hủy bỏ
                            </Link>
                            <button type="submit" className="btn btn-gradient rounded-pill px-5 shadow fw-bold text-white">
                                {isEditMode ? 'Lưu Thay Đổi' : 'Xác Nhận Thêm'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CustomerForm;