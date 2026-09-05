# Project Progress

## Status

| Area              | Status                              | Notes                                                                                                                |
| ----------------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Public storefront | Functional baseline                 | Main pages work; catalog/editorial content is file-backed and public cache revalidation is implemented               |
| Product catalog   | Dynamic filesystem baseline         | Admin CRUD, category relation, storefront feeds, and product detail UI                                               |
| Cart              | Browser-local implemented           | Multi-Product list, live count, quantity/remove controls, cross-tab updates, and WhatsApp handoff                     |
| Product sales     | WhatsApp-assisted                    | Card/detail Buy Now and Cart send itemized requests; GTBS confirms availability, delivery, total, and payment         |
| Customer utilities | Intentionally out of scope         | No Wishlist, Checkout, customer account, profile, or order-history pages                                              |
| Admin auth        | Production-hardened baseline        | Single environment-backed admin, scrypt + TOTP, signed cookie                                                        |
| Admin dashboard   | Catalog/content navigation complete | Dashboard figures remain presentation data; product/category/blog/gallery/testimonial/team management is implemented |
| SEO               | Improved; deployment config pending | Metadata, headings, structured data, robots, sitemap, manifest; real HTTPS canonical URL still required              |
| Documentation     | Active                              | Must evolve with every change                                                                                        |
| Automated quality | Healthy baseline                    | ESLint, TypeScript, 37 focused/integrity tests, production build, and dependency audit pass                           |

## Current priorities

1. Configure and verify the real HTTPS `NEXT_PUBLIC_SITE_URL`, production secrets, provider origins, and shared WAF rate limiting.
2. Replace single-instance filesystem content storage with a shared production database.
3. Operationally verify WhatsApp order handling, current Product availability, delivery pricing, and payment-confirmation procedures.
4. Replace dashboard presentation figures with repository data where those figures remain in scope.
5. Run deployed-origin Core Web Vitals monitoring and authenticated/provider browser journeys in the target environment.

## Change log

### 2026-09-05 - Canonical Products breadcrumb and links

- Outcome: changed the Product-detail breadcrumb label from Shop to Products and replaced its catalog/category destinations with `/allproducts`. Updated the remaining visible 404 and Blog catalog CTAs plus Product layout metadata to the same canonical route. The old `/shop` URL remains a permanent backward-compatible redirect only.
- Main files/areas: localized Product breadcrumb, public fallback/Blog links, Product metadata, canonical-route regression coverage, project overview, storefront rules, troubleshooting, and progress documentation.
- Data/API/security impact: none; this is navigation, labeling, and metadata cleanup.
- Verification and exact result: focused ESLint passed for the breadcrumb, 404 page, Blog detail, Product metadata, and updated integrity test; `pnpm exec tsc --noEmit` passed; direct single-process site-integrity tests passed 8/8, including the new canonical visible-catalog-link assertion; the approved `pnpm build` compiled in 1.768 seconds, completed TypeScript in 5.8 seconds, generated 33/33 pages, and exited 0; `git diff --check` passed with repository line-ending notices only.
- Known limitations or next step: external bookmarks may still request `/shop`, but they continue to redirect permanently to `/allproducts` with supported query parameters preserved.

### 2026-09-05 - Visible Magazine empty state

- Outcome: kept the admin-only Magazine section visible when its Category has no Products and matched the referenced Trending-section treatment: left-aligned heading/description, desktop View All action, dashed centered empty message, and mobile View All action. No placeholder Magazine card or fallback image was restored.
- Main files/areas: homepage Magazine presentation, site-integrity regression, project overview, architecture, storefront rules, troubleshooting, and progress documentation.
- Data/API/security impact: none; Product selection remains restricted to the exact `magazines` Category.
- Verification and exact result: focused ESLint passed for the Magazine component and updated integrity test; `pnpm exec tsc --noEmit` passed; direct single-process site-integrity tests passed 7/7 and assert both the absence of static Magazine fallbacks and presence of the visible empty message; the approved `pnpm build` compiled in 1.843 seconds, completed TypeScript in 6.5 seconds, generated 33/33 pages, and exited 0; `git diff --check` passed with repository line-ending notices only.
- Known limitations or next step: the empty panel remains until an admin assigns at least one Product to the `magazines` Category.

### 2026-09-05 - Admin-only Magazine section data

- Outcome: removed all three static Magazine cards and their fallback cover/content from the homepage Magazine component. Homepage selection now accepts only Products assigned to the exact `magazines` Category, shows the first three using their saved localized title, description, image, price, badge, and Product link, and hides the section when the Category is empty. Renamed the fresh-catalog seed label to `Magazines` and added the same empty Category to the current local admin catalog so future admin-created Magazine Products can be assigned immediately.
- Main files/areas: homepage Magazine component/composition, Category seed and current local catalog, storefront architecture/rules/troubleshooting, project overview, and progress documentation.
- Data/API/security impact: the ignored local content store gained one Category record only; no Product was created. Product/category APIs, validation, auth, and persistence boundaries are unchanged.
- Verification and exact result: focused ESLint passed for the homepage, Magazine component, Category seed, and updated integrity test; `pnpm exec tsc --noEmit` passed; direct single-process site-integrity tests passed 7/7, including the canonical Magazine-category/no-static-fallback regression; content-management tests passed 22/22; the approved `pnpm build` compiled in 3.3 seconds, completed TypeScript in 6.4 seconds, generated 33/33 pages, and exited 0; `git diff --check` passed with repository line-ending notices only.
- Known limitations or next step: existing deployed catalogs that do not already contain the `magazines` slug must create it once through Admin Categories; Magazine products remain admin-managed and the section intentionally stays absent until at least one is assigned.

### 2026-09-05 - Consistent Add to Cart icon

- Outcome: replaced the ListPlus glyph on Product-card and Product-detail Add to Cart actions with the same ShoppingCart glyph used by the Header Cart action. Button labels, sizing, responsive layout, accessible names, and Cart behavior are unchanged.
- Main files/areas: Product Card, Product detail actions, storefront rules, and progress documentation.
- Data/API/security impact: none; this is an icon-only presentation change.
- Verification and exact result: focused ESLint passed for both changed Product components; `pnpm exec tsc --noEmit` passed; direct single-process site-integrity tests passed 6/6; `git diff --check` passed with repository line-ending notices only; source search confirmed ShoppingCart is used consistently by Header, Product Card, and Product detail with no remaining Product-action ListPlus usage.
- Known limitations or next step: none.

### 2026-09-05 - Header Cart icon and acknowledged notification badge

- Outcome: replaced the Header's bag outline with a conventional shopping-cart icon. Changed the orange count from a permanently visible total into an unread Cart-update badge: a successful Add to Cart displays the current quantity, opening `/cart` acknowledges and hides the badge, navigating elsewhere keeps it hidden, and adding another Product displays it again. Viewing the Cart does not remove or alter any item.
- Main files/areas: Header Cart action, browser-local storefront storage, site-integrity coverage, Cart architecture/product/security/rules documentation, and troubleshooting guidance.
- Data/API/security impact: added one non-sensitive `localStorage` read/unread marker with same-tab and cross-tab notification events; existing validated Cart records, WhatsApp order flow, and server APIs are unchanged.
- Verification and exact result: focused ESLint passed for Header, storefront storage, and the updated test; `pnpm exec tsc --noEmit` passed; direct single-process site-integrity tests passed 6/6, including the new add-then-view notification-state case; the sandboxed build compiled but its worker was blocked by the documented `spawn EPERM`, then the approved full `pnpm build` rerun completed TypeScript, generated 33/33 pages, and exited 0; `git diff --check` passed with repository line-ending notices only.
- Known limitations or next step: the badge acknowledgement is browser-local like the Cart itself and does not synchronize between devices.

### 2026-09-05 - Product-card CTA alignment and WhatsApp glyph

- Outcome: fixed Product-card Buy Now and Add to Cart actions to stay equal-height and single-line across supported card widths, preventing the Add to Cart label from wrapping and stretching the action row. Replaced the floating helper's generic chat bubble with a recognizable WhatsApp glyph while preserving its destination, tooltip, responsive visibility, and accessible label.
- Main files/areas: shared Product Card actions, site-wide floating WhatsApp helper, storefront rules, and progress documentation.
- Data/API/security impact: none; Cart behavior and WhatsApp URLs/messages are unchanged.
- Verification and exact result: focused ESLint passed for both changed components; `pnpm exec tsc --noEmit` passed; the standard `pnpm test:site` wrapper was blocked by the documented Windows sandbox `spawn EPERM`, so the direct single-process fallback `node --experimental-strip-types tests/site-integrity.test.ts` was run and passed 5/5 tests; `git diff --check` passed with repository line-ending notices only.
- Known limitations or next step: browser-level visual verification is still pending; the floating helper remains intentionally hidden below the `sm` breakpoint so it does not cover mobile Product actions.

### 2026-09-05 - Text-only Buy Now actions

- Outcome: simplified every purchase CTA on Product cards, Product detail, and the multi-Product Cart to display only `Buy Now`. Removed the WhatsApp icon and visible `Buy on WhatsApp` wording without changing the prepared WhatsApp redirect, quantities, variants, Product links, or Cart total.
- Main files/areas: Product Card, Product detail information/actions, Cart order summary, and storefront interaction rules.
- Data/API/security impact: none; this is a presentation-only change and the existing external WhatsApp handoff remains unchanged.
- Verification and exact result: focused ESLint passed for all three changed components; `pnpm exec tsc --noEmit` passed; the five site-integrity tests passed 5/5, including unchanged single- and multi-Product WhatsApp message coverage; `git diff --check` passed with repository line-ending notices only.
- Known limitations or next step: the accessible labels still identify WhatsApp as the action destination for screen-reader clarity; only the visible button content is intentionally limited to `Buy Now`.

### 2026-09-05 - WhatsApp-only Product sales and simplified Cart scope

- Outcome: aligned the storefront with the confirmed sales model. Product cards now expose exactly two action buttons: Buy Now and outlined Add to Cart with the new ListPlus icon; the former View, Wishlist-heart, and standalone WhatsApp icon actions were removed while image/title links still open Product detail. Product-detail Buy Now uses the selected quantity and variants. The Cart remains the only shopper utility page, lists multiple selected lines, and sends the complete selection directly to WhatsApp. A shared builder supplies the greeting, Product title, quantity, optional variant details, calculated line price, absolute Product link, and Cart total. Wishlist, Checkout, customer login, registration, and profile route implementations/components were removed; old URLs redirect to Cart or All Products. Marketing FAQs, homepage features, Privacy, Terms, and Shipping copy now describe the real WhatsApp confirmation flow instead of accounts, real-time inventory, online checkout, or website payment processing. The floating generic WhatsApp helper is hidden below `sm` so it cannot cover Product-card actions on mobile.
- Main files/areas: Product Card and Product detail actions, browser-local Cart storage/UI, shared WhatsApp order builder, Next redirects/robots, removed shopper/customer routes, homepage features/FAQs, public policy pages, site-integrity tests, README, and all affected project documentation.
- Data/API/security impact: Wishlist local-storage code was removed. Cart continues to store only bounded non-sensitive display data; it is not authoritative for availability, price, inventory, payment, or order acceptance. The website does not collect payment credentials. WhatsApp remains an external handoff that the user reviews and sends; GTBS must confirm availability, delivery, final total, and payment instructions.
- Verification and exact result: `pnpm lint` passed with 0 errors/warnings; `pnpm exec tsc --noEmit` passed after `pnpm exec next typegen` refreshed the intentionally removed route graph; direct single-process tests passed 34/34, including new single- and multi-Product WhatsApp message assertions; `git diff --check` passed with line-ending notices only. Final `pnpm build` on Next.js 16.3.3 compiled in 2.3 seconds, completed TypeScript in 6.8 seconds, generated 33/33 pages in 1.649 seconds, omitted all five removed route implementations, and exited 0. A fresh 375-pixel Chrome profile confirmed the Product card contains only `Buy Now` and `Add to Cart`, both actions fit without horizontal overflow (`scrollWidth=375`), the floating helper no longer obscures them, one-Product Buy Now included greeting/quantity/link, Product-detail Buy Now carried quantity 2/link, Add to Cart persisted the selections, and the two-line Cart with total quantity 3 produced a WhatsApp message containing Product links and the aggregate total with no Checkout link. Production HTTP checks returned 200 with one `<h1>` for All Products, Product detail, and Cart; `/checkout` redirects 308 to `/cart`, while `/wishlist`, `/login`, `/register`, and `/profile` redirect 308 to `/allproducts`.
- Known limitations or next step: WhatsApp opening and message construction are verified, but no real message was sent during automated testing. GTBS still needs to validate the receiving phone/account and operational confirmation procedure on the deployed HTTPS origin. Cart remains browser-local and does not synchronize across devices or reserve inventory.

### 2026-09-05 - Full website audit, prioritized remediation, and production-readiness review

- Outcome: completed a repository-wide Performance, Functionality, Responsive Design, Code Quality, SEO/Accessibility, and Security audit. Critical fixes upgraded vulnerable Next.js 16.3.1 to 16.3.3 and forced patched transitive `effect` 3.20.0; the final production audit reports no known vulnerabilities. High/medium fixes removed remote build-time fonts, converted the LCP hero background to a prioritized responsive `next/image`, compressed four assets from 1,272,311 to 429,892 bytes (66.2% smaller), supplied responsive image `sizes`, repaired missing seed covers, removed Swiper/React Icons, replaced carousels with native scroll snap, eliminated repeat home/detail repository reads, and added 5-minute public revalidation plus mutation-triggered invalidation. Storefront Add to Cart/Wishlist now persists bounded validated browser-local state with live counts, quantity/removal controls, cross-tab updates, storage-failure feedback, and an itemized WhatsApp checkout handoff. Fake account/newsletter success paths were replaced with honest unavailable/email-request states; legacy routes now emit 307/308 redirects; contact errors, search, responsive filters, dialogs/lightbox, skip navigation, focus, reduced-motion, headings, image alt/sizing, and an application error boundary were hardened.
- Priority assessment: Critical comprised the two upstream Next.js unauthenticated RCE advisories and was fixed. High comprised missing commerce actions, duplicated/dynamic public reads, broken assets/routes, localhost production metadata configuration, and lack of a shared production persistence/rate-limit architecture; code-owned issues were fixed, while the deployment/data-architecture items remain. Medium comprised excess carousel/icon JavaScript, image payload, fake forms, incomplete errors, keyboard/focus gaps, missing initial catalog heading, and responsive interaction issues; fixed. Low comprised smaller semantic, labels, link, typography, and source cleanup items; fixed where found.
- Main files/areas: dependency manifests and Next config; root metadata/styles; public Server Components and admin mutation handlers; Header/Footer/Hero, catalog, Product, Gallery, contact, Cart/Wishlist/Checkout and account/newsletter surfaces; local assets and seed references; storefront storage/revalidation utilities; integrity tests; README plus every affected document in `docs/`.
- Data/API/security impact: no secret values were copied or exposed. Cart/Wishlist store only client-controlled display data and cannot authorize price, inventory, payment, or orders. Protected content APIs keep their existing authorization/validation controls and now invalidate the public cache only after successful mutation. Next.js is pinned to 16.3.3, `effect` is overridden to 3.20.0 pending upstream adoption, and `postcss` is development-only.
- Verification and exact result: `pnpm lint` passed with 0 errors/warnings; `pnpm exec tsc --noEmit` passed; direct single-process Node tests passed 32/32 (7 admin-auth, 22 content-management, 3 new site-integrity checks); `git diff --check` passed with line-ending notices only. With system CA enabled, `pnpm audit --prod` returned `No known vulnerabilities found`. Final `pnpm build` on Next.js 16.3.3 compiled in 3.2 seconds, completed TypeScript in 7.1 seconds, generated 38/38 pages in 1.577 seconds, and exited 0. A fresh production server returned HTTP 200 and exactly one `<h1>` for all 15 audited public/static routes plus a persisted Product detail, returned 404 for an unknown route, emitted 308 for `/shop` and `/product` plus 307 for `/profile`, exposed the intended 300-second public cache and security headers, and returned HTTP 200 through Next Image for the remote persisted Product asset. Headless Chrome visual checks covered 375, 768, and 1440-pixel layouts; exact 375-pixel emulation reported `clientWidth=375` and `scrollWidth=375` on Home and Catalog, with only the intentionally translated-offscreen closed navigation drawer outside the viewport. A separate fresh-profile interaction run successfully added one Product to Cart and Wishlist, increased quantity from 1 to 2, rendered the Cart/Wishlist/Checkout state, produced the WhatsApp order link, opened and Escape-closed the filter dialog, and opened and Escape-closed mobile navigation.
- Known limitations or next step: the code baseline builds and its audited public routes are healthy, but the complete commerce product is not ready for general production deployment. A real HTTPS `NEXT_PUBLIC_SITE_URL` is not configured in the audited environment; the filesystem repository and process-local login throttle require a single writable instance and shared WAF/store safeguards; customer identity, inventory reservation, payments, persistent orders, admin Orders, and real analytics do not exist; EmailJS/UploadThing/WhatsApp and authenticated admin CRUD still require target-origin end-to-end testing and provider abuse/origin controls. No deployed field Core Web Vitals data was available, so the implemented LCP/CLS/INP improvements need post-deployment measurement. On this Windows machine, start Node with the trusted system CA configuration so the Next Image optimizer can retrieve UploadThing assets.

### 2026-09-03 - Storefront content loading performance fix

- Outcome: removed the hydration-time content-fetch waterfall from the Product, Blog, and Gallery index routes. Each route now reads initial content in a Server Component and renders it through a focused interactive Client Component, so cards/empty states exist in the first response instead of waiting for a second no-store API call. Added a mutation-safe in-process validated repository snapshot with concurrent first-read deduplication, and removed eager priority from the below-the-fold Magazine image.
- Main files/areas: Product/Blog/Gallery public route composition and client list components, filesystem content repository, Magazine image loading, project overview, architecture, code standards, troubleshooting, and progress documentation.
- Data/API/security impact: no schema, endpoint, authentication, upload, or validation contract changed. Public no-store APIs remain available. The repository cache is process-local, clones before mutation, retains the prior snapshot if a write fails, and publishes the new snapshot only after the atomic rename succeeds; this follows the documented single-instance filesystem boundary.
- Verification and exact result: `npm run lint` passed with 0 errors/warnings; `npx tsc --noEmit` passed; direct in-process admin-auth tests passed 7/7; direct in-process content-management tests passed 22/22; `git diff --check` passed with line-ending notices only. The secure system-CA Webpack fallback build (`$env:NODE_USE_SYSTEM_CA='1'; npx next build --webpack`) compiled in 26.1 seconds, completed TypeScript in 10.9 seconds, generated 30/30 static pages, emitted the full route manifest, and exited 0. A hidden production server returned HTTP 200 for `/`, `/allproducts`, `/blogs`, `/gallery`, and `/about`; warm responses measured 457 ms, 317 ms, 353 ms, 334 ms, and 320 ms respectively. `/allproducts` HTML already contained the persisted Product (`catalog_ssr_has_product=True`), confirming that the eliminated API request is no longer required for first content. Development first-hit timings of 2–4 seconds were separately confirmed as route compilation rather than production runtime latency.
- Known limitations or next step: two default Turbopack build attempts hit the documented Windows native PostCSS subprocess crash (`0xc0000409`), and the first Webpack attempt exposed this machine's incomplete Node CA chain. The system-CA Webpack run passed without disabling TLS verification. Remote UploadThing image latency remains provider/network-dependent, with Next Image optimization and cache handling retained.

### 2026-09-03 - Sequential bilingual admin CRUD forms

- Outcome: removed the free-choice language dropdown from Product, Blog, Gallery, Testimonial, and Team add/edit forms. Each bilingual form now opens on English with a `Next` action, validates English and shared required fields without uploading or persisting, then reveals Gujarati with `Previous` and the final create/update action. A shared two-step indicator communicates progress, and both language drafts remain mounted and preserved when moving between steps. Category CRUD remains unchanged because Categories have no localized fields or language dropdown.
- Main files/areas: shared admin bilingual-step indicator; Product, Blog, Gallery, Testimonial, and Team add/edit forms; project overview, architecture, workflow rules, and progress documentation.
- Data/API/security impact: none. The bilingual payloads, protected endpoints, image-upload path, bounded validation, storage schemas, and authentication controls are unchanged; final mutations occur only from step 2.
- Verification and exact result: `npm run lint` passed with 0 errors/warnings; `npx tsc --noEmit` passed; direct in-process `node --experimental-strip-types tests/admin-auth.test.ts` passed 7/7; direct in-process `node --experimental-strip-types tests/content-management.test.ts` passed 22/22; `git diff --check` passed with only line-ending notices. The package test scripts were attempted, but the restricted Windows environment blocked the Node test runner child processes with the documented `spawn EPERM`. `npm run build` compiled successfully in 5.9 seconds and then the same restriction blocked its TypeScript worker with `spawn EPERM`, so a complete build pass is not claimed.
- Known limitations or next step: no authenticated browser-level visual CRUD run was performed in this environment; the existing API/schema suites verify that the unchanged final bilingual payload contracts remain valid.

### 2026-09-03 - Global animated skeleton loading system across all pages

- Outcome: designed and implemented a full animated skeleton shimmer loading system. Added `.skeleton-shimmer` smooth wave animation in `src/app/globals.css`. Built comprehensive, domain-matching skeleton components in `src/components/common/Skeleton.tsx` (`ProductCardSkeleton`, `BlogCardSkeleton`, `GalleryCardSkeleton`, `ProductDetailSkeleton`, `BlogDetailSkeleton`, `GalleryDetailSkeleton`, `CatalogPageSkeleton`, `HomePageSkeleton`). Implemented Next.js App Router streaming `loading.tsx` routes for global root (`/loading.tsx`), `/allproducts/loading.tsx`, `/product/[id]/loading.tsx`, `/blogs/loading.tsx`, `/blogs/[id]/loading.tsx`, `/gallery/loading.tsx`, `/gallery/[id]/loading.tsx`, `/about/loading.tsx`, `/contact/loading.tsx`, and `/admin/loading.tsx`. Updated client components (`AllProductsPage`, `BlogsPage`, `GalleryPage`) with instant client-side shimmer skeleton states during dynamic catalog fetches.
- Main files/areas: `src/app/globals.css`, `src/components/common/Skeleton.tsx`, `src/app/loading.tsx`, `src/app/allproducts/loading.tsx`, `src/app/product/[id]/loading.tsx`, `src/app/blogs/loading.tsx`, `src/app/blogs/[id]/loading.tsx`, `src/app/gallery/loading.tsx`, `src/app/gallery/[id]/loading.tsx`, `src/app/about/loading.tsx`, `src/app/contact/loading.tsx`, `src/app/admin/loading.tsx`, `src/app/allproducts/page.tsx`, `src/app/blogs/page.tsx`, `src/app/gallery/page.tsx`, `docs/PROGRESS.md`.
- Data/API/security impact: None; presentation and streaming UI layer enhancement.
- Verification and exact result: `pnpm lint` passed with 0 errors/warnings; `pnpm test:admin-auth` passed 7/7; `pnpm test:content` passed 22/22; `pnpm build` compiled in 5.2s, finished TypeScript in 8.8s, generated all 35/35 routes with exit code 0.
- Known limitations or next step: none.

### 2026-09-03 - Dynamic Magazine product catalog integration

- Outcome: integrated Magazines as first-class dynamic Products. Added `magazines` ("Magazines & Periodicals") to store categories. Configured homepage Magazines section to render dynamic Product attributes (price, badge, localized Gujarati title/description, cover image, and direct product detail links to `/product/[id]`). Admin users can create, edit, price, and manage magazines directly from Admin Products (`/admin/products`).
- Main files/areas: `src/data/categories.ts`, `src/components/home/Magazines.tsx`, `src/app/page.tsx`, `docs/PROGRESS.md`, `docs/PROJECT_OVERVIEW.md`.
- Data/API/security impact: Magazine products use the standard product validation schema, storage repository, and image upload pipelines.
- Verification and exact result: `pnpm lint` passed with 0 errors/warnings; `pnpm test:admin-auth` passed 7/7; `pnpm test:content` passed 22/22; `pnpm build` completed in 3.4s, finished TypeScript in 7.3s, generated all 35/35 routes with exit code 0.
- Known limitations or next step: none.

### 2026-09-03 - Full site audit: 404 remediation, dynamic magazines, branding cleanup, and empty-state UI upgrade

- Outcome: completed a comprehensive audit across Performance, Functionality, Responsive Design, Code Quality, Dynamic Admin Data, and SEO/Security. Fixed broken `/books/*` and `/magazines/*` links in Header navigation and homepage, pointing them to valid dynamic category query routes (`/allproducts?category=...`). Connected homepage Magazines section to dynamic product catalog repository data with localized text selection. Removed residual template "ProBooks" branding across FAQs, WhatsApp greeting, About story, and Blog headers. Upgraded empty-state and placeholder pages (`/cart`, `/wishlist`, `/checkout`, `/login`, `/register`, `/profile`) with responsive layouts, helpful CTAs, and direct WhatsApp/Phone ordering integration.
- Main files/areas: `src/components/layout/Header.tsx`, `src/components/home/Magazines.tsx`, `src/app/page.tsx`, `src/data/faqs.ts`, `src/components/about/OurStory.tsx`, `src/app/blogs/page.tsx`, `src/app/about/page.tsx`, `src/components/common/WhatsAppButton.tsx`, `src/app/cart/page.tsx`, `src/app/wishlist/page.tsx`, `src/app/checkout/page.tsx`, `src/app/login/page.tsx`, `src/app/register/page.tsx`, `src/app/profile/page.tsx`, `docs/PROGRESS.md`, `docs/PROJECT_OVERVIEW.md`, `docs/TROUBLESHOOTING.md`.
- Data/API/security impact: Dynamic admin products matching magazine category/badges are now reactively surfaced on the homepage. Customer auth and checkout forms remain secure client-side UI routes with direct assistance channels.
- Verification and exact result: `pnpm lint` passed with 0 errors and 0 warnings; `pnpm test:admin-auth` passed 7/7; `pnpm test:content` passed 22/22; `pnpm build` compiled in 6.5s, finished TypeScript in 9.6s, generated all 35/35 static and dynamic pages with exit code 0.
- Known limitations or next step: Database persistence layer for persistent customer accounts and cart sync remains scheduled for future backend milestone.

### 2026-09-03 - Repository cleanup and code-surface reduction

- Outcome: removed the unused 335-line Blog seed module, the empty Gallery seed module, and four one-use homepage carousel wrapper components. The homepage now composes the shared Product carousel directly, including the corrected Best Sellers naming, and the carousel JSX has readable component/prop formatting. Removed the unreferenced Category repository lookup and changed implementation-only props, nested domain types, validation schemas, and constants from exported to module-private declarations.
- Main files/areas: homepage composition and shared Product carousel, editorial data modules and focused tests, shared types/validation helpers, filesystem repository persistence, code standards, architecture, and troubleshooting documentation. Two ignored orphan `storage/content-*.tmp` files from earlier interrupted writes were removed locally after their exact paths and ages were verified; the active `storage/content.json` was preserved.
- Data/API/security impact: public routes, API contracts, content schemas, active seed behavior, and security controls are unchanged. Blogs and Galleries continue to start empty and remain admin-managed. Failed atomic content writes now make a best-effort removal of their unique temporary file before rethrowing the original error; successful writes still use the existing serialized write-then-rename flow.
- Verification and exact result: import/reference auditing found no remaining references to the removed modules or wrapper names; focused ESLint passed; `pnpm lint` passed with 0 errors/warnings; `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters --incremental false` passed; direct in-process tests passed 7/7 admin-auth and 22/22 content-management tests. The restricted package test commands and initial build hit the documented Windows `spawn EPERM`; their permitted reruns passed 7/7 and 22/22, and `pnpm build` compiled in 1.3 seconds, finished TypeScript in 18.3 seconds, generated 35/35 static pages, and exited 0. `git diff --check` passed with only line-ending notices.
- Known limitations or next step: this was an evidence-based structural cleanup, not a redesign of placeholder customer/cart/checkout features. Process termination can still leave a uniquely named temp file because no application cleanup can run after a hard stop; such stale ignored files can be removed after confirming no content mutation is active.

### 2026-09-03 - Dynamic bilingual About Team module

- Outcome: replaced the hardcoded About-page Team array with repository-backed Team members and added protected admin list/add/edit/delete routes. The searchable list uses eight-row pagination and confirmation-based deletion. Add/Edit places the shared English/Gujarati selector beside `Back to list`, keeps one shared member image, requires separate name and role values for both languages, and reveals the incomplete language during save validation. The About page reactively selects authored Gujarati profiles and hides the Team section when the persisted list is empty.
- Main files/areas: Team types/seeds/localization, strict content validation, filesystem repository, protected Team CRUD and upload-purpose APIs, admin navigation/list/add/edit form, About page data composition, focused content tests, and project documentation.
- Data/API/security impact: `storage/content.json` now supports a bounded `teamMembers` array. Stores missing the field receive the four committed bilingual members, while an explicitly persisted empty array remains empty. New writes require strict bounded English and Gujarati names/roles plus a valid image reference. Managed Team images use the existing JPG/PNG/WebP, binary-signature, positive-size, and 500 KiB upload controls; replacing or deleting a member triggers best-effort provider cleanup. Mutations retain signed-session, same-origin/marker, bounded-body, serialized atomic-write, and no-store protections.
- Verification and exact result: focused ESLint passed for all changed TypeScript/TSX and test files; `pnpm exec tsc --noEmit` passed; the restricted `pnpm test:content` run hit the documented Windows sandbox `spawn EPERM`, while the permitted rerun passed 22/22 including bilingual Team validation, localization, seed validation, and empty-store compatibility. The first permitted `pnpm build` attempt exited during native Turbopack compilation with transient Windows code `3221225725`; the clean retry compiled in 7.2 seconds, finished TypeScript in 16.6 seconds, generated 35/35 static pages, listed all three Team admin routes and both Team CRUD APIs, and exited 0. `git diff --check` passed with only line-ending notices.
- Known limitations or next step: Team order follows repository order and has no manual reordering control. The four compatibility seeds currently share the existing Team image. An authenticated browser CRUD and responsive visual review remain recommended.

### 2026-09-03 - Dynamic bilingual Testimonial module

- Outcome: replaced the hardcoded homepage customer-review array with repository-backed Testimonials and added a complete protected admin module. Admin users can search, paginate, add, edit, and confirm-delete Testimonials. The add/edit form follows the Blog/Gallery structure with a shared Rating card plus an English/Gujarati dropdown beside `Back to list`; each language separately requires customer name, role, and testimonial text, and hidden-language validation switches the relevant form into view. The homepage carousel now renders the saved rating and reactively selects authored Gujarati content.
- Main files/areas: Testimonial types/seeds/localization, strict content validation, filesystem repository, protected CRUD APIs, admin navigation/list/add/edit forms, homepage data composition and review carousel, focused content tests, and project documentation.
- Data/API/security impact: `storage/content.json` now supports a bounded `testimonials` array. Existing stores without the field hydrate the six committed bilingual seed Testimonials, while an explicitly persisted empty array stays empty. New writes require strict English and Gujarati name/role/review fields plus an integer Rating from 1 through 5. Mutations use the existing signed admin session, same-origin/marker protection, bounded JSON reader, serialized atomic write queue, and no-store responses.
- Verification and exact result: focused ESLint passed for every changed TypeScript/TSX file; `pnpm exec tsc --noEmit` passed; the restricted `pnpm test:content` run hit the documented Windows sandbox `spawn EPERM`, while the permitted final rerun passed 20/20 including bilingual draft/localization, rating rejection, seed validation, and missing-field store compatibility. The permitted `pnpm build` completed TypeScript, generated 35/35 static pages, and listed all three Testimonial admin routes plus both protected CRUD API routes. `git diff --check` passed with only repository line-ending notices.
- Known limitations or next step: Testimonials use generated initials rather than uploaded customer avatars, have no public detail route, and use repository order as carousel order. Authenticated browser-level CRUD and responsive visual review remain recommended.

### 2026-09-03 - Blog and Gallery content-language selectors

- Outcome: added the same reusable English/Gujarati dropdown beside `Back to list` on Blog and Gallery create/edit pages. Common fields and media remain visible, while the selected language's content card is shown. Switching languages keeps both forms mounted so unsaved text and Blog editor content are preserved. If required hidden-language content is incomplete at save time, the form switches to that language and displays a targeted validation message.
- Main files/areas: shared admin content-language control, Blog and Gallery create/edit forms, and admin workflow documentation. The Product form now consumes the same shared selector for consistent styling and behavior.
- Data/API/security impact: none. Existing required bilingual payloads, bounded validation, authentication, uploads, and persistence are unchanged.
- Verification and exact result: focused ESLint passed for the shared selector and all three admin forms; `pnpm exec tsc --noEmit` passed. The restricted `pnpm build` compiled successfully before the documented Windows sandbox `spawn EPERM`; the permitted rerun completed TypeScript and generated 33/33 static pages. `git diff --check` passed with only repository line-ending notices.
- Known limitations or next step: authenticated browser-level visual verification is still recommended at mobile and desktop widths.

### 2026-09-03 - Bilingual Product authoring and language selector

- Outcome: added an English/Gujarati content-language dropdown immediately beside `Back to list` on Product create/edit pages. Switching it swaps the language-specific title, specifications, variants, short description, overview, and feature inputs without losing either language's unsaved values; price, slug, category, badge, and images remain shared. New Product saves require an English and Gujarati title. Saved Gujarati Product text is selected reactively on storefront cards, catalog search, detail breadcrumbs, product information, variants, overview/features, specifications, and related-product cards.
- Main files/areas: Product admin form, Product types and strict validation, Product localization helper, public Product cards/detail UI, catalog search, breadcrumb rendering, focused content tests, and Product documentation.
- Data/API/security impact: Product create/update payloads now contain a required bounded `gujarati` content block. Persisted Product records keep that block optional so seed and legacy records remain readable; those records continue through the existing Google Translate fallback. Price, media, category relation, slug, badge, and other shared values are not duplicated. Auth and mutation request protections are unchanged.
- Verification and exact result: focused `pnpm exec eslint ...` passed for all changed TypeScript/TSX files; `pnpm exec tsc --noEmit` passed; the restricted `pnpm test:content` run hit the documented Windows sandbox `spawn EPERM`, while the permitted rerun passed 18/18 including Gujarati Product requirement/localization coverage. The restricted `pnpm build` compiled successfully before the same worker restriction; its permitted rerun completed TypeScript and generated 33/33 static pages. `git diff --check` passed with only repository line-ending notices.
- Known limitations or next step: legacy Products do not gain authored Gujarati content automatically and use the existing translation fallback until edited and saved. Product Category remains the shared category slug/name model rather than a Product-localized field. Authenticated browser-level visual verification is still recommended.

### 2026-09-03 - Smooth-scroll route-transition warning fixed

- Outcome: declared the existing global smooth-scroll behavior on the root HTML element so Next.js can manage it correctly during client-side route transitions without emitting the browser warning.
- Main files/areas: root App Router layout and troubleshooting documentation.
- Data/API/security impact: none; the existing smooth scrolling remains enabled outside Next.js route-transition scroll handling.
- Verification and exact result: `pnpm exec eslint src/app/layout.tsx` passed; `pnpm exec tsc --noEmit` passed; source inspection confirmed global `scroll-behavior: smooth` is paired with `data-scroll-behavior="smooth"` on the root HTML element; `git diff --check` passed.
- Known limitations or next step: none.

### 2026-09-03 - Duplicate Product feature key warning fixed

- Outcome: Product detail highlights now use a unique occurrence key even when legacy Product data contains repeated feature text, preventing React's duplicate-child-key warning without hiding stored content. Product create/edit also removes exact duplicate feature lines before submission so newly saved records do not retain repeated highlights.
- Main files/areas: Product detail tabs, Product admin feature normalization, and troubleshooting documentation.
- Data/API/security impact: no API, schema, persistence-format, authentication, or authorization change. Feature order is preserved, and only exact duplicate lines entered during a Product save are collapsed.
- Verification and exact result: `pnpm exec eslint src/components/product/ProductTabs.tsx src/components/admin/product/AdminProductForm.tsx` passed; `pnpm exec tsc --noEmit` passed; the restricted `pnpm test:content` run hit the documented Windows sandbox `spawn EPERM`, while the permitted rerun passed 17/17; final source inspection confirmed feature keys include their occurrence index and submitted feature lines pass through an insertion-order-preserving `Set`; `git diff --check` passed.
- Known limitations or next step: existing duplicate feature values remain in storage until that Product is edited and saved, but render safely in the meantime.

### 2026-09-02 - Admin Product stock column removed

- Outcome: removed the Stock header and availability values from the admin Product list, leaving Product, Category, Price, and Actions. Reduced the table minimum width and updated the empty-state cell span for the four-column layout.
- Main files/areas: Product admin list and catalog UI documentation.
- Data/API/security impact: none; legacy availability and stock fields remain unchanged in stored Product records and storefront behavior.
- Verification and exact result: focused ESLint passed; `pnpm exec tsc --noEmit` passed; source inspection confirmed the four headers, absence of stock rendering, and `colSpan={4}` for the empty state; `git diff --check` exited 0 with only LF-to-CRLF notices.
- Known limitations or next step: none for this list-only presentation change.

### 2026-09-02 - Responsive Product Core details pairing

- Outcome: paired Slug with Category and Badge with Price in the Product Core details grid at the `sm` breakpoint and above. Mobile remains a single-column stack; constrained fields use `min-w-0` so controls shrink within their grid tracks instead of overflowing.
- Main files/areas: Product admin Core details layout and responsive UI documentation.
- Data/API/security impact: none; field names, values, validation, mutations, and persistence are unchanged.
- Verification and exact result: focused ESLint passed; `pnpm exec tsc --noEmit` passed; source inspection confirmed the base one-column grid, `sm:grid-cols-2`, full-width Title, and `min-w-0` on constrained controls; `git diff --check` exited 0 with only LF-to-CRLF notices.
- Known limitations or next step: no behavioral change; this is layout-only.

### 2026-09-02 - Gallery-style Product card and detail images

- Outcome: replaced Product Image URL and extra-URL text fields with a Gallery-style upload card: one required Card image plus up to 6 multi-select Detail page extra images. Added per-field validation, selected-count feedback, immediate `New` previews, retained-image previews, and individual removal. Product detail now always starts with the card image and exposes retained/uploaded extras as thumbnails.
- Main files/areas: Product admin media UI, Product detail-image type/schema, upload purpose and limits, Product update/delete provider cleanup, detail-page image composition/structured data, focused tests, and media documentation.
- Data/API/security impact: Product drafts now persist bounded `detailImages` records containing ID, configured-host URL, optional managed key, and title; legacy `images: string[]` remains at rest only and is rejected by new mutations. The protected upload endpoint accepts at most 6 files for `product-detail-images`, applies the existing JPG/PNG/WebP signature and 500 KiB-per-file validation, and update/delete removes unretained managed card/detail keys best-effort.
- Verification and exact result: `pnpm exec tsc --noEmit` passed; focused ESLint passed for all changed Product form/detail/API/schema/type/test files; permitted `pnpm test:content` passed 17/17 with managed detail-image draft acceptance, rejected legacy URL arrays, and rejected seventh detail-image coverage; `git diff --check` exited 0 with only LF-to-CRLF notices.
- Known limitations or next step: only uploaded/managed detail images are authored now; legacy local/configured-host URLs are retained and migrated into detail-image records on the next save. As with Gallery, an upload that succeeds before a later content mutation fails can leave an orphaned provider file for manual cleanup.

### 2026-09-02 - Product Brand / creator fields removed

- Outcome: removed Brand / creator from Core details and Brand / creator details from Storefront content. Also removed creator text from Product admin rows, cards, detail hero/tabs, all-products search, metadata, keywords, and structured data so Products no longer depend on that legacy concept. Slug now spans the full Core details row.
- Main files/areas: Product form/list, Product card/detail/tabs/search/SEO, Product domain/schema, focused tests, and catalog documentation.
- Data/API/security impact: Product create/update rejects `author` and `authorBio`. Both remain optional only in the at-rest schema/type so existing seeded and persisted Products continue to validate; saving an edited Product removes those legacy values.
- Verification and exact result: focused ESLint passed; `pnpm exec tsc --noEmit` passed; permitted `pnpm test:content` passed 17/17 with removed author and authorBio rejection coverage; `git diff --check` exited 0 with only LF-to-CRLF notices.
- Known limitations or next step: old content files can retain unused creator values until each Product is edited; these values are no longer shown on Product surfaces.

### 2026-09-02 - Inventory and rating authoring removed from Products

- Outcome: removed the complete Inventory and rating card from Product create/edit, including Available for sale, Stock count, Rating, and Reviews count. Product Image now spans the full form width. Admin Product rows with no stored stock count show `Available` instead of the misleading `0 available` label.
- Main files/areas: Product admin form/list, Product mutation schema, focused catalog tests, and catalog documentation.
- Data/API/security impact: Product create/update now rejects the four removed inventory/rating properties. The persisted Product schema retains them only so legacy content and seeded reviews/ratings/availability continue to load; editing a Product saves the supported shape without those legacy values.
- Verification and exact result: focused ESLint passed; `pnpm exec tsc --noEmit` passed; permitted `pnpm test:content` passed 17/17 with removed Stock count and Rating rejection coverage; `git diff --check` exited 0 with only LF-to-CRLF notices.
- Known limitations or next step: legacy Products may still display their saved availability, stock, and ratings until edited. New Products default to available in current storefront logic, and no replacement inventory management workflow is implemented.

### 2026-09-02 - Flexible general Product specifications and variants

- Outcome: generalized Product create/edit and detail presentation beyond books. Replaced fixed Pages, Publisher, Published date, ISBN, Language, Dimensions, and four Format checkboxes with removable dynamic specification name/value rows and product-specific variant groups whose options are entered one per line. Renamed authored/display copy to Brand / creator, Product Overview, Product Specifications, and generic product language. The detail hero renders every saved variant group as its own selector and includes selections in the existing add-to-cart toast.
- Main files/areas: Product domain types and strict schemas, Product admin form/list, Product detail info/tabs/SEO structured data, generic product card/grid/related copy, focused content tests, and catalog documentation.
- Data/API/security impact: Product drafts accept up to 50 specifications and 20 variant groups, each with up to 50 bounded options; fixed legacy book fields are rejected on new mutations. The at-rest schema retains the former Format and book-detail properties so existing JSON remains valid. Editing a legacy Product presents those values as generic rows/groups and saves the flexible shape. Structured data now identifies detail records as generic `Product` with a Brand instead of forcing `Book` attributes.
- Verification and exact result: `pnpm exec tsc --noEmit` passed; focused ESLint passed for every changed Product implementation, schema, type, and test file; permitted `pnpm test:content` passed 17/17 including flexible specification/variant acceptance plus rejected legacy Format and empty-option variants; `git diff --check` exited 0 with only LF-to-CRLF notices.
- Known limitations or next step: variants currently define selectable labels/options only; per-combination SKU, price, image, and stock are not modeled, and the existing cart remains a presentation/toast placeholder. Existing legacy values remain readable until that Product is edited and saved.

### 2026-09-02 - Product Category popup and Price spinner cleanup

- Outcome: changed Add category in Product create/edit from an expanded inline panel to a centered modal popup with name, auto-derived/custom slug, Cancel, close, backdrop-close, inline failure feedback, and Create and select actions. Removed the browser increment/decrement arrows from the Product Price input with a scoped cross-browser CSS class.
- Main files/areas: Product admin form, global scoped number-input styling, and catalog UI documentation.
- Data/API/security impact: none. The popup continues to create through the existing authenticated Category API and selects its returned slug; Product and Category schemas/persistence are unchanged from the preceding catalog update.
- Verification and exact result: focused ESLint for `AdminProductForm.tsx` passed; `pnpm exec tsc --noEmit` passed; `git diff --check` exited 0 with only LF-to-CRLF notices.
- Known limitations or next step: spinner removal applies only to Product Price; other numeric admin fields retain their native browser controls.

### 2026-09-02 - Single-price Product form, controlled badges, and inline Category creation

- Outcome: removed Original price from Product create/edit so admin-authored Products use one Price, replaced the free-text Badge input with a fixed dropdown for Best Sellers, New Releases, Trending Products, and Accessories, and added an inline Category creator beside the Product Category selector. A newly created Category is inserted into the dropdown and selected immediately. Accessories badge membership now feeds both the home Accessories carousel and the matching all-products collection filter.
- Main files/areas: Product admin form, Product badge constants and draft validation, catalog repository normalization, home/all-products collection selection, Category API reuse, focused content tests, and catalog documentation.
- Data/API/security impact: Product draft validation rejects `originalPrice` and unknown badge strings; the stored Product schema retains legacy original-price/discount/free-text badge fields so existing content files remain readable. Inline Category creation uses the existing authenticated, same-origin, marker-protected Category POST endpoint and does not bypass Category validation.
- Verification and exact result: focused ESLint passed for all changed implementation/test files; `pnpm exec tsc --noEmit` passed; permitted `pnpm test:content` passed 17/17 and now covers rejected Original price and custom Badge drafts; `git diff --check` exited 0 with only LF-to-CRLF notices.
- Known limitations or next step: existing stored Products can retain legacy original-price/discount/custom-badge values until edited. Editing maps recognized legacy badge text to the supported dropdown and saves the new single-price shape; unrecognized legacy badges become No badge. A Category created inline is persisted immediately even if the Product form is later cancelled.

### 2026-09-02 - Category descriptions removed from authoring and cards

- Outcome: removed the Description input from Category create/edit, removed legacy description text from the admin Category list, and removed description rendering from home-page Category cards. Category mutation validation now rejects the removed field instead of silently retaining an obsolete authoring path.
- Main files/areas: Category admin manager, home Category section, Category draft validation and focused content tests, plus product/architecture/rules documentation.
- Data/API/security impact: Category create/update payloads now contain only name and slug. The persisted Category schema keeps its optional description solely so existing content files and seed records remain valid; authorization and other catalog behavior are unchanged.
- Verification and exact result: focused ESLint passed for the Category admin, home section, validation, and test files; `pnpm exec tsc --noEmit` passed; the restricted `pnpm test:content` hit the documented Windows sandbox `spawn EPERM`, while the permitted rerun passed 17/17 and verifies that Category drafts containing the removed description field are rejected. A later full `pnpm lint` attempt was blocked before linting by the machine's existing native `RangeError: Array buffer allocation failed`; `git diff --check` exited 0 with only LF-to-CRLF notices.
- Known limitations or next step: existing legacy descriptions can remain in storage but are neither editable nor displayed; saving a Category replaces that record with the supported name-and-slug shape. A production build and another memory-intensive full lint retry were not run alongside the user's active dev server because the machine remains under the separately documented Windows commit-memory pressure.

### 2026-09-02 - React pre-mount warning and chunk-memory recovery

- Outcome: fixed the admin-side `Can't perform a React state update on a component that hasn't mounted yet` failure path by removing the storefront-only Language provider and Google Translate lifecycle from all `/admin` renders, cleaning up its delayed translation callback on public unmount, and enabling Next.js's low-risk Webpack memory optimization with entry preloading disabled. Added a catalog initialization marker so the accidental legacy `products: []`/`categories: []` state recovers the committed seeds once, while a deliberately emptied initialized catalog remains empty.
- Main files/areas: root layout and public site chrome boundary, language/Google Translate lifecycle, Next.js memory configuration, content store schema/repository migration, catalog tests, and troubleshooting/architecture/security documentation.
- Data/API/security impact: admin pages no longer initialize the storefront language subscription or third-party Google Translate script. Existing runtime stores with no initialized catalog marker and no catalog records hydrate Product/Category seeds; repository reads mark the in-memory store initialized so the next mutation persists the distinction. API authorization and validation are unchanged.
- Verification and exact result: before the fix, Windows committed memory was about 14,858.8 MiB of a 15,712.6 MiB limit and the Next child held about 1,279.3 MiB private memory. After memory optimization/recompile, the child initially measured about 1,130.2 MiB; three final live rounds returned 200 for `/product/atomic-habits`, `/api/content/catalog`, and `/manifest.webmanifest`, plus the expected unauthenticated 307 for `/admin/categories`, without an allocation/chunk failure. `pnpm lint` passed; `npx tsc --noEmit` exposed one migration-helper input typing mismatch, then passed after the helper accepted partial legacy records; focused ESLint passed; permitted `pnpm test:content` passed 17/17 including legacy-vs-intentional empty catalog behavior; `git diff --check` exited 0 with only LF-to-CRLF notices.
- Known limitations or next step: the React warning was downstream of native `Array buffer allocation failed`/layout `ChunkLoadError`, not a render-time setter in `RootLayout`. After broad route warming the Next child retained about 1,538.7 MiB private memory and Windows had only about 526 MiB physical/782 MiB commit headroom. A production build was not run concurrently with the user's active dev server because that would materially increase the exact pressure being fixed; the immediately preceding dynamic-catalog change already had a successful 33/33 production build. Close memory-heavy Chrome/VS Code/Adobe processes or increase the Windows paging file if native allocation failures recur.

### 2026-09-02 - Windows development OOM fallback

- Outcome: changed the default local `pnpm dev` command to Next.js's supported Webpack development mode after Turbopack crashed with `Fatal process out of memory: Zone`. Added `pnpm dev:turbopack` as an explicit opt-in diagnostic path, cleared only the generated workspace `.next` output before verification, and disabled Next 16's dev-time agent-rule generation so startup does not modify the repository-owned `AGENTS.md` working agreement.
- Main files/areas: package scripts, Next.js configuration, local development setup/tooling documentation, and troubleshooting guidance.
- Data/API/security impact: none. Product/Category content, APIs, authentication, uploads, and runtime storage are unchanged; the change only selects the local development bundler.
- Verification and exact result: before cleanup, `.next` measured about 1,186.64 MiB, including about 1,000.82 MiB under `.next/dev`; the largest Turbopack SST files measured about 243.50 MiB and 145.26 MiB. The restricted shell reproduced its known `spawn EPERM`, while the permitted `pnpm dev` Webpack server became ready in 2.0 seconds. Three warmed request rounds returned 200 for `/product/atomic-habits`, `/api/content/catalog`, and `/`, plus the expected unauthenticated 307 for `/admin/categories`; no process crash occurred. The regenerated `.next` measured about 118 MiB. A final configuration startup became ready in 1.447 seconds without rewriting `AGENTS.md`; Product/catalog returned 200 and the protected Category route returned 307 as expected. `pnpm lint` and `npx tsc --noEmit` passed, and `git diff --check` exited 0 with only existing LF-to-CRLF notices.
- Known limitations or next step: production `pnpm build` continues to use the default Turbopack build because it passes in the permitted environment. `pnpm dev:turbopack` may reproduce the native Windows memory failure until the machine's paging-file/resource constraint or upstream cache behavior is resolved.

### 2026-09-02 - Dynamic Products and separate Categories module

- Outcome: moved the public product catalog from direct static imports to the validated file-backed repository and added protected admin Product list/create/edit/delete routes. Added a separate inline Category management workspace with create/edit/delete, product counts, category selection in Product forms, automatic product reassignment when a category slug changes, and deletion protection while products remain assigned. Home product carousels, category cards, all-products filtering, product details, and sitemap now consume repository catalog data; the former home placeholder product arrays were removed.
- Main files/areas: Product/Category domain types and seeds, strict catalog schemas, atomic content repository, protected catalog APIs, UploadThing product-image purpose, admin Product/Category components and routes, shared admin navigation, public catalog API/storefront consumers, focused tests, and catalog documentation.
- Data/API/security impact: legacy `storage/content.json` documents without catalog keys are hydrated from committed Product/Category seeds and persist those arrays on the next mutation. Product and Category writes require the existing signed admin session, same-origin checks, marker header, strict Zod payloads, and a 64 KiB JSON cap. Product images retain the 500 KiB JPG/PNG/WebP client/server/signature checks; replaced/deleted managed primary images receive best-effort provider cleanup. The persistence layer remains suitable only for one writable Node instance.
- Verification and exact result: `pnpm lint` passed with 0 errors/warnings; `npx tsc --noEmit` passed; permitted `pnpm test:content` passed 16/16 tests including Product/Category draft acceptance and malformed catalog rejection; the restricted `pnpm build` compiled in 7.8 seconds but hit the documented `spawn EPERM` worker denial, while the permitted rerun compiled, completed TypeScript, generated 33/33 static pages, listed all new admin/API routes, and exited 0; `git diff --check` exited 0 with only existing LF-to-CRLF notices.
- Known limitations or next step: catalog mutations still use single-instance filesystem persistence rather than a shared database. Product content is currently one language block, collection membership is inferred from badge text/rating, only the primary uploaded Product image has a managed provider key, and dashboard revenue/order/inventory figures remain presentation data.

### 2026-09-02 - Admin content titles moved into header

- Outcome: moved the shared Blog and Gallery management headings and descriptions from the main content area into the admin header. The list routes now show `Blog management` and `Gallery management` in the header, and their add/edit routes use the same consistent title placement; mobile keeps the title on its own responsive row.
- Main files/areas: shared admin content shell, admin route overview, and admin shell architecture documentation.
- Data/API/security impact: none; this is a presentation-only change and authentication, navigation, CRUD requests, uploads, and persistence are unchanged.
- Verification and exact result: `npm run lint` passed with 0 errors/warnings; `npx tsc --noEmit` passed; `git diff --check` passed apart from Git's existing LF-to-CRLF notices.
- Known limitations or next step: authenticated browser-level visual review is still recommended at mobile and desktop widths.

### 2026-09-02 - Unified Overview admin chrome

- Outcome: moved the Overview dashboard onto the same shared admin shell used by Blog and Gallery, giving all three workspaces the same desktop sidebar, Storefront/Sign out header, mobile identity row, and mobile navigation. The dashboard greeting, summary cards, sales chart, inventory panel, and recent-orders table are unchanged.
- Main files/areas: Overview dashboard composition, shared admin shell props/navigation state, project overview, and admin architecture documentation.
- Data/API/security impact: none; the dashboard retains its server-side session check, and authentication, content CRUD, persistence, and routes are unchanged.
- Verification and exact result: `npm run lint` passed with 0 errors/warnings; `npx tsc --noEmit` passed; permitted `npm run test:admin-auth` passed 7/7; permitted `npm run test:content` passed 14/14; `git diff --check` passed apart from Git's existing LF-to-CRLF notices.
- Known limitations or next step: dashboard metrics and product/order actions remain presentation-only as previously documented.

### 2026-09-02 - Admin components organized by feature

- Outcome: reorganized the flat admin component directory into `blog`, `gallery`, and `login` feature folders without changing routes or runtime behavior. Components shared across multiple admin features remain at the admin root.
- Main files/areas: `src/components/admin/`, imports in protected admin route pages, admin component architecture, and component organization standards.
- Data/API/security impact: none; authentication, content validation, persistence, uploads, and public/admin routes are unchanged.
- Verification and exact result: `npm run lint` passed with 0 errors/warnings; `npx tsc --noEmit` passed; after the documented Windows sandbox test-worker denial, the permitted `npm run test:admin-auth` passed 7/7 and `npm run test:content` passed 14/14; stale-import search found no references to the former flat component paths; `git diff --check` passed apart from Git's existing LF-to-CRLF notices.
- Known limitations or next step: VS Code can retain diagnostics for an already-open buffer at the deleted flat path after the move. Close that deleted-file tab and open `src/components/admin/blog/AdminBlogForm.tsx`; restart the TypeScript server or reload the editor window if the stale Problems group remains. Future admin feature components should follow the same domain-folder convention.

### 2026-09-01 - Gujarati Gallery CRUD and standalone cards

- Outcome: removed Subtitle from Gallery create/edit and mutation payloads, then added Blog-style Common fields, English content, Gujarati content, and Gallery images cards. Gujarati title, category, location, description, and optional organizer are authored separately. Public Gallery filtering/search, album cards, detail content, breadcrumbs, organizer, and related albums switch reactively to saved Gujarati data.
- Main files/areas: Gallery domain types and localization helper, strict content schemas, admin Gallery form/list, public Gallery list/detail localization components, focused content tests, and affected project/architecture/rules/security documentation.
- Data/API/security impact: new Gallery create/update drafts require a strict bounded Gujarati content block and reject the removed Subtitle field. Stored Gallery records keep Subtitle and Gujarati optional for backward compatibility, so existing runtime data continues to load. Authentication, same-origin checks, 500 KiB image limits, 12-photo cap, previews, uploads, shared slug/date/images, and atomic persistence are unchanged.
- Verification and exact result: `npm run lint` passed with 0 errors/warnings; `npx tsc --noEmit` passed; permitted `npm run test:content` passed 14/14 tests, including required Gujarati Gallery content, reactive locale selection, and Subtitle rejection; permitted `npm run build` compiled successfully in 4.3 seconds, completed TypeScript and all 36 static pages, and exited 0; `git diff --check` passed apart from Git's existing LF-to-CRLF notices.
- Known limitations or next step: existing Gallery records do not gain authored Gujarati content automatically; edit and save them to add it. Until then their public text retains the existing Google Translate fallback. Photo filenames/titles and captions are not editable translation fields in the current CRUD scope.

### 2026-09-01 - Standalone Blog form cards

- Outcome: replaced the single enclosing Blog form panel with distinct responsive cards for the heading/actions, Common fields, English content, and Gujarati content. The Common fields card groups Slug, Date, Banner image, and Author avatar; each language card keeps its own title, category, author name/role, and article editor.
- Main files/areas: admin Blog create/edit form, project overview, product rules, and progress documentation.
- Data/API/security impact: none; input names, required states, file validation, upload behavior, request payloads, persistence, and public localization are unchanged.
- Verification and exact result: `npm run lint` passed with 0 errors/warnings; `npx tsc --noEmit` passed; permitted `npm run build` compiled successfully in 3.2 seconds, completed TypeScript and all 36 static pages, and exited 0; `git diff --check` passed apart from Git's existing LF-to-CRLF notices.
- Known limitations or next step: authenticated browser-level visual review is still recommended at mobile and desktop widths; the standalone cards retain the existing responsive field grids.

### 2026-09-01 - Admin-managed Gujarati Blog content

- Outcome: added a separate required Gujarati section to Blog create/edit forms for title, category, author name/role, and rich article content. The public home Blog cards, Blog listing/search/categories, Blog detail content, breadcrumbs, and related articles now switch reactively to the saved Gujarati variant when Gujarati is selected; English remains unchanged, and legacy posts without saved Gujarati fields retain their existing translation fallback.
- Main files/areas: Blog domain types and rich-text helpers, strict content schemas and file repository, admin Blog form, public Blog localization components/list/detail views, focused content tests, and affected project/architecture/rules/security documentation.
- Data/API/security impact: new Blog create/update drafts require a bounded Gujarati content block. Stored records accept an optional Gujarati block for backward compatibility. Both English and Gujarati rich-text documents use the same allow-listed nodes, marks, attributes, link protocols, and explicit React renderer. The Blog-only JSON request cap is 256 KiB to accommodate both bounded documents; other content JSON requests remain at 128 KiB. Request authentication, same-origin protection, upload handling, and shared fields such as slug/date/images are unchanged.
- Verification and exact result: `npm run lint` passed with 0 errors/warnings; `npx tsc --noEmit` passed; permitted `npm run test:content` passed 12/12 tests, including required Gujarati fields, locale selection, Gujarati rich-text safety, and the bilingual request-body cap; final permitted `npm run build` compiled successfully in 2.9 seconds, completed TypeScript and all 36 static pages, and exited 0. The first restricted build attempt could not fetch the existing Google Fonts dependency; the documented permitted rerun completed successfully. `git diff --check` passed apart from Git's existing LF-to-CRLF notices.
- Known limitations or next step: existing stored posts do not gain authored Gujarati content automatically; edit and save them through the admin form to add it. Until then they remain readable through the existing Google Translate fallback. Browser-level visual verification should be performed with an authenticated admin session and both storefront language choices.

### 2026-09-01 - Tiptap rich-text Blog editor

- Outcome: replaced the Blog admin Article content textarea with a responsive Tiptap editor. The toolbar supports bold, italic, underline, strikethrough, level-two/three headings, bullet and numbered lists, block quotes, code blocks, horizontal rules, safe links, unlink, undo, and redo. Saved formatting now renders on the public Blog detail page; existing plain/section-based articles still load into the editor and retain their public fallback rendering.
- Main files/areas: Tiptap dependencies and lockfile, Blog admin editor/form, rich-content domain types and helpers, content schemas/repository, public Blog renderer/detail route, focused content tests, and affected project/architecture/rules/security/standards/troubleshooting documentation.
- Data/API/security impact: Blog drafts and stored posts may now include bounded, allow-listed Tiptap JSON while retaining the existing derived plain-text `content` sections for compatibility and summary fallback. The server rejects unknown nodes/marks, oversized JSON, and unsafe link protocols. Public rendering maps validated nodes to React elements and does not use `dangerouslySetInnerHTML`; authentication, same-origin checks, request-size limits, uploads, and atomic persistence are unchanged.
- Verification and exact result: `pnpm add @tiptap/react @tiptap/pm @tiptap/starter-kit --store-dir D:\.pnpm-store\v11` passed with the lockfile supply-chain policy check; permitted `pnpm list @tiptap/react @tiptap/pm @tiptap/starter-kit --depth 0` confirmed all three at 3.30.5; `npx tsc --noEmit` passed; `npm run lint` passed with 0 errors/warnings; direct `node --experimental-strip-types tests/content-management.test.ts` passed 9/9, including safe rich content plus unsafe-link/unknown-node rejection; `git diff HEAD --check` passed apart from existing Git LF-to-CRLF notices. `npm run test:content` was blocked by the documented Windows sandbox `spawn EPERM`, and `npx next build --webpack` was blocked at worker startup by the same `spawn EPERM`, so a complete production-build pass is not claimed.
- Known limitations or next step: this first editor scope intentionally excludes embedded images, tables, text colors, and collaboration. Article images remain managed through the separate validated banner upload; authenticated pixel-level browser testing is still required in a normal local/deployment environment.

### 2026-09-01 - Responsive Blog metadata row

- Outcome: aligned Slug, Category, and Date in one horizontal row on medium and larger Blog admin forms while retaining a single-column stack on narrow screens. The form heading actions also stack on narrow screens so the Back action does not crowd the title.
- Main files/areas: Blog admin create/edit form layout, project overview, and progress documentation.
- Data/API/security impact: none; this is a responsive presentation-only change and preserves field names, validation, submission, upload, and persistence behavior.
- Verification and exact result: `git diff --check` passed apart from existing Git LF-to-CRLF notices; `npm run lint` passed with 0 errors/warnings; `npx tsc --noEmit` passed. `npm run build` could not complete because Turbopack failed while memory-mapping its existing Windows cache with paging-file error 1455; this environment issue is documented in troubleshooting, so a complete production-build pass is not claimed.
- Known limitations or next step: the responsive layout was verified structurally as a mobile-first single-column grid that changes to three columns at Tailwind's `md` breakpoint; final pixel-level confirmation still depends on rendering the authenticated form in a browser at representative viewport widths.

### 2026-09-01 - Remove required blog summary and avatar URL fields

- Outcome: simplified the Blog admin form so it no longer requires a text summary, and blog author avatar uploads are optional. When no avatar image is selected, the app falls back to the default example avatar at `/images/logo/logo.webp` instead of forcing a URL field or a broken image.
- Main files/areas: Blog admin form, blog content validation, content repository fallback logic, upload-purpose validation, and the related regression tests.
- Data/API/security impact: no persisted schema migration was required. Summary now defaults to an empty string while the author avatar defaults to the repository fallback image; the public blog cards continue to render a valid avatar source.
- Verification and exact result: `npx tsc --noEmit` passed, and `node --experimental-strip-types --test tests/content-management.test.ts` passed 7/7 tests.
- Known limitations or next step: the default avatar is intentionally local and static; if you want a different example image later, replace the fallback asset in the public images directory and keep the same path contract.

### 2026-09-01 - Use blog and gallery title slugs in public URLs

- Outcome: switched public blog detail links from numeric IDs to canonical title-derived slugs, preserving the old numeric path as a compatibility redirect so existing links still resolve to the same content. The same pattern already exists for gallery slug URLs.
- Main files/areas: public blog list/detail pages, shared blog cards, sitemap, project overview, and progress documentation.
- Data/API/security impact: no persistent data change; blog lookup still accepts either a slug or legacy numeric ID, and the canonical route is now the title slug.
- Verification and exact result: `npx tsc --noEmit` passed, and the content-management regression suite passed 5/5.
- Known limitations or next step: existing old `/blogs/{id}` URLs redirect to the canonical slug route; custom slug edits remain subject to the same uniqueness checks as admin-managed blog slugs.

### 2026-09-01 - Use Gallery title slugs in public URLs

- Outcome: replaced numeric Gallery detail links with the album's title-derived slug across public cards, related albums, admin View actions, metadata, structured data, and sitemap entries. Legacy numeric/detail aliases resolve the same record and redirect to its canonical slug URL.
- Main files/areas: public Gallery list/detail routes, admin Gallery list action, sitemap, project overview, architecture, product rules, progress, and troubleshooting documentation.
- Data/API/security impact: no content or persistence migration. Existing stored slugs are now the canonical public identifier; repository lookup still accepts IDs for backward compatibility, and unknown identifiers still return not found.
- Verification and exact result: `npm run lint` passed with 0 errors/warnings; `npx next typegen` passed; `npx tsc --noEmit` passed; `git diff --check` passed apart from existing Git LF-to-CRLF notices; direct single-process content-management tests passed 5/5. `npm run build` compiled successfully in 4.3 seconds, then the documented Windows sandbox `spawn EPERM` blocked its TypeScript worker.
- Known limitations or next step: changing a Gallery slug in admin changes its canonical URL; old custom slugs are not retained as aliases, while numeric IDs remain compatible redirects.

### 2026-09-01 - Gallery lightbox keyboard navigation

- Outcome: added keyboard controls to the public Gallery lightbox. Left Arrow opens the previous revealed photo, Right Arrow opens the next revealed photo, and Escape closes the viewer. Existing click controls now also have accessible labels.
- Main files/areas: public Gallery lightbox, project overview, architecture, product rules, progress, and troubleshooting documentation.
- Data/API/security impact: none. Keyboard navigation changes client interaction only and remains bounded to photos already revealed by View more.
- Verification and exact result: `npm run lint` passed with 0 errors/warnings; `npx tsc --noEmit` passed; `git diff --check` passed apart from the existing Git LF-to-CRLF notice. `npm run build` compiled successfully in 4.1 seconds, then the documented Windows sandbox `spawn EPERM` blocked its TypeScript worker.
- Known limitations or next step: authenticated/admin behavior and photo persistence are unaffected; browser visual testing still requires a runnable local/deployment server.

### 2026-09-01 - Responsive public Gallery grid with View more

- Outcome: changed the public Gallery detail photo collection to a responsive 1-column mobile, 2-column tablet, and 4-column desktop grid. Only the first 8 photos render initially; View more reveals the next batch, and hidden photos are excluded from lightbox navigation until revealed.
- Main files/areas: public Gallery lightbox/grid component, Gallery detail section header, project overview, architecture, product rules, and progress documentation.
- Data/API/security impact: none. This is client presentation state over the already loaded album photos; public data reads, admin CRUD, image storage, and upload constraints are unchanged.
- Verification and exact result: `npm run lint` passed with 0 errors/warnings; `npx tsc --noEmit` passed; `git diff --check` passed apart from existing Git LF-to-CRLF notices. `npm run build` compiled successfully in 4.1 seconds, then the documented Windows sandbox `spawn EPERM` blocked its TypeScript worker.
- Known limitations or next step: View more is client-side progressive disclosure, not server/query pagination; the current maximum album size is 12 photos.

### 2026-09-01 - Allow local Gallery preview images through admin CSP

- Outcome: fixed newly selected Gallery thumbnails rendering as broken images. The preview component already produced valid browser `blob:` URLs, but the admin Content Security Policy blocked that scheme; the admin-only image directive now permits local blob previews.
- Main files/areas: Next.js admin security headers, security documentation, architecture, progress, and troubleshooting guidance.
- Data/API/security impact: the admin `img-src` CSP now narrowly allows `blob:` alongside the existing same-origin, data, and UploadThing sources. Other resource directives, public headers, UploadThing uploads, accepted file rules, and persistence are unchanged. Preview URLs remain local, short-lived, and revoked by the form.
- Verification and exact result: `npm run lint` passed with 0 errors/warnings; `npx tsc --noEmit` passed; `git diff --check` passed apart from existing Git LF-to-CRLF notices. `npm run build` loaded the updated configuration and compiled successfully in 4.0 seconds, then the documented Windows sandbox `spawn EPERM` blocked its TypeScript worker.
- Known limitations or next step: the admin server must be restarted after a CSP configuration change before browser headers update; refresh the form after restart.

### 2026-09-01 - Preview newly selected Gallery photos before save

- Outcome: Gallery extra photos now appear immediately in the thumbnail grid before submission. Pending files use local object-URL previews with an orange outline and `New` badge, can be individually removed, and additional file selections append instead of silently replacing the prior pending selection.
- Main files/areas: Gallery admin form, project overview, architecture, product rules, progress, and image-upload troubleshooting guidance.
- Data/API/security impact: no upload endpoint or persistence change. The existing client/server 500 KiB/type checks and combined 12-photo limit remain enforced; temporary browser preview URLs are revoked on removal or form unmount.
- Verification and exact result: `npm run lint` passed with 0 errors/warnings; `npx tsc --noEmit` passed; `git diff --check` passed apart from the existing Git LF-to-CRLF notice; direct single-process content-management tests passed 5/5.
- Known limitations or next step: previews represent local pending files, not completed UploadThing uploads; actual upload still begins only when the admin submits the form.

### 2026-09-01 - Place image validation beside its input

- Outcome: moved client-side image validation feedback from the form-level error banner to the relevant file input. Blog banner, Gallery cover, and Gallery extra-photo errors now render directly below their own controls, with an error border/background and accessible `aria-invalid`/description linkage.
- Main files/areas: Blog admin form, Gallery admin form, project overview, architecture, product rules, progress, and image-upload troubleshooting guidance.
- Data/API/security impact: none. Accepted formats, the 500 KiB limit, the 12-photo limit, UploadThing flow, API validation, and general mutation-error toasts are unchanged.
- Verification and exact result: `npm run lint` passed with 0 errors/warnings; `npx tsc --noEmit` passed; `git diff --check` passed apart from existing Git LF-to-CRLF notices; direct single-process content-management tests passed 5/5, including image type/size and gallery-count validation.
- Known limitations or next step: server/API mutation failures remain form-level and toast errors because they may not belong to a single field.

### 2026-09-01 - Admin CRUD toasts and delete confirmation modal

- Outcome: added admin-scoped Sonner notifications for Blog/Gallery create, update, delete, and mutation failures. Replaced native browser delete confirms with a reusable accessible confirmation modal that identifies the selected record, explains permanent deletion, supports cancellation/backdrop dismissal, and prevents duplicate actions while deletion is running.
- Main files/areas: admin layout toaster host, shared delete-confirmation modal, Blog/Gallery list managers, Blog/Gallery forms, project overview, architecture, product rules, and progress documentation.
- Data/API/security impact: none. Confirmation remains a client interaction before the existing protected DELETE request; API authorization, persistence, UploadThing deletion, validation, and payloads are unchanged.
- Verification and exact result: `npm run lint` passed with 0 errors/warnings; `npx tsc --noEmit` passed; `git diff --check` passed apart from existing Git LF-to-CRLF notices; direct single-process content-management tests passed 5/5. `npm run build` compiled successfully in 5.7 seconds, then the documented Windows sandbox `spawn EPERM` blocked its TypeScript worker.
- Known limitations or next step: authenticated visual keyboard/focus smoke testing requires a runtime environment that permits the Next.js process.

### 2026-09-01 - Admin Blog/Gallery table search and pagination

- Outcome: added responsive search, category filtering, result counts, and Previous/Next pagination to both admin content list tables. Each page shows at most 8 rows; changing search or category returns the table to page 1, and empty/filter-no-result states are distinct.
- Main files/areas: admin Blog list manager, admin Gallery list manager, project overview, architecture, product rules, and progress documentation.
- Data/API/security impact: none. Filtering and pagination operate only on the content already loaded into the protected list page; CRUD routes, persistence, upload behavior, and request validation are unchanged.
- Verification and exact result: `npm run lint` passed with 0 errors/warnings; `npx tsc --noEmit` passed; `git diff --check` passed apart from existing Git LF-to-CRLF notices; direct single-process content-management tests passed 5/5. `npm run build` compiled successfully in 5.2 seconds, then the documented Windows sandbox `spawn EPERM` blocked its TypeScript worker.
- Known limitations or next step: pagination and filtering are intentionally client-side; move them to query-backed server pagination if content volume becomes large.

### 2026-09-01 - Remove inactive admin sidebar items

- Outcome: simplified every admin sidebar to show only the implemented Overview, Blogs, and Gallery destinations. Removed Orders, Products, Customers, Analytics, Settings, Help, and View storefront from both the dashboard sidebar and the shared content sidebar; the header Storefront shortcut remains available.
- Main files/areas: admin dashboard sidebar, shared admin content shell, project overview, architecture, product rules, and progress documentation.
- Data/API/security impact: none. No route, dashboard content, CRUD behavior, authentication, upload rule, or persisted data changed.
- Verification and exact result: `npm run lint` passed with 0 errors/warnings; `npx tsc --noEmit` passed; `git diff --check` passed apart from existing Git LF-to-CRLF notices.
- Known limitations or next step: Orders, Products, Customers, Analytics, Settings, and Help remain unimplemented and are no longer advertised as sidebar destinations.

### 2026-09-01 - Separate Blog/Gallery add and edit pages

- Outcome: moved Blog and Gallery create/update forms out of their list screens and into dedicated admin routes. Add now opens `/admin/blogs/add` or `/admin/galleries/add`; Edit opens `/admin/blogs/[id]/edit` or `/admin/galleries/[id]/edit`. Save and Cancel return to the related list while the shared admin navigation remains visible.
- Main files/areas: Blog/Gallery list managers, new reusable form components, four protected admin form routes, route documentation, architecture, product rules, and progress records.
- Data/API/security impact: no payload, persistence, authentication, UploadThing, 500 KiB image, or 12-photo rule changed. Each new route verifies the signed admin session server-side, and unknown edit identifiers return not found.
- Verification and exact result: `npx next typegen` passed and generated all four new route types; `npm run lint` passed with 0 errors/warnings; `npx tsc --noEmit` passed; `git diff --check` passed apart from existing Git LF-to-CRLF notices; direct single-process admin-auth tests passed 7/7; direct single-process content-management tests passed 5/5. `npm run build` compiled successfully in 5.4 seconds, then the documented Windows sandbox `spawn EPERM` blocked its TypeScript worker.
- Known limitations or next step: authenticated browser navigation still requires a runtime environment that permits the Next.js child process; existing non-content admin placeholders remain unchanged.

### 2026-09-01 - Persistent admin content navigation and CRUD tables

- Outcome: fixed the Blog/Gallery navigation experience so both workspaces retain the dashboard-style sidebar on desktop and the admin navigation on mobile. Blog and Gallery now open on list-first table views with an Add button above each table and explicit View, Edit, and Delete actions. Forms were subsequently moved to the dedicated routes documented above.
- Main files/areas: shared admin content shell, blog manager, gallery manager, project overview, architecture, product rules, progress, and troubleshooting documentation.
- Data/API/security impact: none. Existing protected CRUD endpoints, UploadThing integration, 500 KiB image validation, gallery 12-photo limit, authentication, persisted content format, and public routes are unchanged.
- Verification and exact result: `git diff --check` passed apart from existing Git LF-to-CRLF notices; `npm run lint` passed with 0 errors/warnings; `npx next typegen` passed; `npx tsc --noEmit` passed; direct single-process admin-auth tests passed 7/7; direct single-process content-management tests passed 5/5. The npm test scripts were attempted but the Windows sandbox blocked Node test-runner child processes with the documented `spawn EPERM`; direct execution verified the same suites. `npm run build` compiled successfully in 3.4 seconds, then the same sandbox restriction blocked its TypeScript worker with `spawn EPERM`.
- Known limitations or next step: no authenticated browser smoke test was possible because the sandbox prevents starting the Next.js child process. Non-content admin modules remain unimplemented and were subsequently removed from the sidebar.

### 2026-09-01 - Dynamic admin-managed blogs and galleries

- Outcome: added protected blog and gallery CRUD workspaces, strict content APIs, dynamic public list/detail/sitemap reads, atomic file-backed metadata persistence, and server-mediated UploadThing banner/cover/photo uploads. Every image is limited to JPG/PNG/WebP at 500 KiB, and gallery albums allow at most 12 extra photos in addition to the cover.
- Main files/areas: admin blogs/galleries pages and managers, public blog/gallery routes, content repository/schemas, admin content/upload APIs, UploadThing integration, sitemap/home blog feed, environment/dependency/configuration files, focused tests, and all affected documentation.
- Data/API/security impact: blog/gallery mutations now require a valid signed admin session, matching same-origin request metadata, the `X-GTBS-Admin-Request` marker, bounded bodies, and strict Zod validation. `UPLOADTHING_TOKEN` remains server-only. Runtime metadata is stored in ignored `storage/content.json`; committed TypeScript arrays remain fallback seeds. Managed provider keys allow best-effort deletion of replaced/deleted UploadThing files.
- Verification and exact result: `pnpm install --store-dir D:\.pnpm-store\v11` passed with the lockfile up to date and supply-chain policy verified; `npx next typegen` passed; `npm run lint` passed with 0 errors/warnings; `npx tsc --noEmit` passed; direct admin-auth tests passed 7/7; direct content-management tests passed 5/5, including complete seed validation, invalid slug/date rejection, the 12-photo cap, and the 500 KiB/type limit. `npm run build` compiled successfully in 3.3 seconds, then the documented Windows sandbox `spawn EPERM` blocked the TypeScript worker. Starting the dev server was blocked by the same child-process restriction, so authenticated browser CRUD and a live UploadThing request were not exercised in this environment.
- Known limitations or next step: `storage/content.json` supports one writable persistent Node instance only; use a shared database repository before serverless/read-only or multi-replica deployment. Configure a real `UPLOADTHING_TOKEN` privately and complete an authenticated browser smoke test on the deployment target. A successful upload followed by a rejected later content mutation can leave an orphan provider file for manual/reconciliation cleanup.

### 2026-09-01 - Remove remaining inactive home-page code

- Outcome: removed the commented-out home-page newsletter import/render block and 44 unused `cta` metadata entries from the New Releases, Best Sellers, Trending, and Accessories carousel data. The active newsletter component used by the About page was preserved.
- Main files/areas: home-page composition and four home carousel data definitions.
- Data/API/security impact: none; no rendered element, route, product field consumed by the UI, dependency, asset, authentication behavior, or stored data changed. A repository reference audit found no additional unreferenced modules, dependencies, public assets, or empty source directories safe to delete.
- Verification and exact result: `npm run lint` passed with 0 errors/warnings; `npx tsc --noEmit` passed; direct execution of `tests/admin-auth.test.ts` passed 7/7. `npm run build` compiled successfully in 2.2 seconds, then the documented Windows sandbox `spawn EPERM` blocked the TypeScript worker, so a complete build pass is not claimed.
- Known limitations or next step: intentionally routed placeholder pages, active mock catalog data, and referenced components were left unchanged; future deletion work should continue to require exact reference checks.

### 2026-09-01 - Remove unused UI scaffolding and empty directories

- Outcome: removed 11 unreferenced generated UI primitives, their unused `cn` utility, the unused shadcn generator configuration, 10 orphaned runtime dependencies, and 33 empty placeholder directories. Active routes, components, images, admin authentication, and static blog/gallery data were preserved.
- Main files/areas: `src/components/ui/`, `src/lib/utils.ts`, `components.json`, package manifest/lockfile, empty CMS/API/content/image scaffolding, project overview, architecture, progress, and troubleshooting documentation.
- Data/API/security impact: none; no database, stored data, route handler, authentication, cookie, or public behavior changed. The deleted directories contained no files. The generated `.pnpm-store/` cache created during lockfile maintenance was also removed and is recoverable through dependency installation.
- Verification and exact result: exact repository reference scans found no consumers for the removed files or packages; `pnpm remove` updated `package.json`, `pnpm-lock.yaml`, and the installed dependency graph; no non-generated empty directories remained after cleanup. `npm run lint` passed with 0 errors/warnings; `npx next typegen` and `npx tsc --noEmit` passed; direct execution of `tests/admin-auth.test.ts` passed 7/7. `npm run build` compiled successfully in 4.1 seconds, then the known Windows sandbox `spawn EPERM` blocked the TypeScript worker, so a complete build pass is not claimed.
- Known limitations or next step: reinstalling a shadcn/Base UI component in the future must intentionally restore its required utility/configuration and dependencies; do not retain unused generated primitives preemptively.

### 2026-08-31 - Repository lint baseline restored

- Outcome: resolved all 28 ESLint errors and 14 warnings without changing routes or product scope. Filter actions now reset pagination in the same user event, URL-backed catalog filters remount from current search parameters, controlled search synchronization is deferred, Swiper controls call slider instances only from event handlers, blog avatars use `next/image`, and isolated typing, comparator, JSX, and unused-code issues are corrected.
- Main files/areas: all-products/blog/gallery filtering, shared search, five home-page carousels, product/about/contact/gallery components, README, and quality/troubleshooting documentation.
- Data/API/security impact: none; no persistence, route-handler, authentication, cookie, or environment behavior changed.
- Verification and exact result: `npm run lint` passed with 0 errors and 0 warnings; `npx next typegen` passed; `npx tsc --noEmit` passed; direct execution of `tests/admin-auth.test.ts` passed 7/7 tests; the latest `npm run build` compiled successfully in 1.9 seconds, then the known Windows sandbox `spawn EPERM` blocked the TypeScript worker, so a complete production-build pass is not claimed.
- Known limitations or next step: the commerce/backend and admin-module limitations remain. Rerun `npm run build` in a Windows environment that permits Node child processes before release.

### 2026-08-31 - Remove unreferenced scaffolding

- Outcome: removed 17 empty placeholder modules plus two unreferenced dropdown-menu copies and the unreferenced `ProductRating` component; no imported or routed implementation was removed.
- Main files/areas: unused cart/checkout/common/hook/type/data/lib scaffolding, unused product/UI components, architecture, project overview, and troubleshooting documentation.
- Data/API/security impact: none; cart and wishlist remain static empty-state routes, checkout remains presentation UI, and no API or security boundary changed.
- Verification and exact result: exact import/reference scans found no consumers for any removed module; `npx next typegen` and `npx tsc --noEmit` passed; direct execution of `tests/admin-auth.test.ts` passed 7/7 tests; `npm run lint` reported only the documented pre-existing 28 errors and 14 warnings; `npm run build` compiled the production bundle successfully in 5.6 seconds, then the known Windows sandbox `spawn EPERM` blocked its TypeScript worker, so a full build pass is not claimed.
- Known limitations or next step: repository-wide lint debt and the missing commerce state/backend remain; implement those as scoped features instead of retaining empty placeholder files.

### 2026-08-31 - Admin authentication production hardening

- Outcome: replaced production plaintext-password authentication with a fail-closed scrypt password verifier and required TOTP MFA; added strict request schemas/body limits, generic failures, bounded login lockout, same-origin mutation checks, stronger versioned session claims, production `__Host-` cookies, security headers, a private setup generator, and focused regression tests.
- Main files/areas: admin auth/request/rate-limit utilities, login/logout route handlers and UI, `next.config.ts`, environment template, setup/test scripts, and authentication/security documentation.
- Data/API/security impact: production deployments must migrate from `ADMIN_PASSWORD` by running `npm run admin:setup`; default sessions remain 8 hours and remembered sessions are reduced from 30 to 7 days; incrementing `ADMIN_SESSION_VERSION` revokes all sessions. The rate-limit store is process-local, so multi-instance deployments still require a shared host/WAF control.
- Verification and exact result: focused ESLint passed; `npx tsc --noEmit` passed; `npm run test:admin-auth` passed 7/7 tests; `npm run build` completed successfully with 53/53 static pages and dynamic admin routes; live HTTP checks returned 403 without the same-origin marker, 401 for invalid credentials, 200 for valid login/dashboard/logout, and redirected the post-logout dashboard request to `/admin/login`. Repository-wide `npm run lint` remains blocked by existing unrelated debt (28 errors, 14 warnings) already cataloged in troubleshooting.
- Known limitations or next step: authentication still represents one environment-backed admin; add shared persistent throttling, database identities/roles, per-session revocation, audit logging, and real single-use password reset when the production infrastructure is selected.

### 2026-08-30 - Admin login hydration fixed

- Outcome: made the admin email and remember-me inputs deterministic during server rendering and hydration, then restored the saved email after hydration.
- Main files/areas: the admin login form (now `src/components/admin/login/AdminLoginForm.tsx`) and hydration troubleshooting guidance.
- Data/API/security impact: no API or session changes; remembered admin email remains browser-local and passwords are not persisted.
- Verification and exact result at the time: focused ESLint for the admin login form passed; `npx tsc --noEmit` passed.
- Known limitations or next step: browser extensions can independently mutate form markup and may need to be disabled when diagnosing unrelated hydration warnings.

### 2026-08-30 - Storefront cookie consent removed

- Outcome: removed the cookie-preference banner, consent persistence module, and `gtbs_cookie_consent` creation; returning visitors have the legacy consent cookie and local-storage value cleared.
- Main files/areas: shared storefront chrome, language provider, privacy policy, and cookie/security documentation.
- Data/API/security impact: admin authentication still uses its required signed HttpOnly cookie; Google Translate loads only after Gujarati is selected and may use `googtrans`.
- Verification and exact result: `npx eslint src/components/layout/SiteChrome.tsx src/contexts/LanguageContext.tsx src/app/privacy-policy/page.tsx` passed; `npx next typegen` refreshed stale route types; `npx tsc --noEmit` then passed.
- Known limitations or next step: browser privacy settings can still block Gujarati translation or admin sessions.

### 2026-08-30 — Documentation foundation

- Added `AGENTS.md` requiring documentation updates with every development task.
- Added overview, architecture, rules, code standards, security, progress, and troubleshooting documents.
- Recorded current implementation and labeled mock/incomplete areas.
- Replaced the generic README with a GTBS entry point and documentation links.
- Verification: Markdown paths/content checked against the repository; application behavior was not changed.

### 2026-08-30 — First responsive admin dashboard

- Added desktop/mobile navigation, account header, KPIs, sales chart, inventory, and recent orders.
- Added a dynamic Asia/Kolkata date/greeting and compact mobile logout.
- Areas: `src/app/admin/dashboard/page.tsx`, and the admin logout button now at `src/components/admin/login/AdminLogoutButton.tsx`.
- Verification: focused ESLint passed; `npx tsc --noEmit` passed; Next compiled the bundle, then Windows denied the TypeScript worker with `spawn EPERM`.
- Remaining: figures and non-Overview actions are placeholders.

### 2026-08-30 — Admin authentication baseline

- Added login/logout routes, HMAC-signed sessions, protected pages, and admin-specific chrome.
- Added placeholder admin variables to `.env.example`.
- Remaining hardening is tracked in `SECURITY.md`.

## Future entry template

```markdown
### YYYY-MM-DD — Change title

- Outcome:
- Main files/areas:
- Data/API/security impact:
- Verification and exact result:
- Known limitations or next step:
```
