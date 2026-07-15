# TradeHub UAE -- Total Project Overview

**Enterprise Ecommerce Platform** for IT Equipment in the United Arab Emirates.

> 4 apps + 12 packages -- Monorepo (Turborepo + pnpm)

---

## 1. Domains & Apps

| Domain | App | Port | Purpose | Status |
|--------|-----|------|---------|--------|
| `tradehubuae.com` | `apps/web` | 3000 | Customer storefront | Built |
| `admin.tradehubuae.com` | `apps/admin` | 3001 | Admin dashboard | Built |
| `crm.tradehubuae.com` | `apps/admin` (middleware) | 3001 | CRM module (subdomain rewrite) | Planned |
| `chat.tradehubuae.com` | `apps/chat` | 3003 | Chat PWA for support agents | Planned |
| `api.tradehubuae.com` | `apps/api` | 4000 | NestJS REST API | Built |
| -- | `apps/worker` | -- | BullMQ background job worker | Stubs |

---

## 2. Architecture Diagram

```
                           Users (Browser)
         |                      |                      |
    tradehubuae.com        admin.tradehubuae.com    chat.tradehubuae.com
    apps/web :3000          apps/admin :3001         apps/chat :3003
    Customer Storefront     Admin Dashboard + CRM    Chat PWA (planned)
         |                      |                      |
         -----------------------+-----------------------
                                |
                          apps/api :4000
                          NestJS REST API
                          /api/v1/*
                                |
                    ------------+-----------
                    |                       |
              Postgres :5432           Redis :6379
                                         |
                                    apps/worker
                                    BullMQ Jobs
```

---

## 3. App Details

### 3.1 Web Frontend (`apps/web`)

| Aspect | Detail |
|--------|--------|
| **Framework** | Next.js 15.1 (App Router) |
| **Domain** | `tradehubuae.com` |
| **Pages** | 36 routes -- Home, Products, Categories, Brands, Cart, Checkout, Auth, Account, Blog, Search, Compare, Wishlist, Track Order, Bulk Sales, Combo Offers, Contact, About |
| **State** | React Context (Cart, CartFly, Auth) |
| **Data** | Static mock files in `src/data/` (only combo offers calls real API) |
| **Auth** | Mock Supabase (localStorage only -- not connected) |
| **Doc** | `docs/web-app.md` |

**Key issue:** All data is static mock. Auth is not connected to real API.

### 3.2 Admin Dashboard (`apps/admin`)

| Aspect | Detail |
|--------|--------|
| **Framework** | Next.js 15.1 (App Router) |
| **Domain** | `admin.tradehubuae.com` |
| **Pages** | 47 routes -- Dashboard, Products, Orders, Categories, Brands, Customers, Inventory, Combo Offers, Bulk Sales, Media, Blog, Uses, SEO, Analytics, Users, Settings |
| **Forms** | Zod+RHF (products only), manual useState (all others) |
| **Charts** | recharts (8 charts across analytics, dashboard, SEO) |
| **API** | Connected to backend for 24+ endpoints |
| **State** | zustand + React Query |
| **Doc** | `docs/admin-app.md` |

**Key issue:** No authentication -- no login page, no JWT, no auth guard.

### 3.3 CRM Module (`apps/admin` subdomain)

| Aspect | Detail |
|--------|--------|
| **Framework** | Same as admin (Next.js 15.1) |
| **Domain** | `crm.tradehubuae.com` (middleware rewrite to `/crm`) |
| **Modules** | Finance & Expenses, Partner Management, Enhanced Customer CRM, Deal Pipeline |
| **Tables** | 10 new database tables |
| **Endpoints** | 26 API endpoints under `/api/v1/crm/` |
| **Charts** | 11 recharts graphs |
| **Estimate** | ~21 days implementation |
| **Doc** | `docs/crm-app.md` |

### 3.4 Chat PWA (`apps/chat`)

| Aspect | Detail |
|--------|--------|
| **Framework** | Next.js 15.1 + PWA (service worker) |
| **Domain** | `chat.tradehubuae.com` |
| **UI** | WhatsApp-style (sidebar + conversation panel, read receipts, typing indicators) |
| **Real-time** | WebSocket via NestJS ChatGateway |
| **Push** | Web Push API -- Android full, iOS 16.4+ |
| **Auth** | JWT (customer: login required to chat; admin: login required for PWA) |
| **Estimate** | ~5 weeks |
| **Doc** | `docs/chat-pwa-app.md` |

### 3.5 API (`apps/api`)

| Aspect | Detail |
|--------|--------|
| **Framework** | NestJS 10 (Express underhood) |
| **Domain** | `api.tradehubuae.com` |
| **Prefix** | `/api/v1/` |
| **Modules** | 17 modules (11 implemented, 6 empty stubs) |
| **Auth** | JWT + Passport + Role Guards |
| **Storage** | Cloudflare R2 (S3-compatible) + sharp |
| **Doc** | `docs/backend-endpoints.md` |

**Implemented modules:** Auth, Products, Categories, Brands, Orders, Inventory, Media, Combo Offers, SEO, Analytics, AI

**Empty modules:** Users, Customers, Reviews, Coupons, Notifications, Reports

### 3.6 Worker (`apps/worker`)

| Aspect | Detail |
|--------|--------|
| **Runtime** | TypeScript via tsx |
| **Queue** | BullMQ + Redis |
| **Queues** | ai-generation, image-processing, email-sending, invoice-generation, analytics-processing, seo-generation |
| **SEO cron** | Fully implemented -- generates SEO for top 20 products daily via Gemini |

---

## 4. Shared Packages

All prefixed with `@tradehubuae/`. Located in `packages/`.

| Package | Purpose |
|---------|---------|
| `ui` | shadcn/ui components (Button, Card, Badge, Input, Dialog, etc.) + `cn()` |
| `database` | Drizzle ORM schema (38 tables, 16 schema files) + client |
| `auth` | NextAuth config, role/permission helpers |
| `config` | Env vars (42), Role/Permission enums, Tailwind config, UAE emirates |
| `types` | UUID, Slug, Email, Price, PaginatedResponse |
| `validation` | Zod schemas for Product, Order, Address, Review, Auth, Pagination, Search |
| `ai` | Vercel AI SDK -- multi-provider AI service |
| `chat` | Chat types + localStorage persistence |
| `storage` | Cloudflare R2 / S3 file storage with sharp WebP conversion |
| `seo` | Metadata generation + JSON-LD schemas |
| `utils` | cn(), slugify, formatPrice, generateSKU, generateOrderNumber, debounce |
| `logger` | Structured logger with levels, context, JSON output |

---

## 5. AI Service -- Vercel AI SDK (`@tradehubuae/ai`)

The project uses **Vercel AI SDK v4** (`ai` package) with multi-provider support.

### Provider Support

| Provider | Package | Default Model | Vision Model |
|----------|---------|---------------|--------------|
| **Google Gemini** | `@ai-sdk/google` | `gemini-1.5-pro` | `gemini-1.5-flash` |
| **OpenAI** | `@ai-sdk/openai` | `gpt-4o` | `gpt-4o-mini` |
| **Anthropic** | `@ai-sdk/anthropic` | `claude-3-5-sonnet` | `claude-3-5-sonnet` |
| **OpenAI-compatible** | `@ai-sdk/openai` | Configurable | Configurable |

Provider selected via `AI_PROVIDER` env var. Falls back gracefully if vision not supported.

### AI Functions

| Function | Input | Output | Used By |
|----------|-------|--------|---------|
| `generateProduct` | Specs, images | Title, description, specs, FAQ, SEO, category, brand | Admin product form |
| `analyzeImage` | Base64 image | Alt text, quality, objects, colors, text | Admin media |
| `generateSEOContent` | Type, title, keywords | Meta title, description, content, schema | SEO pages, Worker SEO cron |
| `generateCategoryDescription` | Category name, products | SEO content for category pages | SEO module |
| `suggestRelatedProducts` | Product name, specs, inventory | 4 related product names | Product detail page |

### Worker SEO Cron

The `seo-generation` BullMQ queue runs daily via worker. It:
1. Queries top 20 products by viewCount
2. Generates SEO metadata via `ai.generateSEOContent()`
3. Upserts into `seo_metadata` table
4. Reports success/error counts

---

## 6. Database (PostgreSQL + Drizzle ORM)

**38 tables** across 16 schema files in `packages/database/src/schema/`.

| Schema File | Tables |
|-------------|--------|
| `enums.ts` | role, condition, order_status, payment_status |
| `users.ts` | users, profiles, sessions, activity_logs |
| `addresses.ts` | addresses |
| `categories.ts` | categories, category_attributes |
| `brands.ts` | brands |
| `products.ts` | products, product_categories, product_images, product_specs, product_variants |
| `inventory.ts` | warehouses, stock, stock_history, stock_transfers, stock_transfer_items, inventory_logs |
| `orders.ts` | orders, order_items, payments, shipments, returns |
| `cart.ts` | cart_items, wishlist_items |
| `reviews.ts` | reviews |
| `marketing.ts` | coupons, coupon_products, combo_offers, combo_offer_items |
| `blog.ts` | blog_posts, blog_post_products, blog_tags, blog_post_tags |
| `seo.ts` | seo_metadata, redirects |
| `notifications.ts` | notifications |
| `bulk-sales.ts` | bulk_requests, bulk_request_items |
| `analytics.ts` | analytics_events, page_views, search_logs |
| `relations.ts` | Drizzle relations for all tables |

**Plus CRM (planned):** 10 additional tables (expense_categories, expenses, expense_budgets, partners, partner_addresses, partner_transactions, partner_payouts, partner_deals, communication_log)

---

## 7. Deployment (Railway)

All apps deploy to Railway as separate services in a single project, sharing Postgres and Redis.

| Service | Deploy Method | Domain |
|---------|--------------|--------|
| `web` | Dockerfile.web or `railway up` | `tradehubuae.com` |
| `admin` | Dockerfile.admin | `admin.tradehubuae.com` + `crm.tradehubuae.com` |
| `api` | Dockerfile.api | `api.tradehubuae.com` |
| `worker` | Dockerfile.worker | No domain (background process) |
| `chat` | New service (planned) | `chat.tradehubuae.com` |

All Dockerfiles in `docker/` directory. Docker Compose for local dev in `docker/docker-compose.yml`.

---

## 8. Monorepo Commands

```bash
pnpm dev              # Start all apps (web:3000, admin:3001, api:4000, worker)
pnpm build            # Build all apps and packages
pnpm lint             # Lint all workspaces
pnpm typecheck        # TypeScript check all workspaces
pnpm test             # Run all tests
pnpm clean            # Clean all node_modules and dist

# Database
pnpm db:generate      # Generate Drizzle schema types
pnpm db:push          # Push schema to database
pnpm db:migrate       # Create and run migration
pnpm db:seed          # Seed data
pnpm db:studio        # Drizzle Studio GUI

# Individual apps
pnpm --filter @tradehubuae/web dev
pnpm --filter @tradehubuae/admin dev
pnpm --filter @tradehubuae/api dev
pnpm --filter @tradehubuae/worker dev
```

---

## 9. Documentation Index

| File | Covers |
|------|--------|
| `docs/web-app.md` | Customer storefront (`tradehubuae.com`) |
| `docs/admin-app.md` | Admin dashboard (`admin.tradehubuae.com`) |
| `docs/crm-app.md` | CRM module (`crm.tradehubuae.com` -- planned) |
| `docs/chat-pwa-app.md` | Chat PWA (`chat.tradehubuae.com` -- planned) |
| `docs/roadmap.md` | Issues, bugs, priorities across all apps |
| `docs/frontend-endpoints.md` | Web frontend routes audit |
| `docs/dashboard-endpoints.md` | Admin dashboard routes audit |
| `docs/backend-endpoints.md` | API endpoint audit |
| `ARCHITECTURE.md` | Monorepo architecture |
| `PROJECT.md` | Detailed project status tracking |

---

## 10. Implementation Status Summary

| Area | Completion | Notes |
|------|-----------|-------|
| **Shared packages** | 12/12 (100%) | All built and exported |
| **API modules** | 11/17 (65%) | 6 modules are empty stubs |
| **Admin pages** | 45/47 (96%) | Reviews missing, AI page not built |
| **Web storefront** | 19/19 (100%) | All pages built (all on mock data) |
| **CRM module** | 0% | Planned -- 21 days |
| **Chat PWA** | 0% | Planned -- 5 weeks |
| **Worker** | 1/6 queues (17%) | SEO cron done, rest are stubs |
| **Auth** | 0% | No login, no JWT anywhere |
| **CI/CD** | 0% | Not configured |
