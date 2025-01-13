import { io } from "socket.io-client";
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
const socket = io(SOCKET_URL, {
    withCredentials: true,
});

export const joinCommunity = (id) => {
    if (id) {
        if (socket.connected) {
        console.log("Socket is connected. Emitting join-community event.", id);
        socket.emit("join-community", id);
        } else {
        // If the socket is not connected, wait for the "connect" event
        socket.once("connect", () => {
            console.log("Socket connected. Emitting join-community event.", id);
            socket.emit("join-community", id);
        });
        }
    }
};

export default socket;