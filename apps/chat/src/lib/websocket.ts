import type { ChatMessage, ChatSession } from "@/types";

type WsEvent =
  | { event: "chat:message:new"; message: ChatMessage }
  | { event: "chat:session:updated"; session: ChatSession }
  | { event: "chat:typing:update"; sessionId: string; adminName: string; isTyping: boolean }
  | { event: "chat:unread:count"; count: number };

type WsOutgoing =
  | { event: "chat:message"; sessionId: string; content: string }
  | { event: "chat:typing"; sessionId: string; isTyping: boolean }
  | { event: "chat:join"; sessionId: string }
  | { event: "chat:leave"; sessionId: string };

type Listener = (event: WsEvent) => void;

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:4000/chat";

class ChatWebSocket {
  private ws: WebSocket | null = null;
  private listeners = new Set<Listener>();
  private onStatusChange: ((connected: boolean) => void) | null = null;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private refCount = 0;

  connect() {
    this.refCount++;
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) return;

    this.ws = new WebSocket(WS_URL);

    this.ws.onopen = () => this.onStatusChange?.(true);

    this.ws.onmessage = (event) => {
      try {
        const data: WsEvent = JSON.parse(event.data);
        this.listeners.forEach((fn) => fn(data));
      } catch {
        // malformed message
      }
    };

    this.ws.onclose = () => {
      this.onStatusChange?.(false);
      this.reconnectTimeout = setTimeout(() => {
        this.ws = null;
        this.connect();
      }, 3000);
    };

    this.ws.onerror = () => this.ws?.close();
  }

  disconnect() {
    this.refCount--;
    if (this.refCount > 0) return;
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    this.listeners.clear();
    this.onStatusChange = null;
    this.ws?.close();
    this.ws = null;
  }

  onConnectionChange(handler: (connected: boolean) => void) {
    this.onStatusChange = handler;
    if (this.ws) handler(this.ws.readyState === WebSocket.OPEN);
  }

  subscribe(handler: Listener): () => void {
    this.listeners.add(handler);
    return () => this.listeners.delete(handler);
  }

  send(data: WsOutgoing) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  get connected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

export const chatWs = new ChatWebSocket();
