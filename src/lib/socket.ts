import { io } from "socket.io-client";

const BACKEND_URL = process.env.NEXT_PUBLIC_DEMO_DAY_API_URL || "http://localhost:5000";

export const socket = io(BACKEND_URL, {
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 2000,
});
