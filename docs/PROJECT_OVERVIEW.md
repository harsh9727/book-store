# Project Overview

## Product

GTBS Book Store is a responsive e-commerce website for Gujarat Tract Book Store. It presents Christian books, Bibles, devotionals, magazines, gifts, store information, editorial content, and a protected administration area.

The repository currently implements a frontend-led storefront with a dynamic, file-backed product/category/blog/gallery repository. Cart and wishlist routes are static empty-state pages; checkout and customer-account routes are presentation UI. These commerce areas are not connected to a production database or backend.

## Technology stack

- Next.js 16 App Router, React 19, and strict TypeScript
- Tailwind CSS 4
- Lucide React and React Icons
- EmailJS for the contact form
- Swiper for carousels
- Zod for request and persisted-content validation
- Tiptap 3 for the Blog admin rich-text editor
- UploadThing server SDK for managed blog/gallery/product images
- Node crypto for scrypt password hashing, TOTP MFA, and admin session signing

## Routes and current state

| Area | Routes | Current state |
| --- | --- | --- |
| Storefront | `/`, `/shop`, `/allproducts`, `/product/[id]` | Dynamic Product/Category catalog served by the content repository |
| Content | `/about`, `/blogs`, `/gallery`, `/gallery/[slug]`, `/contact` | Blog/gallery data is dynamic; Gallery detail URLs use title-derived slugs |
| Shopping | `/cart`, `/wishlist`, `/checkout` | Static empty states/presentation UI; no cart state or production order backend |
| Customer | `/login`, `/register`, `/profile` | UI exists; identity backend pending |
| Policies | Privacy, terms, and shipping routes | Content implemented |
| Admin | `/admin/login`, `/admin/dashboard`, `/admin/products`, `/admin/products/add`, `/admin/products/[id]/edit`, `/admin/categories`, `/admin/blogs`, `/admin/galleries` and their add/edit routes | Protected dashboard, catalog, and content workspaces share one responsive sidebar/header; Products, Blogs, and Gallery use list-first management while Categories use a dedicated inline module |
| Admin API | `/api/admin/login`, `/api/admin/logout`, `/api/admin/content/*` | Auth plus validated same-origin content CRUD and UploadThing uploads |
| SEO | robots, sitemap, manifest, metadata | App Router generated |

The public storefront has no cookie-consent banner or consent cookie. Selecting Gujarati opts into the Google Translate integration and its language cookie. Admin authentication continues to use a signed HttpOnly session cookie.

The Language provider and Google Translate lifecycle exist only inside public `SiteChrome`. Admin routes do not subscribe to the storefront language store, create the hidden translation element, or load the third-party translation script.

Public Gallery detail pages show photos in a responsive 1/2/4-column grid. The first 8 are visible initially; View more reveals the remaining batch and expands the photos available to the lightbox. The viewer supports click controls plus Left Arrow, Right Arrow, and Escape keyboard controls.

Gallery cards and canonical detail URLs use each album's stored title-derived slug. Legacy numeric Gallery URLs redirect to the matching slug route when the record still exists.

## Data

Products and categories have committed seed arrays in `src/data/` for first-run/backward-compatible catalog hydration; Product/Category admin mutations then persist them alongside Blogs and Galleries in ignored `storage/content.json`. The full document is strictly validated and written atomically. A `catalogInitialized` marker distinguishes an intentional empty catalog from a legacy/accidental uninitialized empty document: only the latter receives committed seeds. This is single-instance filesystem persistence, not a database. FAQs remain static, and cart/wishlist have no state layer or persistence implementation.

## Local setup

1. Install dependencies with `npm install` or the declared package manager, pnpm.
2. Copy `.env.example` to `.env` and provide local values. Never commit `.env`.
3. Run `npm run admin:setup` to generate the production password hash, session secret, and authenticator secret; store the output in local/deployment secret configuration.
4. Run `pnpm dev` (or `npm run dev`) to use the repository's stable Webpack development fallback on Windows. `pnpm dev:turbopack` remains available for explicit Turbopack diagnostics.
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
| `UPLOADTHING_TOKEN` | Authenticates server-side blog/gallery image uploads | Server only |
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
- Admin Orders, Customers, Analytics, Settings, and Help are not implemented and are not shown in the sidebar; Overview, Products, Categories, Blogs, and Gallery are available.
- Product management supports search/filter/list and standalone add/edit forms for books, gifts, accessories, and other catalog items. The admin list shows Product, Category, Price, and Actions; it does not expose legacy stock data. The form provides a single authored Price without browser spinner arrows, a controlled Badge dropdown, one uploaded Card image, up to 6 uploaded Detail page images with immediate previews/removal, content, up to 50 arbitrary specification name/value rows, and up to 20 product-specific variant groups with up to 50 options per group. Exact duplicate feature lines are collapsed on submission, while legacy duplicates remain safe to render on the detail page. Brand/creator, inventory/availability, and rating/review-count controls are not authored in this form. The storefront renders saved groups such as Size, Color, Format, Pack, Storage, or Edition without hardcoded variant names, and the detail gallery combines the card image with saved extras. Legacy creator, book, inventory/rating, and extra-image URL fields remain readable by the storage validator, with book details and legacy images migrated into generic records when edited, but new mutations use only the flexible supported shape. Category selection is strict, but an admin can open Add category from the Product form, create a missing name-and-slug Category in a modal popup, and have it selected immediately. The separate Category manager supports slug edits that cascade to assigned Products and prevents deletion of an assigned Category. Category descriptions are no longer accepted by admin mutations or displayed on home-page Category cards, while legacy stored descriptions remain readable for backward-compatible validation.
- Product Core details stacks on mobile; from `sm` upward it pairs Slug with Category and Badge with Price while Title remains full-width.
- Blog and Gallery index routes default to responsive tables with text search, category filtering, and 8-row client-side pagination. Add and Edit navigate to separate protected form routes; Save or Cancel returns to the related list, while View opens the corresponding public detail route. CRUD mutations report success/failure through admin-scoped toasts, and Delete requires confirmation in a custom modal.
- Blog admin create/edit pages use distinct responsive cards for heading/actions, Common fields, English content, and Gujarati content. The language-independent Slug, Date, Banner image, and Author avatar controls live in the Common fields card; each language card contains its own title, category, author name/role, and article content. Both language articles use the responsive Tiptap toolbar for headings, inline emphasis, lists, quotes, code, rules, links, and history controls. When Gujarati is selected, saved Gujarati data is used reactively on home cards, the Blog list/search/categories, detail content, breadcrumbs, and related articles; legacy posts without it retain the prior translation fallback. The forms no longer require a summary field, and the author avatar is optional. If no avatar image is uploaded, the form uses `/images/logo/logo.webp` so the public author card still renders a valid image.
- Gallery admin create/edit pages use matching standalone cards for heading/actions, Common fields, English content, Gujarati content, and Gallery images. Slug and date are shared; English and Gujarati each have title, category, location, description, and optional organizer fields. Subtitle is not part of Gallery CRUD. Cover upload, extra-photo selection, inline image errors, retained photos, and pending previews stay together in the image card. Selecting Gujarati reactively switches authored Gallery list/search/category, detail, breadcrumb, organizer, and related-album text; legacy records without Gujarati content retain the translation fallback.
- Image selection errors are displayed directly below the affected banner, cover, or extra-photo input; general API/mutation failures remain form-level and toast notifications.
- Newly selected Gallery extra photos render local previews before submission, are marked `New`, can be removed individually, and remain subject to the combined 12-photo limit.
- Product/category/blog/gallery metadata persistence requires one writable persistent Node filesystem. Serverless/read-only/multi-replica deployments need a shared database repository before use.
- Uploading images and then failing a later content mutation can leave an unreferenced UploadThing file that must be cleaned up manually.
- Admin auth supports one environment-configured account and no roles or database-backed per-session revocation.
- Login throttling is process-local; multi-instance deployments must also enable a shared host/WAF rate limit.
- Password recovery prepares a support email; it does not issue an automated reset token.
- There is no documented payment gateway or persistent order workflow.
- Windows sandbox child-process restrictions can block the final build worker even after compilation; lint and standalone TypeScript checks pass.
