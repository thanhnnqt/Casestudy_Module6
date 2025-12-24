import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from "../components/Header";
import Footer from "../components/Footer";

// Thêm tham số { showSidebar = true } vào đây
const MainLayout = ({ showSidebar = true }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleToggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#f0f2f5'
        }}>

            {/* --- PHẦN 1: HEADER (LUÔN CÓ) --- */}
            <div style={{ height: '70px', flexShrink: 0 }}>
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0,
                    height: '70px',
                    zIndex: 1000,
                    backgroundColor: 'white'
                }}>
                    <Header />
                </div>
            </div>

            {/* --- PHẦN 2: THÂN --- */}
            <div style={{
                flex: 1,
                display: 'flex',
                padding: '20px',
                gap: '20px',
                alignItems: 'start',
                marginTop: '10px'
            }}>

                {/* --- SIDEBAR (CHỈ HIỆN NẾU showSidebar === true) --- */}
                {showSidebar && (
                    <aside style={{
                        width: isCollapsed ? '80px' : '260px',
                        flexShrink: 0,
                        position: 'sticky',
                        top: '90px',
                        height: 'calc(100vh - 110px)',
                        backgroundColor: '#fff',
                        borderRadius: '10px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        overflow: 'hidden',
                        transition: 'width 0.3s'
                    }}>
                        <Sidebar isCollapsed={isCollapsed} onToggle={handleToggleSidebar} />
                    </aside>
                )}

                {/* --- NỘI DUNG CHÍNH (Tự động full màn hình nếu mất sidebar) --- */}
                <main style={{
                    flex: 1,
                    backgroundColor: '#fff',
                    borderRadius: '10px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    padding: '20px',
                    minWidth: 0,
                    minHeight: '80vh'
                }}>
                    <Outlet />
                </main>

            </div>

            {/* --- PHẦN 3: FOOTER (LUÔN CÓ) --- */}
            <div style={{ flexShrink: 0 }}>
                <Footer />
            </div>

        </div>
    );
};

export default MainLayout;