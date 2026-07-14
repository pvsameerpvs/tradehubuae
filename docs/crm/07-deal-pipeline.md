# Deal / Sales Pipeline Module

**Priority: PHASE 5 — LOWER (nice-to-have)**

A Kanban-style sales pipeline for tracking deals from lead to closed won/lost.

---

## Stages

| Stage | Label | Default Probability | Description |
|-------|-------|-------------------|-------------|
| LEAD | Lead | 10% | Initial contact made |
| QUALIFIED | Qualified | 25% | Needs identified, budget confirmed |
| PROPOSAL | Proposal | 50% | Quote sent, terms discussed |
| NEGOTIATION | Negotiation | 75% | Active negotiation on price/terms |
| CLOSED_WON | Closed Won | 100% | Deal won |
| CLOSED_LOST | Closed Lost | 0% | Deal lost |

---

## Pages

### Deal Pipeline (`/crm/deals`)

Kanban board with drag-and-drop to move between stages.

```
┌─────── Pipeline ─────────────────────────────────────────────────────┐
│ [Filter: Partner ▼] [Filter: Assignee ▼] [Search...] [+ New Deal]   │
├──────────┬───────────┬───────────┬──────────────┬──────────┬─────────┤
│  LEAD    │ QUALIFIED │ PROPOSAL  │ NEGOTIATION  │ WON      │ LOST    │
│ ┌──────┐ │ ┌──────┐  │ ┌──────┐  │ ┌──────┐     │ ┌──────┐ │ ┌──────┐ │
│ │Deal  │ │ │Deal  │  │ │Deal  │  │ │Deal  │     │ │Deal  │ │ │Deal  │ │
│ │AED50K│ │ │AED120│  │ │AED300│  │ │AED500│     │ │AED200│ │ │AED80K│ │
│ │Partner│ │ │Partner│  │ │Partner│  │ │Partner│    │ │Partner│ │ │Reason│ │
│ │30 Jun │ │ │15 Jul │  │ │20 Aug │  │ │10 Sep │    │ │5 Jun  │ │ │Budget│ │
│ └──────┘ │ └──────┘  │ └──────┘  │ └──────┘     │ └──────┘ │ └──────┘ │
│    2      │    3      │    5      │     2        │    8      │    3     │
│ AED 100K  │ AED 360K  │ AED 1.2M  │ AED 1.0M    │ AED 1.6M │ AED 240K │
└──────────┴───────────┴───────────┴──────────────┴──────────┴─────────┘
```

Each card shows: Title, Value, Partner/Customer, Expected close date.

### New Deal (`/crm/deals/new`)

Form: Title, Value, Partner (dropdown), Customer (dropdown), Stage, Probability, Expected close date, Assigned to, Description.

---

## Key Interfaces

```typescript
interface Deal {
  id: string;
  title: string;
  partner?: { id: string; companyName: string };
  customer?: { id: string; name: string };
  value: number;
  stage: DealStage;
  probability: number;
  expectedCloseDate?: string;
  assignedTo?: { id: string; name: string };
  description?: string;
  createdAt: string;
}

interface PipelineColumn {
  stage: DealStage;
  label: string;
  deals: Deal[];
  totalValue: number;
}
```
