import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let client;
let connected = false;

export const connectChat = (token, onMessage, onConnected) => {
    client = new Client({
        webSocketFactory: () =>
            new SockJS("http://localhost:8080/ws-chat"),

        connectHeaders: {
            Authorization: "Bearer " + token
        },

        debug: str => console.log("STOMP:", str),

        onConnect: () => {
            console.log("✅ STOMP CONNECTED");
            connected = true;

            client.subscribe("/user/queue/messages", msg => {
                onMessage(JSON.parse(msg.body));
            });

            onConnected && onConnected();
        },

        onStompError: frame => {
            console.error("❌ STOMP ERROR", frame);
        }
    });

    client.activate();
};

export const sendChatMessage = (data) => {
    if (!connected) {
        return false; // 🔥 CHO CHATBOX BIẾT
    }

    client.publish({
        destination: "/app/chat.send",
        body: JSON.stringify(data)
    });

    return true;
};
