# API Endpoints — CRM Module

All endpoints under `/api/v1/crm/*` prefix. Follow existing NestJS patterns in `apps/api/src/`.

---

## Finance & Expenses

### Expense Categories

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/crm/expense-categories` | List all categories |
| `POST` | `/crm/expense-categories` | Create a category |
| `PATCH` | `/crm/expense-categories/:id` | Update category |
| `DELETE` | `/crm/expense-categories/:id` | Delete category (only if no expenses) |

**GET /crm/expense-categories** response:
```json
[
  {
    "id": "uuid",
    "name": "Marketing & Advertising",
    "slug": "marketing",
    "description": "Ad spend, promotions, events",
    "icon": "Megaphone",
    "color": "#134A7C",
    "sortOrder": 1,
    "isActive": true,
    "budget": { "period": "MONTHLY", "amount": 50000, "spentAmount": 32500 }
  }
]
```

### Expenses

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/crm/expenses` | List expenses (paginated, filterable) |
| `POST` | `/crm/expenses` | Create expense |
| `GET` | `/crm/expenses/:id` | Expense detail |
| `PATCH` | `/crm/expenses/:id` | Update expense |
| `PATCH` | `/crm/expenses/:id/approve` | Approve expense |
| `PATCH` | `/crm/expenses/:id/reject` | Reject expense |
| `DELETE` | `/crm/expenses/:id` | Delete expense |

**GET /crm/expenses** query params:
```
?page=1&limit=20
&categoryId=uuid
&userId=uuid
&partnerId=uuid
&status=PENDING|APPROVED|REJECTED
&from=2025-01-01&to=2025-12-31
&search=term
&sort=date|amount|title
&order=asc|desc
```

**GET /crm/expenses** response:
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Google Ads Campaign",
      "description": "Q1 2025 search ads",
      "amount": 15000.00,
      "currency": "AED",
      "category": { "id": "uuid", "name": "Marketing & Advertising", "color": "#134A7C" },
      "user": { "id": "uuid", "name": "Ahmed Hassan" },
      "partner": null,
      "purpose": "Google Ads for IT equipment keywords",
      "date": "2025-03-01",
      "receipt": null,
      "status": "APPROVED",
      "approvedBy": { "id": "uuid", "name": "Admin" }
    }
  ],
  "meta": { "total": 45, "page": 1, "limit": 20, "totalPages": 3 }
}
```

### Reports

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/crm/expenses/reports/by-category` | Expenses grouped by category (for pie chart) |
| `GET` | `/crm/expenses/reports/by-person` | Expenses grouped by person (for bar chart) |
| `GET` | `/crm/expenses/reports/by-purpose` | Expenses grouped by purpose |
| `GET` | `/crm/expenses/reports/monthly` | Monthly expense totals (for trend chart) |

**GET /crm/expenses/reports/by-category** response:
```json
[
  { "categoryId": "uuid", "categoryName": "Marketing", "color": "#134A7C", "total": 450000, "count": 12, "percentage": 32.5 }
]
```

**GET /crm/expenses/reports/by-person** response:
```json
[
  { "userId": "uuid", "userName": "Ahmed Hassan", "total": 350000, "count": 24, "categories": [
    { "categoryName": "Marketing", "total": 200000 },
    { "categoryName": "Travel", "total": 150000 }
  ]}
]
```

---

## Partners

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/crm/partners` | List partners (paginated, filterable) |
| `POST` | `/crm/partners` | Create partner |
| `GET` | `/crm/partners/:id` | Partner detail with stats |
| `PATCH` | `/crm/partners/:id` | Update partner |
| `DELETE` | `/crm/partners/:id` | Soft-delete partner |
| `GET` | `/crm/partners/:id/transactions` | Partner transaction history |
| `GET` | `/crm/partners/:id/revenue` | Partner revenue over time (for chart) |
| `GET` | `/crm/partners/revenue-top` | Top partners by revenue (for bar chart) |

**GET /crm/partners** response:
```json
{
  "data": [
    {
      "id": "uuid",
      "companyName": "Dubai Tech Distributors",
      "contactName": "Khalid Al Maktoum",
      "email": "khalid@dubai-tech.ae",
      "phone": "+971 50 123 4567",
      "type": "DISTRIBUTOR",
      "status": "ACTIVE",
      "commissionRate": 5.00,
      "paymentTerms": "Net 30",
      "creditLimit": 500000,
      "totalRevenue": 2500000,
      "totalCommissions": 125000,
      "balance": 45000,
      "dealsCount": 12,
      "openDealsValue": 800000
    }
  ],
  "meta": { "total": 25, "page": 1, "limit": 20 }
}
```

---

## Partner Deals

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/crm/partner-deals` | List deals (filterable by stage) |
| `POST` | `/crm/partner-deals` | Create deal |
| `GET` | `/crm/partner-deals/:id` | Deal detail |
| `PATCH` | `/crm/partner-deals/:id` | Update deal |
| `PATCH` | `/crm/partner-deals/:id/stage` | Move deal stage |
| `DELETE` | `/crm/partner-deals/:id` | Delete deal |
| `GET` | `/crm/partner-deals/pipeline` | Deals grouped by stage (for Kanban) |

---

## Partner Payouts

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/crm/partner-payouts` | List payouts |
| `POST` | `/crm/partner-payouts` | Create payout |
| `PATCH` | `/crm/partner-payouts/:id` | Update payout status |
| `GET` | `/crm/partner-payouts/summary` | Aggregated payout summary |

---

## CRM Dashboard

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/crm/dashboard/overview` | Main CRM KPIs (revenue, expenses, net, margins, counts) |
| `GET` | `/crm/dashboard/revenue-vs-expenses` | Revenue vs expenses over time (area chart data) |
| `GET` | `/crm/dashboard/cash-flow` | Cash flow data |
| `GET` | `/crm/dashboard/profit-loss` | P&L summary for a period |

**GET /crm/dashboard/overview** response:
```json
{
  "totalRevenue": 4200000,
  "totalExpenses": 1850000,
  "netProfit": 2350000,
  "grossMargin": 44.0,
  "avgOrderValue": 8500,
  "activePartners": 24,
  "totalCustomers": 320,
  "pendingExpenses": 4,
  "expenseByCategory": [
    { "category": "Marketing", "total": 450000, "percentage": 24.3 }
  ],
  "expenseByPerson": [
    { "name": "Ahmed", "total": 350000 }
  ],
  "revenueTrend": [
    { "month": "Jan", "revenue": 350000, "expenses": 140000 }
  ]
}
```

---

## Communication Log

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/crm/communications` | List comms (filterable by entityType/entityId) |
| `POST` | `/crm/communications` | Add communication entry |

---

## CRM Enhanced Customers

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/crm/customers/:id/orders` | Customer order history |
| `GET` | `/crm/customers/:id/communications` | Customer communication timeline |
| `GET` | `/crm/customers/:id/stats` | Enhanced customer stats (LTV, AOV, frequency, churn risk) |
| `GET` | `/crm/customers/top-spenders` | Top customers by total spent (bar chart data) |
