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
