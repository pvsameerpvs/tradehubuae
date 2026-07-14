# Missing APIs & Integrations

## Status Legend
| Icon | Meaning |
|---|---|
| ✅ Done | Implemented and working |
| 🔄 Partial | Exists but incomplete |
| ❌ Missing | Not started |
| 🔮 Deferred | Planned but not needed yet |
| 🔧 Needs external | Requires third-party API key/account |

---

## 1. External Service Integrations

### Ad Platforms (for Dashboard)

| Service | API Needed | Status | What It Unlocks |
|---|---|---|---|
| **Meta Ads** | Facebook Marketing API | ❌ Missing | Real ad spend, impressions, clicks, CTR, ROAS in dashboard |
| **Google Ads** | Google Ads API | ❌ Missing | Real ad campaign data, cost, conversions |
| **TikTok Ads** | TikTok Business API | ❌ Missing | Campaign performance tracking |

**Required env vars not in `.env.example`:**
```
META_APP_ID=
META_ACCESS_TOKEN=
META_AD_ACCOUNT_ID=
GOOGLE_ADS_DEVELOPER_TOKEN=
GOOGLE_ADS_CLIENT_ID=
GOOGLE_ADS_CLIENT_SECRET=
GOOGLE_ADS_CUSTOMER_ID=
```

### Payment Gateways

COD only for now. Stripe, Tabby, and Tamara will be added when online payments are ready.

| Service | API Needed | Status | Env Var |
|---|---|---|---|
| **Stripe** | Stripe SDK | 🔮 Deferred | `STRIPE_SECRET_KEY` — commented out in `.env` |
| **Tabby** | Tabby API | 🔮 Deferred | `TABBY_API_KEY` — commented out in `.env` |
| **Tamara** | Tamara API | 🔮 Deferred | `TAMARA_API_KEY` — commented out in `.env` |

### Analytics / Tracking

| Service | What For | Status | Notes |
|---|---|---|---|
| **Google Analytics 4** | Visitor insights, demographics | ❌ Missing | No gtag/GA4 script on any page |
| **Google Search Console** | Search rankings, impressions | ❌ Missing | Requires Search Console API |
| **Server-side tracking** | Custom page_views, search_logs | ❌ Missing | `analytics.middleware.ts` not built — tables are empty |

### Communication

| Service | API Needed | Status | Env Var |
|---|---|---|---|
| **Resend (Email)** | Resend SDK | 🔧 Missing | `RESEND_API_KEY` ✅ in `.env` but empty |
| **SMS** | Twilio / SMS provider | ❌ Missing | — |
| **n8n** | n8n webhook | ❌ Missing | Referenced in @tradehubuae/chat but not connected |

---

## 2. API Modules (Backend NestJS)

### Recently Completed (✅)

| Module / Page | Status | Endpoints / Notes |
|---|---|---|
| **Analytics** | ✅ Done | `GET /analytics/overview`, `/top-products`, `/search-terms`, `/devices`, `/seo-stats`, `/weekly-trend` |
| **SEO** | ✅ Done | `GET/POST /seo`, `POST /seo/generate`, `GET /seo/stats`, `DELETE /seo/:id` |
| **Integrations Settings** | ✅ Done | `/settings/integrations` — UI to manage Meta Ads, Google Ads, GA4, Search Console, Resend, Gemini API keys |

### Still Empty (❌ — Module exists but no controller/service)

| Module | Directory | What Needs to Be Built |
|---|---|---|
| **Users** | `apps/api/src/modules/users/` | CRUD for admin user management |
| **Customers** | `apps/api/src/modules/customers/` | Customer listing, details, activity |
| **Reviews** | `apps/api/src/modules/reviews/` | Approve/reject, list, CRUD |
| **Coupons** | `apps/api/src/modules/coupons/` | Discount code management |
| **Notifications** | `apps/api/src/modules/notifications/` | In-app + email notification system |
| **Reports** | `apps/api/src/modules/reports/` | Sales reports, export CSV/PDF |

---

## 3. Missing Dashboard Pages (Admin Frontend)

| Page | Route | Status | Notes |
|---|---|---|---|
| **Orders** | `/orders` | 🔄 Placeholder | Has "Coming soon" text |
| **Orders Detail** | `/orders/[id]` | 🔄 Placeholder | Basic page exists |
| **Inventory** | `/inventory` | 🔄 Placeholder | Description cards only — needs CRUD |
| **Bulk Sales** | `/bulk-sales` | ❌ Missing | Empty directory |
| **Reviews** | `/reviews` | ❌ Missing | Empty directory |
| **Blog** | `/blog` | ❌ Missing | Empty directory |
| **Media** | `/media` | ❌ Missing | Empty directory |
| **Coupons** | `/coupons` | ❌ Missing | Empty directory |
| **Permissions** | `/permissions` | ❌ Missing | Empty directory |
| **Roles** | `/roles` | ❌ Missing | Empty directory |
| **Ad Campaigns** | `/analytics/ads` | ❌ Missing | Ad management + manual entry form |

---

## 4. Worker Processors (BullMQ)

| Queue | Current Status | What It Should Do |
|---|---|---|
| `ai-generation` | 🔄 Stub (console.log) | Gemini product content, SEO, image analysis |
| `image-processing` | 🔄 Stub (console.log) | Image resize, optimize, generate thumbnails |
| `email-sending` | 🔄 Stub (console.log) | Transactional emails via Resend |
| `invoice-generation` | 🔄 Stub (console.log) | Generate PDF invoices |
| `analytics-processing` | ❌ Not started | Aggregate page_views, calculate trends |
| `seo-generation` | ✅ Done | Daily Gemini SEO generation (recently built) |

---

## 5. Storefront — Mock Data vs Real API

All `apps/web/src/data/` files are hardcoded:

| Data File | Mock Data | Needs Real API |
|---|---|---|
| `products.ts` | 20+ products | `GET /products` |
| `categories.ts` | 8 categories | `GET /categories/tree` |
| `brands.ts` | 10 brands | `GET /brands` |
| `orders.ts` | Sample orders | `GET /orders` (auth required) |
| `blog.ts` | 6 posts | `GET /blog/posts` |
| `offers.ts` | Combo offers | `GET /combo-offers/active` |
| `benefits.ts` | Static | No API needed (static) |
| `bulkPricing.ts` | Static | `POST /bulk-sales` |

---

## 6. Analytics Tracking (Middleware)

| Piece | Status | File |
|---|---|---|
| **Page view tracking** | ❌ Missing | No middleware writes to `page_views` table |
| **Search logging** | ❌ Missing | No middleware writes to `search_logs` table |
| **Event tracking** | ❌ Missing | No middleware writes to `analytics_events` table |
| **Session tracking** | ❌ Missing | No session ID generation |

These would go in: `apps/api/src/common/middleware/analytics.middleware.ts`

---

## 7. Env Variables Still Needed

UI page exists at `/settings/integrations` to manage all of these.

```
# === ADS (not in .env.example) ===
META_APP_ID=
META_ACCESS_TOKEN=
META_AD_ACCOUNT_ID=
GOOGLE_ADS_DEVELOPER_TOKEN=
GOOGLE_ADS_CLIENT_ID=
GOOGLE_ADS_CLIENT_SECRET=
GOOGLE_ADS_CUSTOMER_ID=

# === ANALYTICS (not in .env.example) ===
GA4_MEASUREMENT_ID=
GA4_API_SECRET=
SEARCH_CONSOLE_API_KEY=

# === Already in .env.example but not set ===
RESEND_API_KEY=

# === Already in .env.example but commented out (deferred) ===
# STRIPE_SECRET_KEY=
# STRIPE_WEBHOOK_SECRET=
# TABBY_API_KEY=
# TAMARA_API_KEY=
```

---

## 8. Ad Campaigns Dashboard — What's Needed

### Option A: Manual Entry (recommended to start)

| Component | What to Build |
|---|---|
| **DB Table** | `ad_campaigns` with: name, platform (meta/google/tiktok), spend, impressions, clicks, conversions, start_date, end_date |
| **API** | `POST /analytics/ads`, `GET /analytics/ads?range=7d\|30d\|90d`, `PUT /analytics/ads/:id`, `DELETE /analytics/ads/:id` |
| **Admin Page** | `/analytics/ads` — form to add/edit campaigns + table with spend, CTR, ROAS, conversion charts |

### Option B: Real API Connection

| Platform | Setup Required |
|---|---|
| **Meta Ads** | Facebook Developer App → Marketing API → Access Token → Ad Account ID |
| **Google Ads** | Google Ads Manager → Developer Token → OAuth → Customer ID |

---

## Summary

| Category | Total | ✅ Done | 🔄 Partial | 🔮 Deferred | ❌ Missing |
|---|---|---|---|---|---|---|
| API Modules | 17 | 11 | 0 | — | 6 |
| Admin Pages | 21 | 11 | 2 | — | 8 |
| Worker Queues | 6 | 1 | 4 | — | 1 |
| External Integrations | 10 | 1 (Gemini) | 1 (UI at /settings/integrations) | 3 (Stripe, Tabby, Tamara) | 5 |
| Storefront → Real API | 8 | 0 | 0 | — | 8 |
| Tracking Middleware | 4 | 0 | 0 | — | 4 |
