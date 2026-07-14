# Database Schema — CRM Tables

All new tables go in `packages/database/src/schema/`. Follow existing patterns: `uuid` PK with `defaultRandom()`, `createdAt`/`updatedAt` timestamps, drizzle-pg-core types.

---

## 1. Expense Categories (`expense-categories.ts`)

```typescript
export const expenseCategories = pgTable("expense_categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  icon: varchar("icon", { length: 50 }),       // lucide icon name
  color: varchar("color", { length: 7 }),       // hex color for pie chart
  sortOrder: integer("sort_order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});
```

**Seed data:**

| Name | Slug | Icon | Color |
|------|------|------|-------|
| Marketing & Advertising | marketing | Megaphone | #134A7C |
| Shipping & Logistics | shipping | Truck | #059669 |
| Office & Admin | office-admin | Building2 | #D97706 |
| Supplier Payments | supplier-payments | CreditCard | #7C3AED |
| Staff Salaries | salaries | Users | #DC2626 |
| Commission Payouts | commissions | DollarSign | #0891B2 |
| IT & Infrastructure | it-infrastructure | Monitor | #4F46E5 |
| Professional Services | professional-services | Briefcase | #B45309 |
| Travel & Entertainment | travel-entertainment | Plane | #BE123C |
| Taxes & Licenses | taxes-licenses | Receipt | #1D4ED8 |
| Inventory Purchase | inventory-purchase | Package | #15803D |
| Returns & Refunds | returns-refunds | RotateCcw | #E11D48 |

---

## 2. Expenses (`expenses.ts`)

```typescript
export const expenseStatusEnum = pgEnum("expense_status", [
  "PENDING", "APPROVED", "REJECTED",
]);

export const expenses = pgTable("expenses", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("AED").notNull(),
  categoryId: uuid("category_id").notNull().references(() => expenseCategories.id),
  userId: uuid("user_id").notNull().references(() => users.id),          // who spent
  partnerId: uuid("partner_id").references(() => partners.id),           // optional: expense related to a partner
  purpose: varchar("purpose", { length: 500 }).notNull(),                // what purpose
  date: timestamp("date", { mode: "date" }).notNull(),
  receipt: varchar("receipt", { length: 1000 }),                         // receipt image URL
  status: expenseStatusEnum("status").default("PENDING").notNull(),
  approvedBy: uuid("approved_by").references(() => users.id),
  approvedAt: timestamp("approved_at", { mode: "date" }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});
```

---

## 3. Expense Budgets (`expense-budgets.ts`)

```typescript
export const budgetPeriodEnum = pgEnum("budget_period", [
  "MONTHLY", "QUARTERLY", "YEARLY",
]);

export const expenseBudgets = pgTable("expense_budgets", {
  id: uuid("id").defaultRandom().primaryKey(),
  categoryId: uuid("category_id").notNull().references(() => expenseCategories.id),
  period: budgetPeriodEnum("period").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),         // budgeted amount
  spentAmount: numeric("spent_amount", { precision: 12, scale: 2 }).default("0").notNull(),
  fiscalYear: integer("fiscal_year").notNull(),
  month: integer("month"),               // for MONTHLY budgets (1-12)
  quarter: integer("quarter"),           // for QUARTERLY budgets (1-4)
  notes: text("notes"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
}, (t) => ({
  // One budget per category per period
  unique: unique().on(t.categoryId, t.period, t.fiscalYear, t.month, t.quarter),
}));
```

---

## 4. Partners (`partners.ts`)

```typescript
export const partnerTypeEnum = pgEnum("partner_type", [
  "DISTRIBUTOR", "RESELLER", "AFFILIATE", "SUPPLIER",
]);
export const partnerStatusEnum = pgEnum("partner_status", [
  "ACTIVE", "INACTIVE", "SUSPENDED",
]);

export const partners = pgTable("partners", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyName: varchar("company_name", { length: 500 }).notNull(),
  contactName: varchar("contact_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  type: partnerTypeEnum("type").default("RESELLER").notNull(),
  status: partnerStatusEnum("status").default("ACTIVE").notNull(),
  commissionRate: numeric("commission_rate", { precision: 5, scale: 2 }),   // percentage
  paymentTerms: varchar("payment_terms", { length: 100 }),                  // "Net 30", "Net 60"
  creditLimit: numeric("credit_limit", { precision: 12, scale: 2 }),
  contractStart: timestamp("contract_start", { mode: "date" }),
  contractEnd: timestamp("contract_end", { mode: "date" }),
  taxId: varchar("tax_id", { length: 100 }),
  notes: text("notes"),
  totalRevenue: numeric("total_revenue", { precision: 14, scale: 2 }).default("0").notNull(),
  totalCommissions: numeric("total_commissions", { precision: 14, scale: 2 }).default("0").notNull(),
  balance: numeric("balance", { precision: 14, scale: 2 }).default("0").notNull(),
  logo: varchar("logo", { length: 1000 }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});
```

---

## 5. Partner Addresses (`partner-addresses.ts`)

```typescript
export const partnerAddresses = pgTable("partner_addresses", {
  id: uuid("id").defaultRandom().primaryKey(),
  partnerId: uuid("partner_id").notNull().references(() => partners.id, { onDelete: "cascade" }),
  label: varchar("label", { length: 100 }).default("Business"),            // "Business", "Warehouse", "Billing"
  addressLine1: varchar("address_line1", { length: 255 }).notNull(),
  addressLine2: varchar("address_line2", { length: 255 }),
  city: varchar("city", { length: 100 }).notNull(),
  emirate: varchar("emirate", { length: 100 }),
  country: varchar("country", { length: 100 }).default("UAE").notNull(),
  isDefault: boolean("is_default").default(false).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});
```

---

## 6. Partner Transactions (`partner-transactions.ts`)

```typescript
export const partnerTxnTypeEnum = pgEnum("partner_txn_type", [
  "SALE", "COMMISSION", "EXPENSE", "PAYMENT", "REFUND", "CREDIT", "DEBIT",
]);

export const partnerTransactions = pgTable("partner_transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  partnerId: uuid("partner_id").notNull().references(() => partners.id, { onDelete: "cascade" }),
  type: partnerTxnTypeEnum("type").notNull(),
  amount: numeric("amount", { precision: 14, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("AED").notNull(),
  description: varchar("description", { length: 500 }),
  reference: varchar("reference", { length: 255 }),                       // order number, invoice no
  referenceId: uuid("reference_id"),                                      // order ID, payout ID
  date: timestamp("date", { mode: "date" }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});
```

---

## 7. Partner Payouts (`partner-payouts.ts`)

```typescript
export const payoutStatusEnum = pgEnum("payout_status", [
  "PENDING", "PROCESSING", "COMPLETED", "FAILED",
]);

export const partnerPayouts = pgTable("partner_payouts", {
  id: uuid("id").defaultRandom().primaryKey(),
  partnerId: uuid("partner_id").notNull().references(() => partners.id, { onDelete: "cascade" }),
  amount: numeric("amount", { precision: 14, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("AED").notNull(),
  periodStart: timestamp("period_start", { mode: "date" }).notNull(),
  periodEnd: timestamp("period_end", { mode: "date" }).notNull(),
  status: payoutStatusEnum("status").default("PENDING").notNull(),
  method: varchar("method", { length: 50 }),                              // "bank_transfer", "check", "cash"
  transactionId: varchar("transaction_id", { length: 255 }),
  paidAt: timestamp("paid_at", { mode: "date" }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});
```

---

## 8. Partner Deals (`partner-deals.ts`)

```typescript
export const dealStageEnum = pgEnum("deal_stage", [
  "LEAD", "QUALIFIED", "PROPOSAL", "NEGOTIATION", "CLOSED_WON", "CLOSED_LOST",
]);

export const partnerDeals = pgTable("partner_deals", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  partnerId: uuid("partner_id").references(() => partners.id),
  customerId: uuid("customer_id").references(() => users.id),
  value: numeric("value", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("AED").notNull(),
  stage: dealStageEnum("stage").default("LEAD").notNull(),
  probability: integer("probability").default(0),                          // 0-100
  expectedCloseDate: timestamp("expected_close_date", { mode: "date" }),
  assignedTo: uuid("assigned_to").references(() => users.id),
  description: text("description"),
  notes: text("notes"),
  lostReason: varchar("lost_reason", { length: 500 }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});
```

---

## 9. Communication Log (`communication-log.ts`)

```typescript
export const commTypeEnum = pgEnum("comm_type", [
  "EMAIL", "CALL", "MEETING", "NOTE", "TICKET",
]);

export const communicationLog = pgTable("communication_log", {
  id: uuid("id").defaultRandom().primaryKey(),
  entityType: varchar("entity_type", { length: 50 }).notNull(),          // "customer", "partner", "deal"
  entityId: uuid("entity_id").notNull(),
  type: commTypeEnum("type").notNull(),
  subject: varchar("subject", { length: 500 }),
  content: text("content").notNull(),
  performedBy: uuid("performed_by").references(() => users.id),
  date: timestamp("date", { mode: "date" }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});
```

---

## 10. Schema Index Update (`schema/index.ts`)

Add these to the existing exports:

```typescript
export * from "./expense-categories";
export * from "./expenses";
export * from "./expense-budgets";
export * from "./partners";
export * from "./partner-addresses";
export * from "./partner-transactions";
export * from "./partner-payouts";
export * from "./partner-deals";
export * from "./communication-log";
```

## Relations (`relations.ts`)

Add drizzle-orm relations connecting:
- `expenses` → `expenseCategories`, `users`, `partners`
- `expenseBudgets` → `expenseCategories`
- `partners` → `partnerAddresses`, `partnerTransactions`, `partnerPayouts`, `partnerDeals`
- `partnerDeals` → `partners`, `users`
- `partnerTransactions` → `partners`
- `partnerPayouts` → `partners`
