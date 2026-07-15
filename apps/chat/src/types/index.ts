export type SenderType = "user" | "admin" | "bot" | "system";
export type MessageType = "text" | "image" | "file" | "system";
export type SessionStatus = "new" | "in_progress" | "closed";
export type OnlineStatus = "online" | "away" | "offline";
export type Source = "web" | "whatsapp" | "email";

export interface ChatMessage {
  id: string;
  sessionId: string;
  senderType: SenderType;
  adminId?: string;
  messageType: MessageType;
  content: string;
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentSize?: number;
  createdAt: string;
  readAt?: string;
}

export interface ProductContext {
  name: string;
  slug: string;
  price: number;
  image?: string;
}

export interface ChatSession {
  id: string;
  userId?: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  status: SessionStatus;
  productContext?: ProductContext | null;
  source: Source;
  assignedAdminId?: string;
  assignedAdminName?: string;
  createdAt: string;
  lastMessageAt: string;
  closedAt?: string;
  unreadCount: number;
  avatarUrl?: string;
  avatarColor?: string;
  pinned?: boolean;
}

export interface UnreadCounts {
  [sessionId: string]: number;
}
