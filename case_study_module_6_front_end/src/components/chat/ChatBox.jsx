import { useEffect, useState } from "react";
import { connectChat, sendChatMessage } from "../../services/chatSocket.js";
import { useAuth } from "../../context/AuthContext.jsx";

export default function ChatBox({ adminMode, customer }) {
    const { user, token } = useAuth();
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");

    useEffect(() => {
        connectChat(token, msg => {
            setMessages(prev => [...prev, msg]);
        });
    }, []);

    const send = () => {
        sendChatMessage({
            senderId: user.id,
            senderUsername: user.username,
            senderRole: user.role,

            receiverId: customer.customerAccountId,
            receiverUsername: customer.customerUsername,
            receiverRole: "CUSTOMER",

            content: text
        });
        setText("");
    };

    return (
        <div className="chat-box">
            <div className="chat-header">
                Chat với {customer.customerUsername}
            </div>

            <div className="chat-body">
                {messages.map((m, i) => (
                    <div key={i}>
                        <b>{m.senderUsername}</b>: {m.content}
                    </div>
                ))}
            </div>

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

