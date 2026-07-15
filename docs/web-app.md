# Web Frontend -- `tradehubuae.com`

**Architecture & Implementation Guide**

---

## 1. Vision

The **customer-facing storefront** at `tradehubuae.com` is where customers browse products, manage cart, checkout, track orders, and manage their account. Built with Next.js 15 App Router, it serves as the primary customer interface for TradeHub UAE.

### Subdomain Architecture

| Subdomain | App | Port | Purpose |
|-----------|-----|------|---------|
| **`tradehubuae.com`** | **`apps/web`** | **3000** | **Customer storefront** |
| `admin.tradehubuae.com` | `apps/admin` | 3001 | Admin dashboard |
| `crm.tradehubuae.com` | `apps/admin` (middleware) | 3001 | CRM module |
| `chat.tradehubuae.com` | `apps/chat` | 3003 | Chat PWA |
| `api.tradehubuae.com` | `apps/api` | 4000 | NestJS REST API |

---

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15.1 (App Router) |
| **Language** | TypeScript strict |
| **Styling** | Tailwind CSS 3.4 + CSS variables |
| **UI Library** | `@tradehubuae/ui` (shadcn/ui) |
| **Icons** | lucide-react |
| **State** | React Context (Cart, CartFly, Auth) |
| **Auth** | Supabase SSR (mock -- localStorage only) |
| **Data** | Static mock files in `src/data/` |
| **API Client** | Custom `api.ts` + server actions |
| **Testing** | Vitest (unit), Playwright (e2e) |

---

## 3. Dependencies

### Internal Packages

| Package | Purpose |
|---------|---------|
| `@tradehubuae/ui` | shadcn/ui components + `cn()` |
| `@tradehubuae/auth` | Auth helpers |
| `@tradehubuae/config` | Shared config, UAE emirates |
| `@tradehubuae/types` | TypeScript types |
| `@tradehubuae/validation` | Zod schemas |
| `@tradehubuae/seo` | SEO metadata, JSON-LD |
| `@tradehubuae/utils` | formatPrice, slugify, etc. |
| `@tradehubuae/logger` | Logging |
| `@tradehubuae/chat` | Chat store |

### External Dependencies

| Package | Purpose |
|---------|---------|
| `next` ^15.1.0 | Framework |
| `react` / `react-dom` ^19.0.0 | UI |
| `lucide-react` ^0.468.0 | Icons |
| `@supabase/ssr` / `@supabase/supabase-js` | Auth (mock) |
| `class-variance-authority` | Component variants |
| `tailwind-merge` / `clsx` | Class merging |

---

## 4. Folder Structure

```
apps/web/
├── public/
│
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   ├── not-found.tsx
│   │   ├── page.tsx               # Homepage
│   │   │
│   │   ├── about/page.tsx
│   │   ├── blog/page.tsx
│   │   ├── brands/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── bulk-sales/page.tsx
│   │   ├── cart/page.tsx
│   │   ├── categories/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── combo-offers/page.tsx
│   │   ├── compare/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── products/[slug]/page.tsx
│   │   ├── search/page.tsx
│   │   ├── track-order/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── uses/[slug]/page.tsx
│   │   ├── wishlist/page.tsx
│   │   │
│   │   ├── auth/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── callback/       (empty)
│   │   │   └── error/page.tsx
│   │   │
│   │   └── account/
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       ├── addresses/page.tsx
│   │       ├── details/page.tsx
│   │       └── orders/page.tsx
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── home/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── ProductRow.tsx
│   │   │   ├── LatestArrivalsRow.tsx
│   │   │   ├── DiscoveryGrid.tsx
│   │   │   ├── OfferSection.tsx
│   │   │   └── index.ts
│   │   ├── products/
│   │   │   ├── BuyButtons.tsx
│   │   │   ├── ProductGallery.tsx
│   │   │   ├── SellerCard.tsx
│   │   │   ├── SpecsTable.tsx
│   │   │   ├── ProductHighlights.tsx
│   │   │   ├── CollapsibleSection.tsx
│   │   │   └── TrustBadges.tsx
│   │   ├── chat/
│   │   │   ├── LiveChatWidget.tsx
│   │   │   └── ChatProductButton.tsx
│   │   ├── shared/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── CategoryCard.tsx
│   │   │   ├── BrandCard.tsx
│   │   │   ├── Breadcrumb.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── StarRating.tsx
│   │   │   ├── AddressCard.tsx
│   │   │   ├── AddressForm.tsx
│   │   │   └── AddressSelector.tsx
│   │   └── icons/
│   │       ├── Icons.tsx
│   │       ├── ChatBubble.tsx
│   │       └── index.ts
│   │
│   ├── lib/
│   │   ├── api.ts
│   │   ├── cart-context.tsx
│   │   ├── cart-fly-context.tsx
│   │   ├── chat-store.ts
│   │   └── supabase/provider.tsx
│   │
│   ├── lib/actions/
│   │   ├── addresses.ts
│   │   ├── orders.ts
│   │   └── __tests__/orders.test.ts
│   │
│   └── data/
│       ├── index.ts
│       ├── products.ts
│       ├── categories.ts
│       ├── brands.ts
│       ├── blog.ts
│       ├── orders.ts
│       ├── comboOffers.ts
│       ├── offers.ts
│       ├── promoCodes.ts
│       ├── bulkPricing.ts
│       ├── benefits.ts
│       ├── uses.ts
│       └── __tests__/orders.test.ts
│
├── next.config.ts
├── tailwind.config.ts
├── vitest.config.ts
├── tsconfig.json
├── postcss.config.js
└── package.json
```

---

## 5. Complete Route Map

### Public Pages

| Route | Data Source | Description |
|-------|-------------|-------------|
| `/` | Static data | Hero, categories, products, offers, discovery grid, chat widget |
| `/about` | Static (`benefits.ts`) | Company info, stats (5000+ products, 1000+ customers), mission |
| `/contact` | Static | Form + address/phone/hours |
| `/blog` | Static (`blog.ts`) | 6 blog post cards |
| `/brands` | Static (`brands.ts`) | 16 brand cards |
| `/brands/[slug]` | Static (filtered) | Brand info + products |
| `/categories` | Static (`categories.ts`) | 8 category cards |
| `/categories/[slug]` | Static (filtered) | Category + products |
| `/uses/[slug]` | Static (`uses.ts`) | Products by use case |
| `/search` | Static (filtered) | Query params + filters |
| `/compare` | Static (`products.ts`) | 3 product side-by-side |
| `/cart` | Context (client) | Items, promos, totals |
| `/checkout` | Context + actions | 3-step flow (address -- payment -- confirm) |
| `/wishlist` | Static (`products.ts`) | Saved items |
| `/combo-offers` | API (`GET /combo-offers/active`) | Bundle deals |
| `/bulk-sales` | Static (`bulkPricing.ts`) | Tiers, benefits, quote form |
| `/track-order` | Server action | Order lookup + timeline |

### Auth Pages

| Route | Page | Status |
|-------|------|--------|
| `/auth` | Sign In / Sign Up | Static UI only -- no API call |
| `/auth/error` | Auth Error | Shows error messages |
| `/auth/callback` | Callback | Empty placeholder |

### Account Pages

| Route | Data Source | Description |
|-------|-------------|-------------|
| `/account` | Static + actions | Stats, recent orders |
| `/account/orders` | Server action | Order list + cancel |
| `/account/details` | Local state | Edit name/email/phone |
| `/account/addresses` | Server action | CRUD addresses |

---

## 6. Components

### Layout

| Component | Description |
|-----------|-------------|
| **Header** | Sticky header. Logo, multi-segment search bar (on scroll), cart icon with bounce badge, hamburger dropdown. Scroll-aware: blur to solid background. |
| **Footer** | Dark 4-column grid: branding, Shop, Support, Account links. Copyright, location, email. |

### Homepage Sections (`components/home/`)

| Component | Description |
|-----------|-------------|
| **HeroSection** | Parallax hero with scroll-driven fade/scale, SearchBar |
| **SearchBar** | 3-segment: What / Budget / Condition |
| **ProductRow** | Grid + horizontal scroll variant with arrows |
| **LatestArrivalsRow** | Horizontal scroll of LatestArrivalsCard |
| **DiscoveryGrid** | 3-tab carousel: By Budget / By Brand / By Use |
| **OfferSection** | Special offer cards with gradients, icons, badges |

### Product Detail (`components/products/`)

| Component | Description |
|-----------|-------------|
| **BuyButtons** | Qty selector, animated price, Add to Cart + Buy Now, mobile sticky bar, low-stock warning |
| **ProductGallery** | Image thumbnails + main image, badge overlay |
| **SpecsTable** | Alternating-row specs table |
| **ProductHighlights** | Check-mark bullet highlights |
| **CollapsibleSection** | Animated chevron collapse |
| **SellerCard** | Seller profile, rating, contact button |
| **TrustBadges** | 4 badges: certified, free delivery, returns, showroom |

### Shared (`components/shared/`)

| Component | Description |
|-----------|-------------|
| **ProductCard** | Image, badge, stock, wishlist heart, quick-add-to-cart with fly animation |
| **CategoryCard** | Circular icon card with mapped Lucide icons |
| **BrandCard** | Initial letter avatar + description |
| **Breadcrumb** | Chevron-separated nav |
| **EmptyState** | Icon + title + description + action link |
| **StarRating** | 5-star display |
| **AddressCard** | Address with default badge, edit/delete/set-default |
| **AddressForm** | Dialog with UAE emirates dropdown |
| **AddressSelector** | Saved addresses + add-new combo |

### Chat (`components/chat/`)

| Component | Description |
|-----------|-------------|
| **LiveChatWidget** | FAB + pre-chat form + messaging with polling + unread badge |
| **ChatProductButton** | "Ask about this item" button (3 variants) |

---

## 7. Mock Data Files

All in `src/data/` -- **static mock data, not connected to real API** (except combo offers).

| File | Content |
|------|---------|
| `products.ts` | 13 products (AED 245-8299), 7 search categories, 3 compare, 5 wishlist |
| `categories.ts` | 8 categories (Laptops, Desktop PCs, Gaming, Components, Accessories, Networking, Storage, Software) |
| `brands.ts` | 16 brands (Dell, HP, Lenovo, Apple, ASUS, Acer, Microsoft, Logitech, Samsung, Intel, AMD, NVIDIA, Corsair, TP-Link, Seagate, WD) |
| `blog.ts` | 6 posts |
| `orders.ts` | 5 mock orders + formatStatus, orderStatusColor, ORDER_STATUS_FLOW |
| `comboOffers.ts` | **Only file that calls real API** -- `GET /combo-offers/active` |
| `offers.ts` | Derived from combo offers |
| `promoCodes.ts` | 6 promo codes + validatePromoCode, calculatePromoDiscount |
| `bulkPricing.ts` | 5 bulk tiers (2-50+ units, 3-15% off) |
| `benefits.ts` | 6 bulk benefits, 8 industries, 4 about stats |
| `uses.ts` | 5 use cases (Gaming, Office, Student, Content Creation, Business) |

---

## 8. State Management

### Cart (React Context -- `cart-context.tsx`)

| Aspect | Details |
|--------|---------|
| **State** | `items: CartItem[]`, `activePromo`, `promoError` |
| **Actions** | addItem, addComboToCart, removeItem, updateQuantity, clearCart, applyPromoCode, removePromoCode |
| **Computed** | subtotal, bulkSavings, comboDiscount, promoDiscount, totalSavings, grandTotal, shipping (free over AED 500) |
| **Persistence** | In-memory only (not persisted across refresh) |

### Auth (React Context -- `supabase/provider.tsx`)

| Aspect | Details |
|--------|---------|
| **Type** | Mock -- does not call real Supabase |
| **Persistence** | localStorage (`tradehub_user`) |
| **Functions** | signInWithGoogle, signInWithEmail, signUp, signOut |
| **User type** | MockUser (id, email, name, avatar) |

### Cart Fly Animation (`cart-fly-context.tsx`)

- `flyToCart(element)` -- creates a flying overlay from element to cart icon
- Renders animated div at `z-[9999]` using CSS `@keyframes flyToCart`

---

## 9. Server Actions (`src/lib/actions/`)

### Addresses (`addresses.ts`)

| Function | Method | Endpoint |
|----------|--------|----------|
| `getAddresses()` | GET | `/addresses` |
| `createAddress(input)` | POST | `/addresses` |
| `updateAddress(id, input)` | PUT | `/addresses/:id` |
| `deleteAddress(id)` | DELETE | `/addresses/:id` |
| `setDefaultAddress(id)` | PUT | `/addresses/:id/default` |

### Orders (`orders.ts`)

| Function | Method | Endpoint |
|----------|--------|----------|
| `createOrder(data)` | POST | `/orders` |
| `getMyOrders()` | GET | `/orders/my-orders` |
| `trackOrder(orderNumber)` | GET | `/orders/track/:number` |
| `getOrderById(id)` | GET | `/orders/:id` |
| `getAllOrders(params?)` | GET | `/orders?page&limit&status&search` |
| `updateOrderStatus(id, status)` | PUT | `/orders/:id/status` |

---

## 10. API Client (`src/lib/api.ts`)

```typescript
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

class ApiError extends Error { status: number; }
PaginatedResponse<T> = { data: T[], meta: { total, page, limit, totalPages, hasNextPage, hasPreviousPage } }

api.get<T>(endpoint, params?)     // GET with query params
api.post<T>(endpoint, body)       // POST
api.put<T>(endpoint, body)        // PUT
api.delete<T>(endpoint)           // DELETE
```

**Note:** No JWT token is attached. Auth pages are static UI only -- never call `POST /auth/login` or `POST /auth/register`.

---

## 11. Root Layout

```
// src/app/layout.tsx
- Font: Inter (variable --font-sans)
- Providers: AuthProvider -> CartProvider -> CartFlyProvider
- Layout: Header -> <main> -> Footer (flex column, min-h-screen)
- SEO: Organization JSON-LD via @tradehubuae/seo
- OpenGraph, Twitter, robots metadata

// src/app/globals.css
- Brand: #1A5A8C (208 73% 28%)
- Ink (text): #0F172A
- Lines: #E2E8F0
- Custom shadows: card, search, panel, chip
- @keyframes flyToCart
- Utility: .btn-brand gradient
```

---

## 12. Design System

| Token | Value | Usage |
|-------|-------|-------|
| Brand | `#1A5A8C` | Primary color |
| Radius | `0.5rem` | Border radius |
| Font | Inter | Body text |
| Shadows | card, search, search-active, panel, chip | Elevation |
| Breakpoints | sm, md, lg, xl (mobile-first) | Responsive |

---

## 13. Edge Cases

| Concern | Status |
|---------|--------|
| **Loading** | Global `loading.tsx` + per-page states |
| **Error** | Global `error.tsx` + per-page error in most pages |
| **Empty** | `EmptyState` component on search, wishlist, categories, brands, account orders |
| **404** | Custom `not-found.tsx` with link to home |
| **Mobile** | Mobile-first. Tables to cards. Sidebar to tabs. |

---

## 14. Known Issues

| Issue | Severity | Details |
|-------|----------|---------|
| **All data is static mock** | Critical | Only combo offers calls real API. Products, categories, brands, blog, orders all from `src/data/` |
| **Auth is mock** | Critical | Login/register UI never calls API. localStorage only. No real JWT. |
| **No JWT in API requests** | Critical | API client never attaches Authorization header |
| **No protected routes** | Medium | No middleware -- account pages accessible to anyone |
| **WebSocket unused** | Medium | `NEXT_PUBLIC_WS_URL` set but no client code |
| **Chat widget localStorage** | Medium | No real-time, no API persistence |
| **Checkout # placeholders** | Low | `checkout/page.tsx:494,501` -- inert links |
| **Blog detail missing** | Low | `/blog/[slug]` does not exist |
