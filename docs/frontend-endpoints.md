# TradeHub UAE — Frontend API Integration Map

> Generated: 2026-07-16 | Backend: NestJS `/api/v1` | Web: Next.js 15 (port 3000) | Admin: Next.js 15 (port 3001) | Chat: Next.js PWA (port 3003)

---

## 1. Architecture

```
Web (3000) ──Server Actions──► API (4000/api/v1)      ◄── Admin (3001) Client fetch
Chat PWA (3003) ──REST + WS──────► (no backend yet)
```

**Auth:** JWT in localStorage. Admin uses role guards.

---

## 2. COMPLETE API ENDPOINT LIST — 47 Backend Endpoints

### 2.1 Auth — `POST /auth/register` | `POST /auth/login` | `GET /auth/me`
- Web: ✅ login, register, getMe
- `/auth/me` requires JWT (uses `@CurrentUser`)

### 2.2 Products — `@Controller("products")`
| Method | Endpoint | Auth | Web | Admin |
|--------|----------|------|-----|-------|
| GET | `/products` | Public | ✅ | ✅ |
| GET | `/products/search?q=&limit=` | Public | ✅ | — |
| GET | `/products/{slug}` | Public | ✅ | — |
| GET | `/products/{id}` | ADMIN/CONTENT | — | ✅ |
| POST | `/products` | ADMIN/CONTENT | — | ✅ |
| PUT | `/products/{id}` | ADMIN/CONTENT | — | ✅ |
| DELETE | `/products/{id}` | ADMIN/SUPER | — | ❌ No UI |

### 2.3 Categories — `@Controller("categories")`
| Method | Endpoint | Auth | Web | Admin |
|--------|----------|------|-----|-------|
| GET | `/categories` | Public | ✅ | ✅ |
| GET | `/categories/tree` | Public | ✅ | — |
| GET | `/categories/{id}` | Public | ✅ | ✅ |
| POST | `/categories` | ADMIN/CONTENT | — | ✅ |
| PUT | `/categories/{id}` | ADMIN/CONTENT | — | ✅ |
| DELETE | `/categories/{id}` | ADMIN/SUPER | — | ❌ No UI |

### 2.4 Brands — `@Controller("brands")`
| Method | Endpoint | Auth | Web | Admin |
|--------|----------|------|-----|-------|
| GET | `/brands` | Public | ✅ | ✅ |
| GET | `/brands/{id}` | Public | ✅ | ✅ |
| POST | `/brands` | ADMIN/CONTENT | — | ✅ |
| PUT | `/brands/{id}` | ADMIN/CONTENT | — | ✅ |
| DELETE | `/brands/{id}` | ADMIN/SUPER | — | ❌ No UI |

### 2.5 Orders — `@Controller("orders")`
| Method | Endpoint | Auth | Web | Admin |
|--------|----------|------|-----|-------|
| GET | `/orders` | ADMIN/SALES | — | ✅ |
| GET | `/orders/my-orders` | Auth (JWT) | ✅ | — |
| GET | `/orders/track/{orderNumber}` | Public | ✅ | — |
| GET | `/orders/{id}` | ADMIN/SALES | — | ✅ |
| POST | `/orders` | Auth (JWT) | ✅ | — |
| PUT | `/orders/{id}/status` | ADMIN/SALES | ✅ | ✅ |

### 2.6 Inventory — `@Controller("inventory")`
| Method | Endpoint | Auth | Admin |
|--------|----------|------|-------|
| GET | `/inventory` | ADMIN/INVENTORY | ✅ |
| GET | `/inventory/low-stock` | ADMIN/INVENTORY | ❌ No UI |
| GET | `/inventory/product/{productId}` | ADMIN/INVENTORY | ❌ No UI |
| POST | `/inventory/adjust/{id}` | ADMIN/INVENTORY | ❌ No UI |
| POST | `/inventory/transfer` | ADMIN/SUPER | ❌ No UI |

### 2.7 Media — `@Controller("media")`
| Method | Endpoint | Auth | Admin |
|--------|----------|------|-------|
| POST | `/media/upload` | ADMIN/CONTENT | ✅ ImageUpload component |

### 2.8 Combo Offers — `@Controller("combo-offers")`
| Method | Endpoint | Auth | Web | Admin |
|--------|----------|------|-----|-------|
| GET | `/combo-offers` | Public | — | ✅ |
| GET | `/combo-offers/active` | Public | ✅ | — |
| GET | `/combo-offers/{id}` | Public | — | ✅ |
| POST | `/combo-offers` | ADMIN/SALES | — | ✅ |
| PUT | `/combo-offers/{id}` | ADMIN/SALES | — | ✅ |
| DELETE | `/combo-offers/{id}` | ADMIN/SUPER | — | ❌ No UI |

### 2.9 Analytics — `@Controller("analytics")`
| Method | Endpoint | Auth | Admin |
|--------|----------|------|-------|
| GET | `/analytics/overview?range=` | ADMIN/SEO | ✅ |
| GET | `/analytics/top-products?range=&limit=` | ADMIN/SEO | ✅ |
| GET | `/analytics/search-terms?range=&limit=` | ADMIN/SEO | ✅ |
| GET | `/analytics/devices?range=` | ADMIN/SEO | ✅ |
| GET | `/analytics/seo-stats` | ADMIN/SEO | ✅ |
| GET | `/analytics/weekly-trend?days=` | ADMIN/SEO | ✅ |

### 2.10 SEO — `@Controller("seo")`
| Method | Endpoint | Auth | Admin |
|--------|----------|------|-------|
| GET | `/seo?entityType=` | ADMIN/SEO | ✅ |
| GET | `/seo/stats` | ADMIN/SEO | ❌ No UI |
| GET | `/seo/{entityType}/{entityId}` | ADMIN/SEO | ❌ No UI |
| POST | `/seo` | ADMIN/SEO | ✅ |
| POST | `/seo/generate` | ADMIN/SUPER | ✅ |
| DELETE | `/seo/{id}` | ADMIN/SEO | ❌ No UI |

### 2.11 AI — `@Controller("ai")`
| Method | Endpoint | Auth | Admin |
|--------|----------|------|-------|
| POST | `/ai/generate-product` | ADMIN/CONTENT | ❌ No UI (needs API key) |
| POST | `/ai/analyze-image` | ADMIN/CONTENT | ❌ No UI (needs API key) |
| POST | `/ai/generate-seo` | ADMIN/SEO | ❌ No UI (needs API key) |

---

## 3. 🚫 DEAD FRONTEND CALLS — No Backend Controller

These frontend endpoints hit **nothing** — backend doesn't have a controller:

| Frontend File | Endpoint | Notes |
|--------------|----------|-------|
| `web/actions/addresses.ts` | `GET/POST/PUT/DELETE /addresses*` | No AddressModule in API |
| `web/actions/blog.ts` | `GET /blog`, `GET /blog/{slug}` | No BlogModule in API |
| `web/actions/uses.ts` | `GET /uses`, `GET /uses/{slug}` | No Uses controller in API |
| `admin/blog/page.tsx` | `GET /blog` | No BlogModule in API |
| `admin/uses/*` | `GET/POST/PUT /uses*` | No Uses controller in API |
| `admin/users/*` | `GET /users*` | UsersModule has NO controller |
| `admin/bulk-sales/page.tsx` | `GET /bulk-sales` | No BulkSalesModule in API |
| `admin/products/product-form.tsx` | `GET /uses` | No Uses controller in API |

**6 backend modules exist as stubs (module + DTOs only, NO controller):**
`UsersModule`, `CustomersModule`, `ReviewsModule`, `CouponsModule`, `NotificationsModule`, `ReportsModule`

**4 backend modules don't exist at all:**
`BulkSales`, `Blog`, `Addresses`, `Wishlist`, `Uses`

---

## 4. ✅ WEB FRONTEND — ALL HARDCODED DATA REMOVED

All web `data/` barrel exports are now API-backed or removed. Static marketing content kept as direct imports (not via barrel):

| File | Status | Notes |
|------|--------|-------|
| `data/products.ts` | ✅ API fetch | `GET /products` |
| `data/categories.ts` | ✅ API fetch | `GET /categories` |
| `data/brands.ts` | ✅ API fetch | `GET /brands` |
| `data/blog.ts` | ✅ API fetch | `GET /blog` (dead endpoint — silently returns `[]`) |
| `data/uses.ts` | ✅ API fetch | `GET /uses` (dead endpoint — silently returns `[]`) |
| `data/comboOffers.ts` | ✅ API fetch | `GET /combo-offers/active` |
| `data/offers.ts` | ✅ API fetch | Delegates to `fetchComboOffers()` |
| `data/orders.ts` | ✅ Clean | Deleted fake orders array, kept utility helpers |
| `data/index.ts` | ✅ Clean barrel | Only exports API-backed functions |
| `DiscoveryGrid.tsx` | ✅ Brands from API | Fetches `GET /brands`, renders `brand.image` logos |
| `promoCodes.ts` | 📁 Static content | Direct import in `cart-context.tsx` (no coupon API yet) |
| `bulkPricing.ts` | 📁 Static defaults | Direct import in cart + pages (no bulk pricing API) |
| `benefits.ts` | 📁 Marketing copy | Direct import in `about/` + `bulk-sales/` |

### Admin App — Still Has Hardcoded Stubs
| File | Issue |
|------|-------|
| `admin/seo/sitemap/page.tsx` | 6 hardcoded URLs, no-op Generate |
| `admin/seo/redirects/page.tsx` | 3 hardcoded redirects, no API |
| `admin/seo/reports/page.tsx` | Hardcoded radar chart data |
| `admin/settings/integrations/page.tsx` | 6 integrations, no-op Save |

---

## 5. 🔍 Discover Section — How It Works

**File:** `web/src/components/home/DiscoveryGrid.tsx`

All three tabs are now **fully API-driven** (no hardcoded data):

| Tab | Data Source | Links To | Empty State |
|-----|-------------|----------|-------------|
| **By Budget** | ✅ `GET /products` → computes 5 dynamic price ranges from actual product prices | `/search?minPrice=X&maxPrice=Y` | "No products available yet" |
| **By Brand** | ✅ `GET /brands` → renders `brand.image` logo (fallback: first letter) | `/brands/{slug}` | "No brands available yet" |
| **By Use** | ✅ `GET /uses` (falls back to static if API unavailable) → renders label + image | `/uses/{slug}` | "No use cases available yet" |

**Dynamic budget ranges:** Computed from actual product prices using equal-width segmentation. Tags show item count or "Popular". Only ranges with products are shown.

---

## 6. 💬 Chat PWA — Current State

| Component | Data | Status |
|-----------|------|--------|
| Web LiveChatWidget | localStorage (`@tradehubuae/chat`) | ✅ Works client-only |
| Chat PWA sessions | demo-data.ts → localStorage | ❌ No backend |
| Chat PWA messages | demo-data.ts → localStorage | ❌ No backend |
| Chat PWA WebSocket | `ws://localhost:4000/chat` | ❌ No server |

**Needs:** NestJS ChatModule with REST + WebSocket + database persistence.

---

## 7. Quick Reference — What Needs Building

| Priority | What | Why |
|----------|------|-----|
| 🔴 High | Admin has no delete UIs for products/categories/brands/combo-offers/seo | Backend has the DELETE endpoints |
| 🔴 High | AI endpoints have no admin UI | Backend + `@tradehubuae/ai` are ready, just need API key in .env |
| 🟡 Medium | Chat needs backend (REST + WS) | Full PWA is built, no server exists |
| 🟡 Medium | `/uses`, `/blog`, `/addresses` need backend controllers | Frontend calls hit 404 |
| 🟢 Low | Inventory stock adjust/transfer UI | Backend endpoints exist |
| 🟢 Low | Coupons, reviews, customers, notifications, reports controllers | Backend has scaffold modules |
