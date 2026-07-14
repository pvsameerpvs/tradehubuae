# Admin Dashboard Routes (apps/admin)

Base URL: `http://localhost:3001`

Framework: Next.js (App Router)

---

## Overview

The admin dashboard is a standalone Next.js application. Routes are organized by entity. Forms are co-located as shared components.

## Dashboard

| Route | File | Type |
|-------|------|------|
| `/` | `src/app/page.tsx` | Redirects to `/dashboard` |
| `/dashboard` | `src/app/dashboard/page.tsx` | Main overview |
| `/dashboard/chats` | `src/app/dashboard/chats/page.tsx` | Live chat |

## Products

| Route | File | Type |
|-------|------|------|
| `/products` | `src/app/products/page.tsx` | List |
| `/products/new` | `src/app/products/new/page.tsx` | Create |
| `/products/[id]` | `src/app/products/[id]/page.tsx` | Edit |

## Orders

| Route | File | Type |
|-------|------|------|
| `/orders` | `src/app/orders/page.tsx` | List |
| `/orders/[id]` | `src/app/orders/[id]/page.tsx` | Detail |

## Categories

| Route | File | Type |
|-------|------|------|
| `/categories` | `src/app/categories/page.tsx` | List |
| `/categories/new` | `src/app/categories/new/page.tsx` | Create |
| `/categories/[id]` | `src/app/categories/[id]/page.tsx` | Edit |

## Brands

| Route | File | Type |
|-------|------|------|
| `/brands` | `src/app/brands/page.tsx` | List |
| `/brands/new` | `src/app/brands/new/page.tsx` | Create |
| `/brands/[id]` | `src/app/brands/[id]/page.tsx` | Edit |

## Customers

| Route | File | Type |
|-------|------|------|
| `/customers` | `src/app/customers/page.tsx` | List |
| `/customers/[id]` | `src/app/customers/[id]/page.tsx` | Detail |

## Inventory

| Route | File | Type |
|-------|------|------|
| `/inventory` | `src/app/inventory/page.tsx` | List |

## Combo Offers

| Route | File | Type |
|-------|------|------|
| `/combo-offers` | `src/app/combo-offers/page.tsx` | List |
| `/combo-offers/new` | `src/app/combo-offers/new/page.tsx` | Create |
| `/combo-offers/[id]` | `src/app/combo-offers/[id]/page.tsx` | Edit |

## Bulk Sales

| Route | File | Type |
|-------|------|------|
| `/bulk-sales` | `src/app/bulk-sales/page.tsx` | List |
| `/bulk-sales/[id]` | `src/app/bulk-sales/[id]/page.tsx` | Detail |

## Reviews

| Route | File | Type |
|-------|------|------|
| `/reviews` | `src/app/reviews/page.tsx` | List |
| `/reviews/[id]` | `src/app/reviews/[id]/page.tsx` | Detail |

## Media

| Route | File | Type |
|-------|------|------|
| `/media` | `src/app/media/page.tsx` | Gallery |

## Blog

| Route | File | Type |
|-------|------|------|
| `/blog` | `src/app/blog/page.tsx` | List |
| `/blog/new` | `src/app/blog/new/page.tsx` | Create |
| `/blog/[id]` | `src/app/blog/[id]/page.tsx` | Edit |

## SEO

| Route | File | Type |
|-------|------|------|
| `/seo` | `src/app/seo/page.tsx` | Landing page |
| `/seo/meta` | `src/app/seo/meta/page.tsx` | Meta editor |
| `/seo/sitemap` | `src/app/seo/sitemap/page.tsx` | Sitemap manager |
| `/seo/redirects` | `src/app/seo/redirects/page.tsx` | Redirect manager |
| `/seo/reports` | `src/app/seo/reports/page.tsx` | SEO reports |

## Analytics

| Route | File | Type |
|-------|------|------|
| `/analytics` | `src/app/analytics/page.tsx` | Analytics dashboard |

## AI Assistant

| Route | File | Type |
|-------|------|------|
| `/ai` | `src/app/ai/page.tsx` | AI assistant UI |

## Users

| Route | File | Type |
|-------|------|------|
| `/users` | `src/app/users/page.tsx` | List |
| `/users/new` | `src/app/users/new/page.tsx` | Create |
| `/users/[id]` | `src/app/users/[id]/page.tsx` | Detail |
| `/users/[id]/edit` | `src/app/users/[id]/edit/page.tsx` | Edit |

## Settings

| Route | File | Type |
|-------|------|------|
| `/settings` | `src/app/settings/page.tsx` | Landing page |
| `/settings/general` | `src/app/settings/general/page.tsx` | General settings |
| `/settings/payments` | `src/app/settings/payments/page.tsx` | Payment settings |
| `/settings/shipping` | `src/app/settings/shipping/page.tsx` | Shipping settings |
| `/settings/email` | `src/app/settings/email/page.tsx` | Email settings |
| `/settings/security` | `src/app/settings/security/page.tsx` | Security settings |
| `/settings/appearance` | `src/app/settings/appearance/page.tsx` | Appearance settings |
| `/settings/integrations` | `src/app/settings/integrations/page.tsx` | Integrations settings |

## Shared Form Components (co-located)

| File | Used By |
|------|---------|
| `src/app/products/product-form.tsx` | `/products/new`, `/products/[id]` |
| `src/app/categories/category-form.tsx` | `/categories/new`, `/categories/[id]` |
| `src/app/brands/brand-form.tsx` | `/brands/new`, `/brands/[id]` |
| `src/app/combo-offers/combo-offer-form.tsx` | `/combo-offers/new`, `/combo-offers/[id]` |
| `src/app/blog/blog-form.tsx` | `/blog/new`, `/blog/[id]` |

## Global Files

| File | Purpose |
|------|---------|
| `src/app/layout.tsx` | Root layout |
| `src/app/loading.tsx` | Global loading skeleton |
| `src/app/error.tsx` | Global error boundary |
| `src/app/not-found.tsx` | 404 page |

## Sidebar Navigation Structure

```
Main
├── /dashboard         -> Dashboard overview
├── /products          -> Products CRUD
├── /orders            -> Orders management
├── /categories        -> Categories CRUD
├── /brands            -> Brands CRUD
└── /customers         -> Customers list/detail

More
├── /dashboard/chats   -> Live Chat
├── /inventory         -> Inventory management
├── /combo-offers      -> Combo offers CRUD
├── /bulk-sales        -> Bulk sales management
├── /media             -> Media gallery
├── /blog              -> Blog CRUD
├── /seo               -> SEO tools
├── /analytics         -> Analytics dashboard
├── /ai                -> AI assistant
├── /users             -> Users CRUD
└── /settings          -> Settings (all sub-pages)
```

## Empty Directories (not yet implemented)

| Directory | Notes |
|-----------|-------|
| `src/app/coupons/` | No pages |
| `src/app/permissions/` | No pages |
| `src/app/roles/` | No pages |

## User Dashboard in Web App (apps/web)

These routes live in the main frontend app (`apps/web`, port 3000), not in the admin app:

| Route | File | Description |
|-------|------|-------------|
| `/dashboard` | `src/app/dashboard/page.tsx` | User data overview |
| `/dashboard/orders` | `src/app/dashboard/orders/page.tsx` | User's orders |
| `/dashboard/orders/[id]` | `src/app/dashboard/orders/[id]/page.tsx` | Order detail |

---

**Total: 48 admin routes** (45 in apps/admin + 3 in apps/web/dashboard)

---

## 🔍 Deep Audit: Issues Found

### ❌ MISSING BACKEND ENDPOINTS (Admin pages call API that doesn't exist)

These admin pages are built, but their API calls will **fail at runtime** because the backend has no matching endpoint:

| Admin Page | API Call | Backend Status |
|-----------|----------|---------------|
| `/customers` | `GET /customers` | ❌ Module is empty `@Module({})` |
| `/customers/[id]` | `GET /customers/:id` | ❌ Module is empty |
| `/bulk-sales` | `GET /bulk-sales` | ❌ No module exists |
| `/bulk-sales/[id]` | `GET /bulk-sales/:id`, `PUT /bulk-sales/:id` | ❌ No module exists |
| `/blog` | `GET /blog` | ❌ No module exists |
| `/blog/new` | `POST /blog` | ❌ No module exists |
| `/blog/[id]` | `GET /blog/:id`, `PUT /blog/:id` | ❌ No module exists |
| `/media` | `GET /media` | ❌ Only `POST /media/upload` exists |
| `/users` | `GET /users` | ❌ Module is empty |
| `/users/new` | `POST /users` | ❌ Module is empty |
| `/users/[id]` | `GET /users/:id` | ❌ Module is empty |
| `/users/[id]/edit` | `GET /users/:id`, `PUT /users/:id` | ❌ Module is empty |
| `/products/new` (AI button) | `POST /ai/auto-fill` | ❌ Backend has `generate-product`, not `auto-fill` |

### ❌ MISSING ADMIN PAGE (sidebar-referenced but no files)

| Route | Source | Status |
|-------|--------|--------|
| `/reviews` | Listed in `AGENTS.md` sidebar audit as "complete" | ❌ **No page files exist** in `apps/admin/src/app/reviews/` |
| `/reviews/[id]` | Listed in `AGENTS.md` sidebar audit as "complete" | ❌ **No page files exist** |

### ❌ SETTINGS SIDEBAR OMISSIONS

The settings landing page (`/settings`) links to 5 sub-pages but **2 are missing**:

| Sub-page | Exists? | Linked from `/settings`? |
|----------|---------|-------------------------|
| `/settings/general` | ✅ | ✅ |
| `/settings/payments` | ✅ | ✅ |
| `/settings/shipping` | ✅ | ✅ |
| `/settings/appearance` | ✅ | ✅ |
| `/settings/integrations` | ✅ | ✅ |
| `/settings/email` | ✅ | ❌ **Not linked** from settings landing |
| `/settings/security` | ✅ | ❌ **Not linked** from settings landing |

### ❌ FRONTEND USES STATIC DATA (not real API)

Despite having full CRUD UI, these admin list pages use **hardcoded mock data**:

| Page | Data Source | Real API Behind? |
|------|-------------|-----------------|
| `/customers` | Hardcoded array in `page.tsx` | No — API doesn't exist |
| `/customers/[id]` | Hardcoded array | No |
| `/bulk-sales` | Hardcoded array | No |
| `/bulk-sales/[id]` | Hardcoded array | No |
| `/media` | Hardcoded array | No — only upload endpoint exists |
| `/blog` | `useState` with fetched data | Yes, but API doesn't exist |
| `/users` | Hardcoded array | No |
| `/analytics` | **All hardcoded** | Yes, API exists but not connected |

### ❌ NO AUTHENTICATION ON ADMIN

| Issue | Details |
|-------|---------|
| **No login page** | Admin app has no `/login` or `/auth` route — anyone with the URL can access |
| **No auth guard** | `AdminShell` has no token check, no redirect to login |
| **Roles unusable** | Backend has `@Roles()` guards but admin never sends JWT — all admin API calls get 403 |
| **No JWT in api client** | `admin/src/lib/api.ts` never attaches `Authorization: Bearer` header |

### ❌ DELETE UIs MISSING

The backend has DELETE endpoints for these entities, but the admin has **no delete buttons or confirm dialogs**:

| Entity | Backend DELETE | Admin UI |
|--------|---------------|----------|
| Products | `DELETE /products/:id` | ❌ No delete button |
| Categories | `DELETE /categories/:id` | ❌ No delete button |
| Brands | `DELETE /brands/:id` | ❌ No delete button |
| Combo Offers | `DELETE /combo-offers/:id` | ❌ No delete button |
| SEO | `DELETE /seo/:id` | ❌ No delete button |

### ❌ REVIEWS PAGE DOES NOT EXIST

Despite being listed in `AGENTS.md` sidebar audit as "complete":

| Route | Status |
|-------|--------|
| `/reviews` | ❌ **No files** in `apps/admin/src/app/reviews/` |
| `/reviews/[id]` | ❌ **No files** in `apps/admin/src/app/reviews/[id]/` |

### ❌ LIVE CHAT IS UI SHELL (no real-time)

| Component | Issue |
|-----------|-------|
| `/dashboard/chats` | Uses localStorage mock data — no WebSocket connection |
| `LiveChatWidget` (web) | UI only — no real messages |
| Backend | No WebSocket gateway configured |

### ❌ AI ASSISTANT GENERATE BUTTON IS NO-OP

| Detail | Value |
|--------|-------|
| Page | `/ai` has full chat UI |
| Backend | No AI/LLM API provider configured |
| Button | "Generate" does nothing — no API call |

### ✅ ADMIN PAGES PROPERLY CONNECTED TO BACKEND

These admin pages have both UI and working API:

| Page | Backend Module | Status |
|------|---------------|--------|
| `/dashboard` | Products, Orders, Analytics | ✅ |
| `/products`, `/products/new`, `/products/[id]` | Products, Categories, Brands, AI | ✅ (except `auto-fill` endpoint) |
| `/orders`, `/orders/[id]` | Orders | ✅ |
| `/categories`, `/categories/new`, `/categories/[id]` | Categories | ✅ |
| `/brands`, `/brands/new`, `/brands/[id]` | Brands | ✅ |
| `/inventory` | Products | ✅ (uses products endpoint) |
| `/combo-offers`, `/combo-offers/new`, `/combo-offers/[id]` | Combo Offers | ✅ |
| `/seo/*` | SEO, Analytics | ✅ |
| `/analytics` | Analytics | ✅ (but data hardcoded, not connected) |
