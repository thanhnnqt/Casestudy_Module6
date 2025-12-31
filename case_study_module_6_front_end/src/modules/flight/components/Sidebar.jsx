import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../modules/flight/components/FlightList.css'; // Import CSS để nhận style sidebar

const Sidebar = ({ collapsed, toggleSidebar, onLogout }) => {
    const location = useLocation();

    // Hàm active link
    const isActive = (path) => location.pathname.startsWith(path) ? 'active-link' : '';

    return (
        <div
            className="d-flex flex-column flex-shrink-0 p-3 bg-white border-end"
            style={{ width: collapsed ? '80px' : '260px', minHeight: '100vh', transition: 'width 0.3s' }}
        >
            {/* Logo Area */}
            <div className="d-flex align-items-center mb-4 mb-md-0 me-md-auto link-dark text-decoration-none">
                <i className="bi bi-airplane-engines-fill fs-2 text-primary me-2"></i>
                {!collapsed && <span className="fs-4 fw-bold text-primary">FlyFast Admin</span>}
            </div>

            <hr />

            {/* Menu Items */}
            <ul className="nav nav-pills flex-column mb-auto gap-2">
                <li className="nav-item">
                    <Link to="/flights" className={`nav-link link-dark d-flex align-items-center ${isActive('/flights')}`}>
                        <i className="bi bi-airplane-fill me-3 fs-5"></i>
                        {!collapsed && <span>Quản lý chuyến bay</span>}
                    </Link>
                </li>
                <li>
                    <Link to="/bookings" className={`nav-link link-dark d-flex align-items-center ${isActive('/bookings')}`}>
                        <i className="bi bi-ticket-perforated-fill me-3 fs-5"></i>
                        {!collapsed && <span>Quản lý đặt chỗ</span>}
                    </Link>
                </li>
                <li>
                    <Link to="/employees" className={`nav-link link-dark d-flex align-items-center ${isActive('/employees')}`}>
                        <i className="bi bi-people-fill me-3 fs-5"></i>
                        {!collapsed && <span>Quản lý nhân viên</span>}
                    </Link>
                </li>
                <li>
                    <Link to="/admin/news" className={`nav-link link-dark d-flex align-items-center ${isActive('/admin/news')}`}>
                        <i className="bi bi-newspaper me-3 fs-5"></i>
                        {!collapsed && <span>Quản lý tin tức</span>}
                    </Link>
                </li>
                <li>
                    <Link to="/report" className={`nav-link link-dark d-flex align-items-center ${isActive('/report')}`}>
                        <i className="bi bi-bar-chart-line-fill me-3 fs-5"></i>
                        {!collapsed && <span>Báo cáo</span>}
                    </Link>
                </li>
            </ul>

            <hr />

            {/* User / Logout */}
            <div className="dropdown">
                <a href="#" className="d-flex align-items-center link-dark text-decoration-none dropdown-toggle" id="dropdownUser2" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src="https://github.com/mdo.png" alt="" width="32" height="32" className="rounded-circle me-2" />
                    {!collapsed && <strong>Admin</strong>}
                </a>
                <ul className="dropdown-menu text-small shadow" aria-labelledby="dropdownUser2">
                    <li><button className="dropdown-item" onClick={onLogout}>Đăng xuất</button></li>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;