import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllCustomers } from '../services/CustomerService';
import "../modules/flight/components/FlightList.css";

const CustomerList = () => {
    // --- STATE ---
    const [customers, setCustomers] = useState([]);
    const [searchParams, setSearchParams] = useState({
        name: '',
        phone: '',
        identity: ''
    });
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    // --- FETCH DATA ---
    const fetchCustomers = useCallback(async () => {
        try {
            const params = {
                ...searchParams,
                page: currentPage,
                size: 10
            };
            const data = await getAllCustomers(params);

            setCustomers(data.content || []);
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);
        } catch (error) {
            toast.error('Lỗi: Không thể tải danh sách khách hàng!');
        }
    }, [searchParams, currentPage]);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    // --- HANDLERS ---
    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({ ...prev, [name]: value }));
        // Chưa gọi API ngay, chờ bấm nút Tìm
    };

    const handleSearchSubmit = () => {
        setCurrentPage(0);
        fetchCustomers();
    }

    const handleReset = () => {
        setSearchParams({ name: '', phone: '', identity: '' });
        setCurrentPage(0);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    const stats = {
        total: totalElements,
        male: customers.filter(c => c.gender === 'NAM').length,
        female: customers.filter(c => c.gender === 'NU').length,
        others: customers.filter(c => c.gender === 'KHAC').length
    };

    // --- LOGIC PHÂN TRANG RÚT GỌN (Hiện 3 trang + dấu ...) ---
    const renderPaginationItems = () => {
        const items = [];
        // Luôn hiện trang đầu (1)
        items.push(
            <li key={0} className={`page-item ${currentPage === 0 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(0)}>1</button>
            </li>
        );

        // Nếu trang hiện tại > 2, hiện dấu ...
        if (currentPage > 2) {
            items.push(<li key="start-dots" className="page-item disabled"><span className="page-link">...</span></li>);
        }

        // Hiện các trang xung quanh trang hiện tại (nếu không phải là trang đầu hoặc cuối)
        if (currentPage > 0 && currentPage < totalPages - 1) {
            // Trang trước hiện tại (nếu cần thiết)
            if (currentPage > 1) {
                items.push(
                    <li key={currentPage - 1} className="page-item">
                        <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>{currentPage}</button>
                    </li>
                );
            }

            // Trang hiện tại
            items.push(
                <li key={currentPage} className="page-item active">
                    <button className="page-link" onClick={() => handlePageChange(currentPage)}>{currentPage + 1}</button>
                </li>
            );

            // Trang sau hiện tại (nếu cần thiết)
            if (currentPage < totalPages - 2) {
                items.push(
                    <li key={currentPage + 1} className="page-item">
                        <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>{currentPage + 2}</button>
                    </li>
                );
            }
        }

        // Nếu trang hiện tại < tổng - 3, hiện dấu ...
        if (currentPage < totalPages - 3) {
            items.push(<li key="end-dots" className="page-item disabled"><span className="page-link">...</span></li>);
        }

        // Luôn hiện trang cuối (nếu tổng > 1)
        if (totalPages > 1) {
            items.push(
                <li key={totalPages - 1} className={`page-item ${currentPage === totalPages - 1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(totalPages - 1)}>{totalPages}</button>
                </li>
            );
        }
        return items;
    };


    return (
        <div className="p-4 bg-white" style={{ minHeight: '100vh' }}>

            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1 text-dark">Quản lý khách hàng</h2>
                </div>
                <Link to="/customers/create" className="btn btn-primary shadow-sm fw-bold btn-sm px-3">
                    <i className="bi bi-person-plus-fill me-2"></i>Thêm mới
                </Link>
            </div>

            {/* STATISTICS */}
            <div className="row mb-4 g-3">
                <div className="col-md-3">
                    <div className="card shadow-sm border-0 h-100 border-start border-4 border-success bg-light">
                        <div className="card-body p-2 d-flex align-items-center justify-content-between">
                            <span className="text-muted small fw-bold">TỔNG SỐ KHÁCH</span>
                            <span className="fs-4 fw-bold text-success">{stats.total}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* FILTER */}
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
                        <button className="btn btn-light border btn-sm w-50" onClick={handleReset} title="Làm mới">
                            <i className="bi bi-arrow-counterclockwise"></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* LIST OF CUSTOMERS */}
            <div className="bg-white rounded border shadow-sm mb-3">

                {/* 1. Header Bảng + Thông tin trang (Đã chuyển xuống đây) */}
                <div className="p-2 border-bottom bg-light d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-baseline gap-2">
                        <h6 className="fw-bold mb-0 text-secondary small">DANH SÁCH KHÁCH HÀNG</h6>
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                            (Trang <b>{currentPage + 1}</b>/{totalPages} - Tổng <b>{totalElements}</b> kết quả)
                        </span>
                    </div>
                </div>

                {/* 2. Hàng Tiêu Đề Cột (Mới Thêm) */}
                <div className="d-none d-md-flex bg-white border-bottom p-2 fw-bold text-muted small">
                    <div className="col-1 text-center">#</div>
                    <div className="col-4">HỌ VÀ TÊN / MÃ</div>
                    <div className="col-3 text-center">SỐ ĐIỆN THOẠI</div>
                    <div className="col-3 text-center">CCCD / CMND</div>
                    <div className="col-1 text-end">XỬ LÝ</div>
                </div>

                {/* 3. Danh sách dữ liệu */}
                {customers.length === 0 ? (
                    <div className="text-center py-4">
                        <p className="text-muted small mb-0">Không tìm thấy kết quả phù hợp.</p>
                    </div>
                ) : (
                    <div className="list-group list-group-flush">
                        {customers.map((c, index) => (
                            <div key={c.id} className="list-group-item p-2 hover-bg-light">
                                <div className="row align-items-center g-0">

                                    {/* Cột 1: STT */}
                                    <div className="col-1 text-center text-muted fw-bold small">
                                        {(currentPage * 10) + index + 1}
                                    </div>

                                    {/* Cột 2: Tên & Mã */}
                                    <div className="col-4 d-flex align-items-center gap-2">
                                        <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center text-primary fw-bold" style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>
                                            {c.fullName.charAt(0)}
                                        </div>
                                        <div className="d-flex flex-column" style={{ lineHeight: '1.2' }}>
                                            <span className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>{c.fullName}</span>
                                            <div className="d-flex align-items-center gap-2">
                                                <span className="badge bg-light text-secondary border px-1" style={{ fontSize: '0.65rem' }}>{c.customerCode}</span>
                                                <span className="small text-muted" style={{ fontSize: '0.75rem' }}>
                                                    {c.gender === 'NAM' ? 'Nam' : c.gender === 'NU' ? 'Nữ' : 'Khác'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Cột 3: SĐT */}
                                    <div className="col-3 text-center">
                                        <span className="fw-medium font-monospace text-primary" style={{ fontSize: '0.9rem' }}>{c.phoneNumber}</span>
                                    </div>

                                    {/* Cột 4: CCCD */}
                                    <div className="col-3 text-center">
                                        <span className="fw-medium font-monospace text-dark" style={{ fontSize: '0.9rem' }}>{c.identityCard}</span>
                                    </div>

                                    {/* Cột 5: Nút Sửa */}
                                    <div className="col-1 text-end">
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

            {/* PAGINATION */}
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

                            {/* Render các trang rút gọn */}
                            {renderPaginationItems()}

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