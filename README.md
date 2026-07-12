# tradehubuae

# TradeHub UAE 🚀

**Enterprise Ecommerce Platform** for IT Equipment in the United Arab Emirates.

## Architecture

```
tradehubuae/
├── apps/
│   ├── web/          # Customer website (Next.js 15)
│   ├── admin/        # Admin dashboard (Next.js 15)
│   ├── api/          # Backend API (NestJS)
│   ├── worker/       # Background workers (BullMQ)
│   └── docs/         # Documentation
├── packages/
│   ├── ui/           # Shared UI components (shadcn/ui)
│   ├── database/     # Prisma schema & client
│   ├── auth/         # Authentication (NextAuth)
│   ├── config/       # Shared configuration
│   ├── types/        # TypeScript types
│   ├── validation/   # Zod schemas
│   ├── seo/          # SEO utilities
│   ├── utils/        # Utility functions
│   ├── ai/           # AI integration (Gemini)
│   ├── storage/      # File storage (S3/R2)
│   └── logger/       # Logging service
├── docker/           # Docker configurations
└── .github/          # CI/CD pipelines
```

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Monorepo** | Turborepo + pnpm |
| **Frontend** | Next.js 15, React 19, Tailwind CSS, shadcn/ui |
| **Backend** | NestJS, Prisma ORM |
| **Database** | PostgreSQL |
| **Queue** | BullMQ + Redis |
| **Auth** | NextAuth.js (Auth.js) + JWT |
| **AI** | Google Gemini API |
| **Storage** | AWS S3 / Cloudflare R2 |
| **Email** | Resend |
| **Payments** | Cash on Delivery (v1), Stripe/Tabby/Tamara (future) |

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm >= 9
- PostgreSQL
- Redis

### Installation

```bash
# Install dependencies
pnpm install

# Setup environment
cp .env.example .env
# Edit .env with your credentials

# Generate Prisma client
pnpm db:generate

# Push database schema
pnpm db:push

# Start development
pnpm dev
```

### Services

| Service | URL | Port |
|---------|-----|------|
| Customer Website | http://localhost:3000 | 3000 |
| Admin Dashboard | http://localhost:3001 | 3001 |
| API | http://localhost:4000 | 4000 |

## Domains

- **Website**: tradehubuae.com
- **Admin**: admin.tradehubuae.com
- **API**: api.tradehubuae.com

## Features

- [x] Full product catalog with categories & brands
- [x] Advanced search with PostgreSQL full-text search
- [x] Multi-warehouse inventory management
- [x] AI-powered product generation & SEO
- [x] Role-based access control (RBAC)
- [x] Bulk sales & corporate ordering
- [x] Combo offers & promotions
- [x] SEO optimized with Schema.org
- [x] Responsive, mobile-first design
- [x] Image optimization (WebP/AVIF)

## Environment Variables

See `.env.example` for all required environment variables.

## License

Private - All rights reserved.
