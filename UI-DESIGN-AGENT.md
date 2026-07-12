# UI Design Agent

## Design Philosophy

The visual system is modeled on **Airbnb's current website (2025 layout)**. The interface is calm, white, and spacious — product photos do the talking. No marketing fluff, no hero banners, no gradient blobs, no glassmorphism.

The layout works because of **restraint**, not because of any single element. The white background, flat cards, black text, single accent color, 12px radius everywhere. If you add one shadow too many, it stops looking like Airbnb and starts looking like a template. When reviewing output, your job is to **remove, not to add**.

---

## Design Tokens

Define these as CSS variables in `globals.css` and map them in `tailwind.config.ts`. Every component must use tokens, never raw hex values.

### Color

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

The whole page is white. Color appears in exactly three places: the primary button, the price, and the wishlist heart when active. Nothing else is colored.

### Type

Font: **Inter** from Google Fonts, weights 400, 500, 600, 700. Letter-spacing: `-0.01em` on headings.

```
page-title      26px / 30px / 600
section-title   22px / 26px / 600     (row headings, detail page h2)
section-sub     14px / 18px / 400 / --ink-2
card-title      15px / 19px / 600
card-meta       14px / 18px / 400 / --ink-2
body            16px / 24px / 400
small           14px / 18px / 400
micro-label     10px / 12px / 700 / uppercase / letter-spacing 0.04em
button          16px / 20px / 600
```

### Radius

```
image and card    12px
button            8px
input box         8px
pill, chip, badge 999px
sticky buy panel  12px
seller card       16px
```

Nothing on the page is more rounded than this. No `rounded-2xl` on everything.

### Shadows

```
--sh-card:     0 6px 16px rgba(0,0,0,0.12);   /* hover only */
--sh-search:   0 1px 2px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05);
--sh-search-a: 0 6px 20px rgba(0,0,0,0.20);   /* search bar when a segment is active */
--sh-panel:    0 6px 16px rgba(0,0,0,0.12);   /* sticky buy card, seller card */
--sh-chip:     0 1px 2px rgba(0,0,0,0.18);    /* badge on top of an image */
```

**Product cards have no shadow and no border at rest.** The grid must look flat and quiet.

### Spacing Scale

Use nothing else: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80`

### Motion

- Transition: `all 0.2s ease` on hover states only
- No scroll animations, no fade-in on load, no parallax
- Respect `prefers-reduced-motion`

### Icons

- `lucide-react`, size 16 to 24, stroke width 1.75, color `--ink`
- Outline only, never filled, never colored

### Containers

```
header            full width, height 80px, sticky top, white, 1px bottom border --line, z-50
home content      max-width 1760px, centered, padding-inline 80px desktop / 40px tablet / 24px mobile
detail content    max-width 1120px, centered, padding-inline 24px
```

---

## Global Rules

- **Focus states**: 2px solid `--ink` outline with 2px offset on every interactive element. Never remove outlines.
- **All images**: `object-fit: cover`, `background: var(--bg-2)` behind them, `loading="lazy"` except the first row.
- **Buttons come in three types only**:
  - **Primary**: `--brand-grad` background, white text, height 48px, radius 8px, 600 weight
  - **Secondary**: white background, 1px solid `--ink` border, `--ink` text, height 48px, radius 8px, 600 weight, hover `--bg-3`
  - **Ghost link**: `--ink` text, 600 weight, underlined, with a chevron icon when it opens something
- Never use placeholder image services. Reference local paths like `/images/laptop-01.jpg` and set a `--bg-2` fill behind them so the layout still reads when images are missing.
- No lorem ipsum. Use real sample data.

---

## Component Architecture

### Component Splitting Rules

- **MAXIMUM decomposition**: each file = one responsibility
- **Page sections** → separate components in `components/` (e.g. `HeroSection`, `CategoryGrid`, `WhyUsSection`, `CTASection`)
- **Repeated patterns** → extracted components (e.g. `ProductCard`, `CategoryCard`, `IconWrapper`)
- **Layout pieces** → `Header`, `Footer`, `MobileNav`, `NavLinks`, `SearchBar`, `CartIcon`
- **Inline data/maps** → extracted to data files or constants
- **Inline SVGs** → extracted to `components/icons/` as Lucide icons or custom icon components
- **Large lists/maps** → extracted list components with proper typing
- **Conditional rendering branches** → extracted to sub-components
- **Inline event handlers** → named handler functions

### File Structure

```
apps/web/src/
├── app/                  # Next.js App Router pages
│   ├── (marketing)/      # Marketing layout group
│   ├── products/
│   ├── categories/
│   └── ...
├── components/
│   ├── layout/           # Header, Footer, MobileNav, etc.
│   ├── ui/               # Composed shadcn components (if using shadcn)
│   ├── icons/            # Icon components
│   ├── marketing/        # Home page sections
│   ├── products/         # Product-related components
│   ├── cart/             # Cart-related components
│   └── shared/           # Cross-cutting shared components
├── lib/                  # Utils, hooks, actions
├── data/                 # Static data, constants
└── types/                # TypeScript types
```

### Product Card (most reused component)

Structure, top to bottom:
1. **Image**, aspect ratio 1:1, radius 12px, `--bg-2` fill. On card hover the image scales to 1.02 with `overflow: hidden` on the wrapper. Nothing else moves.
2. **Badge pill**, absolute, top 12px left 12px: white background, radius 999px, padding 6px 10px, 12px 600 `--ink`, `--sh-chip`. Values: `Certified`, `Great deal`, `Like new`, `Low stock`, `Staff pick`. No badge = render nothing.
3. **Heart button**, absolute, top 12px right 12px: 24px lucide heart, white 2px stroke, fill `rgba(0,0,0,0.35)`. Hover scale 1.08. When saved, fill becomes `--brand` with white stroke.
4. **Text block** (8px gap below image, left aligned, no padding):
   - **Title**: card-title style, one line, truncated with ellipsis. Format: `MacBook Air M2, 2022`
   - **Meta**: card-meta style, one line, truncated. Format: `16GB RAM · 512GB SSD · 94% battery`
   - **Price**: 14px, `--ink`: price in 600 weight, original price with strikethrough in `--ink-2` 400, then `·` separator, then filled star + rating, then `(21)` in `--ink-2`. Example: `2,450 AED  2,899 AED · ★ 4.9 (21)`
   - Line gap inside text block: 2px.

The card is a single link. **No border, no shadow, no background, no button inside it.**

---

## Responsive Breakpoints

| Breakpoint | Width | Behavior |
|---|---|---|
| mobile | < 744px | single column, 24px padding, bottom bar on detail page |
| tablet | 744–1023 | two column card grids, buy card below content |
| laptop | 1024–1279 | two column detail page, sticky buy card active |
| desktop | 1280+ | full row counts, 80px container padding |
| wide | 1600+ | 7 cards per row |

### Card Column Counts per Breakpoint

| Viewport | Cards visible |
|---|---|
| 1600px+ | 7 |
| 1440–1599 | 6 |
| 1280–1439 | 5 |
| 1024–1279 | 4 |
| 744–1023 | 3 |
| 480–743 | 2 |
| < 480 | 1.2 (partial next card visible to signal scroll) |

---

## Buttons — Three Types Only

| Type | Style | Usage |
|---|---|---|
| **Primary** | `--brand-grad` bg, white text, h-48px, radius-8, font-600 | Buy now, Submit, CTA |
| **Secondary** | White bg, 1px `--ink` border, `--ink` text, h-48px, radius-8, font-600, hover `--bg-3` | Make an offer, Show more |
| **Ghost link** | `--ink` text, font-600, underlined, optional chevron icon | Show more, Learn more, Share |

---

## Code Style

- Named exports only (no default exports except pages)
- TypeScript strict mode
- Tailwind classes for styling (no CSS modules)
- Use `cn()` from `tailwind-merge` for class merging
- Responsive-first: mobile-first Tailwind breakpoints
- Use `lucide-react` for icons (size 16–24, strokeWidth 1.75)
- Every interactive element gets an `aria-label` if it has no visible text
- Semantic HTML: `header`, `nav`, `main`, `section`, `article`, `footer`, real `button` and `a` elements

---

## Page Layouts

### Home Page

1. **Header** (sticky, 80px): wordmark, nav tabs, user menu
2. **Search bar**: pill with 3 segments (What / Budget / Condition)
3. **Category rows**: 7 horizontal scrollable rows of product cards
4. **Browse grid**: "All laptops" responsive grid, 12 cards + Show more
5. **Discovery link grid**: tabs + link grid
6. **Footer**: 3 columns, bottom bar

### Product Detail Page

1. **Header** (same, compact search bar)
2. **Title row** with Share/Save
3. **Gallery**: 2-column grid, 5 images
4. **Two-column body**: left ~62% (summary, seller, trust, specs, condition, reviews, seller card, things to know), right 372px (sticky buy card)
5. **Breadcrumbs + tail link grids**
6. **Mobile bottom bar** (<744px): fixed, price + Buy now
7. **Footer** (same as home)
