# CRM App — `crm.tradehubuae.com`

**Architecture & Implementation Plan**

---

## 1. Vision

A **full CRM module** at `crm.tradehubuae.com` for finance tracking, partner management, customer relationship management, and sales pipeline. CRM lives **inside the existing admin app** (`apps/admin/src/app/crm/`) with subdomain middleware routing.

### Subdomain Architecture

| Subdomain | App | Port | Purpose |
|-----------|-----|------|---------|
| `tradehubuae.com` | `apps/web` | 3000 | Customer storefront |
| `admin.tradehubuae.com` | `apps/admin` | 3001 | Admin dashboard |
| **`crm.tradehubuae.com`** | **`apps/admin` (middleware)** | **3001** | **CRM module — same app, subdomain rewrite** |
| `chat.tradehubuae.com` | `apps/chat` | 3003 | Chat PWA |
| `api.tradehubuae.com` | `apps/api` | 4000 | NestJS REST API |

### Why Inside Admin (Not Separate App)

| Option | Verdict | Reason |
|--------|---------|--------|
| New Next.js app (`apps/crm/`) | ❌ Rejected | Duplicate auth, layout, API client, UI library — too much overhead |
| Inside existing admin (`apps/admin/src/app/crm/`) | ✅ Chosen | Shares AdminShell, auth, API client, icons, shadcn/ui |

### Core Capabilities

| Module | Purpose |
|--------|---------|
| **Finance & Expenses** | Track income, expenses, per-person spending, budgets, P&L, cash flow |
| **Partner Management** | Distributors, resellers, affiliates, suppliers — deals, commissions, payouts |
| **Enhanced Customer CRM** | Order history, activity timeline, segments, support tickets |
| **Deal Pipeline** | Kanban sales pipeline from lead to closed won/lost |

---

## 2. Architecture Overview

```
User → crm.tradehubuae.com
         ↓
    DNS → Railway → Admin Next.js service (:3001)
                        ↓
              Middleware checks hostname
                        ↓
            crm. → rewrite / → /crm (CRM layout)
            admin. → /dashboard (Admin layout)
                        ↓
              ┌───────────┴───────────┐
              │                       │
        apps/admin/src/          apps/api/:4000
        ├── app/crm/             ├── modules/crm/
        │   ├── dashboard        │   ├── expenses
        │   ├── finance/         │   ├── partners
        │   ├── partners/        │   ├── deals
        │   ├── customers/       │   └── communications
        │   ├── deals/           └── shared DB (Postgres)
        │   └── communications/
        └── components/crm/
```

### Data Flow

```
CRM Dashboard (/crm)
  └── Fetches from API → GET /crm/dashboard/*
         ↓
  NestJS CRM Module
  ├── Reads orders, expenses, partners from Postgres
  ├── Aggregates KPIs, trends, reports
  └── Returns JSON → recharts renders charts
```

---

## 3. Database Schema

New file: `packages/database/src/schema/crm/` (10 tables)

### 3.1 Expense Categories

```typescript
export const expenseCategories = pgTable("expense_categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  icon: varchar("icon", { length: 50 }),
  color: varchar("color", { length: 7 }),
  sortOrder: integer("sort_order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});
```

**Seed categories (12):** Marketing, Shipping, Office & Admin, Supplier Payments, Staff Salaries, Commission Payouts, IT & Infrastructure, Professional Services, Travel & Entertainment, Taxes & Licenses, Inventory Purchase, Returns & Refunds — each with a unique color (for pie charts) and Lucide icon.

### 3.2 Expenses

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `title` | varchar(500) | Required |
| `description` | text | Optional |
| `amount` | numeric(12,2) | Required |
| `currency` | varchar(3) | Default AED |
| `categoryId` | uuid FK → expense_categories | Required |
| `userId` | uuid FK → users | Who spent it |
| `partnerId` | uuid FK → partners | Optional — expense related to a partner |
| `purpose` | varchar(500) | **Required** — "what was this for?" |
| `date` | timestamp | Required |
| `receipt` | varchar(1000) | Receipt image URL |
| `status` | enum: PENDING / APPROVED / REJECTED | |
| `approvedBy` | uuid FK → users | |
| `approvedAt` | timestamp | |

### 3.3 Expense Budgets

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `categoryId` | uuid FK → expense_categories | |
| `period` | enum: MONTHLY / QUARTERLY / YEARLY | |
| `amount` | numeric(12,2) | Budgeted amount |
| `spentAmount` | numeric(12,2) | Computed |
| `fiscalYear` | integer | |
| `month` | integer | 1-12 for MONTHLY |
| `quarter` | integer | 1-4 for QUARTERLY |
| Unique | (categoryId, period, fiscalYear, month, quarter) | One budget per category per period |

### 3.4 Partners

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `companyName` | varchar(500) | Required |
| `contactName` | varchar(255) | Required |
| `email` | varchar(255) | Required |
| `phone` | varchar(20) | |
| `type` | enum: DISTRIBUTOR / RESELLER / AFFILIATE / SUPPLIER | |
| `status` | enum: ACTIVE / INACTIVE / SUSPENDED | |
| `commissionRate` | numeric(5,2) | Percentage |
| `paymentTerms` | varchar(100) | e.g. "Net 30" |
| `creditLimit` | numeric(12,2) | |
| `totalRevenue` | numeric(14,2) | Denormalized |
| `totalCommissions` | numeric(14,2) | Denormalized |
| `balance` | numeric(14,2) | Denormalized |
| `logo` | varchar(1000) | |

### 3.5 Partner Addresses

| Column | Type |
|--------|------|
| `id` | uuid PK |
| `partnerId` | uuid FK → partners (cascade) |
| `label` | varchar(100) — "Business", "Warehouse", "Billing" |
| `addressLine1` | varchar(255) |
| `city` | varchar(100) |
| `emirate` | varchar(100) |
| `country` | varchar(100) — default UAE |
| `isDefault` | boolean |

### 3.6 Partner Transactions

| Column | Type |
|--------|------|
| `id` | uuid PK |
| `partnerId` | uuid FK → partners (cascade) |
| `type` | enum: SALE / COMMISSION / EXPENSE / PAYMENT / REFUND / CREDIT / DEBIT |
| `amount` | numeric(14,2) |
| `description` | varchar(500) |
| `reference` | varchar(255) — order number, invoice no |
| `referenceId` | uuid — order ID, payout ID |
| `date` | timestamp |

### 3.7 Partner Payouts

| Column | Type |
|--------|------|
| `id` | uuid PK |
| `partnerId` | uuid FK → partners (cascade) |
| `amount` | numeric(14,2) |
| `periodStart` / `periodEnd` | timestamp |
| `status` | enum: PENDING / PROCESSING / COMPLETED / FAILED |
| `method` | varchar(50) — bank_transfer, check, cash |
| `transactionId` | varchar(255) |
| `paidAt` | timestamp |

### 3.8 Partner Deals

| Column | Type |
|--------|------|
| `id` | uuid PK |
| `title` | varchar(500) |
| `partnerId` / `customerId` | uuid FK (nullable) |
| `value` | numeric(12,2) |
| `stage` | enum: LEAD / QUALIFIED / PROPOSAL / NEGOTIATION / CLOSED_WON / CLOSED_LOST |
| `probability` | integer (0-100) |
| `expectedCloseDate` | timestamp |
| `assignedTo` | uuid FK → users |
| `lostReason` | varchar(500) |

### 3.9 Communication Log

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `entityType` | varchar(50) | "customer", "partner", "deal" |
| `entityId` | uuid | Polymorphic |
| `type` | enum: EMAIL / CALL / MEETING / NOTE / TICKET | |
| `subject` | varchar(500) | |
| `content` | text | Required |
| `performedBy` | uuid FK → users | |

### 3.10 Indexes

- `chat_messages(session_id, created_at)` — fast session message loading
- `chat_sessions(status, last_message_at)` — active session sorting
- `chat_sessions(assigned_admin_id)` — admin's session list

---

## 4. API Endpoints

All endpoints under `/api/v1/crm/*` prefix. NestJS module at `apps/api/src/modules/crm/`.

### 4.1 Finance & Expenses

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/crm/expense-categories` | List all categories |
| `POST` | `/crm/expense-categories` | Create category |
| `PATCH` | `/crm/expense-categories/:id` | Update category |
| `DELETE` | `/crm/expense-categories/:id` | Delete (only if no expenses) |
| `GET` | `/crm/expenses` | List expenses (paginated, filterable) |
| `POST` | `/crm/expenses` | Create expense |
| `GET` | `/crm/expenses/:id` | Expense detail |
| `PATCH` | `/crm/expenses/:id` | Update expense |
| `PATCH` | `/crm/expenses/:id/approve` | Approve expense |
| `PATCH` | `/crm/expenses/:id/reject` | Reject expense |
| `DELETE` | `/crm/expenses/:id` | Delete expense |
| `GET` | `/crm/expenses/reports/by-category` | Grouped by category (pie chart) |
| `GET` | `/crm/expenses/reports/by-person` | Grouped by person (bar chart) |
| `GET` | `/crm/expenses/reports/by-purpose` | Grouped by purpose |
| `GET` | `/crm/expenses/reports/monthly` | Monthly totals (trend chart) |

**Expense list query params:** `?page=1&limit=20&categoryId=uuid&userId=uuid&partnerId=uuid&status=PENDING&from=2025-01-01&to=2025-12-31&search=term&sort=date&order=desc`

### 4.2 Partners

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/crm/partners` | List partners (paginated, filterable) |
| `POST` | `/crm/partners` | Create partner |
| `GET` | `/crm/partners/:id` | Partner detail with stats |
| `PATCH` | `/crm/partners/:id` | Update partner |
| `DELETE` | `/crm/partners/:id` | Soft-delete |
| `GET` | `/crm/partners/:id/transactions` | Transaction history |
| `GET` | `/crm/partners/:id/revenue` | Revenue over time (chart) |
| `GET` | `/crm/partners/revenue-top` | Top partners by revenue (bar chart) |

### 4.3 Partner Deals

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/crm/partner-deals` | List deals (filterable by stage) |
| `POST` | `/crm/partner-deals` | Create deal |
| `GET` | `/crm/partner-deals/:id` | Deal detail |
| `PATCH` | `/crm/partner-deals/:id` | Update deal |
| `PATCH` | `/crm/partner-deals/:id/stage` | Move stage |
| `DELETE` | `/crm/partner-deals/:id` | Delete deal |
| `GET` | `/crm/partner-deals/pipeline` | Grouped by stage (Kanban) |

### 4.4 Partner Payouts

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/crm/partner-payouts` | List payouts |
| `POST` | `/crm/partner-payouts` | Create payout |
| `PATCH` | `/crm/partner-payouts/:id` | Update status |
| `GET` | `/crm/partner-payouts/summary` | Aggregated summary |

### 4.5 CRM Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/crm/dashboard/overview` | KPIs: revenue, expenses, net, margins, counts |
| `GET` | `/crm/dashboard/revenue-vs-expenses` | Area chart data (12 months) |
| `GET` | `/crm/dashboard/cash-flow` | Cash flow data |
| `GET` | `/crm/dashboard/profit-loss` | P&L for a period |

### 4.6 Communications & Customers

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/crm/communications` | List comms (filterable) |
| `POST` | `/crm/communications` | Add entry |
| `GET` | `/crm/customers/:id/orders` | Customer order history |
| `GET` | `/crm/customers/:id/communications` | Customer timeline |
| `GET` | `/crm/customers/:id/stats` | LTV, AOV, frequency, churn |
| `GET` | `/crm/customers/top-spenders` | Bar chart data |

---

## 5. Pages & UI

### 5.1 CRM Dashboard (`/crm`)

Main landing page when visiting `crm.tradehubuae.com`.

```
┌─ KPI Cards Row ─────────────────────────────────────────────────┐
│ [Revenue: AED 4.2M] [Expenses: AED 1.85M] [Net: AED 2.35M]     │
│ [Gross Margin: 44%] [Avg Order: AED 8.5K] [Partners: 24]        │
├─ Charts Row 1 ──────────────────────────────────────────────────┤
│ ┌─ Revenue vs Expenses (AreaChart, 12 months) ─┐ ┌─ Expense    ┐│
│ │                                                │ │ by Category ││
│ │                                                │ │ (PieChart)  ││
│ └────────────────────────────────────────────────┘ └─────────────┘│
├─ Charts Row 2 ──────────────────────────────────────────────────┤
│ ┌─ Expenses by Person (Horizontal BarChart) ─┐ ┌─ Top Partners ┐│
│ │                                             │ │ by Revenue    ││
│ │                                             │ │ (BarChart)    ││
│ └─────────────────────────────────────────────┘ └───────────────┘│
├─ Recent Expenses Table ─────────────────────────────────────────┤
│ Date │ Person │ Category │ Amount │ Purpose │ Status             │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Expense List (`/crm/finance/expenses`)

- **Desktop:** Table — Title, Category (colored badge), Person, Purpose (truncated), Amount (AED), Date, Status badge, Actions
- **Mobile:** Card layout per expense
- **Filters:** Category dropdown, Person dropdown, Date range, Status tabs (All/Pending/Approved/Rejected), Search
- **Bulk actions:** Approve selected, Reject selected

### 5.3 Add Expense (`/crm/finance/expenses/new`)

Form fields:
- **Title** — text input (required)
- **Amount** — number with AED prefix (required)
- **Category** — dropdown from expenseCategories (required)
- **Spent By** — user dropdown (defaults to current user) (required)
- **Purpose** — textarea: "what was this for?" (required)
- **Related Partner** — optional partner dropdown
- **Date** — date picker (defaults to today)
- **Receipt** — file upload (image/PDF)
- **Notes** — textarea

### 5.4 Expense Categories (`/crm/finance/expenses/categories`)

List with: Color indicator + icon, Name, Description, Budget amount + progress bar (spent vs budgeted), Edit/Delete

### 5.5 Revenue Analytics (`/crm/finance/revenue`)

Charts:
- Revenue Trend — AreaChart by month (12 months)
- Revenue by Product Category — BarChart
- Revenue by Payment Method — PieChart
- Monthly Comparison — Year-over-year bar chart

### 5.6 Profit & Loss (`/crm/finance/profit-loss`)

Period selector (Month / Quarter / Year / Custom), then:

```
Revenue:            AED 450,000
COGS:              -AED 247,500     (55%)
Gross Profit:       AED 202,500     (45%)
Expenses:          -AED 85,000      (18.9%)
  - Marketing:     -AED 35,000
  - Shipping:      -AED 12,000
  - Salaries:      -AED 30,000
  - Other:         -AED 8,000
Net Profit:         AED 117,500     (26.1%)
```

Stacked bar chart: Revenue / COGS / Expenses / Net by month.

### 5.7 Cash Flow (`/crm/finance/cash-flow`)

Area chart: money in vs money out over time. Table of all transactions ordered by date.

### 5.8 Budgets (`/crm/finance/budgets`)

- Budget list: category, period, budgeted, spent, remaining, progress bar
- Budget form: category, period (monthly/quarterly/yearly), amount
- Budget vs actual chart: Grouped bar chart per category

### 5.9 Partner List (`/crm/partners`)

```
┌─ Filters + Search ─────────────────────────────────────────────────┐
│ [All Types ▼] [All Status ▼] [Search by name/company...]           │
├─ Table ────────────────────────────────────────────────────────────┤
│ Company         │ Type      │ Status │ Revenue      │ Commission  │
│ Dubai Tech Dist │ Distrib. │ Active │ AED 2,500,000│ AED 125,000 │
│ Gulf IT Resell  │ Reseller  │ Active │ AED 850,000  │ AED 42,500  │
└───────────────────────────────────────────────────────────────────┘
```

Columns: Logo, Company Name, Contact Person, Type badge, Status badge, Total Revenue, Total Commissions, Pending Payout, Last Deal Date.

### 5.10 Partner Detail (`/crm/partners/:id`)

```
┌─ Header ────────────────────────────────────────────────────────────┐
│ [Logo] Dubai Tech Distributors  ·  Distributor  ·  [Active] badge   │
│ Contact: Khalid Al Maktoum  ·  khalid@dubai-tech.ae                 │
├─ Stats Row ─────────────────────────────────────────────────────────┤
│ [Revenue: AED 2.5M] [Commissions: AED 125K] [Balance: AED 45K]    │
│ [Deals: 12] [Open Value: AED 800K] [Credit Limit: AED 500K]        │
├─ Tabs ──────────────────────────────────────────────────────────────┤
│ [Transactions] [Deals] [Payouts] [Documents] [Communications]       │
└─────────────────────────────────────────────────────────────────────┘
```

### 5.11 Deal Pipeline (`/crm/deals`)

Kanban board with drag-and-drop:

```
┌─ Lead ─┐ ┌─ Qualified ─┐ ┌─ Proposal ─┐ ┌─ Negotiation ┐ ┌─ Won ─┐ ┌─ Lost ─┐
│ Deal 1  │ │ Deal 3      │ │ Deal 5      │ │ Deal 7        │ │ Deal 2│ │ Deal 4│
│ AED 50K │ │ AED 120K    │ │ AED 300K    │ │ AED 500K      │ │200K   │ │ 80K   │
└─────────┘ └─────────────┘ └────────────┘ └──────────────┘ └───────┘ └────────┘
```

Each card: Title, Value, Partner, Expected close date, Assigned to.

### 5.12 Customer Detail Enhancement (`/crm/customers/:id`)

Enhanced with tabs:

```
┌─ Stats Row ───────────────────────────────────────────────────────┐
│ [Orders: 24] [Spent: AED 340K] [LTV: AED 340K] [AOV: AED 14.2K] │
│ [Last Purchase: 2 days ago] [Churn Risk: Low]                     │
├─ Tabs ────────────────────────────────────────────────────────────┤
│ [Order History] [Timeline] [Communication Log] [Tickets]          │
└───────────────────────────────────────────────────────────────────┘
```

**Customer Segments:** VIP (>AED 100K), Wholesale (company, bulk), New (<30 days), At-risk (>90 days no purchase), High-value (AOV >AED 20K), Repeat Buyer (>5 orders).

---

## 6. Charts (All recharts)

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

---

## 7. Shared Components

All at `apps/admin/src/components/crm/`:

| Component | Props | Purpose |
|-----------|-------|---------|
| `KpiCard` | label, value, icon, trend, color, bg, href | Stat display card |
| `ExpenseChart` | type, data, height | Wraps recharts with design system styles |
| `PartnerSelect` | value, onChange, placeholder, types | Searchable partner dropdown |
| `CategorySelect` | value, onChange, showBudget | Category dropdown with color dot |
| `FinancialPeriodPicker` | value, onChange, presets | Month/Quarter/Year/Custom selector |
| `MoneyDisplay` | amount, currency, compact, negative | Formatted AED display |
| `PurposeTag` | text, maxLength | Truncated text with tooltip |
| `Timeline` | items, renderItem | Chronological vertical timeline |
| `DealStageBadge` | stage | Colored stage badge |
| `BudgetProgressBar` | budgeted, spent, currency | Progress bar with color thresholds |
| `ReportsDownload` | type, params, formats | CSV/PDF download button |

### Page Layout Template

All CRM pages follow this pattern:

```tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@tradehubuae/ui";
import { KpiCard, ExpenseChart, FinancialPeriodPicker } from "@/components/crm";

export default function CrmPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-ink sm:text-2xl">Page Title</h1>
          <p className="mt-0.5 text-xs text-ink-2 sm:text-sm">Description</p>
        </div>
        <div className="flex items-center gap-2">{/* Actions */}</div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard ... />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Chart</CardTitle></CardHeader>
          <CardContent><div className="h-64"><ResponsiveContainer><AreaChart ... /></div></CardContent>
        </Card>
      </div>

      <Card>{/* Table or list */}</Card>
    </div>
  );
}
```

---

## 8. Folder Structure

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

---

## 9. Middleware — Subdomain Routing

Create `apps/admin/src/middleware.ts`:

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const url = request.nextUrl.clone();

  if (hostname.startsWith("crm.")) {
    if (url.pathname === "/") {
      url.pathname = "/crm";
    }
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico).*)"],
};
```

---

## 10. Implementation Phases

### Phase 1 — Finance & Expense Tracking (5 days)

**Goal:** Track who spent what, for what purpose, with graphs.

| Day | Tasks |
|-----|-------|
| 1 | Create `expenseCategories` + `expenses` DB tables. Seed 12 categories. |
| 2 | Build `POST/GET /expenses`, report endpoints (`by-category`, `by-person`, `by-purpose`, `monthly`) |
| 3 | Build CRM Dashboard (`/crm`) — KPI cards + Revenue vs Expenses AreaChart + Expense by Category PieChart |
| 4 | Build `/crm/finance/expenses` — list with filters + add form + category management |
| 5 | Build `/crm/finance/revenue` and `/crm/finance/profit-loss` pages |

### Phase 2 — Partner Management (6 days)

| Day | Tasks |
|-----|-------|
| 1 | Create `partners`, `partnerAddresses`, `partnerTransactions` DB tables |
| 2 | Build `POST/GET/PATCH /partners` CRUD + per-partner revenue endpoint |
| 3 | Build `/crm/partners` list + detail + transaction history |
| 4 | Create `partnerPayouts` table + API. Build `/crm/partners/payouts` |
| 5 | Create `partnerDeals` table + API. Build `/crm/deals` Kanban |
| 6 | Build per-partner spend graph on CRM dashboard |

### Phase 3 — Enhanced Customer CRM (3 days)

| Day | Tasks |
|-----|-------|
| 1 | Create `communicationLog` table + API. Build Timeline component |
| 2 | Enhance customer detail page: order history list + communication timeline |
| 3 | Build customer segments page + tag management |

### Phase 4 — P&L, Cash Flow, Budgets (4 days)

| Day | Tasks |
|-----|-------|
| 1 | Create `expenseBudgets` table + API. Build budget management page |
| 2 | Build P&L page with stacked bar chart |
| 3 | Build cash flow page with area chart |
| 4 | Add budget vs actual graph to finance dashboard |

### Phase 5 — Deployment & Polish (3 days)

| Day | Tasks |
|-----|-------|
| 1 | All remaining graphs. Responsive testing at 320px. |
| 2 | Railway deployment for `crm.tradehubuae.com`. Middleware + NextAuth callback URLs |
| 3 | Bug fixes, empty states, loading skeletons, error boundaries |

**Total: ~21 days**

---

## 11. Key TypeScript Interfaces

```typescript
interface Expense {
  id: string;
  title: string;
  amount: number;
  currency: string;
  category: { id: string; name: string; color: string; icon: string };
  user: { id: string; name: string };
  partner?: { id: string; companyName: string } | null;
  purpose: string;
  date: string;
  receipt?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

interface DashboardOverview {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  grossMargin: number;
  avgOrderValue: number;
  activePartners: number;
  totalCustomers: number;
  pendingExpenses: number;
  expenseByCategory: { categoryId: string; categoryName: string; color: string; total: number; percentage: number }[];
  expenseByPerson: { userId: string; userName: string; total: number }[];
  revenueTrend: { month: string; revenue: number; expenses: number }[];
}

interface Partner {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string | null;
  type: "DISTRIBUTOR" | "RESELLER" | "AFFILIATE" | "SUPPLIER";
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  commissionRate: number;
  totalRevenue: number;
  totalCommissions: number;
  balance: number;
  logo: string | null;
}

interface PartnerDeal {
  id: string;
  title: string;
  value: number;
  stage: "LEAD" | "QUALIFIED" | "PROPOSAL" | "NEGOTIATION" | "CLOSED_WON" | "CLOSED_LOST";
  probability: number;
  expectedCloseDate?: string;
  assignedTo?: { id: string; name: string };
}

interface CustomerStats {
  totalOrders: number;
  totalSpent: number;
  lifetimeValue: number;
  averageOrderValue: number;
  purchaseFrequency: number;
  lastPurchaseDate: string | null;
  churnRisk: "LOW" | "MEDIUM" | "HIGH";
}
```

---

## 12. Railway Deployment

### Same Service as Admin

```
crm.tradehubuae.com  CNAME  →  <railway-generated>.railway.app
         ↓
Same Railway service as admin.tradehubuae.com
         ↓
Next.js middleware rewrites / → /crm
```

### Adding CRM Subdomain

```bash
railway domain --domain crm.tradehubuae.com
```

### DNS

```
crm.tradehubuae.com  CNAME  →  <railway-generated>.railway.app
```

### NextAuth Configuration

```typescript
// apps/admin/src/lib/auth.ts
callbacks: {
  async redirect({ url, baseUrl }) {
    if (url.startsWith("/")) return url;
    if (url.startsWith("https://crm.tradehubuae.com")) return url;
    if (url.startsWith("https://admin.tradehubuae.com")) return url;
    return baseUrl;
  },
},
```

### Pre-deployment Checklist

- [ ] All DB tables created via drizzle migrations
- [ ] All API endpoints implemented and tested
- [ ] Middleware handles `crm.` subdomain correctly
- [ ] NextAuth allows `crm.tradehubuae.com` callback URLs
- [ ] Mobile responsive at 320px
- [ ] All graphs handle empty data gracefully
- [ ] Seed data for expense categories added
- [ ] Loading skeletons, error boundaries, empty states

---

## 13. Environment Variables

```env
# No new vars needed — shares admin's existing:
NEXT_PUBLIC_API_URL=https://api.tradehubuae.com/api/v1
DATABASE_URL=postgres://...
NEXTAUTH_URL=https://admin.tradehubuae.com
NEXTAUTH_SECRET=...
```

Only change: ensure `NEXTAUTH_URL` allows both `admin.tradehubuae.com` and `crm.tradehubuae.com` (handled in NextAuth redirect callback).
