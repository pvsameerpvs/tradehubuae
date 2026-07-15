# TradeHub UAE — Monorepo Architecture

**Enterprise Ecommerce Platform** for IT Equipment in the United Arab Emirates.

---

## What is TradeHub UAE?

TradeHub UAE is a full-stack, multi-app ecommerce platform for buying and selling IT equipment (laptops, PCs, components, peripherals) in the UAE market. It serves two user groups via a REST API backend:

| User | Interface | Port/Domain |
|------|-----------|-------------|
| **Customers** | Storefront — browse products, cart, checkout, track orders | `tradehubuae.com` (3000) |
| **Admin Staff** | Dashboard — manage products, orders, categories, brands, inventory, analytics, settings | `admin.tradehubuae.com` (3001) |
| **CRM Staff** | CRM — finance, partners, deals, customer management | `crm.tradehubuae.com` (same app as admin, subdomain middleware) |
| **Support Agents** | Chat PWA — real-time conversations | `chat.tradehubuae.com` (3003) |
| **API** | NestJS REST API — all business logic and data access | `api.tradehubuae.com` (4000) |

---

## Monorepo Stack

| Category | Technology |
|----------|-----------|
| **Package Manager** | pnpm 9.15.4 (workspaces) |
| **Orchestration** | Turborepo 2.3 — parallel task execution, caching |
| **Language** | TypeScript strict mode throughout |
| **Formatting/Linting** | ESLint + Prettier + Husky + commitlint + lint-staged |

---

## Workspace Structure

```
tradehubuae/
├── apps/                          # Independent deployable applications
│   ├── web/          [3000]      # Customer-facing Next.js 15 storefront
│   ├── admin/        [3001]      # Admin dashboard + CRM (subdomain routed)
│   ├── api/          [4000]      # NestJS 10 REST API
│   ├── worker/       [no port]   # BullMQ background job workers
│   └── chat/         [3003]      # ⬜ Chat PWA (planned — separate app)
│
├── packages/                      # Shared libraries consumed by apps
│   ├── ui/                       # shadcn/ui components (Button, Card, Dialog, etc.)
│   ├── database/                 # Drizzle ORM schema, migrations, client
│   ├── auth/                     # Authentication helpers (Supabase, JWT, Google OAuth)
│   ├── config/                   # Env vars, RBAC enums, Tailwind config, constants
│   ├── types/                    # Shared TypeScript types (UUID, Price, etc.)
│   ├── validation/               # Zod schemas shared frontend ↔ backend
│   ├── ai/                       # Vercel AI SDK — multi-provider (Google, OpenAI, etc.)
│   ├── chat/                     # Chat types + localStorage persistence (no real-time)
│   ├── storage/                  # Cloudflare R2 / S3 file storage with Sharp
│   ├── seo/                      # Metadata + JSON-LD schema generators
│   ├── utils/                    # cn(), slugify, formatPrice, generateSKU, etc.
│   └── logger/                   # Structured logging service
│
├── docker/                        # Docker Compose + per-app Dockerfiles
│   ├── docker-compose.yml        # postgres + redis + api + worker + web + admin
│   ├── Dockerfile.api
│   ├── Dockerfile.web
│   ├── Dockerfile.admin
│   └── Dockerfile.worker
│
├── scripts/                       # Utility scripts
├── .github/                       # CI/CD (not yet configured)
├── ARCHITECTURE.md               # This file
├── PROJECT.md                    # Detailed project status tracking
├── AGENTS.md                     # AI coding agent rules
└── UI-DESIGN-AGENT.md            # UI design system specification
```

---

## Application Map

```
┌──────────────────────────────────────────────────────────┐
│                      Users (Browser)                     │
└──────────┬──────────────┬──────────────┬─────────────────┘
           │              │              │
     ┌─────▼─────┐  ┌─────▼──────┐  ┌───▼────────┐
     │  web:3000 │  │ admin:3001 │  │ chat:3003  │
     │ Customer  │  │ Dashboard  │  │ Chat PWA   │
     │ Storefront│  │  + CRM     │  │ (planned)  │
     │           │  │ (subdomain)│  │            │
     └─────┬─────┘  └─────┬──────┘  └─────┬──────┘
           │              │               │
           └──────────────┼───────────────┘
                          │
                     ┌────▼──────────────┐
                     │    api:4000       │
                     │  NestJS REST API  │
                     │ /api/v1/*         │
                     └────┬──────────┬───┘
                          │          │
                    ┌─────▼────┐ ┌───▼──────┐
                    │ Postgres │ │  Redis   │
                    │   :5432  │ │  :6379   │
                    └──────────┘ └───┬──────┘
                                     │
                                ┌────▼─────┐
                                │  worker  │
                                │  BullMQ  │
                                └──────────┘
```

---

## Domain Mapping

| Domain | App | Purpose | Status |
|--------|-----|---------|--------|
| `tradehubuae.com` | `@tradehubuae/web` | Customer storefront — browse products, cart, checkout, orders | ✅ Built |
| `admin.tradehubuae.com` | `@tradehubuae/admin` | Admin dashboard — products, orders, categories, brands, inventory, analytics, settings, users | ✅ Built |
| `crm.tradehubuae.com` | `@tradehubuae/admin` (via middleware) | CRM — customer management, sales pipeline, finance, partners — routed inside admin via subdomain middleware | ⬜ Planned |
| `chat.tradehubuae.com` | `apps/chat` (new) | Chat PWA — real-time messaging between customers and support agents | ⬜ Planned |
| `api.tradehubuae.com` | `@tradehubuae/api` | NestJS REST API — all backend business logic, auth, data access | ✅ Built |

## Port Allocation

| Port | App | Framework | Purpose | Status |
|------|-----|-----------|---------|--------|
| 3000 | `@tradehubuae/web` | Next.js 15 | Customer-facing storefront | ✅ Live |
| 3001 | `@tradehubuae/admin` | Next.js 15 | Admin dashboard + CRM (via subdomain) | ✅ Live |
| 3003 | `apps/chat` | Next.js 15 (PWA) | Chat application | ⬜ Planned |
| 4000 | `@tradehubuae/api` | NestJS 10 | REST API | ✅ Live |
| — | `@tradehubuae/worker` | TypeScript/tsx | BullMQ background job worker | 🔄 Stubs |

---

## Chat Data Flow (Planned)

```
┌──────────┐          ┌──────────┐          ┌───────────┐
│  web:3000│◄────────►│ api:4000 │◄────────►│ chat:3003 │
│ Customer │  WS msg  │ NestJS   │  WS msg  │ Chat PWA  │
│ Widget   │          │ (persist)│          │ (Admin)   │
└──────────┘          └──────────┘          └───────────┘
                           │
                     ┌─────▼──────┐
                     │  Postgres  │
                     │ chat_messages │
                     │ chat_sessions│
                     └────────────┘
```

**Current state:** All chat data lives in `localStorage` (same browser only). No server persistence, no real-time sync. The `@tradehubuae/chat` shared package provides types and localStorage helpers consumed by both `web` and `admin`.

**Target state:** Real-time WebSocket via NestJS `ChatGateway`. Customer widget in `apps/web`, admin console in `apps/chat` (standalone PWA). Messages persisted in PostgreSQL.

---

## Package Dependency Graph

```
                    ┌─────────┐
                    │  types  │
                    └────┬────┘
                         │
              ┌──────────┼──────────┐
              │          │          │
         ┌────▼───┐ ┌───▼────┐ ┌───▼──────┐
         │ config │ │ utils  │ │ validation│
         └────┬───┘ └───┬────┘ └───┬──────┘
              │         │          │
    ┌─────────┼─────────┼──────────┼──────┐
    │         │         │          │      │
┌───▼───┐ ┌──▼───┐ ┌───▼───┐ ┌────▼──┐ ┌─▼────┐
│  ui   │ │ auth │ │logger │ │ chat  │ │ seo  │
└───┬───┘ └──┬───┘ └──┬───┘ └───┬───┘ └──┬───┘
    │        │        │         │
    └────────┼────────┼─────────┘
             │        │         │
         ┌───▼────┐ ┌─▼──────┐ ┌▼────────┐
         │database│ │storage │ │   ai    │
         └───┬────┘ └────────┘ └─────────┘
             │
     ┌───────┼───────┐
     │       │       │
   ┌─▼─┐ ┌──▼──┐ ┌──▼──┐
   │web│ │admin│ │ api │
   └───┘ └─────┘ └──┬──┘
                    │
               ┌────▼────┐
               │  worker │
               └─────────┘
```

---

## Quick Start

```bash
# Infrastructure
docker compose -f docker/docker-compose.yml up postgres redis -d

# Install & setup
pnpm install
cp .env.example .env
pnpm db:generate && pnpm db:push && pnpm db:seed

# Start all apps in parallel
pnpm dev
```

| Command | Starts |
|---------|--------|
| `pnpm dev` | All apps (web:3000, admin:3001, api:4000, worker) |
| `pnpm --filter @tradehubuae/web dev` | Web only |
| `pnpm --filter @tradehubuae/admin dev` | Admin only |
| `pnpm --filter @tradehubuae/api dev` | API only |


---

## Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15, React 19, Tailwind CSS 3.4, shadcn/ui |
| **State (Admin)** | TanStack React Query, Zustand, React Table |
| **Forms** | react-hook-form + Zod |
| **Charts** | Recharts |
| **Backend** | NestJS 10 (Express), Passport, Helmet, Throttler |
| **Database** | PostgreSQL 16 + Drizzle ORM |
| **Cache/Queue** | Redis 7 + BullMQ |
| **Auth** | Supabase SSR, JWT, Google OAuth |
| **AI** | Vercel AI SDK (Google Gemini, OpenAI, Anthropic) |
| **Storage** | Cloudflare R2 / AWS S3 + Sharp |
| **Email** | Resend |
| **Payments** | COD (v1), Stripe / Tabby / Tamara (future) |
| **Icons** | Lucide React |
