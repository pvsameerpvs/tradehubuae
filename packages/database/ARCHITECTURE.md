# Database Architecture

## Overview

39 tables across 8 PostgreSQL schemas, 5 enums. Built with Drizzle ORM + PostgreSQL.

---

## Schema Organization

### `public` — Shared / Auth
| Table | Purpose |
|-------|---------|
| `users` | Auth accounts (admin, staff, customers) |
| `profiles` | Extended user profile (bio, company, preferences) |
| `sessions` | Auth sessions |
| `activity_logs` | Audit trail |
| `addresses` | User addresses (UAE, emirate-enforced) |
| `notifications` | Multi-channel notifications |

### `catalog` — Products
| Table | Purpose |
|-------|---------|
| `categories` | Self-referencing hierarchy |
| `category_attributes` | Per-category spec templates |
| `brands` | Product brands |
| `uses` | Use cases / industries |
| `products` | Core product entity |
| `product_categories` | M:N product–category |
| `product_images` | Gallery images |
| `product_specs` | Key-value specifications |
| `product_variants` | Variants (size, color, etc.) |
| `reviews` | Ratings & reviews |

### `inventory` — Stock
| Table | Purpose |
|-------|---------|
| `warehouses` | Multi-warehouse locations |
| `stock` | Per-warehouse stock levels |
| `stock_history` | Stock movement audit |
| `stock_transfers` | Inter-warehouse transfers |
| `stock_transfer_items` | Transfer line items |
| `inventory_logs` | Inventory action audit |

### `sales` — Orders & Cart
| Table | Purpose |
|-------|---------|
| `orders` | Order lifecycle |
| `order_items` | Order line items (snapshot) |
| `payments` | Payment transactions |
| `shipments` | Shipping tracking |
| `returns` | Return requests |
| `cart_items` | Shopping cart |
| `wishlist_items` | Wishlist |

### `marketing` — Promotions
| Table | Purpose |
|-------|---------|
| `coupons` | Discount codes |
| `coupon_products` | Coupon product scope |
| `combo_offers` | Bundle deals |
| `combo_offer_items` | Bundle products |
| `bulk_requests` | B2B bulk inquiries |
| `bulk_request_items` | Bulk request line items |

### `content` — Blog & SEO
| Table | Purpose |
|-------|---------|
| `blog_posts` | Blog articles |
| `blog_post_products` | M:N post–product |
| `blog_tags` | Tag taxonomy |
| `blog_post_tags` | M:N post–tag |
| `seo_metadata` | Centralized SEO (entity_type + entity_id) |
| `redirects` | URL redirects |

### `communication` — Chat
| Table | Purpose |
|-------|---------|
| `chat_sessions` | Chat conversations |
| `chat_messages` | Individual messages |

### `analytics` — Tracking
| Table | Purpose |
|-------|---------|
| `analytics_events` | Custom events |
| `page_views` | Page view tracking |
| `search_logs` | Internal search queries |

---

## Enums

| Enum | Schema | Values |
|------|--------|--------|
| `role` | public | SUPER_ADMIN, ADMIN, INVENTORY_MANAGER, SALES_MANAGER, CONTENT_MANAGER, SEO_MANAGER, CUSTOMER |
| `condition` | catalog | New, Like New, Excellent, Good, Fair |
| `order_status` | public | PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED, RETURNED, REFUNDED |
| `payment_status` | public | PENDING, PAID, FAILED, REFUNDED, PARTIALLY_REFUNDED |
| `emirate` | public | Abu Dhabi, Dubai, Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah, Fujairah |

---

## Design Decisions

| Principle | Implementation |
|-----------|---------------|
| **FK integrity** | Every FK has explicit `onDelete`: `RESTRICT` for business records, `CASCADE` for ephemeral data, `SET NULL` for optional references |
| **No dual-storage** | Stock lives only in `stock` table (not on `products`); SEO lives only in `seo_metadata` (not inline on each entity) |
| **Historical snapshots** | Order items store product name/price/image at time of purchase; chat stores user name/email so history survives account deletion |
| **Denormalized counters** | `rating_average`/`rating_count` on products, `sale_count`, `view_count` — acceptable perf optimizations, updated via application logic |
| **Guest support** | Chat sessions accept null `user_id`; orders accept null `user_id` for guest checkout; bulk requests have optional `user_id` |
| **Partial unique indexes** | Cart unique index handles NULL variant correctly (two partial indexes) |
| **UUID PKs** | All primary keys are UUID v4 (distributed-safe, no sequential leaks) |
| **Structured data** | JSONB for gateway responses, return items, analytics properties, notification metadata, search filters |

---

## Schema Files

```
src/schema/
├── __schemas.ts         # pgSchema instances for each domain
├── index.ts             # Barrel exports
├── relations.ts         # Drizzle relations (all joins)
├── enums.ts             # All enum definitions
├── users.ts             # public schema
├── addresses.ts         # public schema
├── notifications.ts     # public schema
├── categories.ts        # catalog schema
├── brands.ts            # catalog schema
├── uses.ts              # catalog schema
├── products.ts          # catalog schema
├── reviews.ts           # catalog schema
├── inventory.ts         # inventory schema
├── orders.ts            # sales schema
├── cart.ts              # sales schema
├── marketing.ts         # marketing schema
├── bulk-sales.ts        # marketing schema
├── blog.ts              # content schema
├── seo.ts               # content schema
├── chat.ts              # communication schema
└── analytics.ts         # analytics schema
```

---

## Migrations

| # | Tag | Description |
|---|-----|-------------|
| 0000 | `public_raider` | Initial schema — 39 tables + 4 enums |
| 0001 | `bent_wrecking_crew` | Indexes, FK fixes, condition enum rename |
| 0002 | `blushing_namora` | Category parent FK set null |
| 0003 | `schema_fixes` | Audit fixes: stock dedup, SEO consolidation, onDelete, types, indexes |
| 0004 | `schema_organization` | Split into 8 PostgreSQL domain schemas |

**To apply:**
```bash
pnpm --filter @tradehubuae/database db:migrate
```
