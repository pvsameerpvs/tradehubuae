# Project Agent Rules

## Git & Commits
- NEVER run `git commit`, `git push`, or any git write operations automatically
- Always ask for explicit approval before any git operation
- Only stage/commit/push when the user explicitly instructs

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

### Code Style
- No comments in code
- Named exports only (no default exports except pages)
- TypeScript strict mode
- Tailwind classes for styling (no CSS modules)
- Use `cn()` from `@tradehubuae/ui` for class merging
- Responsive-first: mobile-first Tailwind breakpoints
