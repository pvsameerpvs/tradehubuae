# Backend API -- `api.tradehubuae.com`

**Architecture & Implementation Guide**

---

## 1. Vision

The **NestJS REST API** at `api.tradehubuae.com` serves as the backend for all TradeHub UAE applications. It handles authentication, business logic, data access, file storage, AI generation, and background job queuing for the customer storefront, admin dashboard, CRM, and chat PWA.

### Subdomain Architecture

| Domain | App | Port | Purpose |
|--------|-----|------|---------|
| `tradehubuae.com` | `apps/web` | 3000 | Customer storefront |
| `admin.tradehubuae.com` | `apps/admin` | 3001 | Admin dashboard |
| `crm.tradehubuae.com` | `apps/admin` (middleware) | 3001 | CRM module |
| `chat.tradehubuae.com` | `apps/chat` | 3003 | Chat PWA |
| **`api.tradehubuae.com`** | **`apps/api`** | **4000** | **NestJS REST API** |

---

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | NestJS 10 (Express underhood) |
| **Language** | TypeScript strict |
| **Database** | PostgreSQL 16 via Drizzle ORM |
| **Auth** | JWT + Passport (Bearer token, Google OAuth) |
| **Validation** | class-validator + class-transformer (DTOs) |
| **Rate Limiting** | @nestjs/throttler (100 req/min) |
| **Storage** | Cloudflare R2 (S3-compatible) + sharp |
| **AI** | @tradehubuae/ai (Vercel AI SDK -- multi-provider) |
| **Queue** | BullMQ + Redis |
| **Security** | Helmet, CORS, cookie-parser |
| **Compression** | compression (gzip/brotli) |

---

## 3. Dependencies

### Internal Packages

| Package | Purpose |
|---------|---------|
| `@tradehubuae/config` | Env vars, role/permission enums, constants |
| `@tradehubuae/database` | Drizzle schema (38 tables) + client |
| `@tradehubuae/types` | Shared types |
| `@tradehubuae/validation` | Zod schemas |
| `@tradehubuae/logger` | Structured logging |
| `@tradehubuae/storage` | S3/R2 file storage + sharp |
| `@tradehubuae/ai` | Vercel AI SDK multi-provider service |

### Key External Dependencies

| Package | Purpose |
|---------|---------|
| `@nestjs/core/common/platform-express` | NestJS framework |
| `@nestjs/jwt` / `passport` / `passport-jwt` | JWT auth |
| `@nestjs/throttler` | Rate limiting |
| `class-validator` / `class-transformer` | DTO validation |
| `helmet` / `compression` / `cookie-parser` | Middleware |
| `bullmq` / `ioredis` | Job queues |
| `sharp` | Image processing |

---

## 4. Folder Structure

```
apps/api/
├── src/
│   ├── main.ts                    # Bootstrap (helmet, CORS, ValidationPipe)
│   ├── app.module.ts              # Root module (imports all feature modules)
│   │
│   ├── common/
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts   # @CurrentUser() param decorator
│   │   │   ├── public.decorator.ts         # @Public() -- skips JWT auth
│   │   │   └── roles.decorator.ts          # @Roles() -- sets required role
│   │   └── guards/
│   │       ├── jwt-auth.guard.ts           # JWT authentication guard
│   │       └── roles.guard.ts              # Role-based access guard
│   │
│   ├── database/
│   │   ├── drizzle.module.ts      # Global Drizzle provider
│   │   └── drizzle.service.ts     # Wraps @tradehubuae/database
│   │
│   └── modules/
│       ├── auth/
│       │   ├── auth.module.ts
│       │   ├── auth.controller.ts     # POST /register, /login, GET /me
│       │   ├── auth.service.ts
│       │   ├── dto/
│       │   │   ├── login.dto.ts       # email, password
│       │   │   └── register.dto.ts    # name, email, password, phone?
│       │   └── strategies/
│       │       └── jwt.strategy.ts    # PassportStrategy (JWT)
│       │
│       ├── products/
│       │   ├── products.module.ts
│       │   ├── products.controller.ts # CRUD + /search + /:slug
│       │   ├── products.service.ts    # Full-text search, pagination, SKU gen
│       │   └── dto/
│       │       ├── create-product.dto.ts
│       │       ├── update-product.dto.ts
│       │       └── query-product.dto.ts
│       │
│       ├── categories/
│       │   ├── categories.module.ts
│       │   ├── categories.controller.ts # CRUD + /tree
│       │   ├── categories.service.ts    # Tree queries, product counts
│       │   └── dto/
│       │       ├── create-category.dto.ts
│       │       ├── update-category.dto.ts
│       │       └── query-category.dto.ts
│       │
│       ├── brands/
│       │   ├── brands.module.ts
│       │   ├── brands.controller.ts  # CRUD
│       │   ├── brands.service.ts     # Slug gen, pagination, soft-delete
│       │   └── dto/
│       │       ├── create-brand.dto.ts
│       │       ├── update-brand.dto.ts
│       │       └── query-brand.dto.ts
│       │
│       ├── orders/
│       │   ├── orders.module.ts
│       │   ├── orders.controller.ts  # CRUD + /my-orders + /track/:number + /:id/status
│       │   ├── orders.service.ts     # Status transitions, ETA, order number gen
│       │   └── orders.service.spec.ts
│       │
│       ├── inventory/
│       │   ├── inventory.module.ts
│       │   ├── inventory.controller.ts # GET /, /low-stock, /product/:id, POST /adjust/:id, /transfer
│       │   └── inventory.service.ts    # Stock CRUD, transfers (transactional)
│       │
│       ├── combo-offers/
│       │   ├── combo-offers.module.ts
│       │   ├── combo-offers.controller.ts # CRUD + /active
│       │   ├── combo-offers.service.ts     # Nested items, stock check
│       │   └── dto/
│       │       ├── create-combo-offer.dto.ts
│       │       ├── update-combo-offer.dto.ts
│       │       └── query-combo-offer.dto.ts
│       │
│       ├── media/
│       │   ├── media.module.ts       # Multer (10MB limit)
│       │   ├── media.controller.ts   # POST /upload
│       │   └── media.service.ts      # Upload to R2, WebP conversion
│       │
│       ├── seo/
│       │   ├── seo.module.ts
│       │   ├── seo.controller.ts     # CRUD + /generate + /stats
│       │   └── seo.service.ts        # Upsert, daily AI generation
│       │
│       ├── analytics/
│       │   ├── analytics.module.ts
│       │   ├── analytics.controller.ts # /overview, /top-products, /search-terms, /devices, /seo-stats, /weekly-trend
│       │   └── analytics.service.ts    # Queries page_views, search_logs, orders
│       │
│       ├── ai/
│       │   ├── ai.module.ts
│       │   ├── ai.controller.ts      # POST /generate-product, /analyze-image, /generate-seo
│       │   └── ai.service.ts         # Delegates to @tradehubuae/ai
│       │
│       └── (stubs)/
│           ├── users.module.ts       # STUB
│           ├── customers.module.ts   # STUB
│           ├── reviews.module.ts     # STUB
│           ├── coupons.module.ts     # STUB
│           ├── notifications.module.ts # STUB
│           └── reports.module.ts     # STUB
│
├── test/
│   └── orders.e2e-spec.ts           # E2E tests for orders
│
├── jest.config.json
├── tsconfig.json
└── package.json
```

---

## 5. Module Details

### 5.1 Auth Module

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | Public | Register user (name, email, password). Returns JWT. |
| POST | `/auth/login` | Public | Login (email, password). Returns JWT. |
| GET | `/auth/me` | JWT | Get current user profile from token. |

**Flow:** Register/login return `{ token, user }`. User object has no password field (stripped by `sanitizeUser()`). JWT payload contains `{ id, email, role }`. Strategy validates user exists and is active on every request.

### 5.2 Products Module

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/products` | Public | Paginated list with filters (q, category, brand, price range, condition, inStock, sort) |
| GET | `/products/search` | Public | Full-text search across name, description, specs |
| GET | `/products/:slug` | Public | Get by slug (URL-friendly name) |
| GET | `/products/:id` | Admin | Get by UUID |
| POST | `/products` | Admin | Create (auto-generates slug, SKU) |
| PUT | `/products/:id` | Admin | Update |
| DELETE | `/products/:id` | Admin | Soft-delete |

**Note:** `:slug` and `:id` both match `GET /:param` -- `findBySlug` is registered first so `findById` is unreachable.

### 5.3 Categories Module

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/categories` | Public | Paginated list with filters |
| GET | `/categories/tree` | Public | Nested parent/child hierarchy |
| GET | `/categories/:id` | Public | By ID |
| POST | `/categories` | Admin | Create (auto-generates slug) |
| PUT | `/categories/:id` | Admin | Update |
| DELETE | `/categories/:id` | Admin | Delete |

### 5.4 Brands Module

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/brands` | Public | Paginated list with filters |
| GET | `/brands/:id` | Public | By ID |
| POST | `/brands` | Admin | Create (auto-generates slug) |
| PUT | `/brands/:id` | Admin | Update |
| DELETE | `/brands/:id` | Admin | Soft-delete |

### 5.5 Orders Module

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/orders` | Admin | Paginated list (filters: status, search, date range) |
| GET | `/orders/my-orders` | JWT | Current user's orders |
| GET | `/orders/track/:orderNumber` | Public | Track by order number |
| GET | `/orders/:id` | Admin | By ID |
| POST | `/orders` | JWT | Create order (auto-generates order number) |
| PUT | `/orders/:id/status` | Admin | Update status (validates transitions) |

### 5.6 Inventory Module

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/inventory` | Admin | Stock list (filterable by warehouseId, lowStock) |
| GET | `/inventory/low-stock` | Admin | Low stock alerts (threshold query param) |
| GET | `/inventory/product/:productId` | Admin | Stock for specific product |
| POST | `/inventory/adjust/:id` | Admin | Adjust stock quantity |
| POST | `/inventory/transfer` | Admin | Transfer between warehouses (transactional) |

### 5.7 Combo Offers Module

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/combo-offers` | Public | Paginated list |
| GET | `/combo-offers/active` | Public | Active offers (stock-aware filtering) |
| GET | `/combo-offers/:id` | Public | By ID |
| POST | `/combo-offers` | Admin | Create with nested items |
| PUT | `/combo-offers/:id` | Admin | Update |
| DELETE | `/combo-offers/:id` | Admin | Delete |

### 5.8 Media Module

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/media/upload` | Admin | Upload image (10MB max, jpg/jpeg/png/webp/gif). Converts to WebP via sharp. Stores in R2. |

### 5.9 SEO Module

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/seo` | Admin | List SEO entries (filter by entityType) |
| GET | `/seo/:entityType/:entityId` | Admin | Get by entity |
| POST | `/seo` | Admin | Upsert SEO entry |
| DELETE | `/seo/:id` | Admin | Delete |
| POST | `/seo/generate` | Admin | Trigger AI generation for top 20 products |
| GET | `/seo/stats` | Admin | SEO statistics (coverage, missing, etc.) |

### 5.10 Analytics Module

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/analytics/overview` | Admin | Total revenue, orders, customers, products |
| GET | `/analytics/top-products` | Admin | Top performing products |
| GET | `/analytics/search-terms` | Admin | Popular search terms |
| GET | `/analytics/devices` | Admin | Device breakdown |
| GET | `/analytics/seo-stats` | Admin | SEO performance stats |
| GET | `/analytics/weekly-trend` | Admin | Weekly revenue/order trend |

### 5.11 AI Module

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/ai/generate-product` | Admin | Generate product content (title, description, specs, FAQ, SEO) |
| POST | `/ai/analyze-image` | Admin | Analyze product image (quality, objects, colors, alt text) |
| POST | `/ai/generate-seo` | Admin | Generate SEO metadata for any entity |

### 5.12 Stub Modules (6 -- Empty)

| Module | Tables Exist? | Frontend Calls? |
|--------|---------------|-----------------|
| Users | Yes | Yes (admin users CRUD) |
| Customers | No | Yes (admin customer list) |
| Reviews | Yes | No |
| Coupons | Yes | No |
| Notifications | Yes | No |
| Reports | No | No |

---

## 6. Bootstrap Configuration

**File:** `src/main.ts`

| Config | Value |
|--------|-------|
| Global prefix | `/api/v1` |
| Port | `API_PORT` env (default 4000) |
| Host | `API_HOST` env (default `0.0.0.0`) |
| CORS | Configurable via `CORS_ORIGIN` env (default `localhost:3000`) |
| Security | Helmet (all defaults), cookie-parser |
| Compression | Gzip/brotli |
| Validation | Global `ValidationPipe` -- whitelist, forbidNonWhitelisted, transform, implicit conversion |
| Throttler | 100 requests per 60 seconds |
| Swagger | Not installed |

---

## 7. Authentication & Authorization

```
Request
  → Authorization: Bearer <JWT>
  → JwtAuthGuard (global)
      → @Public()? → skip
      → Passport JWT Strategy
          → Verify JWT signature (JWT_SECRET)
          → Find user in DB (must exist and be active)
          → Attach { id, email, name, role, isActive } to request.user
  → RolesGuard
      → @Roles() defined? → check request.user.role
      → No @Roles()? → allow any authenticated user
  → Controller handler
```

**Roles (from @tradehubuae/config):** SUPER_ADMIN, ADMIN, INVENTORY_MANAGER, SALES_MANAGER, CONTENT_MANAGER, SEO_MANAGER

**Note:** The guards are NOT applied globally via `APP_GUARD`. Each controller relies on `@Roles()` and `@Public()` decorators directly.

---

## 8. AI Service Integration

The `@tradehubuae/ai` package uses **Vercel AI SDK v4** (`ai` package) with `generateObject()` for structured JSON output.

**Provider support:** Google Gemini (`@ai-sdk/google`), OpenAI (`@ai-sdk/openai`), Anthropic (`@ai-sdk/anthropic`), OpenAI-compatible

**Selection:** `AI_PROVIDER` env var. Falls back gracefully.

**API module delegates:** `ai.controller.ts` calls `ai.service.ts` which calls `@tradehubuae/ai` singleton.

---

## 9. Environment Variables

### Required

| Variable | Default | Used By |
|----------|---------|---------|
| `DATABASE_URL` | -- | Drizzle (Postgres) |
| `JWT_SECRET` | -- | JWT signing |
| `AI_PROVIDER` | -- | AI model selection |
| `AI_API_KEY` | -- | AI provider auth |

### Optional with Defaults

| Variable | Default | Used By |
|----------|---------|---------|
| `API_PORT` | `4000` | HTTP port |
| `API_HOST` | `0.0.0.0` | Bind address |
| `CORS_ORIGIN` | `http://localhost:3000` | CORS allowed origins |
| `JWT_EXPIRES_IN` | `7d` | Token expiry |
| `REDIS_URL` | `redis://localhost:6379` | BullMQ + Redis |
| `AI_MODEL` | provider default | Override model |
| `AI_VISION_MODEL` | provider default | Override vision model |
| `NODE_ENV` | `development` | Environment |

### Payment Providers (Planned)

STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, TABBY_API_KEY, TAMARA_API_KEY

---

## 10. Known Issues

| Issue | Severity | Details |
|-------|----------|---------|
| **Route conflict: slug vs id** | Critical | `GET /products/:slug` and `GET /products/:id` both map to `/:param`. `findBySlug` always wins -- `findById` unreachable |
| **6 empty stub modules** | High | Users, Customers, Reviews, Coupons, Notifications, Reports have `@Module({})` only |
| **6 controllers lack DTOs** | Medium | Orders, Inventory, Media, SEO, Analytics, AI use inline types or `any` -- ValidationPipe bypassed |
| **Orders uses `any`** | Medium | `create(@Body() dto: any)` -- zero validation on order creation |
| **No Swagger docs** | Medium | `@nestjs/swagger` not installed -- no auto-generated API docs |
| **`categoryId` DTO mismatch** | Low | `CreateProductDto.categoryId` has no column on `products` table (uses join table) |
| **Slug not in Create DTOs** | Low | Products, categories, brands, combo-offers have `notNull().unique()` slugs in schema but no slug field in DTOs (relies on auto-generation) |
| **No WebSocket gateway** | Medium | `NEXT_PUBLIC_WS_URL` env set but no gateway configured |
| **Auth guards not global** | Medium | JwtAuthGuard and RolesGuard rely on decorators per controller -- no `APP_GUARD` provider |

---

## 11. Testing

| Type | File | Coverage |
|------|------|----------|
| Unit | `orders.service.spec.ts` | findAll, findById, findByOrderNumber, create, updateStatus |
| E2E | `test/orders.e2e-spec.ts` | Full HTTP tests for all order endpoints (mocked service) |

**Commands:**

```bash
pnpm --filter @tradehubuae/api test        # Unit tests
pnpm --filter @tradehubuae/api test:e2e    # E2E tests
pnpm --filter @tradehubuae/api test:cov    # With coverage
```

---

## 12. API Endpoint Summary

| Module | Public | Authenticated | Admin | Total |
|--------|--------|---------------|-------|-------|
| Auth | 2 | 1 | 0 | 3 |
| Products | 2 | 0 | 3 | 5 |
| Categories | 3 | 0 | 3 | 6 |
| Brands | 2 | 0 | 3 | 5 |
| Orders | 1 | 1 | 4 | 6 |
| Inventory | 0 | 0 | 5 | 5 |
| Combo Offers | 3 | 0 | 3 | 6 |
| Media | 0 | 0 | 1 | 1 |
| SEO | 0 | 0 | 6 | 6 |
| Analytics | 0 | 0 | 6 | 6 |
| AI | 0 | 0 | 3 | 3 |
| **Total** | **13** | **2** | **37** | **52** |
