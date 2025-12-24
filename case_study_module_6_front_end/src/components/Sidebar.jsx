import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// LƯU Ý: Nếu file CSS cũ (FlightList.css) có set width/position cho .sidebar thì ông xóa dòng import này đi
// import "../modules/flight/components/FlightList.css";

const Sidebar = ({ isCollapsed, onToggle }) => {
    const location = useLocation();

    const isActive = (path) => location.pathname.startsWith(path) ? 'bg-primary text-white' : 'text-dark hover-bg-light';

    return (
        <div className="d-flex flex-column h-100">

            {/* 1. LOGO & TOGGLE */}
            <div className="p-3 border-bottom d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-2 overflow-hidden">
                    <i className="bi bi-airplane-engines-fill text-primary fs-4"></i>
                    {!isCollapsed && <span className="fw-bold fs-5 text-dark">SkyAdmin</span>}
                </div>
                <button onClick={onToggle} className="btn btn-sm btn-light border-0">
                    <i className={`bi ${isCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i>
                </button>
            </div>

            {/* 2. MENU LIST */}
            <div className="flex-grow-1 overflow-auto py-3 px-2 d-flex flex-column gap-1">
                <MenuItem to="/detailemployee" icon="bi-person-badge-fill" label="Nhân viên" activeClass={isActive('/detailemployee')} collapsed={isCollapsed} />
                <MenuItem to="/customers" icon="bi-people-fill" label="Khách hàng" activeClass={isActive('/customers')} collapsed={isCollapsed} />
                <MenuItem to="/management" icon="bi-receipt-cutoff" label="Quản lý vé" activeClass={isActive('/management')} collapsed={isCollapsed} />
                <MenuItem to="/search-flight" icon="bi-ticket-perforated-fill" label="Đặt vé" activeClass={isActive('/search-flight')} collapsed={isCollapsed} />
                <MenuItem to="/statistics" icon="bi-bar-chart-line-fill" label="Thống kê" activeClass={isActive('/statistics')} collapsed={isCollapsed} />
            </div>

            {/* 3. FOOTER (Đăng xuất) */}
            <div className="p-3 border-top mt-auto">
                <Link to="/login" className="nav-link text-danger d-flex align-items-center gap-2">
                    <i className="bi bi-box-arrow-left fs-5"></i>
                    {!isCollapsed && <span>Đăng xuất</span>}
                </Link>
            </div>
        </div>
    );
};

// Component con để code gọn hơn
const MenuItem = ({ to, icon, label, activeClass, collapsed }) => (
    <Link to={to} className={`nav-link d-flex align-items-center gap-3 p-2 rounded ${activeClass}`} title={label}>
        <i className={`bi ${icon} fs-5`}></i>
        {!collapsed && <span style={{whiteSpace: 'nowrap'}}>{label}</span>}
    </Link>
);

export default Sidebar;