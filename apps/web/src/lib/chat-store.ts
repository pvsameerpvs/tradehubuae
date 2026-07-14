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
  closeSession,
  startSession,
  getCurrentSessionId,
  getSessionById,
  getUnreadCount,
  setProductContext,
  getProductContext,
  clearProductContext,
  toggleLiveChat,
  saveN8nSettings,
  reopenSession,
} from "@tradehubuae/chat";

export type {
  ChatMessage,
  ChatSession,
  ChatSettings,
  ProductContext,
} from "@tradehubuae/chat";
