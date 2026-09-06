# Project Overview

## Product

GTBS Book Store is a responsive e-commerce website for Gujarat Tract Book Store. It presents Christian books, Bibles, devotionals, magazines, gifts, store information, editorial content, and a protected administration area.

The repository currently implements a frontend-led storefront with a dynamic, file-backed product/category/blog/gallery/testimonial/team repository. Product sales are WhatsApp-assisted: Buy Now sends one Product immediately, while the browser-local Cart collects multiple Products and sends one itemized request. There is intentionally no Wishlist, Checkout, customer-account, payment-capture, or persistent-order page.

## Technology stack

- Next.js 16.3.3 App Router, React 19, and strict TypeScript
- Tailwind CSS 4
- Lucide React
- EmailJS for the contact form
- Zod for request and persisted-content validation
- Tiptap 3 for the Blog admin rich-text editor
- UploadThing server SDK for managed blog/gallery/product/team images
- Node crypto for scrypt password hashing, TOTP MFA, and admin session signing

## Routes and current state

| Area       | Routes                                                                                                                                            | Current state                                                                                                                                                                                                       |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Storefront | `/`, `/allproducts`, `/product/[id]`; legacy `/shop` and `/product` redirect to `/allproducts`                                                    | Dynamic Product/Category catalog, category-driven homepage Magazines, and homepage Testimonials served by the content repository                                                                                     |
| Content    | `/about`, `/blogs`, `/gallery`, `/gallery/[slug]`, `/contact`                                                                                     | Blog, Gallery, and the About Team section are dynamic; Gallery detail URLs use title-derived slugs                                                                                                                  |
| Shopping   | `/cart`                                                                                                                                           | Browser-local multi-Product Cart with quantity controls, an acknowledged-on-visit header update badge, and a direct itemized WhatsApp handoff                                                                         |
| Removed commerce aliases | `/checkout`, `/wishlist`, `/login`, `/register`, `/profile`                                                                                  | No page implementation; old URLs redirect to Cart or All Products                                                                                                                                                    |
| Policies   | Privacy, terms, and shipping routes                                                                                                               | Content implemented                                                                                                                                                                                                 |
| Admin      | `/admin/login`, `/admin/dashboard`, Product, Category, Blog, Gallery, Testimonial, and Team management routes including standalone add/edit pages | Protected dashboard, catalog, and content workspaces share one persistent responsive sidebar/header; route navigation swaps only main content, Products/Blogs/Gallery/Testimonials/Team use list-first management, and Categories uses a dedicated inline module |

All visible storefront catalog links and Product breadcrumbs use `/allproducts`. `/shop` remains only as a permanent backward-compatible redirect that preserves supported category, collection, and search parameters.

The Language provider and Google Translate lifecycle exist only inside public `SiteChrome`. Admin routes do not subscribe to the storefront language store, create the hidden translation element, or load the third-party translation script.

The homepage Hero keeps the established English composition. When Gujarati is active, it uses a compact language-aware desktop layout with an explicit 8-pixel badge-to-heading gap and a bounded 420-pixel stage so translated font metrics do not create oversized vertical whitespace; mobile height remains content-driven.

The Header Categories trigger has one route-independent closed style across the storefront. It changes to its orange open state only while the related desktop dropdown or mobile category panel is expanded; catalog route highlighting remains on the relevant navigation link instead of changing the trigger merely because of the current page.

Public Gallery detail pages show photos in a responsive 1/2/4-column grid. The first 8 are visible initially; View more reveals the remaining batch and expands the photos available to the lightbox. The viewer supports click controls plus Left Arrow, Right Arrow, and Escape keyboard controls.

Gallery cards and canonical detail URLs use each album's stored title-derived slug. Legacy numeric Gallery URLs redirect to the matching slug route when the record still exists.

Public Product, Blog, and Gallery index routes read their initial repository data in route-level Server Components and pass it into focused interactive Client Components. Their cards and empty states are present in the first server response; hydration does not trigger a second content request. Public repository-backed pages use a 300-second revalidation window, and every successful admin content mutation invalidates the public layout cache. The file-backed repository also retains one validated in-memory snapshot per Node process, deduplicates concurrent initial reads, clones the snapshot before mutation, and replaces it only after the atomic write succeeds.

The homepage Magazine section has no placeholder Product records. It shows up to three admin-managed Products assigned to the canonical `magazines` Category and links each card to its Product detail page. When that Category has no Products, the section remains visible with the same dashed empty-collection treatment and responsive View All placement used by the other homepage collections. Fresh catalogs seed the Category as `Magazines`; existing catalogs can create that English Category name once and let the backend generate its canonical `magazines` key.

## Data

Products, Categories, Testimonials, and Team members have committed seed arrays in `src/data/` for first-run/backward-compatible hydration; Blogs and Galleries have no committed fallback records and start empty until managed through the admin. Admin mutations persist all six domains in ignored `storage/content.json`. Existing stores missing the Testimonial or Team field receive their committed bilingual seeds, while explicit empty arrays remain authoritative. The full document is strictly validated and written atomically. A failed write makes a best-effort cleanup of its unique temporary file before surfacing the error. A `catalogInitialized` marker separately distinguishes an intentional empty Product/Category catalog from a legacy/accidental uninitialized catalog. This is single-instance filesystem persistence, not a database. FAQs remain static. Cart uses bounded, validated, non-sensitive `localStorage` records plus a non-sensitive read/unread update marker and intentionally does not synchronize its contents across devices.

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
npm run test:content
npm run test:site
npm audit --omit=dev
npm run build
```

## Environment variables

| Variable                   | Purpose                                                           | Exposure       |
| -------------------------- | ----------------------------------------------------------------- | -------------- |
| `NEXT_PUBLIC_SITE_URL`     | Canonical URL and SEO                                             | Public         |
| `GOOGLE_SITE_VERIFICATION` | Search Console verification                                       | Server config  |
| `NEXT_PUBLIC_EMAILJS_*`    | Contact-form EmailJS configuration                                | Public/browser |
| `UPLOADTHING_TOKEN`        | Authenticates server-side blog/gallery/product/team image uploads | Server only    |
| `ADMIN_EMAIL`              | Admin identity                                                    | Server only    |
| `ADMIN_PASSWORD_HASH`      | Generated scrypt password verifier; required in production        | Server only    |
| `ADMIN_SESSION_SECRET`     | HMAC signing secret                                               | Server only    |
| `ADMIN_SESSION_VERSION`    | Increment to invalidate every active admin session                | Server only    |
| `ADMIN_REQUIRE_MFA`        | Must be `true` in production                                      | Server only    |
| `ADMIN_TOTP_SECRET`        | Base32 authenticator secret                                       | Server only    |
| `ADMIN_TRUST_PROXY`        | Trust deployment-provided client IP headers for rate-limit keys   | Server only    |

`ADMIN_PASSWORD` remains a local-development migration fallback only and is rejected in production. Do not deploy it.

## Current limitations

- Dashboard product, order, revenue, and inventory figures are presentation data.
- Admin Orders, Customers, Analytics, Settings, and Help are not implemented and are not shown in the sidebar; Overview, Products, Categories, Blogs, Gallery, Testimonials, and Team are available.
- The authenticated Admin sidebar/top bar is owned by the persistent `/admin` layout, so Next.js client navigation and loading states replace only the main content panel. Active styling is derived from the pathname and remains correct on list, add, and edit routes. `/admin/login` intentionally omits this panel chrome; visibility is not an authorization boundary.
- Product management supports search/filter/list and standalone add/edit forms for books, gifts, accessories, and other catalog items. The Admin list shows Product, Category, Price, and Actions without exposing legacy stock or route identifiers. The form starts on English content and shows `Next`; successful English/shared-field validation advances to Gujarati without uploading or saving. The Gujarati step provides `Previous` and performs the final create/update submission. Both steps preserve their unsaved title, specifications, variants, short description, overview, and features. New writes require both titles, while Price, Category, Badge, Card image, and up to 6 Detail page images are shared. The Product ID/slug is generated by the backend from the English title on create and retained on edit. Each language supports up to 50 specification values, 20 product-specific variant groups with up to 50 individual option inputs per group, and 30 individual feature inputs. Specification and Variant cards share the same grouped design: a full-width name input, a divided Values/Options area, an add button, and individually removable two-column inputs. Existing repeated specification names are grouped in the editor and flattened back into the established `{ name, value }` records when submitted. Features use individual inputs with adjacent add/delete icons; plus inserts a field immediately after the selected feature. Partially completed specification or variant groups are reported before advancing or saving, while wholly blank groups/feature inputs are omitted. Exact duplicate features and variant options are collapsed independently on submission, while legacy duplicates remain safe to render. Brand/creator, inventory/availability, and rating/review-count controls are not authored in this form. The storefront reactively selects authored Gujarati Product cards, catalog-search titles, detail breadcrumbs/content, variants, specifications, and related items; legacy Products without Gujarati content retain Google Translate fallback. Category remains shared by slug, while its display name is bilingual. The storefront renders saved groups such as Size, Color, Format, Pack, Storage, or Edition without hardcoded variant names, and the detail gallery combines the card image with saved extras in a horizontally scrollable row of 80-pixel square thumbnails below a compact square main-image stage. Legacy creator, book, inventory/rating, and extra-image URL fields remain readable by the storage validator, with book details and legacy images migrated into generic records when edited, but new mutations use only the flexible supported shape. Category selection is strict, but an admin can open Add category from the Product form, enter English then Gujarati names in a two-step modal, submit only from Gujarati, and have the backend-generated key selected immediately. The separate Category manager uses the same English `Next`, Gujarati `Previous`/final-submit flow, retains the stored key on edit, and prevents deletion of an assigned Category. Category rows show both authored names; homepage Category cards and All Products filters select saved Gujarati names reactively. Category slugs/descriptions are not authored or displayed in Admin CRUD, while stored legacy values remain available for routing, relations, and backward-compatible validation.
- Product Core details stacks on mobile; from `sm` upward Category spans the shared row and Badge pairs with Price while the current step's Title remains full-width.
- Category final-step actions stack full-width on narrow screens; from `sm` upward Previous stays compact and Create/Update fills the remaining row without wrapping its label.
- Product detail variant choices use compact chips. The purchase row uses a compact quantity stepper and content-bounded Add to Cart/Buy Now actions on larger screens; on mobile the two CTAs share one balanced two-column row rather than stretching into oversized desktop columns.
- Blog and Gallery index routes default to responsive tables with text search, category filtering, and 8-row client-side pagination. Add and Edit navigate to separate protected form routes; Save or Cancel returns to the related list, while View opens the corresponding public detail route. CRUD mutations report success/failure through admin-scoped toasts, and Delete requires confirmation in a custom modal.
- Blog admin create/edit pages use the sequential English-to-Gujarati flow. The English step validates shared Date, Banner image, Author avatar, title, category, author, and article content before `Next` reveals the Gujarati card. The Gujarati step can return with `Previous` and is the only step that submits the bilingual payload. Both language articles use the responsive Tiptap toolbar for headings, inline emphasis, lists, quotes, code, rules, links, and history controls. The backend derives a unique slug from the English title on create and retains it on edit. When Gujarati is selected on the storefront, saved Gujarati data is used reactively on home cards, the Blog list/search/categories, detail content, breadcrumbs, and related articles; legacy posts without it retain the prior translation fallback. The forms no longer require a summary field, and the author avatar is optional. If no avatar image is uploaded, the form uses `/images/logo/logo.webp` so the public author card still renders a valid image.
- Gallery admin create/edit pages use the same English `Next` then Gujarati final-submit flow while preserving both sets of unsaved values. Date and the Gallery images card remain shared. Each language requires title, category, location, and description while organizer is optional. Subtitle and Slug are not authored through Gallery CRUD; the backend derives a unique slug from the English title on create and retains it on edit. Cover upload, extra-photo selection, inline image errors, retained photos, and pending previews stay together in the image card. Selecting Gujarati reactively switches authored Gallery list/search/category, detail, breadcrumb, organizer, and related-album text; legacy records without Gujarati content retain the translation fallback.
- Testimonial management provides a searchable, paginated list plus protected standalone add/edit forms and confirmation-based deletion. Rating is a shared 1–5 value; English and Gujarati separately require customer name, role, and testimonial text. Add/Edit starts with English `Next`, preserves the draft when Gujarati is shown, and submits only from the Gujarati step; `Previous` returns to English. The homepage review carousel reads the repository on each dynamic request, renders saved star ratings, switches reactively to authored Gujarati content, and disappears when the persisted list is empty. Initials are derived from the localized customer name; avatar uploads and manual ordering are not implemented.
- Team management provides a searchable, eight-row paginated list plus protected standalone add/edit forms and confirmation-based deletion. Each profile has one shared uploaded image and separately required English/Gujarati name and role fields. Add/Edit starts on English, advances with `Next`, and creates/updates only after Gujarati validation; `Previous` preserves and restores the English draft. The dynamic About page selects authored Gujarati profiles reactively and hides the complete Team section when its persisted array is empty. Repository order controls display order; manual reordering is not implemented.
- Image selection errors are displayed directly below the affected banner, cover, or extra-photo input; general API/mutation failures remain form-level and toast notifications.
- Newly selected Gallery extra photos render local previews before submission, are marked `New`, can be removed individually, and remain subject to the combined 12-photo limit.
- Product/category/blog/gallery/testimonial/team metadata persistence requires one writable persistent Node filesystem. Serverless/read-only/multi-replica deployments need a shared database repository before use.
- Uploading images and then failing a later content mutation can leave an unreferenced UploadThing file that must be cleaned up manually.
- Admin auth supports one environment-configured account and no roles or database-backed per-session revocation.
- Login throttling is process-local; multi-instance deployments must also enable a shared host/WAF rate limit.
- Password recovery prepares a support email; it does not issue an automated reset token.
- Cart is device-local browser state; it is not authenticated, inventory-reserved, server-validated, or synchronized across devices.
- Buy Now and Cart prepare WhatsApp enquiries only. They do not confirm shipping, reserve stock, charge a payment method, or create a persistent order.
- Wishlist, Checkout, customer sign-in, registration, and profile pages are intentionally absent from the product scope.
- Contact delivery depends on browser-side EmailJS configuration/provider availability and still needs deployment-level allowed-origin, quota, and abuse controls.
- A real HTTPS `NEXT_PUBLIC_SITE_URL` must be set before deployment; otherwise canonical and social metadata fall back to localhost and production admin auth fails closed.
- Windows sandbox child-process restrictions can block build/test workers; use the documented direct in-process test fallback for diagnosis and require an exit-0 production build before release.
