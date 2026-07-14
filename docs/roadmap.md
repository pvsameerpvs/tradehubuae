# TradeHub UAE — Endpoint & Architecture Roadmap

Cross-cutting issues grouped by priority.

---

## 🔴 P0 — Blocks Deployment (fix first)

| # | Issue | Files Affected | Fix |
|---|-------|---------------|-----|
| 1 | **Web API base URL missing `/v1`** | `apps/web/src/lib/api.ts:1` | Change `http://localhost:4000/api` → `http://localhost:4000/api/v1` |
| 2 | **Product route conflict** | `apps/api/src/modules/products/products.controller.ts:26-32` | `findBySlug` and `findById` both match `GET /:param`. Either merge into one handler or use distinct paths |

## 🟠 P1 — Admin Pages Broken at Runtime

| # | Issue | Admin Page | Backend Needed |
|---|-------|-----------|----------------|
| 3 | `GET /customers` + `GET /customers/:id` | `/customers`, `/customers/[id]` | Build Customers controller (module exists empty) |
| 4 | `GET /users`, `POST /users`, `PUT /users/:id` | `/users`, `/users/new`, `/users/[id]`, `/users/[id]/edit` | Build Users controller (module exists empty) |
| 5 | `GET /blog`, `POST /blog`, `PUT /blog/:id` | `/blog`, `/blog/new`, `/blog/[id]` | Create Blog module from scratch |
| 6 | `GET /bulk-sales`, `GET /bulk-sales/:id`, `PUT /bulk-sales/:id` | `/bulk-sales`, `/bulk-sales/[id]` | Create Bulk Sales module from scratch |
| 7 | `GET /media` | `/media` | Add `GET /media` to MediaController (only POST exists) |
| 8 | `POST /ai/auto-fill` | `/products/new` (AI button) | Add `auto-fill` route or change frontend to call `POST /ai/generate-product` |

## 🟡 P2 — Authentication Gap

| # | Issue | Impact |
|---|-------|--------|
| 9 | **No login page in admin** | Admin is completely open — no auth guard, no redirect |
| 10 | **No JWT token in requests** | All admin API calls will 403 because `@Roles()` guards reject unauthenticated requests |
| 11 | **Web auth page is static** | `/auth` has login/register UI but never calls the API |
| 12 | **No auth state management** | No token storage, no `AuthContext`, no `useUser()` hook |
| 13 | **No protected routes in web** | No middleware checking auth before rendering pages |

## 🟢 P3 — Static Data → API Migration

| # | Web Page | Current Data | Target API |
|---|----------|-------------|------------|
| 14 | `/` (home) | Static arrays in `data/` | `GET /products`, `GET /categories`, `GET /combo-offers/active` |
| 15 | `/products/[slug]` | `data/products.ts` | `GET /products/:slug` |
| 16 | `/categories`, `/categories/[slug]` | `data/categories.ts` | `GET /categories`, `GET /categories/:slug` (needs public slug endpoint) |
| 17 | `/brands` | `data/brands.ts` | `GET /brands` |
| 18 | `/orders`, `/dashboard/orders` | `data/orders.ts` | `GET /orders/my-orders` (needs auth) |
| 19 | `/search` | `data/products.ts` filter | `GET /products/search?q=` |
| 20 | `/wishlist` | `data/products.ts` filter | Needs backend wishlist endpoints |
| 21 | `/blog` | `data/blog.ts` | `GET /blog` (needs backend first) |

## 🔵 P4 — Missing Delete UIs

| # | Entity | Backend DELETE | Admin UI |
|---|--------|---------------|----------|
| 22 | Products | `DELETE /products/:id` | ❌ Add delete button + confirm dialog |
| 23 | Categories | `DELETE /categories/:id` | ❌ |
| 24 | Brands | `DELETE /brands/:id` | ❌ |
| 25 | Combo Offers | `DELETE /combo-offers/:id` | ❌ |
| 26 | SEO | `DELETE /seo/:id` | ❌ |

## 🟣 P5 — Missing Pages / Broken Links

| # | Route | Where It's Linked | Action |
|---|-------|-------------------|--------|
| 27 | `/brands/[slug]` | DiscoveryGrid (6 brands), Header, Footer | Create brand detail page or change links to `/brands` |
| 28 | `/blog/[slug]` | Blog listing expects detail | Create blog detail page |
| 29 | `/reviews` + `/reviews/[id]` | AGENTS.md sidebar audit | Create admin review pages (backend also empty) |
| 30 | `/settings/email` | Page exists but not linked from `/settings` | Add to settings landing card list |
| 31 | `/settings/security` | Page exists but not linked from `/settings` | Add to settings landing card list |
| 32 | `#` placeholders | `checkout/page.tsx:494,501` | Replace with real links or remove |

## ⚪ P6 — Admin Pages on Hardcoded Data

| # | Page | Data | Note |
|---|------|------|------|
| 33 | `/analytics` | All 6 chart sections hardcoded | API exists but not connected |
| 34 | `/dashboard/chats` | localStorage mock | Needs WebSocket gateway |
| 35 | `/ai` | Generate button does nothing | Needs LLM API provider |
| 36 | `/customers`, `/users`, `/media`, `/blog`, `/bulk-sales` | Hardcoded arrays | Connected to non-existent APIs |

## 🟤 P7 — Empty Backend Modules (no controllers)

| # | Module | DB Schema | Priority |
|---|--------|-----------|----------|
| 37 | `users` | ✅ Users table | 🔴 Needed by admin |
| 38 | `customers` | ❌ No table | 🟠 Needed by admin |
| 39 | `reviews` | ✅ Reviews table | 🟢 Low (admin pages also missing) |
| 40 | `coupons` | ✅ Coupons + coupon_products | 🟢 Low |
| 41 | `notifications` | ✅ Notifications table | 🟢 Low |
| 42 | `reports` | ❌ No table | 🟢 Low |

## ⚪ P8 — Tech Debt / Validation

| # | Issue | Details |
|---|-------|---------|
| 43 | **6 controllers lack DTOs** | Orders, Inventory, Media, SEO, Analytics, AI use inline types or `any` — `ValidationPipe` has no effect |
| 44 | **Orders uses `any`** | `OrdersController.create(@Body() dto: any)` — zero validation on order creation |
| 45 | **`slug` not in Create DTOs** | Products/categories/brands/combo-offers have `notNull().unique()` slugs in schema but no slug field in create DTOs |
| 46 | **`categoryId` DTO mismatch** | `CreateProductDto.categoryId` has no column on `products` table (uses join table) |
| 47 | **WebSocket not implemented** | `NEXT_PUBLIC_WS_URL` env var set but no gateway on backend, no client code |

---

## Summary

| Priority | Issues | Category |
|----------|--------|----------|
| 🔴 P0 | 2 | Blocks all API communication |
| 🟠 P1 | 6 | Admin pages error at runtime |
| 🟡 P2 | 5 | No auth anywhere |
| 🟢 P3 | 8 | Static → API migration |
| 🔵 P4 | 5 | Missing delete UIs |
| 🟣 P5 | 6 | Missing pages/broken links |
| ⚪ P6 | 5 | Hardcoded admin data |
| 🟤 P7 | 6 | Empty backend modules |
| ⚪ P8 | 5 | Validation/tech debt |

**Total: 48 issues**
