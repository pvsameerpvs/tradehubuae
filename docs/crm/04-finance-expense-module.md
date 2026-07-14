# Finance & Expense Management Module

**Priority: PHASE 1 — CRITICAL**

This is the user's top priority: track **how much money is spent, by whom, for what purpose**.

---

## Core Concept

The finance module tracks two flows:

```
INCOME (Revenue)
  └── Orders → Payments → Revenue Dashboard
      
OUTGO (Expenses)
  └── Expenses → Categories → Per-person → Purpose → Expense Dashboard

PROFIT = Revenue - Expenses
```

---

## Pages & Components

### 1. CRM Dashboard (`/crm`)

The main landing page when visiting `crm.tradehubuae.com`.

**Layout:**
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

**Data sources:** `GET /crm/dashboard/overview`, `GET /crm/dashboard/revenue-vs-expenses`, `GET /crm/expenses/reports/by-category`, `GET /crm/expenses/reports/by-person`, `GET /crm/partners/revenue-top`, `GET /crm/expenses`

### 2. Expense List (`/crm/finance/expenses`)

**Desktop table:** Title, Category (colored badge), Person, Purpose (truncated), Amount (AED), Date, Status badge, Actions
**Mobile card:** Card per expense with all fields stacked

**Filters:** Category dropdown, Person dropdown, Date range, Status tabs (All/Pending/Approved/Rejected), Search box

**Bulk actions:** Approve selected, Reject selected

### 3. Add Expense (`/crm/finance/expenses/new`)

Form fields:
- **Title** — text input (required)
- **Amount** — number input with AED prefix (required)
- **Category** — dropdown from `expenseCategories` (required)
- **Spent By** — user dropdown (defaults to current user) (required)
- **Purpose** — textarea: "what was this for?" (required) ← **USER'S KEY REQUIREMENT**
- **Related Partner** — optional partner dropdown
- **Date** — date picker (defaults to today)
- **Receipt** — file upload (image/PDF)
- **Notes** — textarea

### 4. Expense Categories (`/crm/finance/expenses/categories`)

List of categories with:
- Color indicator + icon
- Name and description
- Budget amount + progress bar (spent vs budgeted)
- Edit/delete actions

### 5. Revenue Analytics (`/crm/finance/revenue`)

Charts:
- **Revenue Trend** — AreaChart by month (12 months)
- **Revenue by Product Category** — BarChart
- **Revenue by Payment Method** — PieChart
- **Monthly Comparison** — Year-over-year bar chart

### 6. Profit & Loss (`/crm/finance/profit-loss`)

```
┌─ Period Selector ──────────────────────────────────────┐
│ [Month: March 2025] [Q1 2025] [Year: 2025] [Custom]   │
├─ P&L Summary ──────────────────────────────────────────┤
│ Revenue:            AED 450,000                         │
│ COGS:              -AED 247,500     (55%)               │
│ Gross Profit:       AED 202,500     (45%)               │
│ Expenses:          -AED 85,000      (18.9%)             │
│   - Marketing:     -AED 35,000                          │
│   - Shipping:      -AED 12,000                          │
│   - Salaries:      -AED 30,000                          │
│   - Other:         -AED 8,000                           │
│ Net Profit:         AED 117,500     (26.1%)             │
├─ Chart ────────────────────────────────────────────────┤
│ Stacked bar: Revenue / COGS / Expenses / Net by month   │
└─────────────────────────────────────────────────────────┘
```

### 7. Cash Flow (`/crm/finance/cash-flow`)

Area chart showing money in vs money out over time. Table of all transactions (payments received + expenses paid) ordered by date.

### 8. Budgets (`/crm/finance/budgets`)

- **Budget list** — category, period, budgeted amount, spent amount, remaining, progress bar
- **Budget form** — select category, period (monthly/quarterly/yearly), amount
- **Budget vs actual chart** — Grouped bar chart (budgeted bar next to actual bar per category)

---

## Graph Implementation Details

All graphs use **recharts** (already installed). Patterns follow existing `apps/admin/src/app/analytics/page.tsx`.

### Revenue vs Expenses AreaChart

```tsx
<AreaChart data={data}>
  <Area type="monotone" dataKey="revenue" stackId="1" stroke="#134A7C" fill="#134A7C" fillOpacity={0.1} />
  <Area type="monotone" dataKey="expenses" stackId="2" stroke="#C13515" fill="#C13515" fillOpacity={0.1} />
</AreaChart>
```

### Expenses by Category PieChart

```tsx
<PieChart>
  <Pie data={data} dataKey="total" nameKey="categoryName" cx="50%" cy="50%" innerRadius={50} outerRadius={80}>
    {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
  </Pie>
</PieChart>
```

### Expenses by Person BarChart

```tsx
<BarChart data={data} layout="vertical">
  <Bar dataKey="total" fill="#134A7C" radius={[0, 4, 4, 0]} />
  <YAxis type="category" dataKey="userName" />
</BarChart>
```

### Budget vs Actual GroupedBarChart

```tsx
<BarChart data={data}>
  <Bar dataKey="budgeted" fill="#94A3B8" radius={[4, 4, 0, 0]} />
  <Bar dataKey="actual" fill="#134A7C" radius={[4, 4, 0, 0]} />
</BarChart>
```

---

## Key Interfaces

```typescript
interface Expense {
  id: string;
  title: string;
  description?: string;
  amount: number;
  currency: string;
  category: { id: string; name: string; color: string; icon: string };
  user: { id: string; name: string };
  partner?: { id: string; companyName: string } | null;
  purpose: string;
  date: string;
  receipt?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  approvedBy?: { id: string; name: string } | null;
  approvedAt?: string;
  notes?: string;
  createdAt: string;
}

interface ExpenseCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon: string;
  color: string;
  sortOrder: number;
  isActive: boolean;
  budget?: {
    period: "MONTHLY" | "QUARTERLY" | "YEARLY";
    amount: number;
    spentAmount: number;
  };
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
```
