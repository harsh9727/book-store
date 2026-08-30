# Project Overview

## Product

GTBS Book Store is a responsive e-commerce website for Gujarat Tract Book Store. It presents Christian books, Bibles, devotionals, magazines, gifts, store information, editorial content, and a protected administration area.

The repository currently implements a frontend-led storefront using local TypeScript data. Cart, wishlist, checkout, customer accounts, and most admin business actions are not connected to a production database or commerce backend.

## Technology stack

- Next.js 16 App Router, React 19, and strict TypeScript
- Tailwind CSS 4
- Lucide React, React Icons, shadcn/Base UI
- EmailJS for the contact form
- Swiper for carousels
- Zod and React Hook Form are available for forms
- Node crypto for admin session signing

## Routes and current state

| Area | Routes | Current state |
| --- | --- | --- |
| Storefront | `/`, `/shop`, `/allproducts`, `/product/[id]` | UI and local product catalog |
| Content | `/about`, `/blogs`, `/gallery`, `/contact` | Frontend pages implemented |
| Shopping | `/cart`, `/wishlist`, `/checkout` | Client experience; no production order backend |
| Customer | `/login`, `/register`, `/profile` | UI exists; identity backend pending |
| Policies | Privacy, terms, and shipping routes | Content implemented |
| Admin | `/admin/login`, `/admin/dashboard` | Server-protected login and responsive shell |
| Admin API | `/api/admin/login`, `/api/admin/logout` | Signed-cookie login/logout |
| SEO | robots, sitemap, manifest, metadata | App Router generated |

The public storefront has no cookie-consent banner or consent cookie. Selecting Gujarati opts into the Google Translate integration and its language cookie. Admin authentication continues to use a signed HttpOnly session cookie.

## Data

Catalog and content live in `src/data/`: products, categories, blogs, galleries, FAQs, and banners. Cart and wishlist behavior lives in `src/hooks/` and should be treated as browser-local until a backend is introduced.

## Local setup

1. Install dependencies with `npm install` or the declared package manager, pnpm.
2. Copy `.env.example` to `.env` and provide local values. Never commit `.env`.
3. Run `npm run dev`.
4. Open `http://localhost:3000`.

Useful checks:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Environment variables

| Variable | Purpose | Exposure |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL and SEO | Public |
| `GOOGLE_SITE_VERIFICATION` | Search Console verification | Server config |
| `NEXT_PUBLIC_EMAILJS_*` | Contact-form EmailJS configuration | Public/browser |
| `ADMIN_EMAIL` | Admin identity | Server only |
| `ADMIN_PASSWORD` | Admin secret | Server only |
| `ADMIN_SESSION_SECRET` | HMAC signing secret | Server only |

## Current limitations

- Dashboard product, order, revenue, and inventory figures are presentation data.
- Admin items other than Overview are placeholders.
- Admin auth supports one environment-configured account and no roles.
- There is no documented payment gateway or persistent order workflow.
- Full repository lint has existing failures listed in `TROUBLESHOOTING.md`.
