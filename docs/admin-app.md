# Admin Dashboard — `admin.tradehubuae.com`

**Architecture & Implementation Guide**

---

## 1. Vision

The **admin dashboard** at `admin.tradehubuae.com` is where staff manage products, orders, categories, brands, inventory, content, SEO, analytics, users, and settings. Built with Next.js 15 App Router, it shares the same design system and API as the rest of the TradeHub UAE platform.

### Subdomain Architecture

| Subdomain | App | Port | Purpose |
|-----------|-----|------|---------|
| `tradehubuae.com` | `apps/web` | 3000 | Customer storefront |
| **`admin.tradehubuae.com`** | **`apps/admin`** | **3001** | **Admin dashboard** |
| `crm.tradehubuae.com` | `apps/admin` (middleware) | 3001 | CRM module (subdomain rewrite) |
| `chat.tradehubuae.com` | `apps/chat` | 3003 | Chat PWA |
| `api.tradehubuae.com` | `apps/api` | 4000 | NestJS REST API |

---

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15.1 (App Router) |
| **Language** | TypeScript strict mode |
| **Styling** | Tailwind CSS 3.4 + CSS variables (shadcn-style) |
| **UI Library** | `@tradehubuae/ui` (shadcn/ui) — Card, Button, Input, Badge, Dialog, etc. |
| **Forms** | react-hook-form + Zod + `@hookform/resolvers` (products only); manual `useState` for all others |
| **Data Fetching** | `@tanstack/react-query` (available, not heavily used) |
| **Charts** | recharts (Line, Bar, Area, Pie, Radar) |
| **State** | zustand |
| **Tables** | `@tanstack/react-table` (available) |
| **Icons** | lucide-react |
| **API Client** | Custom `api.ts` — get/post/put/delete/upload |

---

## 3. Dependencies

### Internal Packages

| Package | Purpose |
|---------|---------|
| `@tradehubuae/ui` | shadcn/ui components + `cn()` utility |
| `@tradehubuae/auth` | Authentication |
| `@tradehubuae/config` | Tailwind config, shared config |
| `@tradehubuae/types` | Shared TypeScript types |
| `@tradehubuae/validation` | Zod schemas |
| `@tradehubuae/seo` | SEO utilities |
| `@tradehubuae/utils` | Utility functions |
| `@tradehubuae/logger` | Logging |
| `@tradehubuae/chat` | Live chat store |

### External Dependencies

| Package | Purpose |
|---------|---------|
| `next` ^15.1.0 | Framework |
| `react` / `react-dom` ^19.0.0 | UI |
| `react-hook-form` ^7.54.0 | Forms |
| `zod` ^3.24.1 | Validation |
| `@hookform/resolvers` ^3.9.1 | Zod ↔ RHF bridge |
| `@tanstack/react-query` ^5.62.0 | Data fetching |
| `@tanstack/react-table` ^8.20.5 | Table utilities |
| `recharts` ^2.15.0 | Charts |
| `zustand` ^5.0.1 | State |
| `lucide-react` ^0.468.0 | Icons |

---

## 4. Folder Structure

```
apps/admin/
├── public/
│   ├── logo-mob.png
│   └── logo-web.png
│
├── src/
│   ├── app/
│   │   ├── globals.css            # Tailwind + CSS variables
│   │   ├── layout.tsx             # Root layout (fonts, AdminShell)
│   │   ├── loading.tsx            # Global loading spinner
│   │   ├── error.tsx              # Global error boundary
│   │   ├── not-found.tsx          # 404 page
│   │   ├── page.tsx               # Redirects to /dashboard
│   │   │
│   │   ├── dashboard/
│   │   │   ├── page.tsx           # Overview — stats, trends, products
│   │   │   └── chats/
│   │   │       └── page.tsx       # Live Chat — sessions, messages, n8n
│   │   │
│   │   ├── products/
│   │   │   ├── page.tsx           # List — table + mobile cards
│   │   │   ├── product-form.tsx   # Form — zod+RHF, image upload
│   │   │   ├── new/page.tsx       # Create
│   │   │   └── [id]/page.tsx      # Edit
│   │   │
│   │   ├── orders/
│   │   │   ├── page.tsx           # List — table, status badges
│   │   │   └── [id]/page.tsx      # Detail — items, shipping, status workflow
│   │   │
│   │   ├── categories/
│   │   │   ├── page.tsx           # List
│   │   │   ├── category-form.tsx  # Form
│   │   │   ├── new/page.tsx       # Create
│   │   │   └── [id]/page.tsx      # Edit
│   │   │
│   │   ├── brands/
│   │   │   ├── page.tsx           # List
│   │   │   ├── brand-form.tsx     # Form
│   │   │   ├── new/page.tsx       # Create
│   │   │   └── [id]/page.tsx      # Edit
│   │   │
│   │   ├── customers/
│   │   │   ├── page.tsx           # List (placeholder)
│   │   │   └── [id]/page.tsx      # Detail (placeholder)
│   │   │
│   │   ├── inventory/
│   │   │   └── page.tsx           # Stock levels, filters, toggle
│   │   │
│   │   ├── combo-offers/
│   │   │   ├── page.tsx           # List
│   │   │   ├── combo-offer-form.tsx
│   │   │   ├── new/page.tsx       # Create
│   │   │   └── [id]/page.tsx      # Edit
│   │   │
│   │   ├── bulk-sales/
│   │   │   ├── page.tsx           # List
│   │   │   └── [id]/page.tsx      # Detail (placeholder)
│   │   │
│   │   ├── media/
│   │   │   └── page.tsx           # Gallery — upload + grid
│   │   │
│   │   ├── blog/
│   │   │   ├── page.tsx           # List
│   │   │   ├── blog-form.tsx      # Form
│   │   │   ├── new/page.tsx       # Create
│   │   │   └── [id]/page.tsx      # Edit
│   │   │
│   │   ├── uses/
│   │   │   ├── page.tsx           # List
│   │   │   ├── use-form.tsx       # Form
│   │   │   ├── new/page.tsx       # Create
│   │   │   └── [id]/page.tsx      # Edit
│   │   │
│   │   ├── seo/
│   │   │   ├── page.tsx           # Landing — card links
│   │   │   ├── meta/page.tsx      # Page Meta editor
│   │   │   ├── sitemap/page.tsx   # Sitemap manager
│   │   │   ├── redirects/page.tsx # Redirect CRUD
│   │   │   └── reports/page.tsx   # SEO reports + charts
│   │   │
│   │   ├── analytics/
│   │   │   └── page.tsx           # Charts, stats, device breakdown
│   │   │
│   │   ├── users/
│   │   │   ├── page.tsx           # List
│   │   │   ├── new/page.tsx       # Create
│   │   │   └── [id]/
│   │   │       ├── page.tsx       # Detail
│   │   │       └── edit/page.tsx  # Edit
│   │   │
│   │   └── settings/
│   │       ├── page.tsx           # Landing — card links
│   │       ├── general/page.tsx   # Store info
│   │       ├── payments/page.tsx  # COD toggle
│   │       ├── shipping/page.tsx  # Shipping zones
│   │       ├── email/page.tsx     # SMTP config
│   │       ├── security/page.tsx  # 2FA, session, API keys
│   │       ├── appearance/page.tsx # Logo, favicon, color
│   │       └── integrations/page.tsx # Meta, Google, Resend, Gemini
│   │
│   ├── components/
│   │   ├── AdminShell.tsx         # Root layout wrapper
│   │   ├── ImageUpload.tsx        # File upload → preview → API
│   │   └── layout/
│   │       ├── Sidebar.tsx        # Navigation sidebar
│   │       ├── Header.tsx         # Top bar
│   │       └── NavLinks.tsx       # Nav links with active state
│   │
│   └── lib/
│       ├── api.ts                 # API client
│       ├── navigation.ts          # Sidebar nav structure
│       └── chat-store.ts          # Re-exports from @tradehubuae/chat
│
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.js
└── package.json
```

---

## 5. Sidebar Navigation

### Section: "Main" (6 items)

| Label | Icon | Route |
|-------|------|-------|
| Dashboard | `LayoutDashboard` | `/dashboard` |
| Products | `Package` | `/products` |
| Orders | `ShoppingCart` | `/orders` |
| Categories | `FolderTree` | `/categories` |
| Brands | `Building` | `/brands` |
| Customers | `Users` | `/customers` |

### Section: "More" (11 items)

| Label | Icon | Route |
|-------|------|-------|
| Live Chat | `MessageCircle` | `/dashboard/chats` |
| Inventory | `Warehouse` | `/inventory` |
| Combo Offers | `Tags` | `/combo-offers` |
| Bulk Sales | `Building2` | `/bulk-sales` |
| Media | `Image` | `/media` |
| Blog | `FileText` | `/blog` |
| Uses | `Grid3X3` | `/uses` |
| SEO | `Search` | `/seo` |
| Analytics | `BarChart3` | `/analytics` |
| Users | `Shield` | `/users` |
| Settings | `Settings` | `/settings` |

---

## 6. Complete Route Map

### Dashboard

| Route | Page | API Connected | Description |
|-------|------|---------------|-------------|
| `/dashboard` | Overview | ✅ Products, Orders, Analytics | Stat cards, trend chart, recent products, quick actions |
| `/dashboard/chats` | Live Chat | ✅ Local store | Session list, messages, reply, n8n |

### Products

| Route | Page | API | Description |
|-------|------|-----|-------------|
| `/products` | List | `GET /products` | Table + mobile cards, loading/error/empty states |
| `/products/new` | Create | `POST /products` | Zod+RHF form, image upload, category/brand/use dropdowns |
| `/products/[id]` | Edit | `GET/PUT /products/:id` | Same form pre-filled |

### Orders

| Route | Page | API | Description |
|-------|------|-----|-------------|
| `/orders` | List | `GET /orders` | Table, 8 status badges |
| `/orders/[id]` | Detail | `GET /orders/:id`, `PUT /orders/:id/status` | Items, shipping, payment, status update with Dialog |

### Categories

| Route | Page | API | Description |
|-------|------|-----|-------------|
| `/categories` | List | `GET /categories` | Table, parent/child counts |
| `/categories/new` | Create | `POST /categories` | Manual state, ImageUpload |
| `/categories/[id]` | Edit | `GET/PUT /categories/:id` | Manual state, ImageUpload |

### Brands

| Route | Page | API | Description |
|-------|------|-----|-------------|
| `/brands` | List | `GET /brands` | Logo, product count, website |
| `/brands/new` | Create | `POST /brands` | Manual state, ImageUpload |
| `/brands/[id]` | Edit | `GET/PUT /brands/:id` | Manual state, ImageUpload |

### Customers

| Route | Page | API | Description |
|-------|------|-----|-------------|
| `/customers` | List | ❌ Placeholder | No backend — shows empty state |
| `/customers/[id]` | Detail | ❌ Placeholder | No backend — shows empty state |

### Inventory

| Route | Page | API | Description |
|-------|------|-----|-------------|
| `/inventory` | Stock | `GET /products, /brands, /categories` `PUT /products/:id` | Filters, search, active toggle |

### Combo Offers

| Route | Page | API | Description |
|-------|------|-----|-------------|
| `/combo-offers` | List | `GET /combo-offers` | Discount type, date range |
| `/combo-offers/new` | Create | `POST /combo-offers` | Product picker, items |
| `/combo-offers/[id]` | Edit | `GET/PUT /combo-offers/:id` | |

### Bulk Sales

| Route | Page | API | Description |
|-------|------|-----|-------------|
| `/bulk-sales` | List | `GET /bulk-sales` | Status badges, requests |
| `/bulk-sales/[id]` | Detail | ❌ Placeholder | |

### Media

| Route | Page | API | Description |
|-------|------|-----|-------------|
| `/media` | Gallery | `POST /media/upload` | Upload + grid display |

### Blog

| Route | Page | API | Description |
|-------|------|-----|-------------|
| `/blog` | List | `GET /blog` | Publish/draft badges |
| `/blog/new` | Create | ❌ Mock submit | Manual state form |
| `/blog/[id]` | Edit | ❌ Mock submit | |

### Uses

| Route | Page | API | Description |
|-------|------|-----|-------------|
| `/uses` | List | `GET /uses` | Use categories |
| `/uses/new` | Create | `POST /uses` | |
| `/uses/[id]` | Edit | `GET/PUT /uses/:id` | |

### SEO

| Route | Page | API | Description |
|-------|------|-----|-------------|
| `/seo` | Landing | Static | 5 card links to sub-tools |
| `/seo/meta` | Meta | `GET/POST /seo`, `POST /seo/generate` | Edit 6 pages, AI generate |
| `/seo/sitemap` | Sitemap | Simulated | Static URL list |
| `/seo/redirects` | Redirects | ❌ Local state | CRUD 301/302 rules |
| `/seo/reports` | Reports | `GET /seo, /analytics/*` `POST /seo/generate` | Stats, charts, AI |

### Analytics

| Route | Page | API | Description |
|-------|------|-----|-------------|
| `/analytics` | Dashboard | `GET /analytics/*` | 6 stat cards, area/bar/pie charts, device breakdown, search terms |

### Users

| Route | Page | API | Description |
|-------|------|-----|-------------|
| `/users` | List | `GET /users` | Role badges |
| `/users/new` | Create | ❌ Mock submit | Name, email, password, role |
| `/users/[id]` | Detail | `GET /users/:id` | Avatar, name, email, role, status |
| `/users/[id]/edit` | Edit | ❌ Mock submit | |

### Settings

| Route | Page | API | Description |
|-------|------|-----|-------------|
| `/settings` | Landing | Static | 7 card links |
| `/settings/general` | General | ❌ Local state | Store name, currency, timezone, tax, email |
| `/settings/payments` | Payments | ❌ Local state | COD toggle |
| `/settings/shipping` | Shipping | ❌ Local state | Zone CRUD (Dubai, Sharjah, Other) |
| `/settings/email` | Email | ❌ Local state | SMTP config |
| `/settings/security` | Security | ❌ Local state | 2FA, session timeout, API key gen |
| `/settings/appearance` | Appearance | ❌ Local state | Logo, favicon, primary color |
| `/settings/integrations` | Integrations | ❌ Local state | Meta Ads, Google Ads, Resend, Gemini |

---

## 7. API Client

**File:** `src/lib/api.ts`

```typescript
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

// Methods: get, post, put, del, upload
// Types: PaginatedResponse<T> { data: T[], meta: { total, page, limit, totalPages, hasNextPage, hasPreviousPage } }
// Errors: throws Error on non-ok response
```

**Note:** Currently **no JWT token is attached** to requests. The admin has no auth guard, no login page, and no `Authorization` header is sent. All admin API calls would 403 if the backend's `@Roles()` guards were active.

---

## 8. Layout & Shell

### Root Layout (`src/app/layout.tsx`)

```tsx
- Fonts: Inter (body, --font-sans), Outfit (headings, --font-heading)
- Metadata: title template "%s | TradeHub Admin"
- Wraps in <AdminShell>
- Robots: noindex, nofollow
```

### AdminShell (`src/components/AdminShell.tsx`)

```
┌───────────────────────────────────────────────────┐
│  ┌──────────┐  ┌──────────────────────────────┐  │
│  │          │  │  Header (page title + avatar) │  │
│  │  Sidebar │  ├──────────────────────────────┤  │
│  │  (w-72)  │  │                              │  │
│  │          │  │  Main Content                 │  │
│  │  Logo    │  │  (overflow-y-auto, px-4 py-6) │  │
│  │  Nav     │  │                              │  │
│  │  User    │  │                              │  │
│  └──────────┘  └──────────────────────────────┘  │
└───────────────────────────────────────────────────┘
```

- Mobile: sidebar is a fixed overlay with backdrop (toggle via hamburger)
- Desktop: sidebar is `lg:static`, always visible

---

## 9. Forms

| Entity | Validation | State | Image Upload | Fields |
|--------|-----------|-------|-------------|--------|
| **Product** | ✅ Zod + RHF | react-hook-form | ✅ | Name, SKU, Barcode, Description, Pricing (price/compareAt/cost), Stock, Condition, Category, Brand, Uses, Images, SEO |
| **Category** | ❌ Manual | useState | ✅ | Name, Description, Parent, Sort Order, Active |
| **Brand** | ❌ Manual | useState | ✅ | Name, Description, Website, Sort Order, Active |
| **Combo Offer** | ❌ Manual | useState | ✅ | Name, Description, Discount Type/Value, Date Range, Active, Product Items |
| **Blog** | ❌ Manual | useState | ✅ | Title, Content, Image, Tags |
| **Use** | ❌ Manual | useState | ❌ | Name, Slug |
| **User** | ❌ Manual | useState | ❌ | Name, Email, Password, Role |
| **Settings** | ❌ Manual | useState | ✅ (Appearance) | Varies per page |

---

## 10. Shared Components

| Component | File | Purpose |
|-----------|------|---------|
| `AdminShell` | `components/AdminShell.tsx` | Root layout — sidebar + header + content |
| `Sidebar` | `components/layout/Sidebar.tsx` | Navigation — logo, nav, user footer |
| `Header` | `components/layout/Header.tsx` | Top bar — page title, hamburger, avatar |
| `NavLinks` | `components/layout/NavLinks.tsx` | Sectioned nav items with active state |
| `ImageUpload` | `components/ImageUpload.tsx` | File select → preview → `POST /media/upload` → callback |

---

## 11. Charts (recharts)

| Chart | Page | Type |
|-------|------|------|
| Weekly Revenue Trend | `/dashboard` | AreaChart |
| Overview Stats | `/analytics` | 6 KPI cards |
| Revenue Trend | `/analytics` | AreaChart |
| Product Performance | `/analytics` | BarChart |
| Device Breakdown | `/analytics` | PieChart |
| SEO Performance | `/analytics` | AreaChart |
| SEO Score Radar | `/seo/reports` | RadarChart |
| Trend Chart | `/seo/reports` | AreaChart |

---

## 12. Design System

### Typography

- **Body:** Inter (CSS variable `--font-sans`)
- **Headings:** Outfit (`--font-heading`)

### Colors (CSS Variables)

| Variable | Value | Usage |
|----------|-------|-------|
| `--primary` | `#134A7C` | Brand primary |
| `--background` | `#FFFFFF` | Page bg |
| `--foreground` | `#0A0A0B` | Text |
| `--muted` | `#F5F5F5` | Muted bg |
| `--border` | `#E5E7EB` | Borders |
| Custom classes | `text-ink`, `text-ink-2`, `bg-bg2`, `border-line`, `text-brand`, `shadow-card` | Design system tokens |

### Responsive Breakpoints

- Mobile-first: `sm:`, `md:`, `lg:`, `xl:`
- Sidebar: hidden on mobile (overlay), visible on `lg:`
- Tables: card layout on mobile, table on desktop

---

## 13. Edge Cases & State Handling

| Concern | Implementation |
|---------|---------------|
| **Loading** | ✅ Global `loading.tsx` + per-page loading state in each client component |
| **Error** | ✅ Global `error.tsx` + per-page error in list components (Dashboard has silent catch) |
| **Empty** | ✅ All list pages show empty state with CTA button |
| **404** | ✅ `not-found.tsx` with link to Dashboard |
| **Mobile** | ✅ Mobile-first responsive design |

---

## 14. Missing / Not Yet Built

| Route / Feature | Status | Notes |
|-----------------|--------|-------|
| `/reviews` | ❌ Not built | No pages exist, not in sidebar |
| `/coupons` | ❌ Not built | No pages exist |
| `/permissions` | ❌ Not built | No pages exist |
| `/roles` | ❌ Not built | No pages exist |
| Auth / Login | ❌ Not built | No login page, no auth guard, no JWT in requests |
| Settings (all) | ❌ Local state only | Forms exist but don't persist to API |
| Blog (create/edit) | ❌ Mock only | Forms exist, no API integration |
| Users (create/edit) | ❌ Mock only | Forms exist, no API integration |
| Customers | ❌ Placeholder | List/detail exist but no backend |
| Bulk Sales (detail) | ❌ Placeholder | No backend |
| SEO (redirects) | ❌ Local state only | CRUD UI but no API |
| SEO (sitemap) | ❌ Simulated | Generate button does nothing |
| Delete UIs | ❌ Missing | No delete buttons on Products, Categories, Brands, Combo Offers, SEO |

---

## 15. API Endpoints Used

### Fully Connected (Backend exists + Frontend calls it)

| Endpoint | Pages |
|----------|-------|
| `GET /products` | Dashboard, Products, Inventory |
| `GET/POST /products` | ProductForm |
| `GET/PUT /products/:id` | ProductForm (edit), Inventory (toggle) |
| `GET /orders` | Dashboard, Orders |
| `GET /orders/:id`, `PUT /orders/:id/status` | Order detail |
| `GET /categories` | Categories, ProductForm, Inventory |
| `GET/POST /categories`, `GET/PUT /categories/:id` | CategoryForm |
| `GET /brands` | Brands, ProductForm, Inventory |
| `GET/POST /brands`, `GET/PUT /brands/:id` | BrandForm |
| `GET /combo-offers` | Combo offers list |
| `GET/POST /combo-offers`, `GET/PUT /combo-offers/:id` | ComboOfferForm |
| `POST /media/upload` | ImageUpload (all forms) |
| `GET /seo`, `POST /seo`, `POST /seo/generate` | SEO meta, SEO reports |
| `GET /analytics/*` | Analytics, Dashboard, SEO reports |
| `GET /users`, `GET /users/:id` | Users list, User detail |
| `GET /uses`, `POST /uses`, `GET/PUT /uses/:id` | Uses |
| `GET /blog` | Blog list |
| `GET /bulk-sales` | Bulk sales list |

### Not Connected (Backend exists but frontend uses mock)

| Endpoint | Pages |
|----------|-------|
| `POST /auth/register`, `POST /auth/login` | No auth pages exist |
| `GET /auth/me` | Never called |
| `DELETE /products/:id`, `/categories/:id`, `/brands/:id`, `/combo-offers/:id`, `/seo/:id` | No delete UIs |
| `POST /ai/generate-product` | Admin calls wrong path (`/ai/auto-fill`) |

### Missing Backend (Frontend calls but no backend)

| Endpoint | Pages | Backend Status |
|----------|-------|----------------|
| `GET /customers`, `GET /customers/:id` | Customers | ❌ Empty module |
| `GET /bulk-sales/:id` | Bulk sale detail | ❌ No module |
| `GET /blog/:id`, `POST /blog`, `PUT /blog/:id` | Blog create/edit | ❌ No module |
| `GET /media` | Media gallery | ❌ Only upload exists |
| `POST /users`, `PUT /users/:id` | Users create/edit | ❌ Empty module |

---

## 16. Known Issues

| Issue | Severity | Details |
|-------|----------|---------|
| **No authentication** | 🔴 Critical | No login page, no JWT, no auth guard — anyone with the URL can access |
| **No delete UIs** | 🟡 Medium | Backend supports delete for products, categories, brands, combo offers, SEO — no UI buttons |
| **Settings are local-only** | 🟡 Medium | All settings pages use `useState` — no API persistence |
| **Customers placeholder** | 🟡 Medium | Pages exist but backend module is empty |
| **Blog create/edit mock** | 🟡 Medium | Forms exist but API calls are mocked |
| **Product route conflict** | 🔴 Critical | `findBySlug` and `findById` both map to `GET /:param` on backend |
| **6 controllers lack DTOs** | 🟡 Medium | Orders, Inventory, Media, SEO, Analytics, AI use inline types or `any` |
| **Orders uses `any`** | 🟡 Medium | `OrdersController.create(@Body() dto: any)` — zero validation |
