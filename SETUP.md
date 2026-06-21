# PropFirmHub — Setup Guide

## Prerequisites

- Node.js 20+
- PostgreSQL 15+ (or Docker)
- npm 10+

---

## Quick Start (Local Development)

### 1. Clone & Install Dependencies

```bash
cd popfram

# Install backend deps
cd backend && npm install && cd ..

# Install frontend deps
cd frontend && npm install && cd ..
```

### 2. Setup PostgreSQL

**Option A — Docker (easiest):**
```bash
docker compose up postgres -d
```

**Option B — Local PostgreSQL:**
Create a database: `createdb propfirmhub`

### 3. Configure Environment

**Backend:**
```bash
cp backend/.env.example backend/.env
# Edit backend/.env:
# DATABASE_URL="postgresql://user:password@localhost:5432/propfirmhub"
# JWT_SECRET="your-random-secret-256-bits"
```

**Frontend:**
```bash
cp frontend/.env.local.example frontend/.env.local
# NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 4. Run Database Migrations

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
npm run prisma:seed     # Seeds: admin user + sample firms
```

**Default Admin Credentials:**
- Email: `admin@propfirmhub.com`
- Password: `Admin@1234`

### 5. Start Development Servers

**Terminal 1 — Backend:**
```bash
cd backend && npm run dev
# Runs on http://localhost:4000
```

**Terminal 2 — Frontend:**
```bash
cd frontend && npm run dev
# Runs on http://localhost:3000
```

---

## Project Structure

```
popfram/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # All DB models
│   │   └── seed.ts             # Sample data
│   ├── src/
│   │   ├── index.ts            # Express app entry
│   │   ├── lib/
│   │   │   └── prisma.ts       # Prisma client
│   │   ├── middleware/
│   │   │   ├── auth.ts         # JWT auth + RBAC
│   │   │   ├── errorHandler.ts
│   │   │   └── upload.ts       # Multer file upload
│   │   └── routes/
│   │       ├── admin.ts        # All admin CRUD
│   │       ├── auth.ts         # Register/Login
│   │       ├── firms.ts        # Public firm endpoints
│   │       ├── reviews.ts      # Reviews
│   │       ├── offers.ts       # Offers/coupons
│   │       ├── brokers.ts      # Brokers
│   │       ├── blog.ts         # Blog posts
│   │       ├── redirect.ts     # /go/:slug affiliate tracking
│   │       ├── search.ts       # Global search
│   │       ├── analytics.ts    # Dashboard stats
│   │       ├── newsletter.ts   # Email subscribe
│   │       └── pages.ts        # CMS pages
│   └── package.json
│
└── frontend/
    └── src/
        ├── app/
        │   ├── (main)/         # Public routes (with Navbar/Footer)
        │   │   ├── page.tsx            # Homepage
        │   │   ├── firms/
        │   │   │   ├── page.tsx        # Firm directory
        │   │   │   └── [slug]/         # Single firm page
        │   │   ├── compare/page.tsx    # Comparison tool
        │   │   ├── top-rated/page.tsx
        │   │   ├── trending/page.tsx
        │   │   ├── offers/page.tsx
        │   │   ├── brokers/page.tsx
        │   │   ├── blog/page.tsx
        │   │   ├── login/page.tsx
        │   │   └── register/page.tsx
        │   ├── admin/                  # Admin panel
        │   │   ├── layout.tsx          # RBAC-protected sidebar
        │   │   ├── page.tsx            # Dashboard
        │   │   ├── firms/              # CRUD firms
        │   │   ├── reviews/            # Approve/reject
        │   │   ├── offers/
        │   │   ├── brokers/
        │   │   ├── blog/
        │   │   └── settings/
        │   ├── sitemap.ts
        │   └── robots.ts
        ├── components/
        │   ├── layout/
        │   │   ├── Navbar.tsx
        │   │   └── Footer.tsx
        │   ├── home/
        │   │   ├── HeroBanner.tsx
        │   │   ├── FeaturedFirms.tsx
        │   │   ├── TopRatedSection.tsx
        │   │   ├── TrendingSection.tsx
        │   │   ├── LatestOffers.tsx
        │   │   ├── ComparisonCTA.tsx
        │   │   └── NewsletterSection.tsx
        │   └── firms/
        │       ├── FirmCard.tsx
        │       ├── FirmListItem.tsx
        │       ├── FirmsFilter.tsx
        │       ├── CompareBar.tsx
        │       ├── ReviewForm.tsx
        │       └── ReviewCard.tsx
        ├── lib/
        │   ├── api.ts          # Axios client + all API calls
        │   └── utils.ts
        ├── types/index.ts      # TypeScript types
        └── hooks/useAuth.ts    # Auth context
```

---

## API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh token |
| GET  | `/api/auth/me` | Get current user |

### Prop Firms
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/firms` | List firms (filterable) |
| GET | `/api/firms/featured` | Featured firms |
| GET | `/api/firms/trending` | Trending firms |
| GET | `/api/firms/top-rated` | Top rated |
| GET | `/api/firms/:slug` | Single firm |

### Affiliate Redirect
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/go/:slug` | Track click + redirect |

### Admin (requires EDITOR or SUPER_ADMIN)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/api/admin/firms` | CRUD firms |
| PUT/DELETE | `/api/admin/firms/:id` | Update/delete |
| PATCH | `/api/reviews/:id/status` | Approve/reject review |
| PUT | `/api/admin/settings/:key` | Update settings |

---

## Docker Deployment

```bash
# Copy and fill env vars first
cp backend/.env.example backend/.env

# Build and start all services
docker compose up -d

# Run migrations
docker compose exec backend npx prisma migrate deploy
docker compose exec backend npm run prisma:seed
```

---

## Production Deployment Checklist

- [ ] Set strong `JWT_SECRET` (32+ random chars)
- [ ] Set `NODE_ENV=production`
- [ ] Configure SMTP for email notifications
- [ ] Set `FRONTEND_URL` to your domain
- [ ] Set up SSL/HTTPS (Nginx reverse proxy)
- [ ] Configure a CDN for `/uploads` static files
- [ ] Set up daily PostgreSQL backups
- [ ] Add rate limiting (already included via `express-rate-limit`)
- [ ] Configure `NEXT_PUBLIC_SITE_URL` for correct sitemap URLs

---

## Adding New Features

### Add a new Prop Firm (Admin)
1. Go to `/admin` → Login with admin credentials
2. Click **Prop Firms** → **Add Firm**
3. Fill in details, upload logo, set affiliate URL
4. The `/go/slug` redirect is automatically set up

### Manage Affiliate Links
- Each firm has both `websiteUrl` (public) and `affiliateUrl` (for tracking)
- When user clicks **Visit Firm**, they go to `/go/slug`
- Backend logs the click + redirects to `affiliateUrl`
- Change `affiliateUrl` anytime from Admin → Prop Firms → Edit

### Review Approval Flow
1. User submits review → Status: `PENDING`
2. Admin sees it in **Reviews** tab
3. Click ✓ to **Approve** or ✗ to **Reject**
4. Approved reviews update the firm's average rating automatically
