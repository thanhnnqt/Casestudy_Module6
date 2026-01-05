import { useEffect, useState, useRef } from "react";
import { connectChat, disconnectChat, sendChatMessage } from "../../services/chatSocket.js";
import { useAuth } from "../../context/AuthContext.jsx";
import axios from "../../modules/login/service/axiosConfig";

export default function ChatBox({ customer, onClose, adminMode = false }) {
    const { user, token } = useAuth();
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const scrollRef = useRef();

    // 1. Tải lịch sử tin nhắn
    useEffect(() => {
        const fetchId = adminMode ? customer.customerAccountId : user?.id;
        if (fetchId) {
            axios.get(`/api/chat/history/${fetchId}`)
                .then(res => setMessages(res.data))
                .catch(err => console.log("Chưa có lịch sử chat", err));
        }
    }, [customer?.customerAccountId, adminMode, user?.id]);

    // 2. Kết nối WebSocket
    useEffect(() => {
        if (!token || !customer) return;

        const handleNewMessage = (msg) => {
            console.log("ChatBox: Tin nhắn mới nhận:", msg);
            // ⭐ LOGIC LỌC CHUẨN: Dùng ID phẳng từ DTO
            const targetCustomerId = adminMode ? customer.customerAccountId : user?.id;

            const isTargetMsg = (msg.senderId === targetCustomerId || msg.receiverId === targetCustomerId);

            console.log(`ChatBox: Lọc (isTargetMsg: ${isTargetMsg}). TargetID: ${targetCustomerId}`);

            if (isTargetMsg) {
                setMessages(prev => {
                    if (prev.find(m => m.id === msg.id)) return prev;
                    return [...prev, msg];
                });
            }
        };

        connectChat(token, handleNewMessage);

        return () => {
            disconnectChat(handleNewMessage);
        };
    }, [token, customer?.customerAccountId, adminMode, user?.id]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const send = () => {
        if (!text.trim()) return;

        // Xác định ai là người nhận
        // Nếu tôi là Admin -> Gửi cho Customer
        // Nếu tôi là Customer -> Gửi cho Admin (mặc định ID 1)
        const receiverId = adminMode ? customer.customerAccountId : null;
        const receiverUsername = adminMode ? customer.customerUsername : null;
        const receiverRole = adminMode ? "CUSTOMER" : "ADMIN";

        const msgData = {
            senderId: user.id, // Account ID từ AuthContext
            senderUsername: user.username,
            senderRole: user.role,
            receiverId: receiverId,
            receiverUsername: receiverUsername,
            receiverRole: receiverRole,
            content: text
        };

        console.log("ChatBox: Đang gửi tin nhắn:", msgData);
        const success = sendChatMessage(msgData);
        if (success) {
            console.log("ChatBox: Tin nhắn đã đẩy lên WebSocket thành công.");
            const tempMsg = {
                id: Date.now(),
                senderId: user.id,
                senderUsername: user.username,
                senderRole: user.role,
                content: text,
                createdAt: new Date().toISOString()
            };
            setMessages(prev => [...prev, tempMsg]);
            setText("");
        }
    };

    return (
        <div className="chat-box-container">
            <div className="chat-box-header">
                <span className="title">
                    {adminMode ? `Chat với: ${customer.customerUsername}` : "Hỗ trợ trực tuyến"}
                </span>
                <button className="chat-close-btn" onClick={onClose}>×</button>
            </div>
            <div className="chat-box-body">
                {messages.length === 0 && (
                    <div className="chat-empty">Bắt đầu trò chuyện ngay...</div>
                )}
                {messages.map((m, i) => (
                    <div key={i} className={`chat-msg-row ${m.senderRole === user.role ? "msg-me" : "msg-them"}`}>
                        <div className="chat-msg-bubble">
                            <div className="chat-msg-content">{m.content}</div>
                            <div className="chat-msg-time">
                                {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={scrollRef} />
            </div>
            <div className="chat-box-footer">
                <input
                    placeholder="Nhập tin nhắn..."
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && send()}
                />
                <button className="chat-send-btn" onClick={send}>Gửi</button>
            </div>
        </div>
    );
}
