import { useEffect, useState } from "react";
import { connectChat } from "../../services/chatSocket";
import { useAuth } from "../../context/AuthContext";
import { getAdminInbox } from "../../services/adminChatService";
import ChatBox from "./ChatBox.jsx";

export default function AdminInbox() {
    const { token } = useAuth();
    const [customers, setCustomers] = useState([]);
    const [activeCustomer, setActiveCustomer] = useState(null);

    // ✅ CONNECT CHAT NGAY KHI ADMIN VÀO INBOX
    useEffect(() => {
        if (!token) return;

        connectChat(token, msg => {
            console.log("📩 Admin nhận:", msg);

            // nếu đang chat customer này thì append
            if (
                activeCustomer &&
                msg.senderUsername === activeCustomer.customerUsername
            ) {
                // ChatBox tự append
            }

            // TODO: update preview inbox nếu cần
        });
    }, [token]);

    useEffect(() => {
        getAdminInbox().then(setCustomers);
    }, []);

    return (
        <div style={{ display: "flex", height: "80vh" }}>
            {/* LEFT */}
            <div style={{ width: 300, borderRight: "1px solid #ddd" }}>
                <h5 className="p-2">📥 Inbox khách hàng</h5>

                {customers.map(c => (
                    <div
                        key={c.customerAccountId}
                        onClick={() => setActiveCustomer(c)}
                        style={{
                            padding: 10,
                            cursor: "pointer",
                            background:
                                activeCustomer?.customerAccountId ===
                                c.customerAccountId
                                    ? "#eef"
                                    : "#fff"
                        }}
                    >
                        <b>{c.customerUsername}</b>
                        <div style={{ fontSize: 12 }}>
                            {c.lastMessage}
                        </div>
                    </div>
                ))}
            </div>

            {/* RIGHT */}
            <div style={{ flex: 1 }}>
                {activeCustomer ? (
                    <ChatBox adminMode customer={activeCustomer} />
                ) : (
                    <div className="p-3">
                        👉 Chọn customer để chat
                    </div>
                )}
            </div>
        </div>
    );
}
