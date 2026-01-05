import { useEffect, useState } from "react";
import { getAdminInbox } from "../../services/adminChatService";
import { connectChat, disconnectChat } from "../../services/chatSocket.js";
import { useAuth } from "../../context/AuthContext.jsx";
import ChatBox from "./ChatBox.jsx";

export default function AdminInbox() {
    const [customers, setCustomers] = useState([]);
    const [activeCustomer, setActiveCustomer] = useState(null);
    const { token } = useAuth();

    const refreshInbox = () => {
        getAdminInbox().then(setCustomers);
    };

    useEffect(() => {
        refreshInbox();
    }, []);

    useEffect(() => {
        if (!token) return;

        const handleGlobalMsg = (msg) => {
            // Nếu có tin nhắn mới từ khách hàng, refresh danh sách sidebar
            if (msg.senderRole === "CUSTOMER") {
                console.log("AdminInbox: Nhận tin nhắn mới, cập nhật sidebar...");
                refreshInbox();
            }
        };

        connectChat(token, handleGlobalMsg);
        return () => disconnectChat(handleGlobalMsg);
    }, [token]);
    return (
        <div className="admin-chat-layout">
            <div className="sidebar">
                <h3>Khách hàng</h3>
                {customers.map(c => (
                    <div key={c.customerAccountId}
                        className={`user-item ${activeCustomer?.customerAccountId === c.customerAccountId ? "active" : ""}`}
                        onClick={() => setActiveCustomer(c)}>
                        {c.customerUsername}
                    </div>
                ))}
            </div>
            <div className="chat-area">
                {activeCustomer ? (
                    <ChatBox adminMode customer={activeCustomer} />
                ) : (
                    <div className="welcome">Chọn một khách hàng để bắt đầu chat</div>
                )}
            </div>
        </div>
    );
}