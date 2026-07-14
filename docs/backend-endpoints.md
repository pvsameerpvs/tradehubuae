# Backend API Endpoints (apps/api)

Base URL: `http://localhost:4000/api/v1`

Framework: NestJS (Express underhood)

Global Prefix: `/api/v1`

Auth: JWT (Passport) + Role Guards

---

## Auth Module — `/auth`

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| POST | `/auth/register` | Public | Register a new user |
| POST | `/auth/login` | Public | Login, returns JWT |
| GET | `/auth/me` | Authenticated | Get current user profile |

## Products Module — `/products`

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/products` | Public | List products (paginated, filterable) |
| GET | `/products/search` | Public | Full-text search products |
| GET | `/products/:slug` | Public | Get product by slug |
| GET | `/products/:id` | ADMIN / SUPER_ADMIN / CONTENT_MANAGER | Get product by ID |
| POST | `/products` | ADMIN / SUPER_ADMIN / CONTENT_MANAGER | Create product |
| PUT | `/products/:id` | ADMIN / SUPER_ADMIN / CONTENT_MANAGER | Update product |
| DELETE | `/products/:id` | ADMIN / SUPER_ADMIN | Soft-delete product |

## Categories Module — `/categories`

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/categories` | Public | List categories (paginated, filterable) |
| GET | `/categories/tree` | Public | Get category hierarchy tree |
| GET | `/categories/:id` | Public | Get category by ID |
| POST | `/categories` | ADMIN / SUPER_ADMIN / CONTENT_MANAGER | Create category |
| PUT | `/categories/:id` | ADMIN / SUPER_ADMIN / CONTENT_MANAGER | Update category |
| DELETE | `/categories/:id` | ADMIN / SUPER_ADMIN | Delete category |

## Brands Module — `/brands`

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/brands` | Public | List brands (paginated, filterable) |
| GET | `/brands/:id` | Public | Get brand by ID |
| POST | `/brands` | ADMIN / SUPER_ADMIN / CONTENT_MANAGER | Create brand |
| PUT | `/brands/:id` | ADMIN / SUPER_ADMIN / CONTENT_MANAGER | Update brand |
| DELETE | `/brands/:id` | ADMIN / SUPER_ADMIN | Delete brand |

## Orders Module — `/orders`

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/orders` | ADMIN / SUPER_ADMIN / SALES_MANAGER | List orders (paginated, filterable) |
| GET | `/orders/my-orders` | Authenticated (user) | Get current user's orders |
| GET | `/orders/track/:orderNumber` | Public | Track order by order number |
| GET | `/orders/:id` | ADMIN / SUPER_ADMIN / SALES_MANAGER | Get order by ID |
| POST | `/orders` | Authenticated (optional user) | Create order |
| PUT | `/orders/:id/status` | ADMIN / SUPER_ADMIN / SALES_MANAGER | Update order status |

## Inventory Module — `/inventory`

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/inventory` | ADMIN / SUPER_ADMIN / INVENTORY_MANAGER | List stock (filterable by warehouseId, lowStock) |
| GET | `/inventory/low-stock` | ADMIN / SUPER_ADMIN / INVENTORY_MANAGER | Get low stock items (threshold filter) |
| GET | `/inventory/product/:productId` | ADMIN / SUPER_ADMIN / INVENTORY_MANAGER | Get stock for a specific product |
| POST | `/inventory/adjust/:id` | ADMIN / SUPER_ADMIN / INVENTORY_MANAGER | Adjust stock quantity |
| POST | `/inventory/transfer` | ADMIN / SUPER_ADMIN | Transfer stock between warehouses |

## Media Module — `/media`

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| POST | `/media/upload` | ADMIN / SUPER_ADMIN / CONTENT_MANAGER | Upload file (10MB max, jpg/jpeg/png/webp/gif) |

## Combo Offers Module — `/combo-offers`

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/combo-offers` | Public | List combo offers (paginated, filterable) |
| GET | `/combo-offers/active` | Public | List active combo offers |
| GET | `/combo-offers/:id` | Public | Get combo offer by ID |
| POST | `/combo-offers` | ADMIN / SUPER_ADMIN / SALES_MANAGER | Create combo offer |
| PUT | `/combo-offers/:id` | ADMIN / SUPER_ADMIN / SALES_MANAGER | Update combo offer |
| DELETE | `/combo-offers/:id` | ADMIN / SUPER_ADMIN | Delete combo offer |

## SEO Module — `/seo`

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/seo` | ADMIN / SUPER_ADMIN / SEO_MANAGER | List SEO entries (filter by entityType) |
| GET | `/seo/:entityType/:entityId` | ADMIN / SUPER_ADMIN / SEO_MANAGER | Get SEO by entity |
| POST | `/seo` | ADMIN / SUPER_ADMIN / SEO_MANAGER | Upsert SEO entry |
| DELETE | `/seo/:id` | ADMIN / SUPER_ADMIN / SEO_MANAGER | Delete SEO entry |
| POST | `/seo/generate` | ADMIN / SUPER_ADMIN | Trigger SEO generation |
| GET | `/seo/stats` | ADMIN / SUPER_ADMIN / SEO_MANAGER | Get SEO statistics |

## Analytics Module — `/analytics`

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/analytics/overview` | ADMIN / SUPER_ADMIN / SEO_MANAGER | Overview stats (range: 7d/30d/90d) |
| GET | `/analytics/top-products` | ADMIN / SUPER_ADMIN / SEO_MANAGER | Top performing products |
| GET | `/analytics/search-terms` | ADMIN / SUPER_ADMIN / SEO_MANAGER | Popular search terms |
| GET | `/analytics/devices` | ADMIN / SUPER_ADMIN / SEO_MANAGER | Device breakdown |
| GET | `/analytics/seo-stats` | ADMIN / SUPER_ADMIN / SEO_MANAGER | SEO performance stats |
| GET | `/analytics/weekly-trend` | ADMIN / SUPER_ADMIN / SEO_MANAGER | Weekly trend data |

## AI Module — `/ai`

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| POST | `/ai/generate-product` | ADMIN / SUPER_ADMIN / CONTENT_MANAGER | AI-generate product content |
| POST | `/ai/analyze-image` | ADMIN / SUPER_ADMIN / CONTENT_MANAGER | AI-analyze image |
| POST | `/ai/generate-seo` | ADMIN / SUPER_ADMIN / SEO_MANAGER | AI-generate SEO metadata |

## Empty Module Scaffolds (no endpoints yet)

| Module | Status |
|--------|--------|
| Customers | Empty module, no controller |
| Notifications | Empty module, no controller |
| Coupons | Empty module, no controller |
| Reports | Empty module, no controller |
| Reviews | Empty module, no controller |
| Users | Empty module, no controller |

## Role Reference

| Role | Code |
|------|------|
| Super Admin | `SUPER_ADMIN` |
| Admin | `ADMIN` |
| Inventory Manager | `INVENTORY_MANAGER` |
| Sales Manager | `SALES_MANAGER` |
| Content Manager | `CONTENT_MANAGER` |
| SEO Manager | `SEO_MANAGER` |

---

**Total: 54 endpoint definitions across 11 modules** (14 public, 40 role-restricted)

---

## 🔍 Deep Audit: Issues Found

### ❌ CRITICAL: Route Conflict — Product Slug vs ID

**File:** `apps/api/src/modules/products/products.controller.ts`

```typescript
@Public()
@Get(":slug")         // line 26
async findBySlug(...)

@Roles("ADMIN", ...)
@Get(":id")           // line 32 — DEAD CODE
async findById(...)
```

Both map to `GET /api/v1/products/:param`. Since `:slug` is registered first, NestJS **always** routes all requests to `findBySlug`. The `findById` handler is **unreachable** — it can never be called via HTTP.

### ❌ EMPTY MODULE SHELLS (no controllers, no endpoints)

6 out of 17 modules (35%) are empty `@Module({})` with zero controllers:

| Module | DB Schema Exists? | Frontend Calls? | Impact |
|--------|-------------------|-----------------|--------|
| `customers` | ❌ No table | **Yes** — `GET /customers` and `GET /customers/:id` | Admin page will error |
| `users` | ✅ Users table | **Yes** — `GET /users`, `POST /users`, `PUT /users/:id`, `GET /users/:id` | Admin CRUD broken |
| `reviews` | ✅ Reviews table | Not yet | Stub only |
| `coupons` | ✅ Coupons + coupon_products | Not yet | Stub only |
| `notifications` | ✅ Notifications table | Not yet | Stub only |
| `reports` | ❌ No table | Not yet | Stub only |

### ❌ FRONTEND CALLS BACKEND ENDPOINTS THAT DON'T EXIST

| Endpoint Called | Admin Page | Backend Status |
|----------------|-----------|----------------|
| `GET /customers` | Customers list | ❌ No controller |
| `GET /customers/:id` | Customer detail | ❌ No controller |
| `GET /bulk-sales` | Bulk sales list | ❌ No controller/table |
| `GET /bulk-sales/:id` | Bulk sales detail | ❌ No controller/table |
| `PUT /bulk-sales/:id` | Bulk sales detail | ❌ No controller/table |
| `GET /blog` | Blog list | ❌ No module exists |
| `GET /blog/:id` | Blog form (edit) | ❌ No module exists |
| `POST /blog` | Blog form (create) | ❌ No module exists |
| `PUT /blog/:id` | Blog form (update) | ❌ No module exists |
| `GET /media` | Media gallery | ❌ Only `POST /media/upload` exists |
| `GET /users` | Users list | ❌ No controller |
| `GET /users/:id` | User detail / edit | ❌ No controller |
| `POST /users` | Create user | ❌ No controller |
| `PUT /users/:id` | Edit user | ❌ No controller |
| `POST /ai/auto-fill` | Product form (AI) | ❌ Backend has `generate-product`, `analyze-image`, `generate-seo` — not `auto-fill` |

### ❌ EXISTING ENDPOINTS NEVER CALLED BY ANY FRONTEND

| Endpoint | Purpose | Status |
|----------|---------|--------|
| `POST /auth/register` | Register | Auth pages use no API (static) |
| `POST /auth/login` | Login | Auth pages use no API (static) |
| `GET /auth/me` | Current user | Never called |
| `GET /products/search` | Full-text search | Search page uses static data |
| `GET /products/:slug` | Product by slug | Product detail uses static data |
| `GET /categories/tree` | Category tree | Categories use static data |
| `GET /inventory/*` | All inventory endpoints | Inventory page uses `/products` instead |
| `GET /seo/:entityType/:entityId` | SEO by entity | Never called |
| `DELETE /seo/:id` | Delete SEO | Never called |
| `POST /ai/generate-product` | AI product gen | Calls wrong path `/ai/auto-fill` |
| `POST /ai/analyze-image` | AI image analysis | Never called |
| `POST /ai/generate-seo` | AI SEO gen | Admin calls `/seo/generate` instead |
| `DELETE /products/:id` | Delete product | No delete UI in admin |
| `DELETE /categories/:id` | Delete category | No delete UI |
| `DELETE /brands/:id` | Delete brand | No delete UI |
| `DELETE /combo-offers/:id` | Delete combo offer | No delete UI |

### ❌ DTO/VALIDATION ISSUES

| Issue | Details |
|-------|---------|
| **`categoryId` in DTO** | `CreateProductDto.categoryId` has no direct column on `products` table — uses `product_categories` join table |
| **`slug` missing from Create DTOs** | Products, categories, brands, combo-offers have `slug` as `notNull().unique()` in schema but no slug field in Create DTOs — relies on service auto-generation |
| **`inStock` filter** | `QueryProductDto.inStock` has no column — must be computed from `available_stock > 0` |
| **6 controllers lack DTOs** | Orders, Inventory, Media, SEO, Analytics, AI use inline types or `any` — bypasses `ValidationPipe` (`whitelist: true`, `forbidNonWhitelisted: true` has no effect) |
| **Orders uses `any`** | `OrdersController.create(@Body() dto: any)` — no validation at all |

### ❌ NO BLOG MODULE

Despite the admin having full blog CRUD (create, edit, list, delete UI), **no Blog module exists** in the backend at all:
- No `BlogModule`
- No `BlogController` 
- No `BlogService`
- No blog table in database schema

### ❌ NO BULK-SALES MODULE

Same as blog — admin has `/bulk-sales` list and detail pages but **no backend module exists**:
- No `BulkSalesModule`, `BulkSalesController`, or `BulkSalesService`
- No `bulk_sales` table in schema

### ❌ NO WEBSOCKET GATEWAY

| Detail | Value |
|--------|-------|
| Env var | `NEXT_PUBLIC_WS_URL="ws://localhost:4000"` |
| Backend | No WebSocket gateway/adapter configured in NestJS |
| Impact | Live chat has no real-time messaging, no notifications |

### ❌ AUTH API EXIST BUT FRONTEND NEVER CALLS THEM

The `POST /auth/register`, `POST /auth/login`, `GET /auth/me` endpoints work perfectly but:
- Web app `/auth` page never calls them — login/register is static UI
- No frontend code fetches `GET /auth/me` to determine auth state
- No JWT token is ever sent with requests (no Authorization header)
- Admin app has no login page at all — completely open to anyone

### ✅ API BASE URL — FIXED

| Client | Fallback URL | NestJS Prefix | Match? |
|--------|-------------|---------------|--------|
| `apps/web/src/lib/api.ts` | `http://localhost:4000/api/v1` | `/api/v1` | ✅ Fixed |
| `apps/admin/src/lib/api.ts` | `http://localhost:4000/api/v1` | `/api/v1` | ✅ |
| `.env` `NEXT_PUBLIC_API_URL` | `http://localhost:4000` | `/api/v1` | ❌ No path — set to `http://localhost:4000/api/v1` |
