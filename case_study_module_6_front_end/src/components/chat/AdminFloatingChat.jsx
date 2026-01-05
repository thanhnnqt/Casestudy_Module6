import { useEffect, useState } from "react";
import { getAdminInbox } from "../../services/adminChatService";
import ChatBox from "./ChatBox.jsx";
import "../../styles/chat.css";

export default function AdminFloatingChat({ onClose }) {
    const [customers, setCustomers] = useState([]);
    const [activeCustomer, setActiveCustomer] = useState(null);

    useEffect(() => {
        getAdminInbox().then(innerCustomers => {
            // Sắp xếp hoặc lọc nếu cần
            setCustomers(innerCustomers);
        }).catch(err => console.error("Lỗi tải danh sách chat:", err));
    }, []);

    return (
        <div className="admin-floating-container">
            {!activeCustomer ? (
                <div className="admin-user-list">
                    <div className="chat-box-header">
                        <span className="title">Khách hàng đang nhắn</span>
                        <button className="chat-close-btn" onClick={onClose}>×</button>
                    </div>
                    <div className="admin-user-items">
                        {customers.length === 0 && (
                            <div className="chat-empty" style={{ padding: '20px', textAlign: 'center', opacity: 0.6 }}>
                                Chưa có khách hàng nào bắt đầu chat.
                            </div>
                        )}
                        {customers.map(c => (
                            <div key={c.customerAccountId} className="admin-user-item" onClick={() => setActiveCustomer(c)}>
                                <span className="dot"></span>
                                <div className="user-info">
                                    <div className="user-name">{c.customerUsername}</div>
                                    <div className="user-last-msg" style={{ fontSize: '12px', opacity: 0.7 }}>{c.lastMessage}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <ChatBox
                    adminMode
                    customer={activeCustomer}
                    onClose={() => setActiveCustomer(null)}
                />
            )}
        </div>
    );
}
