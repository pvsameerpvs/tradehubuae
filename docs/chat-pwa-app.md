# Chat PWA — `chat.tradehubuae.com`

**Architecture & Implementation Plan**

---

## 1. Vision

A **standalone PWA chat app** at `chat.tradehubuae.com` where admins manage real-time customer conversations. Messages persist in PostgreSQL, deliver instantly via WebSocket, and work offline.

### Subdomain Architecture

| Subdomain | App | Port | Purpose |
|-----------|-----|------|---------|
| `tradehubuae.com` | `apps/web` | 3000 | Customer storefront (chat widget embedded) |
| `admin.tradehubuae.com` | `apps/admin` | 3001 | Admin dashboard |
| `crm.tradehubuae.com` | `apps/crm` | 3002 | CRM admin |
| **`chat.tradehubuae.com`** | **`apps/chat`** | **3003** | **Dedicated chat PWA for support agents** |
| `api.tradehubuae.com` | `apps/api` | 4000 | NestJS REST + WebSocket API |

### Core Capabilities

| Capability | Current (localStorage) | Target (PWA) |
|---|---|---|
| Message delivery | Polling every 2-3s | Real-time via WebSocket |
| Persistence | Single browser only | PostgreSQL — cross-device |
| Admin notification | None | Push notification + sound |
| Offline support | None | Service worker cache + queue |
| Installable | No | PWA manifest → Add to Home Screen |
| File sharing | None | Image/file upload support |
| Typing indicators | None | Real-time via WebSocket |
| Read receipts | Per localStorage copy | Server-authoritative |

---

## 2. Architecture Overview

```
                          ┌──────────────────────────┐
                          │     PostgreSQL            │
                          │  chat_sessions            │
                          │  chat_messages            │
                          │  chat_attachments         │
                          └──────────┬───────────────┘
                                     │
                          ┌──────────▼───────────────┐
                          │   API :4000               │
                          │   ChatModule              │
                          │   ├─ ChatController (REST)│
                          │   ├─ ChatGateway (WS)     │
                          │   └─ AiChatService        │
                          └────┬──────────┬──────────┘
                               │          │
                    ┌──────────┤          ├──────────┐
                    │          │          │          │
               ┌────▼────┐ ┌──▼─────┐ ┌──▼─────┐ ┌──▼──────┐
               │ web     │ │ admin  │ │ crm    │ │ chat    │
               │ :3000   │ │ :3001  │ │ :3002  │ │ :3003   │
               │ Widget  │ │ Dash   │ │ CRM    │ │ PWA     │
               │ (embed) │ │ (link) │ │        │ │ Console │
               └─────────┘ └────────┘ └────────┘ └─────────┘
```

### Components

| Layer | App | Technology | Role |
|-------|-----|-----------|------|
| **Customer Widget** | `apps/web` | React 19, Tailwind | Embedded chat bubble on storefront |
| **Chat Admin PWA** | `apps/chat` | Next.js 15 + PWA | Standalone chat console for support agents |
| **API + WS** | `apps/api` | NestJS, `@nestjs/websockets` | REST endpoints + WebSocket gateway |
| **Database** | `packages/database` | Drizzle ORM, PostgreSQL | Messages, sessions, attachments |
| **AI** | `packages/ai` | Vercel AI SDK | Bot reply generation |
| **Shared types** | `packages/chat` | TypeScript | Types + WS client + stores |

---

## 3. Database Schema

New file: `packages/database/src/schema/chat.ts`

```typescript
// Enums
chat_sender_type: "user" | "admin" | "bot" | "system"
chat_session_status: "active" | "closed"
chat_message_type: "text" | "image" | "file" | "system"

// chat_sessions
id: uuid (PK)
user_id: uuid (FK → users, nullable)
user_name: text                                  # from user profile or "Guest"
user_email: text                                 # from user profile
user_phone: text                                 # from user profile (nullable)
status: chat_session_status (default "active")
product_context: jsonb (nullable)
source: text ("web" | "whatsapp" | "email")
assigned_admin_id: uuid (FK → users, nullable)
assigned_admin_name: text (nullable — denormalized for PWA display)
created_at: timestamptz
last_message_at: timestamptz
closed_at: timestamptz (nullable)
closed_by: uuid (FK → users, nullable)
metadata: jsonb (nullable — browser, ip, page_url)

// chat_messages
id: uuid (PK)
session_id: uuid (FK → chat_sessions)
sender_type: chat_sender_type
admin_id: uuid (FK → users, nullable)
message_type: chat_message_type (default "text")
content: text
attachment_url: text (nullable)
attachment_name: text (nullable)
attachment_size: integer (nullable)
created_at: timestamptz
read_at: timestamptz (nullable)

// Indexes
- chat_messages(session_id, created_at)
- chat_sessions(status, last_message_at)
- chat_sessions(assigned_admin_id)
```

---

## 4. API — REST Endpoints

### Sessions

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/v1/chat/sessions` | JWT (customer) | Customer creates session (uses user_id, name, email, phone from JWT) |
| `GET` | `/api/v1/chat/sessions` | Admin | List sessions (paginated, filterable) |
| `GET` | `/api/v1/chat/sessions/:id` | Admin | Session detail |
| `PATCH` | `/api/v1/chat/sessions/:id/assign` | Admin | Assign self |
| `PATCH` | `/api/v1/chat/sessions/:id/close` | Admin | Close |
| `PATCH` | `/api/v1/chat/sessions/:id/reopen` | Admin | Reopen |

### Messages

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/v1/chat/sessions/:id/messages` | Admin | Messages (paginated) |
| `POST` | `/api/v1/chat/sessions/:id/messages` | Admin | Send reply |
| `POST` | `/api/v1/chat/sessions/:id/generate-ai-reply` | Admin | Generate AI draft |

### Settings

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/v1/chat/settings` | Admin | Global settings |
| `PUT` | `/api/v1/chat/settings` | Admin | Update settings |

---

## 5. API — WebSocket Gateway

### Namespace: `/chat`

### Events

| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `chat:join` | Client → Server | `{ sessionId }` | Join session room |
| `chat:leave` | Client → Server | `{ sessionId }` | Leave session room |
| `chat:message` | Client → Server | `{ sessionId, content }` | Send message (admin) |
| `chat:typing` | Client → Server | `{ sessionId, isTyping }` | Typing indicator |
| `chat:message:new` | Server → Client | `{ message }` | New message |
| `chat:typing:update` | Server → Client | `{ sessionId, adminName, isTyping }` | Admin typing |
| `chat:session:updated` | Server → Client | `{ session }` | Status change |
| `chat:unread:count` | Server → Client | `{ count }` | Unread badge |

### Rooms

```
/chat
├── session:{sessionId}    # Per-session room (customer + assigned admin)
└── admin:overview         # All connected admins (broadcasts)
```

---

## 6. Web — Customer Chat Widget

**Location:** `apps/web/src/components/chat/LiveChatWidget.tsx`

### Auth Requirement

**Only logged-in users can chat.** Chat icon is always visible, but clicking it:
- **Authenticated user** → opens chat panel, creates/joins session
- **Guest (not logged in)** → shows login prompt with a "Login to Chat" button that redirects to `/auth`

Session auto-populates user info from JWT: `user_id`, `user_name`, `user_email`, `user_phone`.

### Data Flow

| Aspect | Current | Target |
|--------|---------|--------|
| Session create | Local function | `POST /api/v1/chat/sessions` (JWT auth) |
| Message send | localStorage | WebSocket `chat:message` |
| Message receive | Polling 2s | WebSocket push (fallback: polling) |
| Typing indicator | None | WebSocket `chat:typing` |

Customer widget stays lightweight — no PWA, no service worker.

### Widget States

```
Chat Icon (FAB) — always visible
  └── Click → isLoggedIn?
        ├── No → Show Login Prompt Card
        │         └── [Login to Chat] button → /auth
        └── Yes → Open Chat Panel
                    ├── Loading → Skeleton
                    ├── Empty → "Start a conversation"
                    └── Active → Message list + input
```

---

## 7. Chat PWA — `apps/chat`

### Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| UI | Tailwind CSS, shadcn/ui (`@tradehubuae/ui`) |
| Auth | JWT (same as admin — `@tradehubuae/auth`) |
| WS Client | Custom `ChatWebSocket` class in `@tradehubuae/chat` |
| State | Zustand (sessions, active session, UI state) |
| PWA | next-pwa or custom service worker |
| Port | 3003 (dev) |

### Why a Separate App

- `admin.tradehubuae.com` is for CRUD operations — cluttered with sidebar, tables, forms
- `chat.tradehubuae.com` is a focused console — just conversations, no distractions
- PWA needs a dedicated manifest + service worker + install prompt
- Support agents need a **WhatsApp-like experience**, not a dashboard page
- Can be installed as standalone app on phone/desktop
- WhatsApp-style UI: left sidebar (chat list with previews) + right panel (conversation). Mobile: single column with navigation.

### Why Not Inside Admin

- Admin dashboard has heavy bundle (Recharts, React Table, TanStack Query for 20+ pages)
- Chat PWA needs to be lightweight, load instantly, work offline
- Separate subdomain = separate deploy scale (chat can scale independently if needed)
- Simpler auth scope — chat agents may not need admin-level permissions

### UI Layout (WhatsApp-Style)

```
                         Desktop (≥768px)
┌──────────────────────────────────────────────────────────────────┐
│  ☰ TradeHub Chat                      [🟢 Online] [⚙ Settings]  │
├───────────────────────┬──────────────────────────────────────────┤
│  🔍 Search or start   │  ←  User Contact Info          [🔽] [⋮] │
│    new chat           │  ┌──────────────────────────────────────┐│
│                       │  │ Ahmed Al Hashimi                     ││
│  ● Ahmed Al Hashimi   │  │ 📧 ahmed@example.com                 ││
│    📧 ahmed@...       │  │ 📞 +971 50 123 4567                  ││
│    I need bulk pricing│  │ 🏢 Al Hashimi Trading LLC            ││
│    2m ago         [2] │  ├──────────────────────────────────────┤│
│                       │  │                                       ││
│  ● Sara Mohammed      │  │     ┌──────────────────────┐         ││
│    📧 sara@...        │  │     │ Welcome! How can I    │         ││
│    Thanks for the help│  │     │ help you today?       │         ││
│    15m ago            │  │     └──────────────────────┘         ││
│                       │  │              System                   ││
│  ═══ Pinned ═══       │  │                                       ││
│  ● Dell Enquiry       │  │     ┌──────────────────────────┐      ││
│    📞 +971 50 111 2222│  │     │ I need bulk pricing for  │      ││
│    Is this available? │  │     │ 50 Dell laptops          │      ││
│    1h ago             │  │     └──────────────────────────┘      ││
│                       │  │               Ahmed ✓✓                ││
│  ═══ Closed ═══       │  │                                       ││
│  ○ HP Laptop Quote    │  │     ┌──────────────────────┐          ││
│    Alex K.            │  │     │ Sure! AED 2,499/unit │          ││
│    2d ago             │  │     │ for bulk orders.     │          ││
│                       │  │     └──────────────────────┘          ││
│                       │  │              You                       ││
│                       │  │                                       ││
│                       │  ├──────────────────────────────────────┤│
│                       │  │  [📎] [🤖]  Type a message...  [➤] ││
│                       └──┴──────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────┘


                         Mobile (<768px) — Single Column
                         
┌──────────────────────────────────────────────────────┐
│  ←  Ahmed Al Hashimi              [📞] [⋮] [🟢]    │
├──────────────────────────────────────────────────────┤
│                                                      │
│     ┌──────────────────────┐                         │
│     │ Welcome! How can I   │                         │
│     │ help you today?      │                         │
│     └──────────────────────┘                         │
│              System                                  │
│                                                      │
│     ┌──────────────────────────┐                     │
│     │ I need bulk pricing for  │                     │
│     │ 50 Dell laptops          │                     │
│     └──────────────────────────┘                     │
│               Ahmed ✓✓                               │
│                                                      │
│     ┌──────────────────────┐                         │
│     │ Sure! AED 2,499/unit │                         │
│     │ for bulk orders.     │                         │
│     └──────────────────────┘                         │
│              You                                     │
│                                                      │
├──────────────────────────────────────────────────────┤
│  [📎] [🤖]  Type a message...              [➤]     │
└──────────────────────────────────────────────────────┘
```

### WhatsApp-Style Design Details

| Element | Implementation |
|---------|---------------|
| **Sidebar** | User avatar (initials/mdi) + contact info line (email/phone/name whichever available) + message preview + time + unread badge. Pinned section at top. Closed section at bottom. |
| **Chat Header** | User avatar (large), name, email/phone below name, online status indicator. Click phone to call, click email to open compose. |
| **Message Bubbles** | User messages: right-aligned, green/brand bg, rounded corners. Admin messages: left-aligned, gray bg, rounded corners. System messages: center, small text, gray. |
| **Read Receipts** | Single check (sent) → double check (delivered) → double check blue (read). Shown below user messages on right. |
| **Timestamp** | Below each bubble, small gray text. Today → "2:30 PM". Yesterday → "Yesterday 2:30 PM". Older → "15/06/26". |
| **Reply Box** | Fixed bottom. Attach button (📎), AI generate button (🤖), text input (auto-resize), send button (➤). Enter to send, Shift+Enter for newline. |
| **Empty State** | Centered illustration + "No conversations yet. When customers message, they'll appear here." |
| **Mobile** | Single column. Chat list is full screen, tapping a chat navigates to the conversation view (back button to return to list). |

### App Shell

```typescript
// apps/chat/src/app/layout.tsx
export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1e40af" />
      </head>
      <body>
        <AuthGuard>
          <ChatProvider>
            {children}
          </ChatProvider>
        </AuthGuard>
      </body>
    </html>
  );
}
```

### Routes

| Route | Purpose |
|-------|---------|
| `/login` | Auth (JWT) |
| `/` | Redirect to `/chats` |
| `/chats` | Session list (default view) |
| `/chats/:id` | Specific session detail |
| `/settings` | Agent profile, notification prefs |

---

## 8. PWA Features — Push Notifications (iOS & Android)

### Platform Support

| Platform | Works When App Is... | Badge | Sound | Notes |
|----------|---------------------|-------|-------|-------|
| **Android** (Chrome) | Open / Background / Closed / Locked | ✅ | ✅ | Fully supported via Web Push API |
| **iOS** (Safari 16.4+) | Open / Background / Closed / Locked | ✅ (iOS 16.4+) | ✅ | Must be added to Home Screen first. Requires `api.tradehubuae.com` to be HTTPS. |
| **iOS** (Safari <16.4) | ❌ No PWA push support | ❌ | ❌ | User must upgrade iOS |
| **Desktop** (Chrome/Edge/Firefox) | Open / Background / Closed | ✅ | ✅ | Full support |

**Important:** For notifications to arrive when the app is closed or phone is locked, the PWA must be **installed to the Home Screen** (not just open in browser). This triggers the OS-level push service.

### How Push Works

```
                    ┌──────────────────────┐
                    │   NestJS API :4000   │
                    │   ChatModule         │
                    │                      │
                    │ 1. Message arrives   │
                    │ 2. Check WS: any     │
                    │    admin connected?  │
                    │    ├─ Yes → push via │
                    │    │   WebSocket     │
                    │    └─ No → push via  │
                    │        Web Push API  │
                    └──────────┬───────────┘
                               │
                    POST to Push Service
                    (Browser's built-in)
                               │
              ┌────────────────┼────────────────┐
              │                │                │
         ┌────▼────┐    ┌─────▼─────┐    ┌─────▼─────┐
         │ Android  │    │    iOS    │    │  Desktop  │
         │ (FCM)    │    │ (APNs via │    │ (Browser  │
         │          │    │  Safari)  │    │  Push)    │
         └─────────┘    └───────────┘    └───────────┘
              │                │                │
         ┌────▼────┐    ┌─────▼─────┐    ┌─────▼─────┐
         │ Service  │    │  Service  │    │  Service  │
         │ Worker   │    │  Worker   │    │  Worker   │
         │ recieves │    │  recieves │    │  recieves │
         └─────────┘    └───────────┘    └───────────┘
              │                │                │
         ┌────▼────────────────▼────────────────▼────┐
         │  Show OS Notification                     │
         │  "Ahmed Al Hashimi: I need bulk pricing"  │
         │  — Tap → opens chat.tradehubuae.com        │
         └───────────────────────────────────────────┘
```

### Setup Requirements

#### 1. VAPID Keys (required)

Generate VAPID key pair for Web Push:

```bash
npx web-push generate-vapid-keys
```

Add to `.env`:

```env
VAPID_PUBLIC_KEY=BG...
VAPID_PRIVATE_KEY=...
VAPID_SUBJECT=mailto:admin@tradehubuae.com
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BG...
```

#### 2. Service Worker Push Listener (`apps/chat/public/sw.js`)

```javascript
self.addEventListener("push", (event) => {
  const data = event.data.json();

  const options = {
    title: data.sender,
    body: data.message,
    icon: "/icons/chat-192.png",
    badge: "/icons/badge-icon.png",    // small icon for status bar (Android)
    tag: `session-${data.sessionId}`,  // groups notifications by session
    renotify: true,                    // makes a sound even if same tag
    vibrate: [200, 100, 200],          // vibrate pattern (Android)
    data: {
      sessionId: data.sessionId,
      url: `/chats/${data.sessionId}`,
    },
    actions: [
      {
        action: "open",
        title: "Open Chat",
      },
      {
        action: "reply",
        title: "Quick Reply",
      },
    ],
    // iOS-specific: required for iOS 16.4+ PWA push
    requireInteraction: true,           // notification stays until tapped
    silent: false,                      // play sound
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "New Message", options)
  );
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "reply") {
    // Future: quick reply from notification
    return;
  }

  // Open or focus the PWA
  const urlToOpen = event.notification.data.url;
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        // Focus existing PWA window if open
        for (const client of windowClients) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            client.navigate(urlToOpen);
            return client.focus();
          }
        }
        // Open new PWA window
        return clients.openWindow(urlToOpen);
      })
  );
});
```

#### 3. API Push Endpoint (NestJS)

Backend sends push via `web-push` library:

```typescript
// apps/api/src/modules/chat/push.service.ts
import webPush from "web-push";

webPush.setVapidDetails(
  process.env.VAPID_SUBJECT,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY,
);

export class PushService {
  async sendNotification(subscription: PushSubscription, payload: {
    sender: string;
    message: string;
    sessionId: string;
    title?: string;
  }) {
    try {
      await webPush.sendNotification(subscription, JSON.stringify(payload));
    } catch (err) {
      if (err.statusCode === 410) {
        // Subscription expired — remove from DB
        await this.removeSubscription(subscription);
      }
    }
  }

  async notifyAdmins(session: Session, message: Message) {
    const subscriptions = await this.getAdminSubscriptions();
    const senderLabel = [
      message.userEmail,
      message.userPhone,
      message.userName,
    ].filter(Boolean).join(" · ");

    for (const sub of subscriptions) {
      await this.sendNotification(sub.subscription, {
        sender: senderLabel,
        message: message.content,
        sessionId: session.id,
        title: `New message from ${senderLabel}`,
      });
    }
  }
}
```

#### 4. Client Subscription (`apps/chat/src/lib/push-setup.ts`)

```typescript
export async function setupPushSubscription() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    console.warn("Push not supported");
    return;
  }

  const registration = await navigator.serviceWorker.ready;
  const existing = await registration.pushManager.getSubscription();

  if (existing) return existing;

  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
  });

  // Send subscription to backend
  await fetch("/api/v1/chat/push-subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscription),
  });

  return subscription;
}
```

### Notification Payload Structure

```json
{
  "sender": "Ahmed Al Hashimi · ahmed@example.com · +971 50 123 4567",
  "message": "I need bulk pricing for 50 Dell laptops",
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "title": "New message from Ahmed Al Hashimi",
  "unreadCount": 3
}
```

The notification displays whichever contact info is available:
- Has email → show email
- Has phone → show phone  
- Has name only → show name
- All three → `"Ahmed Al Hashimi · ahmed@example.com · +971 50 123 4567"`

### Notification Behavior Matrix

| Scenario | Android | iOS | Desktop |
|----------|---------|-----|---------|
| App open + active (PWA in foreground) | No push (WS delivers) | No push (WS delivers) | No push (WS delivers) |
| App in background | Push notification + sound + badge | Push notification + sound + badge | Push notification + sound + badge |
| App closed | Push notification + sound + badge | Push notification + sound (if installed to HS) | Push notification + sound + badge |
| Phone locked | Push notification on lock screen | Push notification on lock screen | N/A |
| Multiple messages same session | Groups under one notification (same tag) | Groups under one notification | Groups under one notification |

### Badge Support

```javascript
// Update badge count when messages arrive
self.addEventListener("push", (event) => {
  const data = event.data.json();
  if (data.unreadCount && navigator.setAppBadge) {
    navigator.setAppBadge(data.unreadCount);
  }
});

// Clear badge when app is opened
self.addEventListener("focus", () => {
  if (navigator.clearAppBadge) {
    navigator.clearAppBadge();
  }
});
```

### Manifest (`apps/chat/public/manifest.json`)

```json
{
  "name": "TradeHub Chat",
  "short_name": "Chat",
  "description": "Customer support chat for TradeHub UAE",
  "start_url": "/chats",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1e40af",
  "scope": "/",
  "categories": ["business", "communication"],
  "prefer_related_applications": false,
  "icons": [
    { "src": "/icons/chat-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/chat-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ]
}
```

### Service Worker (`apps/chat/public/sw.js`) — Full Feature Table

| Feature | Implementation | Platforms |
|---------|---------------|-----------|
| **Offline shell** | Cache app shell + last 50 messages per session | All |
| **Message queue** | IndexedDB — queue outgoing when offline, flush on reconnect | All |
| **Push notifications** | Web Push API — new session, new message from customer | Android ✅, iOS ✅ (16.4+), Desktop ✅ |
| **Notification grouping** | Same `tag` per session — OS groups them | Android ✅, iOS ✅ |
| **Notification actions** | "Open Chat" + "Quick Reply" action buttons | Android ✅, iOS ❌, Desktop ✅ |
| **Badge** | Unread count on app icon via `navigator.setAppBadge()` | Android ✅, iOS ✅ (16.4+), Desktop ✅ |
| **Vibration** | `navigator.vibrate([200, 100, 200])` on new message | Android ✅, iOS ❌ |
| **Background sync** | `SyncManager` — retry failed sends when online | Android ✅, iOS ❌, Desktop ✅ |
| **Persistent notification** | `requireInteraction: true` — stays until tapped | Android ✅, iOS ✅, Desktop ✅ |

---

## 9. AI Bot Integration

Uses existing `@tradehubuae/ai` (Vercel AI SDK). No n8n needed.

### Manual Mode

Admin clicks "Generate AI Reply" → API calls `AiService.generateReply()` → admin edits draft → sends.

### Auto-Reply Mode (Optional)

When enabled, API auto-responds to common questions with `sender_type: "bot"`:

```
Customer: "What's the price of Dell laptop?"
  → ChatService → AiService.generateReply({ message, productContext, history })
  → If confidence > 0.8 → save as bot message → push via WS
```

---

## 10. End-to-End Data Flow

### Customer Sends Message

```
User clicks chat icon
  → isLoggedIn? No → Show login prompt (button → /auth)
  → isLoggedIn? Yes → POST /chat/sessions (JWT: user_id, name, email, phone)
  → API creates session → returns sessionId
  → WebSocket.connect() → join room session:{sessionId}
  → User types message → WebSocket.send({ event: "chat:message", sessionId, content })
  → ChatGateway → ChatService.createMessage()
  → Drizzle INSERT → ChatGateway emits "chat:message:new"
  → PWA receives → appends to UI (shows user name/email/phone in header)
  → If autoReply → AiService generates bot reply
```

### Admin Sends Reply

```
Admin types in PWA
  → POST /api/v1/chat/sessions/:id/messages { content }
  → ChatController → ChatService.createMessage()
  → Drizzle INSERT → ChatGateway emits "chat:message:new"
  → Widget receives → shows reply
```

### Session Lifecycle

```
1. Customer clicks chat icon → isLoggedIn?
     ├── No → Show login prompt with [Login to Chat] button
     └── Yes → POST /chat/sessions (JWT auth) → API creates session with user_id, name, email, phone
2. PWA receives "chat:session:updated" → appears in list
     └── SessionCard shows: user name/email/phone (whichever available) + message preview
3. Admin clicks session → joins WS room → sees messages + user contact info in header
4. Admin assigns self → PATCH /sessions/:id/assign
5. Conversation happens via WS
6. Admin closes → PATCH /sessions/:id/close
```

---

## 11. Component Tree

### Chat PWA (`apps/chat/src/`)

```
ChatApp
├── AuthLayout
│   └── LoginPage
├── ChatLayout                    # Side-by-side (desktop) / stacked (mobile)
│   ├── Sidebar
│   │   ├── SearchInput           # Filter sessions
│   │   ├── SessionList
│   │   │   └── SessionCard[]     # Avatar + name + preview + time + badge
│   │   └── StatusToggle          # Online / Away / Offline
│   └── MainPanel
│       ├── SessionHeader
│       │   ├── UserInfo          # Avatar + name + email/phone (whichever available)
│       │   ├── ContactChip       # 📧 email or 📞 phone (clickable)
│       │   ├── ProductChip       # "Asking about: Dell Laptop"
│       │   ├── AssignButton
│       │   ├── CloseButton
│       │   └── ReopenButton
│       ├── MessageList
│       │   ├── MessageBubble     # User (right, brand bg)
│       │   ├── MessageBubble     # Admin (left, gray bg)
│       │   ├── BotMessageBubble  # Bot (left, accent bg)
│       │   └── SystemMessage     # "Session assigned to Sara"
│       ├── TypingIndicator       # "Customer is typing..."
│       └── ReplyBox
│           ├── FileAttach        # 📎
│           ├── AiGenerateButton  # 🤖 Generate AI reply
│           └── SendInput         # Textarea + Send
├── SettingsPage                  # /settings
│   ├── ProfileForm
│   ├── NotificationPrefs
│   └── AiSettings
├── PushHandler                   # Service worker registration
└── ServiceWorkerRegister
```

### Web Widget (`apps/web/`)

```
LiveChatWidget                    # FAB + panel (embedded in storefront)
├── ChatFab
├── ChatPanel
│   ├── AuthGate                   # Check isLoggedIn
│   │   ├── LoginPrompt            # Show if guest → [Login to Chat] button
│   │   └── ChatView               # Show if authenticated
│   │       ├── PreChatForm
│   │       │   └── ProductContextChip
│   │       ├── MessageList
│   │       │   ├── MessageBubble (user)
│   │       │   ├── MessageBubble (admin)
│   │       │   └── BotMessageBubble
│   │       ├── TypingIndicator
│   │       └── ChatInput
│   └── ChatProductButton          # "Ask about this item" (only if logged in)
```

---

## 12. Implementation Phases

### Phase 1 — Foundation (Week 1)

| Task | Files |
|------|-------|
| Add chat database schema | `packages/database/src/schema/chat.ts` |
| Drizzle migration | `pnpm db:generate`, `pnpm db:migrate` |
| Create `ChatModule` in NestJS | `apps/api/src/modules/chat/` |
| Implement REST endpoints | `chat.controller.ts`, `chat.service.ts` |

### Phase 2 — Real-Time (Week 2)

| Task | Files |
|------|-------|
| WebSocket gateway | `apps/api/src/modules/chat/chat.gateway.ts` |
| WS client in `@tradehubuae/chat` | `packages/chat/src/ws-client.ts` |
| Update web widget | `apps/web/src/components/chat/LiveChatWidget.tsx` |

### Phase 3 — Chat PWA App (Week 3)

| Task | Files |
|------|-------|
| Scaffold `apps/chat/` | `package.json`, `next.config.js`, `tsconfig.json` |
| App shell + layout | `src/app/layout.tsx`, `src/app/page.tsx` |
| Auth login page | `src/app/login/page.tsx` |
| Session list + detail pages | `src/app/chats/page.tsx`, `src/app/chats/[id]/page.tsx` |
| Zustand store | `src/lib/chat-store.ts` |
| WebSocket integration | `src/hooks/use-chat-ws.ts` |

### Phase 4 — PWA Features (Week 4)

| Task | Files |
|------|-------|
| Manifest + icons | `public/manifest.json`, `public/icons/` |
| Service worker | `public/sw.js` |
| Push notifications | API `notifications.service.ts` + SW `push` event |
| Offline message queue | IndexedDB in SW |
| Install prompt | `src/components/InstallPrompt.tsx` |

### Phase 5 — AI + Polish (Week 5)

| Task | Files |
|------|-------|
| `AiChatService` | `apps/api/src/modules/chat/ai-chat.service.ts` |
| Generate AI reply endpoint | `chat.controller.ts` |
| AI button in PWA | `src/components/ReplyBox.tsx` |
| Auto-reply mode | `chat.service.ts` |
| Error handling + reconnect | `ws-client.ts` |
| Rate limiting | `@nestjs/throttler` |

---

## 13. Security

| Concern | Mitigation |
|---------|------------|
| **Anonymous abuse** | Rate limit session creation (5/min per IP) |
| **Message injection** | Server-side content sanitization |
| **WS hijacking** | JWT auth on WS handshake. Room scoped by session ID. |
| **File upload abuse** | MIME validation + size limit via media module |
| **Data access** | Admin JWT required. Customer sees own session only. |
| **Rate limiting** | 10 messages/min per session, 100 WS connections/IP |

---

## Environment Variables

```env
# .env
CHAT_AI_ENABLED=true
CHAT_AI_AUTO_REPLY=false
CHAT_AI_CONFIDENCE_THRESHOLD=0.8
CHAT_MAX_MESSAGE_LENGTH=5000
CHAT_AUTO_CLOSE_MINUTES=30
CHAT_ENABLE_PUSH_NOTIFICATIONS=true
NEXT_PUBLIC_WS_URL="ws://localhost:4000/chat"
VAPID_PUBLIC_KEY="your-vapid-public-key"
VAPID_PRIVATE_KEY="your-vapid-private-key"
```

---

## Project Structure

```
apps/chat/
├── public/
│   ├── manifest.json
│   ├── sw.js
│   ├── icons/
│   │   ├── chat-192.png
│   │   └── chat-512.png
│   └── offline.html
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Redirect → /chats
│   │   ├── login/page.tsx
│   │   ├── chats/page.tsx        # Session list
│   │   ├── chats/[id]/page.tsx   # Session detail
│   │   └── settings/page.tsx
│   ├── components/
│   │   ├── ChatLayout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── SessionCard.tsx
│   │   ├── SessionList.tsx
│   │   ├── MessageList.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── ReplyBox.tsx
│   │   ├── TypingIndicator.tsx
│   │   ├── InstallPrompt.tsx
│   │   └── icons/
│   ├── hooks/
│   │   └── use-chat-ws.ts
│   ├── lib/
│   │   ├── chat-store.ts         # Zustand store
│   │   └── api.ts
│   └── types/
│       └── index.ts
├── package.json
├── next.config.js
├── tsconfig.json
├── tailwind.config.ts
└── postcss.config.js
```

---

## Migration from localStorage

1. **Read phase:** Both localStorage + API read. UI merges, deduplicates by message ID.
2. **Write phase:** New messages go to API. LocalStorage writes removed.
3. **Cleanup:** After active sessions migrate, localStorage reads removed.
4. **Flag:** `useApi` feature flag controls transition per environment.
