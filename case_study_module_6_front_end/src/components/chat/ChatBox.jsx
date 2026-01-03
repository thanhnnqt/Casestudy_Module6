import { useEffect, useState } from "react";
import { connectChat, sendChatMessage } from "../../services/chatSocket.js";
import { useAuth } from "../../context/AuthContext.jsx";

export default function ChatBox({ customer, onClose, adminMode = false }) {
    const { user, token } = useAuth();
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    useEffect(() => {
        console.log("CHAT TOKEN =", token);
    }, [token]);

    useEffect(() => {
        if (!adminMode && token) {
            connectChat(token, msg =>
                setMessages(prev => [...prev, msg])
            );
        }
    }, [token, adminMode]);

    if (!customer || !user) return null;

    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (!token) {
            console.log("⏳ Chưa có token, chưa connect chat");
            return;
        }

        console.log("🔑 TOKEN OK, bắt đầu connect chat");

        connectChat(
            token,
            msg => setMessages(prev => [...prev, msg]),
            () => {
                console.log("✅ Chat READY");
                setReady(true);
            }
        );
    }, [token]);

    const send = () => {
        if (!ready) {
            alert("⏳ Đang kết nối chat, vui lòng đợi...");
            return;
        }

        if (!text.trim()) return;

        sendChatMessage({
            senderId: user.id,
            senderUsername: user.username,
            senderRole: user.role,

            receiverId: customer.customerAccountId,
            receiverUsername: "admin", // 🔥 TRÙNG JWT
            receiverRole: "ADMIN",

            content: text
        });

        setText("");
    };

    return (
        <div className="chat-box">
            {/* HEADER */}
            <div className="chat-header">
                <span>Chat với {customer.customerUsername}</span>

                {/* 🔽 NÚT ẨN CHAT */}
                <button
                    onClick={onClose}
                    style={{
                        background: "transparent",
                        border: "none",
                        color: "#fff",
                        fontSize: 18,
                        cursor: "pointer"
                    }}
                >
                    ✖
                </button>
            </div>

            {/* BODY */}
            <div className="chat-body">
                {messages.map((m, i) => (
                    <div key={i}>
                        <b>{m.senderUsername}</b>: {m.content}
                    </div>
                ))}
            </div>

            {/* FOOTER */}
            <div className="chat-footer">
                <input
                    value={text}
                    onChange={e => setText(e.target.value)}
                />
                <button onClick={send}>Gửi</button>
            </div>
        </div>
    );
}
