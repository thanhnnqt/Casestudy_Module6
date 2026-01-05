import { useEffect, useState } from "react";
import { getAdminInbox } from "../../services/adminChatService";
import ChatBox from "./ChatBox.jsx";
export default function AdminInbox() {
    const [customers, setCustomers] = useState([]);
    const [activeCustomer, setActiveCustomer] = useState(null);
    useEffect(() => {
        getAdminInbox().then(setCustomers);
    }, []);
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