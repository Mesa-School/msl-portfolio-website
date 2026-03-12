import { io } from "socket.io-client";

const BACKEND_URL = process.env.NEXT_PUBLIC_DEMO_DAY_API_URL || "http://localhost:5000";

console.log("[Socket] Connecting to:", BACKEND_URL);

export const socket = io(BACKEND_URL, {
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 2000,
});

socket.on("connect", () => {
  console.log("[Socket] Connected successfully! Socket ID:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("[Socket] Connection error:", err.message);
});

socket.on("disconnect", (reason) => {
  console.log("[Socket] Disconnected. Reason:", reason);
});
