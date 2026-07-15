# TradeHub UAE — Project Overview

**Enterprise Ecommerce Platform** for IT Equipment in the United Arab Emirates.

---

## Monorepo Stack

| Category | Technology |
|----------|-----------|
| **Monorepo** | Turborepo v2.3 + pnpm 9.15.4 |
| **Frontend (Customer)** | Next.js 15, React 19, Tailwind CSS 3.4, shadcn/ui |
| **Frontend (Admin)** | Next.js 15, React 19, TanStack Query, React Table, Recharts, Zustand, React Hook Form + Zod |
| **Backend API** | NestJS 10, Passport (JWT + Google OAuth), Helmet, Throttler |
| **Database** | PostgreSQL 16 via Drizzle ORM |
| **Queue / Workers** | BullMQ + Redis 7 (queues defined, handler stubs) |
| **Auth** | JWT + Google OAuth (NextAuth v5 for web) |
| **AI** | Google Gemini Pro + Gemini Pro Vision |
| **File Storage** | Cloudflare R2 (S3-compatible) with sharp image optimization |
| **Email** | [Resend](https://resend.com/) |
| **Payments** | COD (v1), Stripe / Tabby / Tamara (future) |
| **Search** | PostgreSQL full-text search |
| **CI/CD** | Not yet configured (planned: GitHub Actions → Railway) |
| **Linting** | ESLint + Prettier + Husky + commitlint + lint-staged |

---

## Workspace Structure

```
tradehubuae/
├── apps/
│   ├── web/          # Customer-facing Next.js app (port 3000)
│   ├── admin/        # Admin dashboard + CRM (port 3001, subdomain routed)
│   ├── api/          # NestJS REST API (port 4000)
│   ├── worker/       # BullMQ background job processors
│   └── chat/         # ⬜ Chat PWA (planned — standalone app, port 3003)
├── packages/
│   ├── ui/           # Shared shadcn/ui components (@tradehubuae/ui)
│   ├── database/     # Drizzle schema + client (@tradehubuae/database)
│   ├── auth/         # NextAuth v5 helpers (@tradehubuae/auth)
│   ├── config/       # Env vars, constants, permissions, Tailwind config (@tradehubuae/config)
│   ├── types/        # Shared TypeScript types (@tradehubuae/types)
│   ├── validation/   # Zod schemas for all entities (@tradehubuae/validation)
│   ├── ai/           # Gemini AI service (@tradehubuae/ai)
│   ├── chat/         # Chat store (@tradehubuae/chat)
│   ├── storage/      # Cloudflare R2 / S3 storage (@tradehubuae/storage)
│   ├── seo/          # SEO utilities (metadata, schemas) (@tradehubuae/seo)
│   ├── utils/        # Shared utility functions (@tradehubuae/utils)
│   └── logger/       # Structured logging service (@tradehubuae/logger)
├── docker/
│   ├── docker-compose.yml
│   ├── Dockerfile.api
│   ├── Dockerfile.web
│   ├── Dockerfile.admin
│   └── Dockerfile.worker
├── .github/workflows/   # Empty — CI/CD not yet configured
└── scripts/             # Utility scripts
```

---

## Implementation Status

### Packages (11/11 — 100% complete)

| Package | Status | Key Exports |
|---------|--------|-------------|
| `@tradehubuae/ui` | ✅ | Button, Card, Badge, Input, Dialog, Accordion, Tabs, Select, Avatar, DropdownMenu, etc. |
| `@tradehubuae/database` | ✅ | 38 tables across 16 schema files + Drizzle relations + client |
| `@tradehubuae/auth` | ✅ | NextAuth config, role/permission helpers |
| `@tradehubuae/config` | ✅ | Env vars (42), Role enum, Permission enum, ROLE_PERMISSIONS, business constants, Tailwind config |
| `@tradehubuae/types` | ✅ | UUID, Slug, Email, URL, Price, PaginatedResponse, etc. |
| `@tradehubuae/validation` | ✅ | Zod schemas for Product, Order, Address, Review, Auth, Pagination, Search |
| `@tradehubuae/ai` | ✅ | Gemini Pro + Pro Vision, product/SEO/image generation |
| `@tradehubuae/storage` | ✅ | S3 upload/delete/presigned-url with sharp WebP conversion |
| `@tradehubuae/seo` | ✅ | Metadata generation, JSON-LD schemas (Product, Organization, Breadcrumb, FAQ, Article) |
| `@tradehubuae/utils` | ✅ | cn(), slugify, formatPrice, generateSKU, generateOrderNumber, debounce, etc. |
| `@tradehubuae/logger` | ✅ | Structured logger with levels, context, JSON output |

### API Modules (11/17 — 65% complete)

| Module | Status | Endpoints |
|--------|--------|-----------|
| **Auth** | ✅ Full | `POST /auth/login`, `POST /auth/register`, `GET /auth/me`, `POST /auth/google`, `POST /auth/refresh` |
| **Products** | ✅ Full | CRUD + search + slug lookup + paginated list with filters |
| **Categories** | ✅ Full | CRUD + tree view + parent/child hierarchy |
| **Brands** | ✅ Full | CRUD + product count |
| **Combo Offers** | ✅ Full | CRUD + active-only (stock-aware) filtering |
| **Orders** | ✅ Full | CRUD + status updates + tracking + per-user orders |
| **Inventory** | ✅ Full | Stock management + warehouse CRUD + transfers |
| **Media** | ✅ Full | `POST /media/upload` with multer + R2 storage |
| **AI** | ✅ Full | `POST /ai/generate-product`, `POST /ai/analyze-image`, `POST /ai/generate-seo` |
| **SEO** | ✅ Full | CRUD + generate + stats |
| **Analytics** | ✅ Full | Overview, top products, search terms, devices, SEO stats, weekly trend |
| **Users** | 🔄 Stub | Empty module |
| **Customers** | 🔄 Stub | Empty module |
| **Reviews** | 🔄 Stub | Empty module |
| **Coupons** | 🔄 Stub | Empty module |
| **Notifications** | 🔄 Stub | Empty module |
| **Reports** | 🔄 Stub | Empty module |

### Admin Dashboard (17/18 sidebar pages — 94% complete)

| Page | Status | Notes |
|------|--------|-------|
| **Dashboard** | ✅ | Stats cards, recent orders, low stock alerts (hardcoded data) |
| **Live Chat** | ✅ | Chat interface |
| **Products** | ✅ | List + Create + Edit forms with image upload, brand/category selectors, SEO fields |
| **Categories** | ✅ | List + Create + Edit forms with image upload, parent selector, sort order |
| **Brands** | ✅ | List + Create + Edit forms with logo upload, website |
| **Combo Offers** | ✅ | List + Create + Edit forms with image upload, product items, discount config, date range |
| **AI** | ✅ | UI for product/SEO generation (not wired to API) |
| **Users** | ✅ | User management page |
| **Settings** | ✅ | Settings (8 sub-pages: general, payments, shipping, email, security, appearance, integrations) |
| **Customers** | ✅ | Customers list + detail pages |
| **Orders** | ⬜ Placeholder | "Coming soon" text |
| **Inventory** | ⬜ Placeholder | Description cards only |
| **Bulk Sales** | ✅ | List + detail with approve/quote/reject |
| **Blog** | ✅ | List + Create + Edit with BlogForm |
| **Media** | ✅ | Gallery page |
| **SEO** | ✅ | Landing + Meta + Sitemap + Redirects + Reports pages |
| **Analytics** | ✅ | Dashboard with 6 chart sections, wired to real API (returns empty until tracking middleware is active) |
| **Reviews** | ❌ Missing | No page files exist |
| **Coupons** | ❌ Missing | Not in sidebar nav scope |
| **Permissions** | ❌ Missing | Not in sidebar nav scope |
| **Roles** | ❌ Missing | Not in sidebar nav scope |

### Storefront (19/19 pages — 100% complete)

All customer-facing pages are implemented: Home, Product Detail (with gallery/specs/bulk tiers/combo offers), Category listing/detail, Search, Cart, Checkout (3-step), Orders, Account, Wishlist, Auth (login/register), Brands, Blog, Compare, Bulk Sales, Combo Offers, Track Order, About, Contact.

**Note**: All pages currently use hardcoded mock data from `apps/web/src/data/`. API integration is planned.

### Worker (6 queues defined)

| Queue | Handler | Status |
|-------|---------|--------|
| `ai-generation` | Gemini content generation | 🔄 Stub (console.log) |
| `image-processing` | Image resize/optimization | 🔄 Stub (console.log) |
| `email-sending` | Transactional emails | 🔄 Stub (console.log) |
| `invoice-generation` | PDF invoice generation | 🔄 Stub (console.log) |
| `seo-generation` | Daily SEO via Gemini | ✅ Full implementation (top 20 products, DB upsert) |
| `analytics-processing` | — | ❌ Not yet defined |

---

## Database (PostgreSQL + Drizzle ORM)

**38 tables** across 16 schema files (defined in `packages/database/src/schema/`):

| File | Tables |
|------|--------|
| `enums.ts` | role, condition, order_status, payment_status (PostgreSQL enums via pgEnum) |
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

### Drizzle commands

```
pnpm db:generate    # Generate Drizzle schema types
pnpm db:push        # Push schema to database
pnpm db:migrate     # Create and run migration
pnpm db:seed        # Seed data
pnpm db:studio      # Drizzle Studio GUI
pnpm db:drop        # Drop database
```

---

## Admin Dashboard — Manual-First with AI Optional

The admin forms are **manual by default**. AI is a helper for specific tasks, never automatic.

### What's Computerized (Auto-Generated)

| ID | Generated By | Notes |
|----|-------------|-------|
| **Product ID** | Database (UUID v4) | Auto-generated by PostgreSQL |
| **SKU** | `@tradehubuae/utils` | Auto-derived from category + brand + timestamp |
| **Order Number** | `@tradehubuae/utils` | Auto-generated unique order number |
| **Slug** | slugify | Auto-derived from name |

### Current Admin Forms

All forms use **image upload** (multipart → API → R2 via sharp), never URL inputs:

| Form | Fields | Image Support |
|------|--------|---------------|
| **Product** | Name, SKU, Barcode, Description, Pricing (price/compareAt/cost), Stock, Condition, Category, Brand, SEO fields | Multiple images (primary + sort order) |
| **Category** | Name, Description, Parent, Sort Order, Active | Single image upload |
| **Brand** | Name, Description, Website, Sort Order, Active | Logo upload |
| **Combo Offer** | Name, Description, Discount Type/Value, Date Range, Active + dynamic product items | Single image upload |

### Planned: AI Assist for Products

AI assist will generate: long descriptions, SEO content, and FAQ from images + single-line spec. Price, stock, condition, category, brand stay manual.

---

## Storage (Cloudflare R2)

The `@tradehubuae/storage` package uses the AWS S3 SDK with `forcePathStyle` for Cloudflare R2:

- `upload()` — Upload with automatic WebP conversion via `sharp` (configurable quality/maxWidth)
- `delete()` — Remove objects
- `getSignedUrl()` — Generate pre-signed URLs
- `uploadProductImage()` — Stores under `products/{productId}/`, max 1200px, 80 quality
- `uploadBlogImage()` — Stores under `blog/{postId}/`, max 1920px, 85 quality
- `uploadDocument()` — Stores under `invoices/` or `documents/`, no conversion

---

## API Architecture

### Common Infrastructure (`apps/api/src/common/`)

| Layer | Files | Purpose |
|-------|-------|---------|
| **Decorators** | `public.decorator.ts`, `roles.decorator.ts`, `current-user.decorator.ts` | Route metadata |
| **Guards** | `jwt-auth.guard.ts`, `roles.guard.ts` | Auth + role enforcement |
| **Database** | `drizzle.module.ts`, `drizzle.service.ts` | Drizzle client provider |

### API Endpoints Summary

| Method | Endpoint | Module | Auth |
|--------|----------|--------|------|
| `POST` | `/api/v1/auth/login` | Auth | Public |
| `POST` | `/api/v1/auth/register` | Auth | Public |
| `GET` | `/api/v1/auth/me` | Auth | JWT |
| `GET` | `/api/v1/products` | Products | Public |
| `GET` | `/api/v1/products/search` | Products | Public |
| `GET` | `/api/v1/products/:slug` | Products | Public |
| `POST` | `/api/v1/products` | Products | Admin |
| `PUT` | `/api/v1/products/:id` | Products | Admin |
| `DELETE` | `/api/v1/products/:id` | Products | Admin |
| `GET` | `/api/v1/categories` | Categories | Public |
| `GET` | `/api/v1/categories/tree` | Categories | Public |
| `POST` | `/api/v1/categories` | Categories | Admin |
| `PUT` | `/api/v1/categories/:id` | Categories | Admin |
| `GET` | `/api/v1/brands` | Brands | Public |
| `POST` | `/api/v1/brands` | Brands | Admin |
| `GET` | `/api/v1/combo-offers` | Combo Offers | Public |
| `GET` | `/api/v1/combo-offers/active` | Combo Offers | Public |
| `POST` | `/api/v1/combo-offers` | Combo Offers | Admin |
| `GET` | `/api/v1/orders` | Orders | Admin |
| `POST` | `/api/v1/orders` | Orders | JWT |
| `GET` | `/api/v1/inventory` | Inventory | Admin |
| `POST` | `/api/v1/media/upload` | Media | Admin |
| `POST` | `/api/v1/ai/generate-product` | AI | Admin |

---

## Local Development

```bash
# Start infrastructure
docker compose -f docker/docker-compose.yml up postgres redis -d

# Install & setup
pnpm install
cp .env.example .env
pnpm db:generate
pnpm db:push
pnpm db:seed

# Start all apps
pnpm dev

# Individual apps
pnpm --filter @tradehubuae/web dev      # :3000
pnpm --filter @tradehubuae/admin dev    # :3001
pnpm --filter @tradehubuae/api dev      # :4000
pnpm --filter @tradehubuae/worker dev   # BullMQ worker
```

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `apps/web/` | Customer Next.js app (19 pages) |
| `apps/admin/` | Admin dashboard (15 pages) |
| `apps/admin/src/app/products/product-form.tsx` | Product form with image upload |
| `apps/admin/src/components/ImageUpload.tsx` | Reusable image upload component |
| `apps/admin/src/lib/api.ts` | API client with upload support |
| `apps/api/src/modules/` | 17 NestJS modules (9 implemented) |
| `apps/api/src/modules/media/media.controller.ts` | Image upload endpoint |
| `apps/api/src/modules/combo-offers/combo-offers.service.ts` | Stock-aware offer filtering |
| `apps/worker/src/main.ts` | BullMQ workers (stubs) |
| `packages/database/src/schema/` | 16 Drizzle schema files (38 tables) |
| `packages/storage/src/index.ts` | Cloudflare R2 storage service |
| `packages/ai/src/index.ts` | Gemini AI service |
| `packages/config/src/env.ts` | Environment variables (42 vars) |
| `packages/config/src/constants.ts` | Roles, permissions, business constants |
| `packages/validation/src/index.ts` | Zod validation schemas |
| `packages/seo/src/index.ts` | SEO metadata + JSON-LD generators |
| `docker/docker-compose.yml` | Local infrastructure (Postgres + Redis + apps) |

---

## Planned Work

### Short-term
- [ ] Wire AI assist buttons in product form to actual API endpoints
- [ ] Implement empty API modules (Users, Customers, Reviews, Coupons, SEO, Analytics, Notifications, Reports)
- [ ] Build admin pages: Orders, Inventory, Blog, Coupons, Reviews, Media, SEO, Analytics
- [ ] Replace storefront mock data with API calls
- [ ] Configure CI/CD (GitHub Actions → Railway)

### Medium-term
- [ ] **CRM module** (`crm.tradehubuae.com`) — finance & expense tracking, partners, deals pipeline, enhanced customer CRM — inside `apps/admin` with subdomain middleware
- [ ] **Chat PWA** (`chat.tradehubuae.com`) — standalone `apps/chat` with WebSocket, service worker, push notifications, offline support
- [ ] Stripe / Tabby / Tamara payment integration
- [ ] Multi-warehouse inventory management
- [ ] n8n workflow automation
- [ ] Full-text search with rankings
