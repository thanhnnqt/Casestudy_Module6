import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminSidebar = ({ collapsed, toggleSidebar, onLogout }) => {
    return (
        <div className={`sidebar ${collapsed ? 'collapsed' : ''}`} id="sidebar">
            <div className="d-flex justify-content-between align-items-start w-100">
                <h4>
                    <i className="bi bi-airplane-engines"></i>
                    {!collapsed && <span>Admin</span>}
                </h4>
                <button className="btn-toggle" onClick={toggleSidebar}>
                    <i className="bi bi-list"></i>
                </button>
            </div>

            <div className="nav flex-column mt-3">
                {/* 1. CHUYẾN BAY */}
                <NavLink to="/flights" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
                    <i className="bi bi-grid-1x2-fill"></i>
                    {!collapsed && <span>Quản lý chuyến bay</span>}
                </NavLink>

                {/* 2. ĐẶT VÉ */}
                <NavLink to="/bookings" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
                    <i className="bi bi-ticket-perforated-fill"></i>
                    {!collapsed && <span>Quản lý đặt chỗ</span>}
                </NavLink>

                {/* 3. NHÂN VIÊN */}
                <NavLink to="/employees" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
                    <i className="bi bi-people-fill"></i>
                    {!collapsed && <span>Quản lý nhân viên</span>}
                </NavLink>

                {/* 4. TIN TỨC (MỚI) */}
                <NavLink to="/admin/news" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
                    <i className="bi bi-newspaper"></i>
                    {!collapsed && <span>Quản lý tin tức</span>}
                </NavLink>

                {/* 5. BÁO CÁO */}
                <NavLink to="/report" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
                    <i className="bi bi-bar-chart-line-fill"></i>
                    {!collapsed && <span>Báo cáo</span>}
                </NavLink>
            </div>

            <div className="mt-auto">
                <button className="nav-link text-danger border-0 bg-transparent w-100 text-start" onClick={onLogout}>
                    <i className="bi bi-box-arrow-left"></i>
                    {!collapsed && <span>Đăng xuất</span>}
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;