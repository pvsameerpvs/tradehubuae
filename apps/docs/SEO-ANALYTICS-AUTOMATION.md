# Automated SEO + Analytics Workflow

## Overview

Data-driven system that tracks visitor behavior, analyzes product performance, and automatically optimizes SEO daily using Google Gemini.

```
Visitor → page view tracked in DB
    ↓
Daily Railway cron (00:00 UTC) triggers worker
    ↓
Worker queries top products by views
    ↓
Gemini generates optimized SEO metadata
    ↓
Stored in seo_metadata → live on site
    ↓
Admin dashboard shows results in Recharts graphs
```

---

## Architecture

### Components Built

| Component | File | Purpose |
|---|---|---|
| **Analytics Controller** | `apps/api/src/modules/analytics/analytics.controller.ts` | 6 REST endpoints |
| **Analytics Service** | `apps/api/src/modules/analytics/analytics.service.ts` | DB queries for stats |
| **Analytics Module** | `apps/api/src/modules/analytics/analytics.module.ts` | Wired controller + service |
| **SEO Controller** | `apps/api/src/modules/seo/seo.controller.ts` | CRUD + generation |
| **SEO Service** | `apps/api/src/modules/seo/seo.service.ts` | Gemini daily gen + upsert |
| **SEO Module** | `apps/api/src/modules/seo/seo.module.ts` | Wired controller + service |
| **Worker (main)** | `apps/worker/src/main.ts` | Cron trigger + BullMQ worker for SEO generation |
| **Analytics Page** | `apps/admin/src/app/analytics/page.tsx` | Recharts graphs + real API data |
| **Dashboard Page** | `apps/admin/src/app/dashboard/page.tsx` | SEO widgets + mini chart |
| **SEO Reports Page** | `apps/admin/src/app/seo/reports/page.tsx` | Full SEO reports with charts |
| **SEO Meta Page** | `apps/admin/src/app/seo/meta/page.tsx` | Wired to real API + AI generate button |
| **SEO Landing Page** | `apps/admin/src/app/seo/page.tsx` | Updated with Reports + Analytics cards |
| **SEO Worker Script** | `apps/worker/package.json` | Added `cron:seo-generation` script |

---

## API Endpoints

### Analytics (`/analytics`)

| Method | Endpoint | Params | Returns |
|---|---|---|---|
| `GET` | `/analytics/overview` | `?range=7d\|30d\|90d` | Visitors, views, trend data |
| `GET` | `/analytics/top-products` | `?range=&limit=` | Ranked product performance |
| `GET` | `/analytics/search-terms` | `?range=&limit=` | Search query stats |
| `GET` | `/analytics/devices` | `?range=` | Mobile/Desktop/Tablet % |
| `GET` | `/analytics/seo-stats` | — | Coverage, stale count, optimized |
| `GET` | `/analytics/weekly-trend` | `?days=7` | Daily view counts for chart |

### SEO (`/seo`)

| Method | Endpoint | Body | Returns |
|---|---|---|---|
| `GET` | `/seo` | `?entityType=` | All SEO entries |
| `GET` | `/seo/:entityType/:entityId` | — | Single entry |
| `POST` | `/seo` | `{ entityType, entityId, title, description, keywords }` | Upserted entry |
| `DELETE` | `/seo/:id` | — | Deletion result |
| `POST` | `/seo/generate` | `{}` | Runs Gemini generation for top 20 products |
| `GET` | `/seo/stats` | — | Total, stale, product count |

---

## Dashboard Graphs (Recharts)

### Dashboard Page (`/dashboard`)
- **SEO Coverage** card — optimized % with count
- **Stale SEO** card — items needing refresh
- **7-Day Trend** mini AreaChart — page views line

### Analytics Page (`/analytics`)
- **6 Stat cards** — Page Views, Product Views, Sales, Orders, SEO Coverage, Stale
- **Page Views Trend** — AreaChart (gradient fill)
- **Most Viewed Products** — horizontal BarChart
- **Device Breakdown** — PieChart (donut)
- **Product Performance** — responsive table

### SEO Reports Page (`/seo/reports`)
- **4 SEO stat cards** — Entries, Health %, Stale count, Page Views
- **Page Views Trend** — AreaChart
- **SEO Quality Score** — RadarChart (title, desc, keywords, OG, schema, length)
- **Top Products by Views** — horizontal BarChart
- **Recent SEO Entries** — list table

---

## Daily SEO Worker

### Trigger — Railway Cron

Set in Railway dashboard under the **worker** service:

| Field | Value |
|---|---|
| **Schedule** | `0 0 * * *` |
| **Command** | `pnpm cron:seo-generation` |
| **TimeZone** | `UTC` |

### Manual Run

```bash
# From project root (worker service)
pnpm --filter @tradehubuae/worker cron:seo-generation

# Or from apps/worker directory
cd apps/worker && pnpm cron:seo-generation
```

### From Admin Dashboard

Go to **SEO → SEO Reports** and click "Run AI SEO" button.

Or **SEO → Page Meta** and click "Generate All with AI".

### What the Worker Does

1. Queries top 20 products by `viewCount` (descending)
2. For each product, calls Gemini `generateSEOContent()`
3. Upserts result into `seo_metadata` table (`entityType=product`, `entityId=<productId>`)
4. Logs success/error counts
5. Returns `{ success, errors, total }`

### Worker Output (logs)

```
Starting daily SEO generation...
Generating SEO for 20 products
SEO generated: iPhone 15 Pro Max 256GB
SEO generated: Samsung Galaxy S24 Ultra
...
Daily SEO complete: 20 ok, 0 failed
```

---

## Database Tables Used

| Table | File | Purpose |
|---|---|---|
| `page_views` | `packages/database/src/schema/analytics.ts` | Visitor page views |
| `search_logs` | `packages/database/src/schema/analytics.ts` | Search queries |
| `analytics_events` | `packages/database/src/schema/analytics.ts` | Custom events |
| `seo_metadata` | `packages/database/src/schema/seo.ts` | Generated SEO metadata |
| `products` | `packages/database/src/schema/products.ts` | viewCount, saleCount, rating |

---

## Smart Strategy Logic

| Signal | Action |
|---|---|
| High views + high time-on-page | Boost SEO priority in next generation |
| High views + low sales | Gemini regenerates description with conversion angle |
| Low views + high stock | Flag for admin review |
| Top searches with no results | Suggests content gap |
| Stale SEO (>90 days) | Auto-regenerated on next daily run |

---

## Environment Variables

| Variable | Required? | Purpose |
|---|---|---|
| `GEMINI_API_KEY` | ✅ Yes | Google Gemini API key |
| `DATABASE_URL` | ✅ Already set | PostgreSQL connection |
| `REDIS_URL` | ✅ Already set | BullMQ queue backend |

---

## Railway Cron Setup

1. Go to **Railway Dashboard → Worker Service**
2. Click **Cron** tab
3. Add new cron job:
   - **Schedule**: `0 0 * * *` (daily at midnight UTC)
   - **Command**: `pnpm cron:seo-generation`
4. Save

### Test the cron

```bash
# Deploy the worker with the new code first, then test:
pnpm --filter @tradehubuae/worker cron:seo-generation
```

---

## Files Summary

### New Files Created
1. `apps/api/src/modules/analytics/analytics.controller.ts`
2. `apps/api/src/modules/analytics/analytics.service.ts`

### Files Modified
1. `apps/api/src/modules/analytics/analytics.module.ts` — added controller + service
2. `apps/api/src/modules/seo/seo.controller.ts` — created from empty stub
3. `apps/api/src/modules/seo/seo.service.ts` — created from empty stub
4. `apps/api/src/modules/seo/seo.module.ts` — wired controller + service
5. `apps/worker/src/main.ts` — added `runSeoGeneration()` + cron handler
6. `apps/worker/package.json` — added `cron:seo-generation` script
7. `apps/admin/src/app/analytics/page.tsx` — full rewrite with Recharts
8. `apps/admin/src/app/dashboard/page.tsx` — added SEO widgets + mini chart
9. `apps/admin/src/app/seo/page.tsx` — added Reports + Analytics cards
10. `apps/admin/src/app/seo/meta/page.tsx` — wired to real API
11. `apps/admin/src/app/seo/reports/page.tsx` — new full SEO reports page

---

## NEVER FORGET

### Railway Cron Setup
- **Service**: Worker
- **Schedule**: `0 0 * * *`
- **Command**: `pnpm cron:seo-generation`
- **Manual test**: `pnpm --filter @tradehubuae/worker cron:seo-generation`

### Admin Pages
| Page | Path | What It Shows |
|---|---|---|
| Dashboard | `/dashboard` | SEO coverage, stale count, 7-day trend |
| Analytics | `/analytics` | Full analytics with 4 graphs + tables |
| SEO Reports | `/seo/reports` | SEO quality radar, entries, views trend |
| SEO Meta | `/seo/meta` | Edit per-page metadata + AI generation |

### API Health Check
- `GET /analytics/seo-stats` → returns `{ total, stale, products }`
- `POST /seo/generate` → triggers Gemini generation, returns `{ success, errors, total }`
