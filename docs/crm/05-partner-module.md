# Partner Management Module

**Priority: PHASE 2 — HIGH**

Partners are distributors, resellers, affiliates, and suppliers who work with TradeHub UAE.

---

## Partner Types

| Type | Description | Commission Model |
|------|-------------|-----------------|
| **Distributor** | Large-volume reseller with exclusive territory | Tiered % per volume bracket |
| **Reseller** | Sells to end customers, marks up our price | Fixed % per sale |
| **Affiliate** | Drives leads/referrals only | Flat fee per qualified lead |
| **Supplier** | Provides products to us for resale | N/A (we pay them) |

---

## Pages

### 1. Partners List (`/crm/partners`)

```
┌─ Filters + Search ─────────────────────────────────────────────────┐
│ [All Types ▼] [All Status ▼] [Search by name/company...]           │
├─ Partner Cards/Table ──────────────────────────────────────────────┤
│ Company         │ Type      │ Status │ Revenue      │ Commission  │
│ Dubai Tech Dist │ Distrib. │ Active │ AED 2,500,000│ AED 125,000 │
│ Gulf IT Resell  │ Reseller  │ Active │ AED 850,000  │ AED 42,500  │
│ ...              │           │        │              │             │
└───────────────────────────────────────────────────────────────────┘
```

**Columns:** Logo, Company Name, Contact Person, Type (badge), Status (badge), Total Revenue, Total Commissions, Pending Payout, Last Deal Date

### 2. Partner Detail (`/crm/partners/:id`)

```
┌─ Header ────────────────────────────────────────────────────────────┐
│ [Logo] Dubai Tech Distributors  ·  Distributor  ·  [Active] badge   │
│ Contact: Khalid Al Maktoum  ·  khalid@dubai-tech.ae  ·  +971 50... │
├─ Stats Row ─────────────────────────────────────────────────────────┤
│ [Revenue: AED 2.5M] [Commissions: AED 125K] [Balance: AED 45K]    │
│ [Deals: 12] [Open Value: AED 800K] [Credit Limit: AED 500K]        │
├─ Tabs ──────────────────────────────────────────────────────────────┤
│ [Transactions] [Deals] [Payouts] [Documents] [Communications]       │
├─ Transaction History (default tab) ─────────────────────────────────┤
│ Date │ Type │ Description │ Amount │ Balance                        │
│ ...  │ SALE │ Order #1234 │ +150K  │ 2,500,000                      │
│ ...  │ COMM │ Commission   │ -7,500 │ 125,000                       │
└─────────────────────────────────────────────────────────────────────┘
```

**Tabs under partner detail:**
- **Transactions** — full financial log (sales, commissions, payments)
- **Deals** — deal pipeline for this partner
- **Payouts** — payout history with status
- **Documents** — uploaded contracts/agreements
- **Communications** — activity timeline

### 3. Partner Deals / Pipeline (`/crm/deals`)

Kanban board with columns:
```
┌─ Lead ─┐ ┌─ Qualified ─┐ ┌─ Proposal ─┐ ┌─ Negotiation ┐ ┌─ Closed Won ┐ ┌─ Closed Lost ┐
│ Deal 1  │ │ Deal 3      │ │ Deal 5      │ │ Deal 7        │ │ Deal 2       │ │ Deal 4       │
│ AED 50K │ │ AED 120K    │ │ AED 300K    │ │ AED 500K      │ │ AED 200K     │ │ AED 80K      │
└─────────┘ └─────────────┘ └────────────┘ └──────────────┘ └─────────────┘ └──────────────┘
```

Each card shows: Deal title, Value (AED), Partner name, Expected close date, Assigned to.

### 4. Partner Payouts (`/crm/partners/payouts`)

List of payouts with:
- Partner name, Period (e.g., "March 2025"), Amount, Method, Status (Pending/Completed/Failed), Date paid
- Action: "Mark as Paid" (opens form with method + transaction ID)

---

## Graph for Partners

### Partner Revenue BarChart (CRM Dashboard)

```tsx
<BarChart data={topPartners} layout="vertical">
  <Bar dataKey="totalRevenue" fill="#134A7C" radius={[0, 4, 4, 0]} />
  <YAxis type="category" dataKey="companyName" width={180} />
  <Tooltip formatter={(v) => [`AED ${Number(v).toLocaleString()}`, "Revenue"]} />
</BarChart>
```

### Partner Commission Trend LineChart (Partner Detail)

```tsx
<LineChart data={commissionTrend}>
  <Line type="monotone" dataKey="commission" stroke="#134A7C" strokeWidth={2} dot={false} />
  <XAxis dataKey="month" />
</LineChart>
```

---

## Key Interfaces

```typescript
type PartnerType = "DISTRIBUTOR" | "RESELLER" | "AFFILIATE" | "SUPPLIER";
type PartnerStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";
type DealStage = "LEAD" | "QUALIFIED" | "PROPOSAL" | "NEGOTIATION" | "CLOSED_WON" | "CLOSED_LOST";
type PayoutStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

interface Partner {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string | null;
  type: PartnerType;
  status: PartnerStatus;
  commissionRate: number;
  paymentTerms: string;
  creditLimit: number;
  contractStart: string | null;
  contractEnd: string | null;
  taxId: string | null;
  notes: string | null;
  totalRevenue: number;
  totalCommissions: number;
  balance: number;
  logo: string | null;
  createdAt: string;
}

interface PartnerTransaction {
  id: string;
  partnerId: string;
  type: "SALE" | "COMMISSION" | "EXPENSE" | "PAYMENT" | "REFUND" | "CREDIT" | "DEBIT";
  amount: number;
  description: string | null;
  reference: string | null;
  date: string;
}

interface PartnerDeal {
  id: string;
  title: string;
  partnerId?: string;
  customerId?: string;
  value: number;
  stage: DealStage;
  probability: number;
  expectedCloseDate?: string;
  assignedTo?: { id: string; name: string };
  description?: string;
}

interface PartnerPayout {
  id: string;
  partnerId: string;
  partnerName: string;
  amount: number;
  periodStart: string;
  periodEnd: string;
  status: PayoutStatus;
  method: string | null;
  transactionId: string | null;
  paidAt: string | null;
}
```
