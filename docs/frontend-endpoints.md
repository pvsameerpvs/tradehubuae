# Frontend Routes (apps/web)

Base URL: `http://localhost:3000`

Framework: Next.js (App Router)

---

## Public Pages

| Route | File | Type |
|-------|------|------|
| `/` | `src/app/page.tsx` | Home page |
| `/about` | `src/app/about/page.tsx` | Static page |
| `/blog` | `src/app/blog/page.tsx` | Static page |
| `/brands` | `src/app/brands/page.tsx` | Static page |
| `/bulk-sales` | `src/app/bulk-sales/page.tsx` | Static page |
| `/cart` | `src/app/cart/page.tsx` | Static page |
| `/categories` | `src/app/categories/page.tsx` | Static page |
| `/categories/[slug]` | `src/app/categories/[slug]/page.tsx` | Dynamic page |
| `/checkout` | `src/app/checkout/page.tsx` | Static page |
| `/combo-offers` | `src/app/combo-offers/page.tsx` | Static page |
| `/compare` | `src/app/compare/page.tsx` | Static page |
| `/contact` | `src/app/contact/page.tsx` | Static page |
| `/orders` | `src/app/orders/page.tsx` | Static page |
| `/products/[slug]` | `src/app/products/[slug]/page.tsx` | Dynamic page |
| `/search` | `src/app/search/page.tsx` | Static page |
| `/wishlist` | `src/app/wishlist/page.tsx` | Static page |

## Auth

| Route | File | Type |
|-------|------|------|
| `/auth` | `src/app/auth/page.tsx` | Auth page (layout wrapper) |

## Account

| Route | File | Type |
|-------|------|------|
| `/account` | `src/app/account/page.tsx` | User account page (layout wrapper) |

## Track Order

| Route | File | Type |
|-------|------|------|
| `/track-order` | `src/app/track-order/page.tsx` | Track order page (layout wrapper) |

## User Dashboard (inside main web app)

| Route | File | Type |
|-------|------|------|
| `/dashboard` | `src/app/dashboard/page.tsx` | Data overview |
| `/dashboard/orders` | `src/app/dashboard/orders/page.tsx` | Orders list |
| `/dashboard/orders/[id]` | `src/app/dashboard/orders/[id]/page.tsx` | Order detail |

## Layouts & Special Files

| File | Purpose |
|------|---------|
| `src/app/layout.tsx` | Root layout |
| `src/app/not-found.tsx` | 404 page |
| `src/app/auth/layout.tsx` | Auth layout wrapper |
| `src/app/account/layout.tsx` | Account layout wrapper |
| `src/app/track-order/layout.tsx` | Track order layout wrapper |

---

**Total: 22 pages (+ 4 layouts + 1 not-found)**

---

## 🔍 Deep Audit: Issues Found

### ❌ BROKEN LINKS (point to non-existent pages)

| Link | Source | Issue |
|------|--------|-------|
| `/brands/dell` | `DiscoveryGrid.tsx:21` | No `/brands/[slug]` page exists |
| `/brands/hp` | `DiscoveryGrid.tsx:22` | Same — no brand detail route |
| `/brands/lenovo` | `DiscoveryGrid.tsx:23` | Same |
| `/brands/apple` | `DiscoveryGrid.tsx:24` | Same |
| `/brands/asus` | `DiscoveryGrid.tsx:25` | Same |
| `/brands/samsung` | `DiscoveryGrid.tsx:26` | Same |
| `#` (placeholder) | `checkout/page.tsx:494,501` | Inert link, scrolls to top |

### ❌ MISSING PAGES (referenced but not implemented)

| Route | Referenced From | Notes |
|-------|----------------|-------|
| `/brands/[slug]` | DiscoveryGrid (6 brands), Header, Footer | Only `/brands` listing exists — no brand detail page |
| `/blog/[slug]` | Blog listing implicitly expects detail links | Only `/blog` list exists in web app |

### ❌ DATA ARCHITECTURE: Static Data vs API

Most pages use **hardcoded static data arrays** instead of calling the backend API:

| Page | Data Source | Format | Should Be |
|------|-------------|--------|-----------|
| Products (`/products/[slug]`) | `src/data/products.ts` | Static array | API `GET /products/:slug` |
| Categories (`/categories`, `/categories/[slug]`) | `src/data/categories.ts` | Static array | API `GET /categories/:slug` |
| Brands (`/brands`) | `src/data/brands.ts` | Static array | API `GET /brands` |
| Orders (`/orders`, `/dashboard/orders`) | `src/data/orders.ts` | Static array | API `GET /orders/my-orders` |
| Blog (`/blog`) | `src/data/blog.ts` | Static array | API `GET /blog` |
| Search (`/search`) | `src/data/products.ts` | Static search | API `GET /products/search` |
| Wishlist (`/wishlist`) | `src/data/products.ts` | Static array | API (needs backend) |
| Cart (`/cart`) | `React Context + localStorage` | Client-only | — |
| Compare (`/compare`) | — | Likely static | — |

**Only 2 features actually hit the API:**
- Orders server actions (`src/lib/actions/orders.ts`) → calls `/orders/*` endpoints
- Combo offers on home page (`data/comboOffers.ts`, `data/offers.ts`) → calls `GET /combo-offers/active`

### ✅ API BASE URL — FIXED

| File | Base URL | Expected | Status |
|------|----------|----------|--------|
| `src/lib/api.ts:1` | `http://localhost:4000/api/v1` | `/api/v1` | ✅ Fixed |
| `src/data/comboOffers.ts:20` | `http://localhost:4000/api/v1` | `/api/v1` | ✅ Correct |
| `.env` | `NEXT_PUBLIC_API_URL=http://localhost:4000` | — | ⚠️ Set to `http://localhost:4000/api/v1` |

### ❌ AUTHENTICATION DISCONNECTED

| Issue | Details |
|-------|---------|
| **No login API call** | `/auth` page has login/register UI but never calls `POST /auth/login` or `POST /auth/register` — uses no API at all |
| **No JWT management** | No token storage (cookies/localStorage), no token refresh, no auth state management |
| **No protected routes** | No middleware or guard on any route — no auth check anywhere in web app |

### ❌ WEBSOCKET UNUSED

| Detail | Value |
|--------|-------|
| Env var | `NEXT_PUBLIC_WS_URL="ws://localhost:4000"` |
| Actual usage | **Nowhere** — no websocket client code, no connection |
| Impact | Live chat widget is UI shell only — no real messaging |

### ✅ ALL LINKS VERIFIED (non-exhaustive)

The following internal links all resolve to existing pages:
`/`, `/about`, `/account`, `/auth`, `/blog`, `/brands` (listing), `/bulk-sales`, `/cart`, `/categories`, `/categories/[slug]`, `/checkout`, `/combo-offers`, `/compare`, `/contact`, `/dashboard`, `/dashboard/orders`, `/dashboard/orders/[id]`, `/orders`, `/products/[slug]`, `/search` (all query variants), `/track-order`, `/wishlist`

All footer nav links, header nav links, breadcrumbs, and product card links resolve to existing routes.
