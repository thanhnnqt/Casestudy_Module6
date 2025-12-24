import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Modal, Button } from 'react-bootstrap';
import { getAllCustomers, deleteCustomer } from '../services/CustomerService';
import Sidebar from './Sidebar'; // Import Sidebar mới tạo
import "../modules/flight/components/FlightList.css";

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // State cho Modal Xóa
    const [showModal, setShowModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    // Load dữ liệu
    const fetchCustomers = useCallback(async () => {
        try {
            const data = await getAllCustomers(keyword);
            setCustomers(data || []);
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            toast.error('Lỗi: Không thể tải danh sách khách hàng!');
        }
    }, [keyword]);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    // Hàm Modal
    const handleShowDeleteModal = (customer) => {
        setSelectedCustomer(customer);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedCustomer(null);
    };

    const confirmDelete = async () => {
        if (!selectedCustomer) return;
        try {
            await deleteCustomer(selectedCustomer.id);
            toast.success(`Đã xóa khách hàng ${selectedCustomer.customerCode} thành công!`);
            fetchCustomers();
            handleCloseModal();
        } catch (error) {
            toast.error('Xóa thất bại! Vui lòng thử lại.');
            handleCloseModal();
        }
    };

    // Thống kê
    const stats = {
        total: customers.length,
        male: customers.filter(c => c.gender === 'NAM').length,
        female: customers.filter(c => c.gender === 'NU').length,
        others: customers.filter(c => c.gender === 'KHAC').length
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
            <div className="main">
                {/* Header */}
                <div className="glass-card d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold mb-1 text-dark">Quản lý khách hàng</h2>
                        <p className="text-muted mb-0">Danh sách và thông tin chi tiết</p>
                    </div>
                    <Link to="/customers/create" className="btn btn-gradient shadow-lg">
                        <i className="bi bi-person-plus-fill me-2"></i>Thêm khách hàng
                    </Link>
                </div>

                {/* Statistics Cards */}
                <div className="row mb-4">
                    <div className="col-md-3">
                        <div className="glass-card stat-card" style={{ borderBottom: '5px solid #2ed573' }}>
                            <i className="bi bi-people-fill stat-icon text-success"></i>
                            <div className="stat-value">{stats.total}</div>
                            <div className="stat-label">Tổng khách hàng</div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="glass-card stat-card" style={{ borderBottom: '5px solid #1e90ff' }}>
                            <i className="bi bi-gender-male stat-icon text-primary"></i>
                            <div className="stat-value">{stats.male}</div>
                            <div className="stat-label">Nam</div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="glass-card stat-card" style={{ borderBottom: '5px solid #ff4757' }}>
                            <i className="bi bi-gender-female stat-icon text-danger"></i>
                            <div className="stat-value">{stats.female}</div>
                            <div className="stat-label">Nữ</div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="glass-card stat-card" style={{ borderBottom: '5px solid #ffa502' }}>
                            <i className="bi bi-three-dots stat-icon text-warning"></i>
                            <div className="stat-value">{stats.others}</div>
                            <div className="stat-label">Khác</div>
                        </div>
                    </div>
                </div>

                {/* Filter Section */}
                <div className="glass-card p-3 mb-4" style={{ position: 'relative', zIndex: 10 }}>
                    <div className="row g-3 align-items-end">
                        <div className="col-md-8">
                            <label className="form-label text-muted small fw-bold">TÌM KIẾM</label>
                            <div className="input-group">
                                <span className="input-group-text border-0 bg-transparent"><i className="bi bi-search"></i></span>
                                <input
                                    className="form-control custom-input"
                                    placeholder="Nhập tên, số điện thoại, mã khách hàng..."
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <button className="btn btn-primary w-100 fw-bold shadow-sm custom-input"
                                    onClick={fetchCustomers} style={{ padding: '10px' }}>
                                <i className="bi bi-filter me-1"></i> Làm mới dữ liệu
                            </button>
                        </div>
                    </div>
                </div>

                {/* List of Customers */}
                <div className="flight-list-wrapper">
                    <div className="d-flex justify-content-between align-items-center mb-3 px-2">
                        <h6 className="fw-bold mb-0" style={{ color: '#444' }}>
                            Tìm thấy {customers.length} khách hàng
                        </h6>
                    </div>

                    {customers.length === 0 ? (
                        <div className="text-center py-5 glass-card">
                            <i className="bi bi-person-x text-muted" style={{ fontSize: '3rem' }}></i>
                            <p className="mt-3 text-muted fw-bold">Không tìm thấy khách hàng nào.</p>
                        </div>
                    ) : (
                        customers.map(c => (
                            <div key={c.id} className="flight-card">
                                <div className="row align-items-center g-0">
                                    <div className="col-md-4 border-end pe-3">
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="bg-light rounded-circle d-flex align-items-center justify-content-center text-primary fw-bold"
                                                 style={{ width: '50px', height: '50px', fontSize: '1.2rem', border: '2px solid #a29bfe' }}>
                                                {c.fullName.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="fc-airline-name">{c.fullName}</div>
                                                <div className="d-flex gap-2 align-items-center mt-1">
                                                    <span className="badge bg-secondary">{c.customerCode}</span>
                                                    <span className="text-muted small">
                                                        {c.gender === 'NAM' ? <i className="bi bi-gender-male text-primary"> Nam</i> :
                                                            c.gender === 'NU' ? <i className="bi bi-gender-female text-danger"> Nữ</i> : 'Khác'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-5 px-4 border-end">
                                        <div className="row">
                                            <div className="col-6 mb-2">
                                                <small className="text-muted d-block">Ngày sinh</small>
                                                <span className="fw-medium">{c.dateOfBirth}</span>
                                            </div>
                                            <div className="col-6 mb-2">
                                                <small className="text-muted d-block">Số điện thoại</small>
                                                <span className="fw-medium text-primary">{c.phoneNumber}</span>
                                            </div>
                                            <div className="col-6">
                                                <small className="text-muted d-block">CMND/CCCD</small>
                                                <span className="fw-medium">{c.identityCard}</span>
                                            </div>
                                            <div className="col-6">
                                                <small className="text-muted d-block">Địa chỉ</small>
                                                <span className="fw-medium text-truncate d-block" title={c.address}>{c.address || '---'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-3 ps-3">
                                        <div className="d-flex flex-column align-items-end h-100 justify-content-center gap-2">
                                            <Link to={`/customers/edit/${c.id}`} className="btn-edit-card w-100 text-center">
                                                <i className="bi bi-pencil-square me-1"></i> Chỉnh sửa
                                            </Link>
                                            <button
                                                onClick={() => handleShowDeleteModal(c)}
                                                className="btn btn-outline-danger btn-sm w-100 rounded-pill border-0 fw-bold"
                                                style={{backgroundColor: '#ffebee'}}
                                            >
                                                <i className="bi bi-trash me-1"></i> Xóa
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Modal */}
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton className="bg-danger text-white">
                    <Modal.Title><i className="bi bi-exclamation-triangle-fill me-2"></i>Xác nhận xóa</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center py-4">
                    <i className="bi bi-trash text-danger" style={{ fontSize: '3rem' }}></i>
                    <p className="mt-3 fs-5">
                        Bạn có chắc chắn muốn xóa khách hàng <br/>
                        <strong className="text-danger">{selectedCustomer?.fullName}</strong> ({selectedCustomer?.customerCode})?
                    </p>
                    <p className="text-muted small">Hành động này không thể hoàn tác.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Hủy bỏ</Button>
                    <Button variant="danger" onClick={confirmDelete}>Đồng ý xóa</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CustomerList;