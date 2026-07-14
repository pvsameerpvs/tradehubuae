# CRM UI Components

## Shared Component Library

All components at `apps/admin/src/components/crm/`. Use `@tradehubuae/ui` (shadcn) primitives + lucide-react icons.

---

### 1. KpiCard.tsx

```tsx
<KpiCard
  label="Total Revenue"
  value="AED 4,200,000"
  icon={DollarSign}
  trend={{ value: "+12.5%", up: true }}
  color="text-emerald-600"
  bg="bg-emerald-50"
  href="/crm/finance/revenue"
/>
```

Displays: icon, label, value, optional trend indicator, optional link.
Reuses the pattern from existing dashboard stat cards.

### 2. ExpenseChart.tsx

```tsx
<ExpenseChart
  type="by-category"         // "by-category" | "by-person" | "by-purpose"
  data={categoryData}
  height={300}
/>
```

Wraps recharts with pre-configured styles matching the design system.

### 3. PartnerSelect.tsx

```tsx
<PartnerSelect
  value={selectedPartnerId}
  onChange={setSelectedPartnerId}
  placeholder="Search partner..."
  types={["DISTRIBUTOR", "RESELLER"]}  // optional filter
/>
```

Searchable dropdown with partner company name + type badge.

### 4. CategorySelect.tsx

```tsx
<CategorySelect
  value={categoryId}
  onChange={setCategoryId}
  showBudget // optionally show budget indicator
/>
```

Dropdown with color dot + name, optional budget spent indicator.

### 5. FinancialPeriodPicker.tsx

```tsx
<FinancialPeriodPicker
  value={{ preset: "THIS_MONTH" }}
  onChange={setPeriod}
  presets={["THIS_MONTH", "LAST_MONTH", "THIS_QUARTER", "THIS_YEAR", "CUSTOM"]}
/>
```

Reusable period selector used on P&L, Revenue, Cash Flow pages.

### 6. MoneyDisplay.tsx

```tsx
<MoneyDisplay amount={4200000} currency="AED" />
// → "AED 4,200,000"

<MoneyDisplay amount={4200000} compact />
// → "AED 4.2M"

<MoneyDisplay amount={-5000} negative />
// → "(AED 5,000)"
```

### 7. PurposeTag.tsx

```tsx
<PurposeTag text="Google Ads for IT equipment keywords" maxLength={40} />
```

Truncated text with full tooltip on hover.

### 8. Timeline.tsx

```tsx
<Timeline
  items={communications}
  renderItem={(item) => (
    <TimelineItem
      icon={Phone}
      title="Call with customer"
      description="Discussed order #1234"
      date="2 hours ago"
      user="Ahmed"
    />
  )}
/>
```

Chronological vertical timeline used on customer/partner detail pages.

### 9. DealStageBadge.tsx

```tsx
<DealStageBadge stage="NEGOTIATION" />
// Colored badge: Lead (gray), Qualified (blue), Proposal (yellow), Negotiation (orange), Won (green), Lost (red)
```

### 10. BudgetProgressBar.tsx

```tsx
<BudgetProgressBar
  budgeted={50000}
  spent={32500}
  currency="AED"
/>
// Shows: "AED 32,500 / AED 50,000 (65%)" + colored progress bar
// Green if < 80%, Yellow if 80-100%, Red if > 100%
```

### 11. ReportsDownload.tsx

```tsx
<ReportsDownload
  type="expense-report"
  params={{ from: "2025-01-01", to: "2025-12-31" }}
  formats={["csv", "pdf"]}
/>
```

---

## Page Layout Template

All CRM pages follow this pattern:

```tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@tradehubuae/ui";
import { KpiCard, ExpenseChart, FinancialPeriodPicker } from "@/components/crm";

export default function CrmPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-ink sm:text-2xl">Page Title</h1>
          <p className="mt-0.5 text-xs text-ink-2 sm:text-sm">Description</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Actions: period picker, refresh, add button */}
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard ... />
        <KpiCard ... />
      </div>

      {/* Charts */}
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Chart Title</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer><AreaChart ... />
            </div>
          </CardContent>
        </Card>
        ...
      </div>

      {/* Data Table / List */}
      <Card>
        {/* Table or card list */}
      </Card>
    </div>
  );
}
```
