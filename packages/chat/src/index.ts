export interface ChatMessage {
  id: string;
  sessionId: string;
  sender: "user" | "admin" | "n8n";
  message: string;
  createdAt: string;
  read: boolean;
}

export interface ProductContext {
  name: string;
  slug: string;
  price: number;
  image?: string;
}

export interface ChatSession {
  id: string;
  userName: string;
  userEmail: string;
  status: "active" | "closed";
  createdAt: string;
  lastMessageAt: string;
  unreadCount: number;
  productContext?: ProductContext | null;
}

export interface ChatSettings {
  liveChatEnabled: boolean;
  n8nWebhookUrl: string;
  n8nEnabled: boolean;
}

const KEYS = {
  sessions: "th_chat_sessions",
  messages: "th_chat_messages",
  settings: "th_chat_settings",
  sessionId: "th_session_id",
  productContext: "th_chat_product",
};

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function getSettings(): ChatSettings {
  return getItem<ChatSettings>(KEYS.settings, { liveChatEnabled: true, n8nWebhookUrl: "", n8nEnabled: false });
}

export function saveSettings(s: ChatSettings): void {
  setItem(KEYS.settings, s);
}

export function toggleLiveChat(enabled: boolean): void {
  const s = getSettings();
  s.liveChatEnabled = enabled;
  saveSettings(s);
}

export function saveN8nSettings(url: string, enabled: boolean): void {
  const s = getSettings();
  s.n8nWebhookUrl = url;
  s.n8nEnabled = enabled;
  saveSettings(s);
}

export function getSessions(): ChatSession[] {
  return getItem<ChatSession[]>(KEYS.sessions, []);
}

export function saveSessions(s: ChatSession[]): void {
  setItem(KEYS.sessions, s);
}

export function getMessages(sessionId: string): ChatMessage[] {
  const all = getItem<ChatMessage[]>(KEYS.messages, []);
  return all.filter((m) => m.sessionId === sessionId);
}

export function getAllMessages(): ChatMessage[] {
  return getItem<ChatMessage[]>(KEYS.messages, []);
}

export function saveMessage(msg: ChatMessage): void {
  const all = getItem<ChatMessage[]>(KEYS.messages, []);
  all.push(msg);
  setItem(KEYS.messages, all);

  const sessions = getSessions();
  const idx = sessions.findIndex((s) => s.id === msg.sessionId);
  if (idx !== -1 && sessions[idx]) {
    sessions[idx].lastMessageAt = msg.createdAt;
    if (msg.sender === "user") {
      sessions[idx].unreadCount = (sessions[idx].unreadCount || 0) + 1;
    }
    saveSessions(sessions);
  }

  if (msg.sender === "user") {
    const settings = getSettings();
    if (settings.n8nEnabled && settings.n8nWebhookUrl) {
      fetch(settings.n8nWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "chat_message", sessionId: msg.sessionId, message: msg.message, sender: msg.sender, timestamp: msg.createdAt }),
      }).catch(() => {});
    }
  }
}

export function markSessionRead(sessionId: string): void {
  const sessions = getSessions();
  const idx = sessions.findIndex((s) => s.id === sessionId);
  if (idx !== -1 && sessions[idx]) {
    sessions[idx].unreadCount = 0;
    saveSessions(sessions);
  }
  const all = getItem<ChatMessage[]>(KEYS.messages, []);
  let changed = false;
  const updated = all.map((m) => {
    if (m.sessionId === sessionId && !m.read) {
      changed = true;
      return { ...m, read: true };
    }
    return m;
  });
  if (changed) setItem(KEYS.messages, updated);
}

export function addAdminReply(sessionId: string, message: string): void {
  const msg: ChatMessage = {
    id: genId(),
    sessionId,
    sender: "admin",
    message,
    createdAt: new Date().toISOString(),
    read: true,
  };
  saveMessage(msg);

  const sessions = getSessions();
  const idx = sessions.findIndex((s) => s.id === sessionId);
  if (idx !== -1 && sessions[idx]) {
    sessions[idx].lastMessageAt = msg.createdAt;
    saveSessions(sessions);
  }
}

export function closeSession(id: string): void {
  const sessions = getSessions();
  const idx = sessions.findIndex((s) => s.id === id);
  if (idx !== -1 && sessions[idx]) {
    sessions[idx].status = "closed";
    saveSessions(sessions);
  }
}

export function reopenSession(id: string): void {
  const sessions = getSessions();
  const idx = sessions.findIndex((s) => s.id === id);
  if (idx !== -1 && sessions[idx]) {
    sessions[idx].status = "active";
    saveSessions(sessions);
  }
}

export function startSession(userName: string, userEmail: string, productContext?: ProductContext | null): ChatSession {
  const session: ChatSession = {
    id: genId(),
    userName,
    userEmail,
    status: "active",
    createdAt: new Date().toISOString(),
    lastMessageAt: new Date().toISOString(),
    unreadCount: 0,
    productContext: productContext ?? null,
  };
  const sessions = getSessions();
  sessions.unshift(session);
  saveSessions(sessions);
  setItem(KEYS.sessionId, session.id);

  const welcome: ChatMessage = {
    id: genId(),
    sessionId: session.id,
    sender: "admin",
    message: `Hi ${userName}! Welcome to TradeHub UAE. How can we help you with bulk orders today?`,
    createdAt: new Date().toISOString(),
    read: true,
  };
  saveMessage(welcome);

  if (productContext) {
    const userMsg: ChatMessage = {
      id: genId(),
      sessionId: session.id,
      sender: "user",
      message: `I'm interested in **${productContext.name}** — AED ${productContext.price.toLocaleString()}\n\nCan you tell me more about this item?`,
      createdAt: new Date().toISOString(),
      read: false,
    };
    saveMessage(userMsg);
  }

  return session;
}

export function getCurrentSessionId(): string | null {
  return getItem<string | null>(KEYS.sessionId, null);
}

export function getSessionById(id: string): ChatSession | null {
  return getSessions().find((s) => s.id === id) ?? null;
}

export function getUnreadCount(): number {
  return getSessions().reduce((sum, s) => sum + (s.unreadCount || 0), 0);
}

export function setProductContext(ctx: ProductContext): void {
  setItem(KEYS.productContext, ctx);
}

export function getProductContext(): ProductContext | null {
  return getItem<ProductContext | null>(KEYS.productContext, null);
}

export function clearProductContext(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEYS.productContext);
}
