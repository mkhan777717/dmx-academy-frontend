import { io } from "socket.io-client";
import { getApiBase } from "./api";

let socket = null;

export function getSocket() {
  if (!socket && typeof window !== "undefined") {
    const apiBase = getApiBase(5001);
    socket = io(apiBase, {
      autoConnect: true,
      transports: ["websocket", "polling"],
    });
    console.log("[SOCKET] Initialized connection to:", apiBase);
  }
  return socket;
}
