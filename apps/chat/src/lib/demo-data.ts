import type { ChatSession, ChatMessage } from "@/types";

function now(offsetMs = 0): string {
  return new Date(Date.now() + offsetMs).toISOString();
}

export const DEMO_SESSIONS: ChatSession[] = [
  {
    id: "s1",
    userName: "Ahmed Al Hashimi",
    userEmail: "ahmed@example.com",
    userPhone: "+971 50 123 4567",
    status: "in_progress",
    source: "web",
    createdAt: now(-3600000),
    lastMessageAt: now(-120000),
    unreadCount: 2,
  },
  {
    id: "s2",
    userName: "Sara Mohammed",
    userEmail: "sara@example.com",
    status: "in_progress",
    source: "web",
    createdAt: now(-7200000),
    lastMessageAt: now(-900000),
    unreadCount: 0,
  },
  {
    id: "s3",
    userName: "Dell Enquiry",
    userEmail: "",
    userPhone: "+971 50 111 2222",
    status: "new",
    source: "whatsapp",
    createdAt: now(-14400000),
    lastMessageAt: now(-3600000),
    unreadCount: 1,
  },
  {
    id: "s4",
    userName: "Alex K.",
    userEmail: "alex@supplier.com",
    status: "closed",
    source: "email",
    createdAt: now(-172800000),
    lastMessageAt: now(-172800000),
    unreadCount: 0,
    closedAt: now(-86400000),
  },
];

export const DEMO_MESSAGES: Record<string, ChatMessage[]> = {
  s1: [
    { id: "m1", sessionId: "s1", senderType: "system", messageType: "system", content: "Session started", createdAt: now(-3600000) },
    { id: "m2", sessionId: "s1", senderType: "user", messageType: "text", content: "Hi, I'm interested in bulk pricing for 50 Dell laptops for our office. Can you help?", createdAt: now(-3500000) },
    { id: "m3", sessionId: "s1", senderType: "admin", messageType: "text", content: "Absolutely! We offer tiered pricing for bulk orders. For 50 units, I can offer AED 2,499 per unit. Would you like a formal quote?", createdAt: now(-3400000), readAt: now(-3350000) },
    { id: "m4", sessionId: "s1", senderType: "user", messageType: "text", content: "That sounds good. What about warranty and delivery timeline?", createdAt: now(-120000) },
    { id: "m5", sessionId: "s1", senderType: "user", messageType: "text", content: "Also, do you have the Dell Latitude 5450 in stock?", createdAt: now(-60000) },
  ],
  s2: [
    { id: "m6", sessionId: "s2", senderType: "system", messageType: "system", content: "Session started", createdAt: now(-7200000) },
    { id: "m7", sessionId: "s2", senderType: "user", messageType: "text", content: "Thanks for the help yesterday! The products arrived and everything is perfect.", createdAt: now(-7100000) },
    { id: "m8", sessionId: "s2", senderType: "admin", messageType: "text", content: "You're welcome Sara! Glad everything arrived safely. Let us know if you need anything else.", createdAt: now(-7000000), readAt: now(-6950000) },
    { id: "m9", sessionId: "s2", senderType: "user", messageType: "text", content: "I will definitely order again. Thanks!", createdAt: now(-900000) },
  ],
  s3: [
    { id: "m10", sessionId: "s3", senderType: "user", messageType: "text", content: "Is this available?", createdAt: now(-3600000) },
  ],
  s4: [
    { id: "m11", sessionId: "s4", senderType: "user", messageType: "text", content: "Hi, we need 200 HP ProBooks for our company. Can you share a quote?", createdAt: now(-172800000) },
    { id: "m12", sessionId: "s4", senderType: "admin", messageType: "text", content: "Sure Alex! Let me prepare a quote and get back to you within 24 hours.", createdAt: now(-171800000), readAt: now(-171000000) },
    { id: "m13", sessionId: "s4", senderType: "system", messageType: "system", content: "Session closed", createdAt: now(-86400000) },
  ],
};
