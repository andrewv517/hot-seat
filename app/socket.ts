import { io } from "socket.io-client";
import { API_URL } from "./types";

// Initialize socket connection
export const socket = io(API_URL, { });