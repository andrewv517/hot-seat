import { io } from "socket.io-client";

// Initialize socket connection
export const socket = io('http://192.168.1.132:8080', { });