import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import "../modules/flight/components/FlightList.css"; // Giữ import CSS cũ của bạn

const Sidebar = ({ isCollapsed, onToggle }) => {
    const location = useLocation();

    // Hàm kiểm tra active
    const isActive = (path) => {
        return location.pathname.startsWith(path) ? 'active' : '';
    };

    return (
        <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`} id="sidebar">
            <div className="d-flex justify-content-between align-items-start w-100">
                {/* Logo */}
                <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-airplane-engines-fill text-primary" style={{ fontSize: '1.5rem' }}></i>
                    {!isCollapsed && <span className="fw-bold fs-5">SkyAdmin</span>}
                </div>
                {/* Nút toggle */}
                <button className="btn-toggle" onClick={onToggle}>
                    <i className="bi bi-list"></i>
                </button>
            </div>

            {/* Menu */}
            <div className="nav flex-column mt-4">
                <Link to="/employees" className={`nav-link ${isActive('/employees')}`}>
                    <i className="bi bi-person-badge-fill"></i>
                    <span> Thông tin nhân viên</span>
                </Link>

                <Link to="/customers" className={`nav-link ${isActive('/customers')}`}>
                    <i className="bi bi-people-fill"></i>
                    <span> Quản lý khách hàng</span>
                </Link>

                <Link to="/sales" className={`nav-link ${isActive('/sales')}`}>
                    <i className="bi bi-receipt-cutoff"></i>
                    <span> Quản lý bán vé</span>
                </Link>

                <Link to="/booking" className={`nav-link ${isActive('/booking')}`}>
                    <i className="bi bi-ticket-perforated-fill"></i>
                    <span> Đặt vé</span>
                </Link>

                <Link to="/statistics" className={`nav-link ${isActive('/statistics')}`}>
                    <i className="bi bi-bar-chart-line-fill"></i>
                    <span> Thống kê</span>
                </Link>
            </div>

            {/* Footer */}
            <div className="mt-auto">
                <hr className="text-white-50" />
                <Link to="/login" className="nav-link text-danger">
                    <i className="bi bi-box-arrow-left"></i>
                    <span>Đăng xuất</span>
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;