import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllCustomers } from '../services/CustomerService';
import "../modules/flight/components/FlightList.css";

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);

    // State tìm kiếm
    const [searchParams, setSearchParams] = useState({
        name: '',
        phone: '',
        identity: ''
    });

    // State phân trang
    const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại (bắt đầu từ 0)
    const [totalPages, setTotalPages] = useState(0);   // Tổng số trang
    const [totalElements, setTotalElements] = useState(0); // Tổng số bản ghi tìm thấy

    // Load dữ liệu
    const fetchCustomers = useCallback(async () => {
        try {
            // Gửi params tìm kiếm + trang hiện tại
            const params = {
                ...searchParams,
                page: currentPage,
                size: 10
            };

            const data = await getAllCustomers(params);

            // Cập nhật state từ phản hồi của Spring Boot Page
            setCustomers(data.content || []); // Dữ liệu nằm trong 'content'
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);

        } catch (error) {
            toast.error('Lỗi: Không thể tải danh sách khách hàng!');
        }
    }, [searchParams, currentPage]);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    // Xử lý tìm kiếm (Reset về trang 0 khi tìm mới)
    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({ ...prev, [name]: value }));
        setCurrentPage(0);
    };

    const handleSearchSubmit = () => {
        setCurrentPage(0);
        fetchCustomers();
    }

    const handleReset = () => {
        setSearchParams({ name: '', phone: '', identity: '' });
        setCurrentPage(0);
    };

    // Chuyển trang
    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    // Thống kê (Chỉ tính trên trang hiện tại hoặc hiển thị tổng số bản ghi)
    const stats = {
        total: totalElements, // Hiển thị tổng số bản ghi trong DB
        male: customers.filter(c => c.gender === 'NAM').length,
        female: customers.filter(c => c.gender === 'NU').length,
        others: customers.filter(c => c.gender === 'KHAC').length
    };

    return (
        <div className="p-4 bg-white" style={{ minHeight: '100vh' }}>

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1 text-dark">Quản lý khách hàng</h2>
                    <p className="text-muted mb-0">Danh sách phân trang</p>
                </div>
                <Link to="/customers/create" className="btn btn-primary shadow-sm fw-bold btn-sm px-3">
                    <i className="bi bi-person-plus-fill me-2"></i>Thêm mới
                </Link>
            </div>

            {/* Statistics (Hiển thị thống kê tổng quan) */}
            <div className="row mb-4 g-3">
                <div className="col-md-3">
                    <div className="card shadow-sm border-0 h-100 border-start border-4 border-success bg-light">
                        <div className="card-body p-2 d-flex align-items-center justify-content-between">
                            <span className="text-muted small fw-bold">TỔNG KHÁCH</span>
                            <span className="fs-4 fw-bold text-success">{stats.total}</span>
                        </div>
                    </div>
                </div>
                {/* Các thẻ thống kê khác chỉ mang tính chất tham khảo trên trang hiện tại */}
                <div className="col-md-9">
                    <div className="alert alert-light border shadow-sm mb-0 py-2 d-flex align-items-center">
                        <i className="bi bi-info-circle text-primary me-2"></i>
                        <small className="text-muted">Đang hiển thị trang <b>{currentPage + 1}</b> trên tổng số <b>{totalPages}</b> trang.</small>
                    </div>
                </div>
            </div>

            {/* Filter Section */}
            <div className="card shadow-sm border-0 p-3 mb-3 bg-white rounded">
                <label className="form-label text-muted small fw-bold mb-2">BỘ LỌC TÌM KIẾM</label>
                <div className="row g-2">
                    <div className="col-md-4">
                        <div className="input-group input-group-sm">
                            <span className="input-group-text bg-light"><i className="bi bi-person"></i></span>
                            <input className="form-control bg-light" placeholder="Họ và tên..." name="name" value={searchParams.name} onChange={handleSearchChange} />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="input-group input-group-sm">
                            <span className="input-group-text bg-light"><i className="bi bi-telephone"></i></span>
                            <input className="form-control bg-light" placeholder="Số điện thoại..." name="phone" value={searchParams.phone} onChange={handleSearchChange} />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="input-group input-group-sm">
                            <span className="input-group-text bg-light"><i className="bi bi-card-heading"></i></span>
                            <input className="form-control bg-light" placeholder="Số CCCD..." name="identity" value={searchParams.identity} onChange={handleSearchChange} />
                        </div>
                    </div>
                    <div className="col-md-2 d-flex gap-1">
                        <button className="btn btn-primary btn-sm w-100 fw-bold" onClick={handleSearchSubmit}>
                            <i className="bi bi-search me-1"></i>Tìm
                        </button>
                        <button className="btn btn-light border btn-sm w-50" onClick={handleReset} title="Làm mới">
                            <i className="bi bi-arrow-counterclockwise"></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* List of Customers */}
            <div className="bg-white rounded border shadow-sm mb-3">
                <div className="p-2 border-bottom bg-light d-flex justify-content-between align-items-center">
                    <h6 className="fw-bold mb-0 text-secondary small">DANH SÁCH KHÁCH HÀNG</h6>
                    <span className="badge bg-white text-dark border">{customers.length} kết quả trang này</span>
                </div>

                {customers.length === 0 ? (
                    <div className="text-center py-4">
                        <p className="text-muted small mb-0">Không tìm thấy kết quả phù hợp.</p>
                    </div>
                ) : (
                    <div className="list-group list-group-flush">
                        {customers.map(c => (
                            <div key={c.id} className="list-group-item p-2 hover-bg-light">
                                <div className="row align-items-center g-0">
                                    <div className="col-md-4 d-flex align-items-center gap-2">
                                        <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center text-primary fw-bold" style={{ width: '35px', height: '35px', fontSize: '0.9rem' }}>
                                            {c.fullName.charAt(0)}
                                        </div>
                                        <div className="d-flex flex-column" style={{lineHeight: '1.2'}}>
                                            <span className="fw-bold text-dark" style={{fontSize: '0.9rem'}}>{c.fullName}</span>
                                            <div className="d-flex align-items-center gap-2">
                                                <span className="badge bg-light text-secondary border px-1" style={{fontSize: '0.65rem'}}>{c.customerCode}</span>
                                                <span className="small text-muted" style={{fontSize: '0.75rem'}}>
                                                    {c.gender === 'NAM' ? 'Nam' : c.gender === 'NU' ? 'Nữ' : 'Khác'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="d-flex align-items-center justify-content-around">
                                            <div className="d-flex align-items-center gap-1" title="Số điện thoại">
                                                <i className="bi bi-telephone text-muted" style={{fontSize: '0.8rem'}}></i>
                                                <span className="fw-medium font-monospace text-primary" style={{fontSize: '0.9rem'}}>{c.phoneNumber}</span>
                                            </div>
                                            <div className="d-flex align-items-center gap-1" title="CCCD/CMND">
                                                <i className="bi bi-person-vcard text-muted" style={{fontSize: '0.9rem'}}></i>
                                                <span className="fw-medium font-monospace text-dark" style={{fontSize: '0.9rem'}}>{c.identityCard}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-2 text-end">
                                        <Link to={`/customers/edit/${c.id}`} className="btn btn-outline-primary btn-sm border-0 py-1 px-2" title="Chỉnh sửa">
                                            <i className="bi bi-pencil-square"></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* === THANH PHÂN TRANG (PAGINATION) === */}
            {totalPages > 1 && (
                <div className="d-flex justify-content-end">
                    <nav>
                        <ul className="pagination pagination-sm mb-0">
                            {/* Nút Trước */}
                            <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                                    <i className="bi bi-chevron-left"></i>
                                </button>
                            </li>

                            {/* Các số trang */}
                            {[...Array(totalPages).keys()].map(page => {
                                // Logic hiển thị rút gọn nếu quá nhiều trang (ví dụ chỉ hiện 5 trang gần nhất)
                                if (totalPages > 5 && Math.abs(page - currentPage) > 2) return null;

                                return (
                                    <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                        <button className="page-link" onClick={() => handlePageChange(page)}>
                                            {page + 1}
                                        </button>
                                    </li>
                                );
                            })}

                            {/* Nút Sau */}
                            <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                                    <i className="bi bi-chevron-right"></i>
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}
        </div>
    );
};

export default CustomerList;