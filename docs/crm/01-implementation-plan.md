# Implementation Plan

## Architecture Decision

**CRM lives inside `apps/admin/src/app/crm/`** — not a separate app.

| Option | Verdict | Reason |
|--------|---------|--------|
| New Next.js app (`apps/crm/`) | ❌ Rejected | Duplicate auth, layout, API client, UI library — too much overhead |
| Add to existing admin (`apps/admin/src/app/crm/`) | ✅ Chosen | Shares AdminShell, auth, api client, Icons, shadcn/ui |

**Subdomain routing:** `crm.tradehubuae.com` → same Railway service as admin. The admin app's middleware detects the subdomain and rewrites `/` to `/crm`.

## Folder Structure

```
apps/admin/src/
├── app/crm/                         # CRM routes
│   ├── page.tsx                     # CRM Dashboard (KPI cards + graphs)
│   ├── layout.tsx                   # CRM sub-nav layout
│   ├── partners/
│   │   ├── page.tsx                 # Partner list
│   │   ├── new/page.tsx             # Create partner
│   │   └── [id]/page.tsx            # Partner detail + transactions
│   ├── customers/
│   │   ├── page.tsx                 # Enhanced customer list
│   │   └── [id]/page.tsx            # Customer detail w/ timeline + orders
│   ├── finance/
│   │   ├── page.tsx                 # Finance dashboard (graphs)
│   │   ├── expenses/
│   │   │   ├── page.tsx             # Expense list + filters
│   │   │   ├── new/page.tsx         # Add expense
│   │   │   └── categories/page.tsx  # Manage categories + budgets
│   │   ├── revenue/page.tsx         # Revenue analytics
│   │   ├── profit-loss/page.tsx     # P&L statements
│   │   ├── cash-flow/page.tsx       # Cash flow
│   │   └── budgets/page.tsx         # Budgets vs actual
│   ├── deals/
│   │   ├── page.tsx                 # Deal pipeline (Kanban)
│   │   └── new/page.tsx             # New deal
│   └── communications/
│       └── page.tsx                 # Communication log
│
├── components/crm/                  # CRM-specific components
│   ├── KpiCard.tsx
│   ├── ExpenseChart.tsx
│   ├── PartnerSelect.tsx
│   ├── CategorySelect.tsx
│   ├── FinancialPeriodPicker.tsx
│   ├── MoneyDisplay.tsx
│   ├── PurposeTag.tsx
│   ├── Timeline.tsx
│   ├── DealStageBadge.tsx
│   ├── BudgetProgressBar.tsx
│   └── ReportsDownload.tsx
```

## Implementation Phases

### Phase 1 — Finance & Expense Tracking (4-5 days)

**Goal:** Get money management live. Track who spent what, for what purpose, with graphs.

| Day | Tasks |
|-----|-------|
| 1 | Create `expenseCategories` + `expenses` DB tables. Seed categories. |
| 2 | Build `POST/GET /expenses`, `GET /expenses/reports`, `GET /expenses/by-person`, `GET /expenses/by-category` API endpoints |
| 3 | Build CRM Dashboard (`/crm`) with KPI cards (Revenue, Expenses, Net) + Revenue vs Expenses AreaChart |
| 4 | Build `/crm/finance/expenses` — list, add form, category management |
| 5 | Build `/crm/finance/revenue` and `/crm/finance/profit-loss` pages with graphs |

### Phase 2 — Partner Management (5-6 days)

**Goal:** Track partners, their spending/commissions, and payouts.

| Day | Tasks |
|-----|-------|
| 1 | Create `partners`, `partnerAddresses`, `partnerTransactions` DB tables |
| 2 | Build `POST/GET/PATCH /partners` CRUD + per-partner revenue endpoint |
| 3 | Build `/crm/partners` — list, detail, transaction history |
| 4 | Create `partnerPayouts` table + API. Build `/crm/partners/payouts` |
| 5 | Create `partnerDeals` table + API. Build `/crm/partners/deals` Kanban |
| 6 | Build per-partner spend graph (horizontal bar chart) in CRM dashboard |

### Phase 3 — Enhanced Customer CRM (2-3 days)

**Goal:** Add order history, activity timeline, segments to existing customer pages.

| Day | Tasks |
|-----|-------|
| 1 | Create `communicationLog` table + API. Add timeline component. |
| 2 | Enhance customer detail page: add order history list, communication timeline |
| 3 | Build customer segments page + tag management |

### Phase 4 — P&L, Cash Flow, Budgets (3-4 days)

**Goal:** Financial reports and budget management.

| Day | Tasks |
|-----|-------|
| 1 | Create `expenseBudgets` table + budget API. Build budget management page. |
| 2 | Build P&L page with waterfall/stacked chart. |
| 3 | Build cash flow page with area chart. |
| 4 | Add budget vs actual graph to finance dashboard. |

### Phase 5 — Polish & Deployment (2-3 days)

| Day | Tasks |
|-----|-------|
| 1 | Add all remaining graphs. Responsive testing at 320px. |
| 2 | Railway deployment for `crm.tradehubuae.com`. Middleware subdomain routing. |
| 3 | Bug fixes, empty states, loading skeletons, error boundaries. |

## Graph/Chart Inventory

All graphs use **recharts** (already in the project).

| Graph | Type | Page | Phase |
|-------|------|------|-------|
| Revenue vs Expenses | AreaChart (stacked) | `/crm` Dashboard | 1 |
| Expenses by Category | PieChart (donut) | `/crm` Dashboard | 1 |
| Expenses by Person | Horizontal BarChart | `/crm/finance/expenses` | 1 |
| Revenue Trend | AreaChart | `/crm/finance/revenue` | 1 |
| Monthly P&L | Stacked BarChart | `/crm/finance/profit-loss` | 1 |
| Partner Revenue | Horizontal BarChart | `/crm/partners` | 2 |
| Partner Commissions | LineChart | `/crm/partners/:id` | 2 |
| Deal Pipeline | Kanban (no chart) | `/crm/deals` | 2 |
| Budget vs Actual | Grouped BarChart | `/crm/finance/budgets` | 4 |
| Cash Flow | AreaChart | `/crm/finance/cash-flow` | 4 |
| Customer LTV | BarChart | `/crm/customers` | 3 |

## Effort Summary

| Phase | Module | Tables | Endpoints | Pages | Components | Days |
|-------|--------|--------|-----------|-------|------------|------|
| 1 | Finance & Expenses | 3 | 8 | 5 | 6 | 5 |
| 2 | Partners | 5 | 10 | 4 | 4 | 6 |
| 3 | Customer CRM | 1 | 4 | 2 | 3 | 3 |
| 4 | P&L, Budgets, Cash Flow | 1 | 4 | 3 | 3 | 4 |
| 5 | Deployment & Polish | 0 | 0 | 0 | 0 | 3 |
| **Total** | | **10** | **26** | **14** | **16** | **21** |
