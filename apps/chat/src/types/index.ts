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

/** Raw shape returned by the chat API for a session (before mapping to ChatSession). */
export interface RawSession {
  id: string;
  userId?: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  status: string;
  source?: string;
  createdAt: string;
  lastMessageAt: string;
  assignedAdminId?: string;
  assignedAdminName?: string;
  productContext?: unknown;
}

export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  image: string | null;
  createdAt: string;
}

export interface OrderItemData {
  id: string;
  orderId: string;
  productId: string;
  variantId?: string;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  image?: string;
  product?: { name: string; slug: string; image?: string };
}

export interface OrderData {
  id: string;
  orderNumber: string;
  status: string;
  total: string;
  currency: string;
  createdAt: string;
  items: OrderItemData[];
}

/** Raw shape returned by the chat API for a message (before mapping to ChatMessage). */
export interface RawMessage {
  id: string;
  sessionId: string;
  senderType: string;
  messageType?: string;
  content: string;
  createdAt: string;
  readAt?: string;
}
