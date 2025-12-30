import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let client;

export const connectChat = (token, onMessage) => {
    client = new Client({
        webSocketFactory: () =>
            new SockJS("http://localhost:8080/ws-chat"),
        connectHeaders: {
            Authorization: "Bearer " + token
        },
        onConnect: () => {
            client.subscribe("/user/queue/messages", msg => {
                onMessage(JSON.parse(msg.body));
            });
        }
    });
    client.activate();
};

export const sendChatMessage = (data) => {
    if (!client || !client.connected) {
        console.warn("STOMP chưa connect");
        return;
    }
    client.publish({
        destination: "/app/chat.send",
        body: JSON.stringify(data)
    });
};