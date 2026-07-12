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

## UI Design System

### Design Philosophy

The visual system is modeled on **Airbnb's current website (2025 layout)**. The interface is calm, white, and spacious — product photos do the talking. No marketing fluff, no hero banners, no gradient blobs, no glassmorphism.

The layout works because of **restraint**, not because of any single element. The white background, flat cards, black text, single accent color, 12px radius everywhere. If you add one shadow too many, it stops looking like Airbnb and starts looking like a template. When reviewing output, your job is to **remove, not to add**.

### Design Tokens

Colors (all in `globals.css`, every component must use tokens, never raw hex):

```
--brand:          #0B8A5B   /* primary action, price accent */
--brand-dark:     #086B47   /* hover */
--brand-grad:     linear-gradient(90deg, #0FA06B 0%, #0B8A5B 50%, #086B47 100%);

--ink:            #222222   /* primary text, icons, active states */
--ink-2:          #717171   /* secondary text, meta, captions */
--ink-3:          #B0B0B0   /* disabled, placeholder */

--line:           #DDDDDD   /* 1px borders and dividers */
--line-soft:      #EBEBEB   /* subtle inner dividers */

--bg:             #FFFFFF   /* page background, always white */
--bg-2:           #F7F7F7   /* footer, image placeholder fill */
--bg-3:           #F0F0F0   /* hover fill on ghost buttons */

--star:           #222222   /* star glyph is black, not gold */
--sale:           #C13515   /* strikethrough / discount label only */
```

The whole page is white. Color appears in exactly three places: the primary button, the price, and the wishlist heart when active.

Type (Inter, letter-spacing -0.01em on headings):
```
page-title      26px / 30px / 600
section-title   22px / 26px / 600
section-sub     14px / 18px / 400 / --ink-2
card-title      15px / 19px / 600
card-meta       14px / 18px / 400 / --ink-2
body            16px / 24px / 400
small           14px / 18px / 400
micro-label     10px / 12px / 700 / uppercase / letter-spacing 0.04em
button          16px / 20px / 600
```

Radius:
```
image and card    12px
button            8px
input box         8px
pill, chip, badge 999px
sticky buy panel  12px
seller card       16px
```

Shadows:
```
--sh-card:     0 6px 16px rgba(0,0,0,0.12);   /* hover only */
--sh-search:   0 1px 2px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05);
--sh-search-a: 0 6px 20px rgba(0,0,0,0.20);   /* search bar when a segment is active */
--sh-panel:    0 6px 16px rgba(0,0,0,0.12);   /* sticky buy card, seller card */
--sh-chip:     0 1px 2px rgba(0,0,0,0.18);    /* badge on top of an image */
```

**Product cards have no shadow and no border at rest.** The grid must look flat and quiet.

Spacing: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80` (use nothing else)

Motion: `all 0.2s ease` on hover only. No scroll animations, no fade-in on load, no parallax. Respect `prefers-reduced-motion`.

Icons: `lucide-react`, size 16 to 24, strokeWidth 1.75, color `--ink`. Outline only, never filled, never colored.

### Buttons — Three Types Only

| Type | Style | Usage |
|------|-------|-------|
| **Primary** | `--brand-grad` bg, white text, h-48px, radius-8, font-600 | Buy now, Submit, CTA |
| **Secondary** | White bg, 1px `--ink` border, `--ink` text, h-48px, radius-8, font-600, hover `--bg-3` | Make an offer, Show more |
| **Ghost link** | `--ink` text, font-600, underlined, optional chevron icon | Show more, Learn more, Share |

### Product Card

1. **Image**, aspect 1:1, radius 12px, `--bg-2` fill. On card hover the image scales to 1.02 with `overflow: hidden` on wrapper.
2. **Badge pill**, absolute top 12px left 12px: white bg, radius 999px, padding 6px 10px, 12px 600 `--ink`, `--sh-chip`. Values: `Certified`, `Great deal`, `Like new`, `Low stock`, `Staff pick`.
3. **Heart button**, absolute top 12px right 12px: 24px lucide heart, white 2px stroke, fill `rgba(0,0,0,0.35)`. When saved: fill `--brand` with white stroke.
4. **Text block** (8px gap, left aligned, no padding):
   - **Title**: card-title, one line truncated
   - **Meta**: card-meta, one line truncated
   - **Price**: 14px `--ink` 600 weight, strikethrough `--ink-2` 400, `·` separator, filled star + rating, `(21)` `--ink-2`

The card is a single link. **No border, no shadow, no background, no button inside it.**

### Responsive Breakpoints

| Breakpoint | Width | Behavior |
|---|---|---|
| mobile | < 744px | single column, 24px padding, bottom bar on detail page |
| tablet | 744–1023 | two column card grids, buy card below content |
| laptop | 1024–1279 | two column detail page, sticky buy card active |
| desktop | 1280+ | full row counts, 80px container padding |
| wide | 1600+ | 7 cards per row |

Card column counts: 1600px+=7, 1440–1599=6, 1280–1439=5, 1024–1279=4, 744–1023=3, 480–743=2, <480=1.2

### Page Layouts

**Home Page:**
1. Header (sticky, 80px): wordmark, user menu
2. Search bar: pill with 3 segments (What / Budget / Condition)
3. Category rows: horizontal scrollable rows of product cards
4. Browse grid: responsive grid + Show more
5. Discovery link grid: tabs + link grid
6. Footer: 3 columns

**Product Detail Page:**
1. Header (same)
2. Title row with Share/Save
3. Gallery: 2-column grid, 5 images
4. Two-column body: left ~62% (summary, seller, trust, specs, condition, reviews, seller card), right 372px sticky buy card
5. Breadcrumbs + tail link grids
6. Mobile bottom bar (<744px): fixed, price + Buy now
7. Footer

### Global Rules

- **Focus states**: 2px solid `--ink` outline with 2px offset on every interactive element
- **All images**: `object-fit: cover`, `background: var(--bg-2)`, `loading="lazy"` except first row
- Never use placeholder image services. Use `/images/*.jpg` with `--bg-2` fill behind
- No lorem ipsum. Use real sample data
- Use `lucide-react` for icons (size 16-24, strokeWidth 1.75)
- Every interactive element gets an `aria-label` if it has no visible text
- Semantic HTML: `header`, `nav`, `main`, `section`, `article`, `footer`, real `button` and `a` elements
