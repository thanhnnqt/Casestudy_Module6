import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let client = null;
let subscribers = new Set();
let isConnected = false;

export const connectChat = (token, onMessage) => {
    if (onMessage) subscribers.add(onMessage);

    if (client && isConnected) {
        return;
    }

    if (client && client.active) {
        return;
    }

    client = new Client({
        webSocketFactory: () => new SockJS("http://localhost:8080/ws-chat"),
        connectHeaders: { Authorization: "Bearer " + token },
        onConnect: () => {
            isConnected = true;
            console.log("✅ WebSocket Connected");
            client.subscribe("/user/queue/messages", msg => {
                const data = JSON.parse(msg.body);
                subscribers.forEach(cb => cb(data));
            });
        },
        onDisconnect: () => {
            isConnected = false;
        }
    });

    client.activate();
};

export const disconnectChat = (onMessage) => {
    if (onMessage) subscribers.delete(onMessage);
};

export const sendChatMessage = (data) => {
    if (client && isConnected) {
        client.publish({
            destination: "/app/chat.send",
            body: JSON.stringify(data)
        });
        return true;
    }
    return false;
};