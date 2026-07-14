# CRM Module — TradeHub UAE

> **Target:** `crm.tradehubuae.com`
> **Purpose:** Customer Relationship Management with full financial tracking, partner management, and analytics
> **Status:** 📋 Plan document — implementation not yet started. ~18-22 days estimated.

## Document Index

| # | Document | Description |
|---|----------|-------------|
| 1 | [01-implementation-plan.md](./01-implementation-plan.md) | Overall architecture, folder structure, phase plan, effort estimates |
| 2 | [02-database-schema.md](./02-database-schema.md) | All new database tables, enums, relations |
| 3 | [03-api-endpoints.md](./03-api-endpoints.md) | Full API endpoint reference with request/response shapes |
| 4 | [04-finance-expense-module.md](./04-finance-expense-module.md) | Expense tracking, budgets, P&L, cash flow, per-person spend |
| 5 | [05-partner-module.md](./05-partner-module.md) | Partner/vendor management, deals, commissions, payouts |
| 6 | [06-customer-crm.md](./06-customer-crm.md) | Enhanced customer CRM with timeline, segments, tickets |
| 7 | [07-deal-pipeline.md](./07-deal-pipeline.md) | Sales pipeline kanban, deal stages, forecasting |
| 8 | [08-ui-components.md](./08-ui-components.md) | Shared CRM component library and pages |
| 9 | [09-deployment.md](./09-deployment.md) | Railway deployment, subdomain, environment variables |

## Architecture Decision

**CRM will be added as a section within the existing admin app** (`apps/admin/src/app/crm/`) rather than a separate Next.js app, to share authentication, layout, UI library, and API client.

The route will be served at `crm.tradehubuae.com` via Railway custom domain pointing to the same admin service, with middleware handling the subdomain routing.
