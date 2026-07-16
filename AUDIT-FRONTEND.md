# Web Frontend Audit

## 🔴 Critical (needs backend or major fix)

### 1. Product images don't render
- **`data/products.ts`** — `Product` interface missing `image`/`images` field; `toProduct()` doesn't map images from API
- **`components/products/ProductGallery.tsx`** — renders empty placeholder divs, no actual product images
- **`components/shared/ProductCard.tsx`** — uses SVG placeholder instead of product image
- **`components/shared/LatestArrivalsCard.tsx`** — same SVG placeholder

### 2. Account details form is non-functional
- **`app/account/details/page.tsx`** — "Save Changes" does nothing, form has no submit logic, hardcoded values
- Needs backend endpoint: `PUT /customers/profile` or similar

### 3. Contact form submits to nothing
- **`app/contact/page.tsx`** — no `onSubmit` handler, no API call
- Needs backend endpoint: `POST /contact` or use existing notifications

### 4. Bulk sales "Request a Quote" form is non-functional
- **`app/bulk-sales/page.tsx`** — no `onSubmit` handler on the form
- Needs backend endpoint (already exists: `POST /bulk-requests`?)

### 5. Search is decorative / non-functional
- **`components/home/SearchBar.tsx`** — desktop search button has no click handler
- **`components/layout/Header.tsx`** — search bars are decorative (no form/action)
- **`app/search/page.tsx`** — category filter buttons don't filter

### 6. Wishlist server actions are empty stubs
- **`lib/actions/wishlist.ts`** — all 4 functions return empty/no-op
- Currently replaced by localStorage `wishlist-context.tsx` (client-only, no server sync)

### 7. LatestArrivalsCard wishlist is local state only
- **`components/shared/LatestArrivalsCard.tsx`** — uses `useState` instead of `useWishlist()` context
- Inconsistent with `ProductCard.tsx` which correctly uses context

---

## 🟡 High Priority

### 8. Account layout has hardcoded user
- **`app/account/layout.tsx`** — "Ahmed Al Maktoum", "ahmed@example.com" hardcoded
- Should read from `useAuth()` or session

### 9. Product detail has hardcoded description
- **`app/products/[slug]/page.tsx`** — laptop boilerplate text regardless of product
- Descriptions from API are not displayed

### 10. Account page wishlist count hardcoded
- **`app/account/page.tsx`** — shows "5" as hardcoded wishlist count

### 11. Promo codes are hardcoded
- **`data/promoCodes.ts`** — all codes and validation are static
- Needs backend endpoint for dynamic promo management

---

## 🟢 Minor / Cleanup

### 12. `data/comboOffers.ts` uses raw `fetch()` instead of `api` helper
### 13. `lib/actions/blog.ts` and `lib/actions/uses.ts` use dynamic `import()` for api (inconsistent)
### 14. `data/orders.ts` has unused `export const orders: Order[] = []`
### 15. `components/icons/ChatBubble.tsx` — `ChatBubbleFilled` has identical SVG to `ChatBubble`

---

## ✅ Currently Working (no changes needed)

### Pages (24 of 32)
Home, Blog, Brands (list + detail), Categories (list + detail), Combo Offers, Compare, Uses (list + detail), Products detail, Cart, Checkout, Auth (login + error), Track Order, Wishlist, About (static only), Loading, Error, Not Found

### Data Layer (10 of 12)
products, categories, brands, blog, comboOffers, offers, uses, benefits, bulkPricing, promoCodes

### Server Actions (9 of 10)
products, categories, brands, orders, auth, addresses, blog, uses, search

### Components (28 of 34)
Header, Footer, HeroSection, ProductRow, DiscoveryGrid, LatestArrivalsRow, OfferSection, ProductCard, CategoryCard, BrandCard, Breadcrumb, EmptyState, StarRating, BuyButtons, SellerCard, SpecsTable, WishlistButton, CollapsibleSection, ProductHighlights, TrustBadges, LiveChatWidget, ChatProductButton, AddressCard, AddressForm, AddressSelector, Icons, ChatBubble
