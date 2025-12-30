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
        <div style={{ display: "flex", height: "80vh" }}>
            {/* LEFT: CUSTOMER LIST */}
            <div style={{ width: 300, borderRight: "1px solid #ddd" }}>
                <h5 className="p-2">📥 Inbox khách hàng</h5>

                {customers.map(c => (
                    <div
                        key={c.customerAccountId}
                        style={{
                            padding: 10,
                            cursor: "pointer",
                            background:
                                activeCustomer?.customerAccountId ===
                                c.customerAccountId
                                    ? "#eef"
                                    : "#fff"
                        }}
                        onClick={() => setActiveCustomer(c)}
                    >
                        <b>{c.customerUsername}</b>
                        <div style={{ fontSize: 12 }}>
                            {c.lastMessage}
                        </div>
                    </div>
                ))}
            </div>

            {/* RIGHT: CHAT BOX */}
            <div style={{ flex: 1 }}>
                {activeCustomer ? (
                    <ChatBox
                        adminMode
                        customer={activeCustomer}
                    />
                ) : (
                    <div className="p-3">
                        👉 Chọn customer để chat
                    </div>
                )}
            </div>
        </div>
    );
}
