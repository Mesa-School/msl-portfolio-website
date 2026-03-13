import { io, Socket } from "socket.io-client";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_DEMO_DAY_API_URL ||
  "https://careers-crm-backend.mesaschool.co.in";

function createSocket(): Socket {
  const ts = () => new Date().toISOString();

  console.log(`[Socket][${ts()}] Creating socket to: ${BACKEND_URL}`);
  console.log(`[Socket][${ts()}] Environment: ${typeof window === "undefined" ? "SERVER (SSR)" : "CLIENT (Browser)"}`);

  const s = io(BACKEND_URL, {
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 10000,
    withCredentials: false,
    autoConnect: typeof window !== "undefined", // only auto-connect on client
  });

  s.on("connect", () => {
    console.log(
      `[Socket][${ts()}] CONNECTED | id=${s.id} | transport=${s.io.engine?.transport?.name}`
    );
  });

  s.on("connect_error", (err) => {
    console.error(
      `[Socket][${ts()}] CONNECTION ERROR | message=${err.message} | transport=${s.io.engine?.transport?.name} | readyState=${s.io.engine?.readyState}`
    );
  });

  s.on("disconnect", (reason) => {
    console.warn(
      `[Socket][${ts()}] DISCONNECTED | reason=${reason} | wasConnected=${s.connected}`
    );
    if (reason === "io server disconnect") {
      console.warn(`[Socket][${ts()}] Server forced disconnect — will attempt manual reconnect`);
      s.connect();
    }
  });

  s.on("reconnect_attempt", (attempt) => {
    console.log(`[Socket][${ts()}] RECONNECT ATTEMPT #${attempt}`);
  });

  s.on("reconnect", (attempt) => {
    console.log(`[Socket][${ts()}] RECONNECTED after ${attempt} attempts | id=${s.id}`);
  });

  s.on("reconnect_failed", () => {
    console.error(`[Socket][${ts()}] RECONNECT FAILED — all attempts exhausted`);
  });

  s.io.on("error", (err) => {
    console.error(`[Socket][${ts()}] MANAGER ERROR:`, err);
  });

  // Log ALL incoming events for debugging
  s.onAny((eventName, ...args) => {
    console.log(
      `[Socket][${ts()}] EVENT RECEIVED: "${eventName}" | connected=${s.connected} | id=${s.id} | data=`,
      JSON.stringify(args).slice(0, 500)
    );
  });

  s.onAnyOutgoing((eventName, ...args) => {
    console.log(
      `[Socket][${ts()}] EVENT SENT: "${eventName}" | connected=${s.connected} | id=${s.id} | data=`,
      JSON.stringify(args).slice(0, 500)
    );
  });

  return s;
}

export const socket = createSocket();
