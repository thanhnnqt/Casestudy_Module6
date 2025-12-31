import React, { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
// Import CSS gốc để giữ hiệu ứng Sky & Glass
import "../modules/flight/components/FlightList.css";

const AdminLayout = ({ children }) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const handleLogout = () => {
        if(window.confirm("Bạn có chắc muốn đăng xuất?")) {
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
    };

    return (
        <div className="flight-list-container"> {/* Class này giữ gradient nền xanh */}

            {/* --- BACKGROUND MÂY TRỜI (GIỮ NGUYÊN) --- */}
            <div className="sky-container">
                <i className="bi bi-cloud-fill cloud" style={{top: '10%', fontSize: '120px', animationDuration: '45s', opacity: 0.4}}></i>
                <i className="bi bi-cloud-fill cloud" style={{top: '30%', fontSize: '80px', animationDuration: '35s', animationDelay: '-10s', opacity: 0.3}}></i>
                <i className="bi bi-cloud-fill cloud" style={{top: '60%', fontSize: '150px', animationDuration: '55s', animationDelay: '-5s', opacity: 0.2}}></i>
                <i className="bi bi-airplane-fill plane-vertical" style={{left: '10%', fontSize: '30px', animationDuration: '4s'}}></i>
                <i className="bi bi-airplane-fill plane-vertical" style={{left: '55%', fontSize: '45px', animationDuration: '5s', animationDelay: '0.5s'}}></i>
                <i className="bi bi-airplane-fill plane-vertical" style={{left: '85%', fontSize: '60px', animationDuration: '7s', animationDelay: '1s'}}></i>
            </div>

            {/* --- SIDEBAR --- */}
            <AdminSidebar
                collapsed={sidebarCollapsed}
                toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
                onLogout={handleLogout}
            />

            {/* --- MAIN CONTENT --- */}
            <div className={`main ${sidebarCollapsed ? 'expanded' : ''}`}>
                {children}
            </div>
        </div>
    );
};

export default AdminLayout;