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
};

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
  return getItem<ChatSettings>(KEYS.settings, {
    liveChatEnabled: true,
    n8nWebhookUrl: "",
    n8nEnabled: false,
  });
}

export function saveSettings(s: ChatSettings): void {
  setItem(KEYS.settings, s);
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
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const msg: ChatMessage = {
    id,
    sessionId,
    sender: "admin",
    message,
    createdAt: new Date().toISOString(),
    read: true,
  };
  const all = getItem<ChatMessage[]>(KEYS.messages, []);
  all.push(msg);
  setItem(KEYS.messages, all);

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
