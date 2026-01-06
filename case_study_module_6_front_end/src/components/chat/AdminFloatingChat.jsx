import { useEffect, useState } from "react";
import { getAdminInbox, markMessagesAsRead } from "../../services/adminChatService";
import { connectChat, disconnectChat } from "../../services/chatSocket.js";
import { useAuth } from "../../context/AuthContext.jsx";
import ChatBox from "./ChatBox.jsx";
import "../../styles/chat.css";

export default function AdminFloatingChat({ onClose }) {
    const [customers, setCustomers] = useState([]);
    const [activeCustomer, setActiveCustomer] = useState(null);
    const { token } = useAuth();

    const refreshInbox = () => {
        getAdminInbox().then(innerCustomers => {
            // Sắp xếp hoặc lọc nếu cần
            setCustomers(innerCustomers);
        }).catch(err => console.error("Lỗi tải danh sách chat:", err));
    };

    useEffect(() => {
        refreshInbox();
    }, []);

    useEffect(() => {
        if (!token) return;

        const handleGlobalMsg = (msg) => {
            // Nếu có tin nhắn mới từ khách hàng, refresh danh sách
            if (msg.senderRole === "CUSTOMER") {
                console.log("AdminFloatingChat: Nhận tin nhắn mới, cập nhật danh sách...");
                refreshInbox();
            }
        };

        connectChat(token, handleGlobalMsg);
        return () => disconnectChat(handleGlobalMsg);
    }, [token]);

    const handleSelectCustomer = async (customer) => {
        setActiveCustomer(customer);

        // Đánh dấu tin nhắn đã đọc
        if (customer.unreadCount > 0) {
            try {
                await markMessagesAsRead(customer.customerAccountId);
                // Refresh inbox để cập nhật badge
                refreshInbox();
            } catch (error) {
                console.error("Error marking messages as read:", error);
            }
        }
    };

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
                            <div key={c.customerAccountId} className="admin-user-item" onClick={() => handleSelectCustomer(c)}>
                                <span className="dot"></span>
                                <div className="user-info">
                                    <div className="user-name">
                                        {c.customerUsername}
                                        {c.unreadCount > 0 && (
                                            <span className="badge bg-danger ms-2">{c.unreadCount}</span>
                                        )}
                                    </div>
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
