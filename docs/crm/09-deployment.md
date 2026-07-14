# Deployment Architecture — `crm.tradehubuae.com`

## Strategy

CRM runs on the **same Next.js service** as the admin dashboard. The subdomain `crm.tradehubuae.com` is handled by Next.js middleware that detects the hostname and rewrites to `/crm`.

```
User → crm.tradehubuae.com → DNS → Railway → Admin Next.js service
                                                   ↓
                                         Middleware checks hostname
                                                   ↓
                                        Rewrites / → /crm (CRM layout)
                                        OR / → /dashboard (Admin layout)
```

## Middleware Setup

Create `apps/admin/src/middleware.ts`:

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const url = request.nextUrl.clone();

  // CRM subdomain → rewrite to /crm
  if (hostname.startsWith("crm.")) {
    if (url.pathname === "/") {
      url.pathname = "/crm";
    }
    // All /crm/* routes work naturally since they exist in the app
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico).*)"],
};
```

## Railway Setup

### Current Setup (Admin)
- **Project:** TradeHub UAE
- **Service:** `admin` (or whatever the existing admin service is named)
- **Domain:** `admin.tradehubuae.com` (or similar)

### Adding CRM Subdomain

1. **Add custom domain** on the admin service:
   ```
   railway domain --domain crm.tradehubuae.com
   ```

2. **DNS records** (point to Railway):
   ```
   crm.tradehubuae.com  CNAME  →  <railway-generated>.railway.app
   ```

3. **No additional environment variables needed** — the same API URL, database, and auth work for CRM.

### Environment Variables

Current variables remain the same. No new ones needed since CRM is part of the same app.

| Variable | Current Value | CRM Impact |
|----------|--------------|------------|
| `DATABASE_URL` | postgres://... | Same DB — CRM tables added |
| `NEXT_PUBLIC_API_URL` | https://api.tradehubuae.com/api/v1 | Same API |
| `NEXTAUTH_URL` | https://admin.tradehubuae.com | Must allow `https://crm.tradehubuae.com` in callback URLs |
| `NEXTAUTH_SECRET` | *** | Same |

## NextAuth Configuration

Update NextAuth to accept the CRM subdomain as a valid callback URL:

```typescript
// apps/admin/src/lib/auth.ts
export const authOptions: NextAuthOptions = {
  providers: [...],
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Allow both admin.tradehubuae.com and crm.tradehubuae.com redirects
      if (url.startsWith("/")) return url;
      if (url.startsWith("https://crm.tradehubuae.com")) return url;
      if (url.startsWith("https://admin.tradehubuae.com")) return url;
      return baseUrl;
    },
  },
};
```

---

## Alternative: Separate App Deployment

If the middleware approach causes issues (e.g., authentication callbacks), CRM can be deployed as a separate service:

1. Create `apps/crm/` as a new Next.js app (copy of `apps/admin/` with CRM-focused routes only)
2. Deploy as a separate Railway service
3. Connect `crm.tradehubuae.com` → CRM service
4. Share the same database

**Tradeoff:** More deployment complexity, duplicate code. Only recommended if auth callbacks cannot be resolved.

## Build Command

No change needed for the current build setup:

```json
// turbo.json — already configured for apps/admin
"admin:build": "cd apps/admin && next build"
```

Build will include `/crm/*` routes automatically since they're part of the app.

---

## Pre-deployment Checklist

- [ ] All CRM database tables created via drizzle migrations
- [ ] All API endpoints implemented and tested
- [ ] Middleware handles `crm.` subdomain correctly
- [ ] NextAuth allows `crm.tradehubuae.com` callback URLs
- [ ] CRM pages have proper loading, error, and empty states
- [ ] Mobile responsive at 320px (follow existing patterns)
- [ ] All graphs handle empty data gracefully
- [ ] Seed data for expense categories added
- [ ] Sidebar updated to include CRM navigation (when on CRM subdomain)
