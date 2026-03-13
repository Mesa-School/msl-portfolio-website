"use client";

import { io, Socket } from "socket.io-client";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_DEMO_DAY_API_URL ||
  "https://careers-crm-backend.mesaschool.co.in";

let _socket: Socket | null = null;

export function getSocket(): Socket {
  if (_socket) return _socket;

  const ts = () => new Date().toISOString();

  console.log(`[Socket][${ts()}] Creating socket to: ${BACKEND_URL}`);

  _socket = io(BACKEND_URL, {
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 10000,
    withCredentials: false,
  });

  _socket.on("connect", () => {
    console.log(
      `[Socket][${ts()}] CONNECTED | id=${_socket!.id} | transport=${_socket!.io.engine?.transport?.name}`
    );
  });

  _socket.on("connect_error", (err) => {
    console.error(
      `[Socket][${ts()}] CONNECTION ERROR | message=${err.message} | transport=${_socket!.io.engine?.transport?.name} | readyState=${_socket!.io.engine?.readyState}`
    );
  });

  _socket.on("disconnect", (reason) => {
    console.warn(
      `[Socket][${ts()}] DISCONNECTED | reason=${reason}`
    );
    if (reason === "io server disconnect") {
      console.warn(`[Socket][${ts()}] Server forced disconnect — reconnecting manually`);
      _socket!.connect();
    }
  });

  _socket.on("reconnect_attempt" as any, (attempt: number) => {
    console.log(`[Socket][${ts()}] RECONNECT ATTEMPT #${attempt}`);
  });

  _socket.on("reconnect" as any, (attempt: number) => {
    console.log(`[Socket][${ts()}] RECONNECTED after ${attempt} attempts | id=${_socket!.id}`);
  });

  _socket.on("reconnect_failed" as any, () => {
    console.error(`[Socket][${ts()}] RECONNECT FAILED — all attempts exhausted`);
  });

  _socket.io.on("error", (err) => {
    console.error(`[Socket][${ts()}] MANAGER ERROR:`, err);
  });

  _socket.onAny((eventName, ...args) => {
    console.log(
      `[Socket][${ts()}] EVENT RECEIVED: "${eventName}" | connected=${_socket!.connected} | id=${_socket!.id} | data=`,
      JSON.stringify(args).slice(0, 500)
    );
  });

  _socket.onAnyOutgoing((eventName, ...args) => {
    console.log(
      `[Socket][${ts()}] EVENT SENT: "${eventName}" | connected=${_socket!.connected} | id=${_socket!.id} | data=`,
      JSON.stringify(args).slice(0, 500)
    );
  });

  return _socket;
}
