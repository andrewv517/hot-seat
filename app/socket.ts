import { io } from "socket.io-client";

// Initialize socket connection
export const socket = io('http://localhost:8080', { });