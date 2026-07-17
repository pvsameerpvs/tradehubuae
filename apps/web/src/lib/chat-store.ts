import {
  getSettings,
  saveSettings,
  getSessions,
  saveSessions,
  getMessages,
  getAllMessages,
  saveMessage,
  markSessionRead,
  addAdminReply,
  closeSession as lsCloseSession,
  reopenSession as lsReopenSession,
  startSession as lsStartSession,
  getCurrentSessionId,
  getSessionById,
  getUnreadCount,
  setProductContext,
  getProductContext,
  clearProductContext,
  toggleLiveChat,
  saveN8nSettings,
  type ChatMessage,
  type ChatSession,
  type ChatSettings,
  type ProductContext,
} from "@tradehubuae/chat";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export async function apiCreateSession(userName: string, userEmail: string, userPhone?: string, productCtx?: ProductContext | null): Promise<ChatSession> {
  const res = await fetch(`${API_BASE}/chat/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userName,
      userEmail,
      userPhone: userPhone ?? null,
      productContext: productCtx ? { name: productCtx.name, slug: productCtx.slug, price: productCtx.price } : undefined,
    }),
  });
  if (!res.ok) throw new Error("Failed to create session");
  const session = await res.json();
  localStorage.setItem("th_session_id", session.id);

  const lsSession: ChatSession = {
    id: session.id,
    userName: session.userName,
    userEmail: session.userEmail,
    status: session.status,
    createdAt: session.createdAt,
    lastMessageAt: session.lastMessageAt,
    unreadCount: 0,
    productContext: session.productContext ?? null,
  };
  const sessions = getSessions();
  sessions.unshift(lsSession);
  saveSessions(sessions);

  return lsSession;
}

export async function apiGetMessages(sessionId: string): Promise<ChatMessage[]> {
  try {
    const res = await fetch(`${API_BASE}/chat/sessions/${sessionId}/messages`);
    if (!res.ok) return [];
    const msgs = await res.json();
    const apiMessages: { id: string; sessionId: string; senderType: "admin" | "bot" | "user"; content: string; createdAt: string; readAt: string | null }[] = msgs ?? [];
    return apiMessages.map((m) => ({
      id: m.id,
      sessionId: m.sessionId,
      sender: m.senderType === "admin" ? "admin" : m.senderType === "bot" ? "n8n" : "user",
      message: m.content,
      createdAt: m.createdAt,
      read: !!m.readAt,
    }));
  } catch {
    return getMessages(sessionId);
  }
}

export async function apiSendMessage(sessionId: string, content: string): Promise<void> {
  const msg: ChatMessage = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    sessionId,
    sender: "user",
    message: content,
    createdAt: new Date().toISOString(),
    read: false,
  };
  saveMessage(msg);

  try {
    await fetch(`${API_BASE}/chat/sessions/${sessionId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, messageType: "text" }),
    });
  } catch {
    /**/
  }
}

export {
  getSettings,
  saveSettings,
  getSessions,
  saveSessions,
  getMessages,
  getAllMessages,
  saveMessage,
  markSessionRead,
  addAdminReply,
  getCurrentSessionId,
  getSessionById,
  getUnreadCount,
  setProductContext,
  getProductContext,
  clearProductContext,
  toggleLiveChat,
  saveN8nSettings,
  lsCloseSession as closeSession,
  lsReopenSession as reopenSession,
  lsStartSession as startSession,
};
export type { ChatMessage, ChatSession, ChatSettings, ProductContext };
