# Chat PWA App — `chat.tradehubuae.com`

## ADR — Architecture Decision Record

| | |
|---|---|
| **Status** | Approved |
| **Deciders** | Project lead |
| **Date** | 2026-07-14 |
| **Driver** | Real-time customer + admin messaging with optional AI, offline support, cross-platform |

### Context

The project needs a WhatsApp-like chat system. Users must see messages instantly, history must persist across devices, and the system must work offline. AI replies (via n8n) should be optional — toggleable when credits run low.

### Decision

| Option | Verdict | Reason |
|--------|---------|--------|
| Inside admin (`apps/admin/src/app/dashboard/chats`) | ❌ Replaced | No PWA, no WebSocket, tied to admin layout |
| **New Next.js PWA (`apps/chat/`)** | ✅ Chosen | PWA manifest, WebSocket client, standalone install, subdomain |
| Inside web (`apps/web/src/app/chat/`) | ❌ Rejected | Chat is cross-cutting (customer + admin + AI) |
| localStorage-only | ❌ Rejected | No persistence across devices, no server-side history |
| Firebase Firestore | ❌ Rejected | Vendor lock-in, no PostgreSQL integration |

### Consequences

- Messages stored in PostgreSQL via NestJS WebSocket gateway
- PWA with service worker for offline + push
- n8n as optional relay — not the core transport
- Admins see all conversations in real-time

---

## Glossary

| Term | Definition |
|---|---|
| **Conversation** | A chat thread between participants. Has `aiEnabled` flag. |
| **Participant** | A user (customer, admin, or AI bot) in a conversation. |
| **Room** | WebSocket channel. `user-{userId}` for private, `admin-all` for admins. |
| **n8n** | Self-hosted workflow automation on Railway. Optional AI relay. |
| **PWA** | Progressive Web App — installable, offline-capable, push notifications. |
| **IndexedDB** | Browser database for offline message queue. |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    apps/chat/ (PWA)                      │
│  ┌──────────┐  ┌───────────┐  ┌──────────────────────┐  │
│  │ Chat UI  │  │ WebSocket │  │ Service Worker       │  │
│  │ (React)  │◄─┤ Client    │  │ (offline + push)     │  │
│  └──────────┘  └─────┬─────┘  └──────────────────────┘  │
└───────────────────────┼──────────────────────────────────┘
                        │  wss://api.tradehubuae.com
                        ▼
┌─────────────────────────────────────────────────────────┐
│              apps/api/ (NestJS)                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  WebSocket Gateway (Socket.io)                   │   │
│  │  - JWT auth on connection                        │   │
│  │  - Join room: user-{userId}                      │   │
│  │  - Events: message:send, message:new, typing     │   │
│  │  - Admin room: admin-all                         │   │
│  └──────────────────────┬───────────────────────────┘   │
│                         │                                │
│              ┌──────────▼──────────┐                    │
│              │  ChatService        │                    │
│              │  - DB read/write    │                    │
│              │  - n8n relay (opt)  │                    │
│              └──────────┬──────────┘                    │
│                         │                                │
│              ┌──────────▼──────────┐                    │
│              │  PostgreSQL (Drizzle)│                   │
│              │  - conversations    │                    │
│              │  - messages         │                    │
│              │  - participants     │                    │
│              └─────────────────────┘                    │
└─────────────────────────────────────────────────────────┘
                        │  (optional)
                        ▼
┌─────────────────────────────────────────────────────────┐
│              n8n (Railway self-host)                     │
│  - Trigger: webhook when user message saved             │
│  - Action: AI reply or human assignment                 │
│  - Toggle ON/OFF via env var / admin switch             │
└─────────────────────────────────────────────────────────┘
```

---

## Requirements

| # | Requirement | Priority | Implementation |
|---|---|---|---|
| R1 | Only logged-in users can chat | P0 | JWT auth on WebSocket + all REST endpoints |
| R2 | Messages appear instantly (like WhatsApp) | P0 | WebSocket (Socket.io) — persistent TCP connection |
| R3 | Chat history persists across devices | P0 | PostgreSQL storage, not localStorage |
| R4 | Offline support — queue messages, send on reconnect | P1 | IndexedDB queue + Service Worker |
| R5 | AI replies optional (n8n toggle) | P1 | ChatService checks `aiEnabled` before calling n8n |
| R6 | Human-to-human when AI is off | P1 | Messages routed to `admin-all` room |
| R7 | Push notifications for new messages | P2 | Web Push API + VAPID keys |
| R8 | Typing indicator | P2 | `chat:typing` WebSocket event |
| R9 | Product context in chat | P2 | Attach product info when starting from product page |

---

## Database Schema

All new tables in `packages/database/src/schema/`.

### Table: `chat_conversations`

```typescript
export const chatConversations = pgTable("chat_conversations", {
  id: uuid("id").defaultRandom().primaryKey(),
  subject: varchar("subject", { length: 500 }),
  status: varchar("status", { length: 20 }).default("active").notNull(),
  aiEnabled: boolean("ai_enabled").default(true).notNull(),
  lastMessageAt: timestamp("last_message_at", { mode: "date" }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});
```

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | PK, auto-generated |
| `subject` | varchar(500) | Optional — auto-generated from first message |
| `status` | varchar(20) | `active` or `closed` |
| `aiEnabled` | boolean | Per-conversation AI toggle |
| `lastMessageAt` | timestamp | Updated on every message for sorting |

### Table: `chat_messages`

```typescript
export const chatMessages = pgTable("chat_messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  conversationId: uuid("conversation_id").notNull().references(() => chatConversations.id, { onDelete: "cascade" }),
  senderId: uuid("sender_id").notNull().references(() => users.id),
  senderRole: varchar("sender_role", { length: 20 }).notNull(),
  content: text("content").notNull(),
  readAt: timestamp("read_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});
```

| Column | Type | Notes |
|--------|------|-------|
| `senderRole` | varchar(20) | `customer`, `admin`, `ai` |
| `readAt` | timestamp | Null until recipient opens conversation |
| `content` | text | Message body |

### Table: `chat_conversation_participants`

```typescript
export const chatConversationParticipants = pgTable("chat_conversation_participants", {
  conversationId: uuid("conversation_id").notNull().references(() => chatConversations.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id),
  joinedAt: timestamp("joined_at", { mode: "date" }).defaultNow().notNull(),
});
```

---

## WebSocket Protocol

### Connection

```typescript
import { io } from "socket.io-client";

const socket = io("wss://api.tradehubuae.com", {
  auth: { token: jwt },
  transports: ["websocket"],    // Skip long-polling
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 10000,
});
```

### Events: Client → Server

| Event | Payload | Auth | Description |
|---|---|---|---|
| `chat:send` | `{ conversationId: string, content: string }` | JWT | Send a message |
| `chat:typing` | `{ conversationId: string }` | JWT | Fires on keystroke, debounced 2s |
| `chat:create` | `{ subject?: string, participantIds: string[] }` | JWT | Start new conversation |

### Events: Server → Client

| Event | Payload | Target | Description |
|---|---|---|---|
| `chat:message` | `ChatMessage` | Room | New message from any participant |
| `chat:typing` | `{ conversationId, userId, userName }` | Room | Debounced typing notification |
| `chat:status` | `{ conversationId, status }` | Room | Conversation opened/closed |
| `chat:ai:toggle` | `{ enabled: boolean }` | Room | AI status changed for conversation |
| `error` | `{ code, message }` | Sender | Validation or auth error |

### ChatMessage type

```typescript
interface ChatMessage {
  id: string;
  conversationId: string;
  sender: { id: string; name: string; role: "customer" | "admin" | "ai" };
  content: string;
  readAt: string | null;
  createdAt: string;
}
```

---

## REST API

All endpoints under `/api/v1/chat/`. All require `Authorization: Bearer <jwt>`.

### `GET /chat/conversations`

List current user's conversations. Supports pagination.

**Query params:** `page`, `limit`, `status` (active\|closed)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "subject": "Bulk pricing for Dell laptops",
      "status": "active",
      "aiEnabled": true,
      "lastMessageAt": "2026-07-14T10:30:00Z",
      "unreadCount": 2,
      "participants": [
        { "id": "uuid", "name": "Sameer" }
      ]
    }
  ],
  "meta": { "total": 1, "page": 1, "limit": 20 }
}
```

### `POST /chat/conversations`

Create a new conversation.

**Body:**
```json
{
  "subject": "Optional subject",
  "participantIds": ["user-uuid-1"]
}
```

**Response:** `201` with conversation object.

### `GET /chat/conversations/:id/messages`

Get message history. Supports cursor-based pagination.

**Query params:** `before` (ISO timestamp, load older), `limit` (default 50)

**Response:**
```json
{
  "data": [
    {
      "id": "msg-uuid",
      "sender": { "id": "uuid", "name": "Sameer", "role": "customer" },
      "content": "Hi! I need bulk pricing",
      "readAt": null,
      "createdAt": "2026-07-14T10:30:00Z"
    }
  ],
  "hasMore": false
}
```

### `POST /chat/conversations/:id/read`

Mark conversation as read. Sets `readAt` on all unread messages where `senderId !== currentUser`.

**Response:** `204 No Content`

### `POST /chat/n8n/reply`

n8n callback endpoint. Used by n8n workflow to inject AI or human replies.

**Auth:** `X-n8n-Secret` header (shared secret, not JWT).

**Body:**
```json
{
  "conversationId": "uuid",
  "content": "AI generated reply",
  "senderRole": "ai"
}
```

**Response:** `201`

### `GET /chat/ai/status`

Get global AI chat status.

**Response:**
```json
{ "aiChatEnabled": true }
```

### `POST /chat/ai/toggle`

Admin-only. Toggle global AI chat on/off.

**Body:**
```json
{ "enabled": false }
```

**Response:** `200`

---

## Error Handling

| Scenario | HTTP/WS behavior | Recovery |
|---|---|---|
| **JWT expired** | WS: `error` event with `TOKEN_EXPIRED`. REST: `401` | Client redirects to login |
| **n8n down** | ChatService catches fetch error, logs warning. Message still saved. | Admin manually replies |
| **PostgreSQL down** | WS: message queued in Redis. REST: `503`. | Auto-reconnect on DB recovery |
| **Offline (no internet)** | WS disconnects. SW shows cached UI. IndexedDB queues messages. | Flush on reconnect |
| **Rate limit** | WS: `error` with `RATE_LIMITED`. REST: `429`. | Client retries with backoff |
| **Invalid message** | WS: `error` with `VALIDATION_FAILED`. | Client shows inline error |
| **Conversation not found** | REST: `404`. WS: N/A (only send to existing convos). | Client redirects to conversation list |

---

## Security

| Concern | Mitigation |
|---|---|
| **Unauthorized access** | JWT required for WebSocket + all REST endpoints |
| **Message tampering** | All writes go through server validation. No client-side DB access |
| **n8n abuse** | `X-n8n-Secret` header validation on `/chat/n8n/reply` |
| **Rate limiting** | 30 messages/min per user via NestJS Throttler |
| **Data privacy** | Users can only see their own conversations. Admins see all via `admin-all` room |
| **XSS in messages** | Content sanitized on render. No raw HTML |
| **Conversation enumeration** | UUIDs are not guessable. 404 on non-member access |

---

## Auth Flow

```
1. User logs in via web app → gets JWT
2. Opens chat.tradehubuae.com → redirected to login if no token
3. WebSocket connects with JWT: io("wss://api.tradehubuae.com", { auth: { token } })
4. NestJS Gateway validates JWT → joins user to room: user-{userId}
5. Admins join room: admin-all (all conversations visible)
```

### Token Sources

| Source | How |
|---|---|
| Web app session | JWT in localStorage, read by `chat.tradehubuae.com` via shared domain cookie |
| Direct PWA login | Login form on `chat.tradehubuae.com` → `POST /api/v1/auth/login` |
| Deep link | `chat.tradehubuae.com?token=xxx` for product page links |

---

## n8n Integration

### Flow: AI On

```
User sends message
       │
       ▼
WebSocket: chat:send
       │
       ▼
ChatService.saveMessage()
       │
       ├── aiEnabled == true ──► POST n8n webhook
       │                              │
       │                         n8n processes (AI reply or assigns human)
       │                              │
       │                         POST /api/chat/n8n/reply
       │                              │
       │                         WebSocket: chat:message (AI reply)
       │
       └── aiEnabled == false ──► No n8n. Message visible to admin room.
```

### Toggle Methods

| Method | Scope | How |
|---|---|---|
| Admin dashboard toggle | Global | Sets `AI_CHAT_ENABLED` env var |
| Per-conversation | Single | `chat_conversations.aiEnabled` flag |
| Auto-detect | Global | Cron checks AI API key validity / credit balance |

---

## Chat History — Every Message Persists

| Scenario | Outcome |
|---|---|
| **User chats with AI** | Message → PostgreSQL → WebSocket to user + admin. AI reply same way. |
| **User chats with human** | Same flow, no n8n call. Admin replies in real-time. |
| **Close PWA, reopen** | `GET /chat/conversations` loads all. `GET /messages` loads history. |
| **Cross-device** | Same JWT, same user ID, same DB. History everywhere. |
| **Admin views any** | `admin-all` room + `GET /conversations/:id/messages` |
| **AI toggled mid-conversation** | All messages stay. New messages go to human admin. |
| **Delete conversation** | Soft delete. Messages preserved for audit. |

```
User A (PWA)                 API + DB                    Admin (PWA)
    │                           │                           │
    │──── POST /chat/message ───►                           │
    │                           │── INSERT ────────────────►│
    │                           │── WS: chat:message ──────►│
    │◄── WS: chat:message ──────                           │
    │                           │                           │
    │     [Message instant on both screens]                 │
```

---

## Folder Structure

```
apps/chat/
├── public/
│   ├── manifest.json
│   ├── sw.js                          # App shell cache, push notifications
│   ├── icons/
│   │   ├── icon-192.png
│   │   ├── icon-512.png
│   │   └── maskable-icon.png
│   └── og-image.png
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # PWA meta, auth guard, SocketProvider
│   │   ├── page.tsx                   # Login check → redirect
│   │   ├── chat/
│   │   │   └── page.tsx               # Chat UI (protected)
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ChatSidebar.tsx            # Conversation list (desktop left panel)
│   │   ├── ChatMessages.tsx           # Message thread with auto-scroll
│   │   ├── ChatInput.tsx              # Composer + send button
│   │   ├── ChatBubble.tsx             # Single message (right/left align)
│   │   ├── ConversationCard.tsx       # Sidebar item
│   │   ├── TypingIndicator.tsx        # "...typing" animation
│   │   ├── OnlineStatus.tsx           # Green/red dot
│   │   ├── AIToggle.tsx               # AI on/off badge
│   │   ├── EmptyState.tsx
│   │   └── MobileNav.tsx              # Bottom tabs for PWA
│   ├── hooks/
│   │   ├── useSocket.ts              # Socket.io connection + lifecycle
│   │   ├── useChat.ts                # Conversation + message state
│   │   ├── useAuth.ts                # JWT management
│   │   ├── useNotifications.ts       # Push subscription
│   │   └── useOnlineStatus.ts        # Online/offline detection
│   ├── lib/
│   │   ├── socket.ts                 # Socket.io singleton
│   │   ├── api.ts                    # REST client
│   │   └── indexed-db.ts             # Offline queue
│   └── providers/
│       ├── SocketProvider.tsx
│       └── AuthProvider.tsx
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── Dockerfile
```

---

## PWA Configuration

### Manifest

```json
{
  "name": "TradeHub Chat",
  "short_name": "TH Chat",
  "description": "Real-time messaging with TradeHub UAE support",
  "start_url": "/chat",
  "display": "standalone",
  "background_color": "#FFFFFF",
  "theme_color": "#134A7C",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/maskable-icon.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

### Service Worker Strategy

| Resource | Strategy | Detail |
|---|---|---|
| App shell (HTML/CSS/JS) | Cache-first | Precache on install, never refetch |
| REST API messages | Network-first | Cache fallback for offline viewing |
| Sent messages (offline) | IndexedDB queue | Flush on `socket:connect` |
| Static assets (icons, fonts) | Cache-first | Immutable, long-lived |
| Push notifications | On `push` event | Show notification with reply action |

---

## Mobile UI (WhatsApp-like)

Theme uses project design tokens: `--brand: #134A7C`, `--ink: #0F172A`, `--bg: #FFFFFF`.

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| `--brand` | `#134A7C` | Sent message bubble, header, primary button, links |
| `--brand-dark` | `#103E68` | Sent bubble hover, header bottom border |
| `--bg` | `#FFFFFF` | Page background, received bubble |
| `--bg-2` | `#F8FAFC` | Chat input area, sidebar background |
| `--bg-3` | `#F1F5F9` | Received bubble background |
| `--ink` | `#0F172A` | Message text, header title |
| `--ink-2` | `#475569` | Timestamps, sender name, preview text |
| `--ink-3` | `#94A3B8` | Placeholder text, unread dot |
| `--line` | `#E2E8F0` | Dividers, bubble borders |
| `--line-soft` | `#F1F5F9` | Input border |

### Layout

```
┌─────────────────────────────────┐
│  ─ TradeHub Chat          ⋮    │  ← Header: `--bg`, 1px `--line` bottom
│     (──brand primary color──)   │     Title in `--ink`, menu icon
├─────────────────────────────────┤
│                                 │
│  ┌───────────────────────────┐  │
│  │ Hi! I need bulk pricing   │  │  ← Sent bubble: `--brand` bg, white text
│  │ on Dell laptops           │  │     right-aligned, 12px radius
│  │               10:30 AM ✓  │  │     timestamp `--ink-2` 11px
│  └───────────────────────────┘  │     check mark (✓) when read
│                                 │
│       ┌─────────────────────┐   │
│       │ Sure! Let me check  │   │  ← Received bubble: white bg, 1px `--line`
│       │ that for you...     │   │     `--ink` text, left-aligned, 12px radius
│       │          10:31 AM   │   │     sender name above in `--ink-2` 12px 600
│       └─────────────────────┘   │
│                                 │
│          ● ● ● typing           │  ← Typing: `--ink-3` dots, 14px
│                                 │
├─────────────────────────────────┤
│  ┌────────────────────────┐ ┌─┐ │  ← Input bar: `--bg`, top border `--line`
│  │  Type a message...     │ │➤│  │     Input: 12px radius, `--line` border
│  └────────────────────────┘ └─┘  │     Send btn: `--brand` bg, white icon
└─────────────────────────────────┘
```

### Component Specs

| Component | Style | Dimensions |
|---|---|---|
| **Header** | `--bg` bg, `--ink` title 16px 600, back arrow + menu icons | h-56px |
| **Sent bubble** | `--brand` bg, white text 15px, 12px radius, right-aligned | max-w 75%, min-h 32px |
| **Received bubble** | `--bg-3` bg, `--ink` text 15px, 12px radius, left-aligned | max-w 75%, min-h 32px |
| **Timestamp** | `--ink-2` 11px 400, below bubble | 4px gap |
| **Sender name** | `--ink-2` 12px 600, above received bubble | 4px gap |
| **Read receipt** | Check mark (✓) in `--ink-2` next to timestamp | 12px |
| **Typing indicator** | Three dots animation, `--ink-3` | 32px height |
| **Online status** | Green dot (`#22C55E`), 8px, next to name | 8x8px |
| **Input field** | `--bg` bg, `--line` border, `--ink-3` placeholder | 12px radius, h-44px |
| **Send button** | `--brand` bg, white ChevronRight icon, 8px radius | 44x44px (touch target) |
| **Sidebar item** | `--bg` bg, `--ink` name 14px 600, `--ink-2` preview, `--brand` unread badge | h-72px |
| **Unread badge** | `--brand` bg, white text 11px 700, 999px radius | 20px min width |
| **Divider** | `--line` 1px | full width |
| **Bottom nav** | `--bg` bg, `--ink-2` inactive, `--brand` active tab | h-64px |

### States

| State | Visual |
|---|---|
| **Sending** | Bubble appears with opacity 0.7, no timestamp |
| **Sent** | Opacity 1.0, timestamp shown |
| **Delivered** | Single check mark (✓) |
| **Read** | Double check mark (✓✓) — both recipients have read |
| **Failed to send** | Bubble with red border (`#C13515`), retry icon |
| **Typing** | Animated dots, disappears after 3s of inactivity |
| **Online** | Green dot `#22C55E` |
| **Offline** | Gray dot `--ink-3` |
| **Empty conversation** | Centered illustration + "No messages yet" text |
| **Loading history** | Skeleton bubbles (pulse animation) |

---

## Admin Integration

Current `/dashboard/chats` in admin becomes:

```tsx
import { redirect } from "next/navigation";

export default function ChatsPage() {
  redirect("https://chat.tradehubuae.com");
}
```

Admins see all conversations in real-time via the `admin-all` WebSocket room. No separate admin panel — the PWA is the single chat interface for everyone.

---

## Dependencies

### `apps/chat/package.json`

| Package | Version | Purpose |
|---|---|---|
| `next` | ^15.1.0 | App framework |
| `react` / `react-dom` | ^19.0.0 | UI |
| `@tradehubuae/ui` | workspace:* | shadcn components |
| `@tradehubuae/config` | workspace:* | Design tokens, env |
| `socket.io-client` | ^4.8.0 | WebSocket client |
| `lucide-react` | ^0.468.0 | Icons |
| `tailwindcss` | ^3.4.17 | Styling |
| `idb` | ^8.0.0 | IndexedDB wrapper |

### New NestJS module (`apps/api`)

| Package | Version | Purpose |
|---|---|---|
| `@nestjs/websockets` | built-in | WebSocket gateway |
| `socket.io` | ^4.8.0 | Server-side WebSocket |
| `@tradehubuae/database` | workspace:* | Drizzle schema |
| `@tradehubuae/config` | workspace:* | Env vars |

---

## Testing Strategy

| Layer | Tool | Scope |
|---|---|---|
| WebSocket events | Jest + Socket.io test client | Auth, message send/receive, typing, error cases |
| REST API | Supertest + NestJS testing | CRUD conversations, pagination, permissions |
| PWA offline | Playwright | Service worker registration, IndexedDB queue, offline send |
| PWA install | Lighthouse | Manifest, SW, install prompt |
| E2E | Playwright | User A sends → User B receives in real-time |
| Load test | k6 | 100 concurrent users, message throughput, reconnect storm |

---

## Monitoring & Observability

| Metric | Method |
|---|---|
| Connected WebSocket count | Prometheus metric from NestJS Gateway |
| Messages per minute | Logged by ChatService |
| n8n webhook latency | Logged by ChatService (time between save and reply) |
| Offline queue size | Client-side metric sent on reconnect |
| Error rate | `logger.error` in ChatService → structured logs |
| AI toggle state | Current value logged on change |

---

## Scaling

| Bottleneck | Solution |
|---|---|
| WebSocket connections per instance | Scale horizontally via Railway multiple replicas. Socket.io Redis adapter for cross-instance rooms. |
| Message history queries | Index on `(conversationId, createdAt)`. Archive conversations > 30 days to cold storage. |
| n8n webhook latency | n8n runs async. ChatService does not block on n8n call. |
| PostgreSQL message table | Partition by month. `chat_messages_2026_07` etc. |

---

## Implementation Steps

| Phase | Step | Task | Est. |
|---|---|---|---|
| **DB** | 1 | Create 3 Drizzle tables + run migration | 30 min |
| **API** | 2 | Build ChatModule: WebSocket gateway + REST controller + ChatService | 3 hr |
| **API** | 3 | Add JWT auth to WebSocket handshake | 30 min |
| **API** | 4 | Add n8n webhook endpoint + secret validation | 30 min |
| **API** | 5 | Add AI toggle endpoint (global + per-conversation) | 20 min |
| **PWA** | 6 | Scaffold `apps/chat/` — Next.js + Tailwind + PWA manifest | 30 min |
| **PWA** | 7 | Build auth flow: JWT login, token storage, protected routes | 1 hr |
| **PWA** | 8 | Build `useSocket` hook + SocketProvider | 1 hr |
| **PWA** | 9 | Build ChatMessages + ChatBubble — real-time thread | 2 hr |
| **PWA** | 10 | Build ChatInput — send + typing indicator | 30 min |
| **PWA** | 11 | Build ChatSidebar — conversation list | 1 hr |
| **PWA** | 12 | Offline support: IndexedDB queue + SW caching | 2 hr |
| **PWA** | 13 | Push notifications | 1 hr |
| **PWA** | 14 | Mobile nav + responsive polish | 1 hr |
| **Integration** | 15 | Admin redirect, n8n toggle UI, product context | 1 hr |
| **Deploy** | 16 | Dockerfile, docker-compose, Railway domain | 30 min |
| **Test** | 17 | E2E, offline, load testing | 2 hr |
| | | **Total** | **~17 hr** |
