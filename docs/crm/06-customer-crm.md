# Enhanced Customer CRM Module

**Priority: PHASE 3 — MEDIUM**

Upgrades the existing basic customer list/detail to a full CRM with order history, activity timeline, segments, and support tickets.

---

## What Changes

### Current (Minimal)
```
Customer detail: name, email, phone, totalOrders, totalSpent, address
```

### Enhanced (Full CRM)
```
Customer detail:
├── Profile (existing)
├── Stats (existing + enhanced)
│   ├── Lifetime Value (LTV)
│   ├── Average Order Value (AOV)
│   ├── Purchase Frequency
│   ├── Last Purchase Date
│   └── Churn Risk Score
├── Order History (NEW)
│   └── Full list of orders with status, amounts, items
├── Activity Timeline (NEW)
│   └── Emails, calls, notes, support tickets in chronological order
├── Tags/Segments (NEW)
│   └── VIP, Wholesale, New, At-risk, etc.
├── Support Tickets (NEW)
│   └── Issue tracking with status
└── Communications (NEW)
    └── Log a call, email, or note
```

---

## Pages

### 1. Customer List (`/crm/customers`)

Enhance existing `/customers` page with:

**New columns:** Company, LTV, Last Purchase, Tags
**New filters:** Tag filter, Date range, Min spend
**Bulk actions:** Add tag to selected, Export selected

### 2. Customer Detail (`/crm/customers/:id`)

Enhance existing detail page. New layout:

```
┌─ Profile Header ──────────────────────────────────────────────────┐
│ [Avatar] Ahmed Al Hashimi · ahmed@example.com · +971 50 123 4567 │
│ Company: Al Hashimi Trading LLC · Tags: [VIP] [Wholesale]         │
│ Customer since: Jan 2024                                          │
├─ Stats Row ───────────────────────────────────────────────────────┤
│ [Orders: 24] [Spent: AED 340K] [LTV: AED 340K] [AOV: AED 14.2K] │
│ [Last Purchase: 2 days ago] [Churn Risk: Low]                     │
├─ Tabs ────────────────────────────────────────────────────────────┤
│ [Order History] [Timeline] [Communication Log] [Tickets]          │
├─ Tab Content ─────────────────────────────────────────────────────┤
│ ... depends on active tab                                          │
└───────────────────────────────────────────────────────────────────┘
```

#### Order History Tab
Table: Order #, Date, Items count, Total, Status, Payment Status
Click → opens order detail modal or navigates to `/orders/:id`
Mobile: Card layout per order

#### Timeline Tab
Chronological feed:
```
Today
  └── 📞 Call with customer re: bulk order — Ahmed (10:30 AM)
  └── 📧 Sent quote for 50x Dell laptops — System (9:15 AM)
Yesterday
  └── 📝 Internal note: Follow up on payment terms — Admin (3:00 PM)
  └── 🎫 Support ticket #1024 opened: "Wrong item delivered" — Customer (11:20 AM)
  └── 📦 Order #ORD-2025-0421 delivered — System (9:00 AM)
```

#### Communication Log Tab
Form to add: Call / Email / Meeting / Note
Subject, Content, Date. Shows history in a list.

#### Tickets Tab
Support tickets: ID, Subject, Status (open/pending/resolved), Priority, Created date

---

## Customer Segments

Predefined segments (configurable):

| Segment | Criteria | Color |
|---------|----------|-------|
| VIP | Total spent > AED 100,000 | Gold |
| Wholesale | Has company name, bulk orders > 5 | Blue |
| New | Signed up < 30 days | Green |
| At-risk | No purchase > 90 days | Red |
| High-value | AOV > AED 20,000 | Purple |
| Repeat Buyer | Orders > 5 | Teal |

---

## Key Interfaces

```typescript
interface CustomerStats {
  totalOrders: number;
  totalSpent: number;
  lifetimeValue: number;
  averageOrderValue: number;
  purchaseFrequency: number;      // orders per month
  lastPurchaseDate: string | null;
  churnRisk: "LOW" | "MEDIUM" | "HIGH";
  daysSinceLastPurchase: number;
  preferredCategory: string | null;
}

interface CommunicationEntry {
  id: string;
  entityType: string;
  entityId: string;
  type: "EMAIL" | "CALL" | "MEETING" | "NOTE";
  subject: string | null;
  content: string;
  performedBy: { id: string; name: string } | null;
  date: string;
}

interface CustomerTag {
  id: string;
  name: string;
  color: string;
  slug: string;
}
```
