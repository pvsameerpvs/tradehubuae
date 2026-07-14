# Project Agent Rules

## Git & Commits (ABSOLUTE RULE)
- ⛔ NEVER run `git add`, `git commit`, `git push`, or ANY git write operation automatically — ZERO EXCEPTIONS
- ⛔ NEVER stage files without explicit user command
- ⛔ NEVER commit, amend, or push without the user saying "commit" or "push" directly
- ✅ Only stage/commit/push when the user explicitly and directly instructs you to do so
- ✅ Always show `git status` and `git diff` for review before staging if user asks

## Component Architecture

### shadcn/ui Usage
- Every UI element must use shadcn/ui components from `@tradehubuae/ui`:
  - `Card`, `CardHeader`, `CardContent`, `CardFooter`, `CardTitle`, `CardDescription`
  - `Button`, `buttonVariants`
  - `Badge`, `badgeVariants`
  - `Input`
  - `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogFooter`, `DialogTitle`, `DialogDescription`
- NEVER hand-roll UI primitives. Always compose from shadcn.
- Use variant/size props instead of custom CSS classes.

### Component Splitting Rules
- MAXIMUM decomposition: each file = one responsibility
- **Page sections** → separate components in `components/` (e.g. `HeroSection`, `CategoryGrid`, `WhyUsSection`, `CTASection`)
- **Repeated patterns** → extracted components (e.g. `CategoryCard`, `FeatureCard`, `IconWrapper`)
- **Layout pieces** → `Header`, `Footer`, `MobileNav`, `NavLinks`, `SearchBar`, `CartIcon`
- **Inline data/maps** → extracted to data files or constants
- **Inline SVGs** → extracted to `components/icons/` as Lucide icons or custom icon components
- **Large lists/maps** → extracted list components with proper typing
- **Conditional rendering branches** → extracted to sub-components
- **Inline event handlers** → named handler functions

### Folder Structure
```
apps/web/src/
├── app/                  # Next.js App Router pages
│   ├── (marketing)/      # Marketing layout group
│   ├── products/
│   ├── categories/
│   └── ...
├── components/
│   ├── layout/           # Header, Footer, MobileNav, etc.
│   ├── ui/               # Composed shadcn components
│   ├── icons/            # Icon components
│   ├── marketing/        # Home page sections
│   ├── products/         # Product-related components
│   ├── cart/             # Cart-related components
│   └── shared/           # Cross-cutting shared components
├── lib/                  # Utils, hooks, actions
├── data/                 # Static data, constants
└── types/                # TypeScript types
```

### Mobile-First Responsive Design (CRITICAL)
- **Most users are on mobile** — every page MUST be fully responsive and tested at 320px width
- Use mobile-first Tailwind breakpoints: `sm:`, `md:`, `lg:`, `xl:`
- Every layout must stack vertically on mobile (no horizontal scroll)
- Touch targets must be minimum 44x44px
- Forms, buttons, and interactive elements must be thumb-friendly
- No horizontal overflow at any viewport width
- Test every page at 320px, 768px, 1024px before shipping

### Code Style
- Named exports only (no default exports except pages)
- TypeScript strict mode
- Tailwind classes for styling (no CSS modules)
- Use `cn()` from `@tradehubuae/ui` for class merging
- Responsive-first: mobile-first Tailwind breakpoints

---

> **UI Design System:** See [`UI-DESIGN-AGENT.md`](./UI-DESIGN-AGENT.md) for the complete design spec — tokens, typography, spacing, shadows, buttons, product cards, responsive breakpoints, page layouts, and global rules.

## Admin Dashboard — Sidebar Item Audit

### 1. Dashboard `/dashboard`
| Aspect | Status | Why (if not implemented) |
|---|---|---|
| Main page | ✅ Complete | — |
| Sub-routes | ✅ `/dashboard/chats` complete | — |
| Loading state | ✅ Skeleton cards | — |
| Error state | ❌ Silent catch | API doesn't return structured errors consistently; needs ErrorBoundary or per-call `setError` with fallback UI |
| Empty state | ✅ Handled | — |
| Mobile/Desktop | ✅ Responsive grid | — |

### 2. Products `/products`
| Aspect | Status | Why (if not implemented) |
|---|---|---|
| List page | ✅ Complete | — |
| Create page | ✅ `/products/new` | — |
| Edit page | ✅ `/[id]` | — |
| Form tokens | ✅ Uses project tokens | — |
| Form validation | ✅ zod + react-hook-form | — |
| Missing | ❌ Custom Label/FieldError vs shadcn | shadcn `FormField`/`FormItem`/`FormLabel` not added to `@tradehubuae/ui` package yet; would need to export them first |

### 3. Orders `/orders`
| Aspect | Status | Why (if not implemented) |
|---|---|---|
| List page | ✅ Complete | — |
| Detail page | ✅ `/orders/[id]` created | — |
| Search/Filter | ❌ Not added | API backend doesn't expose search/filter query params for orders; would need backend + frontend coordination |
| Actions | ❌ Status update buttons | Order state machine (pending→confirmed→processing→shipped→delivered) needs backend validation of valid transitions |

### 4. Categories `/categories`
| Aspect | Status | Why (if not implemented) |
|---|---|---|
| List page | ✅ Complete | — |
| Create page | ✅ `/categories/new` | — |
| Edit page | ✅ `/[id]` | — |
| Form tokens | ✅ Fixed — now uses project tokens | — |
| Form validation | ❌ No zod RHF | Manual state + `alert()` works; upgrading to zod/RHF deferred — small form, low complexity |

### 5. Brands `/brands`
| Aspect | Status | Why (if not implemented) |
|---|---|---|
| List page | ✅ Complete | — |
| Create page | ✅ `/brands/new` | — |
| Edit page | ✅ `/[id]` | — |
| Form tokens | ✅ Fixed — now uses project tokens | — |
| Form validation | ❌ No zod RHF | Same as categories — manual state sufficient for 6-field form |

### 6. Customers `/customers`
| Aspect | Status | Why (if not implemented) |
|---|---|---|
| List page | ✅ Complete | — |
| Detail page | ✅ `/customers/[id]` created | — |
| Search/Filter | ❌ Not added | API doesn't expose customer search/filter params |

### 7. Live Chat `/dashboard/chats`
| Aspect | Status | Why (if not implemented) |
|---|---|---|
| Page | ✅ Complete | — |
| Data | ✅ Uses store/local | — |

### 8. Inventory `/inventory`
| Aspect | Status | Why (if not implemented) |
|---|---|---|
| List page | ✅ Complete | — |
| Error state | ❌ Silent catch | Same pattern as Dashboard — API error display deferred |
| Actions | ❌ No stock adjust/batch edit | Requires backend endpoints for stock mutations and batch operations |

### 9. Combo Offers `/combo-offers`
| Aspect | Status | Why (if not implemented) |
|---|---|---|
| List page | ✅ Complete | — |
| Create page | ✅ `/combo-offers/new` | — |
| Edit page | ✅ `/[id]` | — |
| Form tokens | ✅ Fixed — now uses project tokens | — |
| Form validation | ❌ No zod RHF | Same pattern as categories — deferred, low complexity form |

### 10. Bulk Sales `/bulk-sales`
| Aspect | Status | Why (if not implemented) |
|---|---|---|
| List page | ✅ Complete | — |
| Detail page | ✅ `/bulk-sales/[id]` created with approve/quote/reject | — |

### 11. Reviews `/reviews`
| Aspect | Status | Why (if not implemented) |
|---|---|---|
| List page | ✅ Complete | — |
| Detail page | ✅ `/reviews/[id]` created with approve/reject | — |

### 12. Media `/media`
| Aspect | Status | Why (if not implemented) |
|---|---|---|
| Page | ✅ Complete | — |
| Form tokens | ✅ Fixed — now uses project tokens | — |
| Delete action | ❌ Trash icon unused | Delete endpoint not confirmed in media API; adding a delete without confirmation dialog is risky |

### 13. Blog `/blog`
| Aspect | Status | Why (if not implemented) |
|---|---|---|
| List page | ✅ Complete | — |
| Create page | ✅ `/blog/new` created | — |
| Edit page | ✅ `/blog/[id]` created | — |
| Form component | ✅ BlogForm created | — |

### 14. SEO `/seo`
| Aspect | Status | Why (if not implemented) |
|---|---|---|
| Landing page | ✅ Cards linking to tools | — |
| Meta page | ✅ `/seo/meta` created | — |
| Sitemap | ✅ `/seo/sitemap` created | — |
| Redirects | ✅ `/seo/redirects` created | — |

### 15. Analytics `/analytics`
| Aspect | Status | Why (if not implemented) |
|---|---|---|
| Page | ✅ Complete UI with 6 sections | — |
| Data source | 🔄 API-connected | Page calls real `/analytics/*` endpoints; data returns empty until tracking middleware is active |
| Loading/Error | ❌ No states | Data is hardcoded so no loading needed; error states would matter once API connected |
| Mobile table | ❌ Ads table no mobile fallback | Ads table has 8 columns — mobile card view would lose comparative structure; needs responsive table design pattern |

### 16. AI Assistant `/ai`
| Aspect | Status | Why (if not implemented) |
|---|---|---|
| Page | ✅ Complete UI | — |
| Functionality | ❌ Generate button no-op | No AI/LLM API provider configured — requires OpenAI/Claude API key + backend proxy endpoint for security |
| Loading/Error | ❌ No states | Would be added when API connection is established |

### 17. Users `/users`
| Aspect | Status | Why (if not implemented) |
|---|---|---|
| List page | ✅ Complete | — |
| Create page | ✅ `/users/new` created | — |
| Detail page | ✅ `/users/[id]` created | — |

### 18. Settings `/settings`
| Aspect | Status | Why (if not implemented) |
|---|---|---|
| Landing page | ✅ Cards with `<Link>` wrappers — fixed | — |
| General | ✅ `/settings/general` created | — |
| Payments | ✅ `/settings/payments` created | — |
| Shipping | ✅ `/settings/shipping` created | — |
| Email | ✅ `/settings/email` created | — |
| Security | ✅ `/settings/security` created | — |
| Appearance | ✅ `/settings/appearance` created | — |

### Global Files
| File | Status | Why (if not implemented) |
|---|---|---|
| `loading.tsx` | ✅ Created | — |
| `error.tsx` | ✅ Created | — |
| `not-found.tsx` | ✅ Created | — |

### Empty Dirs (not in sidebar, not linked)
- `coupons/`, `permissions/`, `roles/` — ❌ No pages | Not in sidebar nav; would need API endpoints and business logic before building UIs

### Summary of Remaining ❌ Items (all with valid deferral reasons)
1. Dashboard error UI — needs API error contract
2. ProductForm shadcn components — needs `@tradehubuae/ui` package update
3. Orders search/filter/actions — needs backend support
4. Categories/Brands/ComboOffers zod RHF — low priority (small forms)
5. Inventory error/actions — needs backend stock endpoints
6. Media delete — needs API confirmation
7. Analytics API data — needs tracking infrastructure
8. AI Assistant API — needs LLM provider setup
9. Empty coupon/permission/role dirs — not in nav scope
