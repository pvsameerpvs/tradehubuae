import { io, Socket } from "socket.io-client";
import type { ChatMessage, ChatSession } from "@/types";

type WsEvent =
  | { event: "chat:message:new"; message: ChatMessage }
  | { event: "chat:session:updated"; session: ChatSession }
  | { event: "chat:typing:update"; sessionId: string; adminName: string; isTyping: boolean }
  | { event: "chat:unread:count"; sessionId: string; count: number };

type WsOutgoing =
  | { event: "chat:message"; sessionId: string; content: string }
  | { event: "chat:typing"; sessionId: string; isTyping: boolean }
  | { event: "chat:join"; sessionId: string }
  | { event: "chat:leave"; sessionId: string };

type Listener = (event: WsEvent) => void;

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:4000";

const EVENT_MAP: Record<string, string> = {
  "chat:message:new": "chat:message:new",
  "chat:session:updated": "chat:session:updated",
  "chat:typing:update": "chat:typing:update",
  "chat:unread:count": "chat:unread:count",
};

class ChatWebSocket {
  private socket: Socket | null = null;
  private listeners = new Set<Listener>();
  private onStatusChange: ((connected: boolean) => void) | null = null;
  private refCount = 0;
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  connect() {
    this.refCount++;
    if (this.socket?.connected) return;

    if (this.socket) {
      this.socket.connect();
      return;
    }

    this.socket = io(`${WS_URL}/chat`, {
      transports: ["polling", "websocket"],
      auth: this.token ? { token: this.token } : undefined,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 3000,
    });

    this.socket.on("connect", () => this.onStatusChange?.(true));
    this.socket.on("disconnect", () => this.onStatusChange?.(false));
    this.socket.on("connect_error", (err) => console.error("[ChatWS] Connection error:", err.message));

    for (const eventName of Object.values(EVENT_MAP)) {
      this.socket.on(eventName, (data: any) => {
        const event = { event: eventName, ...data } as WsEvent;
        this.listeners.forEach((fn) => fn(event));
      });
    }
  }

  disconnect() {
    this.refCount--;
    if (this.refCount > 0) return;
    this.listeners.clear();
    this.onStatusChange = null;
    this.socket?.disconnect();
    this.socket = null;
  }

  onConnectionChange(handler: (connected: boolean) => void) {
    this.onStatusChange = handler;
    if (this.socket) handler(this.socket.connected);
  }

  subscribe(handler: Listener): () => void {
    this.listeners.add(handler);
    return () => this.listeners.delete(handler);
  }

  send(data: WsOutgoing) {
    if (this.socket?.connected) {
      this.socket.emit(data.event, data);
    }
  }

  get connected(): boolean {
    return this.socket?.connected ?? false;
  }
}

export const chatWs = new ChatWebSocket();
