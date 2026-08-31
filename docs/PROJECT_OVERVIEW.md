# Project Overview

## Product

GTBS Book Store is a responsive e-commerce website for Gujarat Tract Book Store. It presents Christian books, Bibles, devotionals, magazines, gifts, store information, editorial content, and a protected administration area.

The repository currently implements a frontend-led storefront using local TypeScript data. Cart and wishlist routes are static empty-state pages; checkout and customer-account routes are presentation UI. These areas and most admin business actions are not connected to a production database or commerce backend.

## Technology stack

- Next.js 16 App Router, React 19, and strict TypeScript
- Tailwind CSS 4
- Lucide React, React Icons, shadcn/Base UI
- EmailJS for the contact form
- Swiper for carousels
- Zod and React Hook Form are available for forms
- Node crypto for scrypt password hashing, TOTP MFA, and admin session signing

## Routes and current state

| Area | Routes | Current state |
| --- | --- | --- |
| Storefront | `/`, `/shop`, `/allproducts`, `/product/[id]` | UI and local product catalog |
| Content | `/about`, `/blogs`, `/gallery`, `/contact` | Frontend pages implemented |
| Shopping | `/cart`, `/wishlist`, `/checkout` | Static empty states/presentation UI; no cart state or production order backend |
| Customer | `/login`, `/register`, `/profile` | UI exists; identity backend pending |
| Policies | Privacy, terms, and shipping routes | Content implemented |
| Admin | `/admin/login`, `/admin/dashboard` | Server-protected login, production-required MFA, responsive shell |
| Admin API | `/api/admin/login`, `/api/admin/logout` | Validated, throttled, same-origin signed-cookie login/logout |
| SEO | robots, sitemap, manifest, metadata | App Router generated |

The public storefront has no cookie-consent banner or consent cookie. Selecting Gujarati opts into the Google Translate integration and its language cookie. Admin authentication continues to use a signed HttpOnly session cookie.

## Data

Catalog and content live in `src/data/`: products, categories, blogs, galleries, and FAQs. Cart and wishlist currently have no state layer or persistence implementation.

## Local setup

1. Install dependencies with `npm install` or the declared package manager, pnpm.
2. Copy `.env.example` to `.env` and provide local values. Never commit `.env`.
3. Run `npm run admin:setup` to generate the production password hash, session secret, and authenticator secret; store the output in local/deployment secret configuration.
4. Run `npm run dev`.
5. Open `http://localhost:3000`.

Useful checks:

```bash
npm run lint
npx tsc --noEmit
npm run test:admin-auth
npm run build
```

## Environment variables

| Variable | Purpose | Exposure |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL and SEO | Public |
| `GOOGLE_SITE_VERIFICATION` | Search Console verification | Server config |
| `NEXT_PUBLIC_EMAILJS_*` | Contact-form EmailJS configuration | Public/browser |
| `ADMIN_EMAIL` | Admin identity | Server only |
| `ADMIN_PASSWORD_HASH` | Generated scrypt password verifier; required in production | Server only |
| `ADMIN_SESSION_SECRET` | HMAC signing secret | Server only |
| `ADMIN_SESSION_VERSION` | Increment to invalidate every active admin session | Server only |
| `ADMIN_REQUIRE_MFA` | Must be `true` in production | Server only |
| `ADMIN_TOTP_SECRET` | Base32 authenticator secret | Server only |
| `ADMIN_TRUST_PROXY` | Trust deployment-provided client IP headers for rate-limit keys | Server only |

`ADMIN_PASSWORD` remains a local-development migration fallback only and is rejected in production. Do not deploy it.

## Current limitations

- Dashboard product, order, revenue, and inventory figures are presentation data.
- Admin items other than Overview are placeholders.
- Admin auth supports one environment-configured account and no roles or database-backed per-session revocation.
- Login throttling is process-local; multi-instance deployments must also enable a shared host/WAF rate limit.
- Password recovery prepares a support email; it does not issue an automated reset token.
- There is no documented payment gateway or persistent order workflow.
- Windows sandbox child-process restrictions can block the final build worker even after compilation; lint and standalone TypeScript checks pass.
