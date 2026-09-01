# Project Progress

## Status

| Area | Status | Notes |
| --- | --- | --- |
| Public storefront | In progress | Main pages exist; data is local/static |
| Product catalog | Prototype | Typed data and product detail UI |
| Cart/wishlist | Placeholder | Static empty-state routes; no state or persistence layer |
| Checkout/payments | UI only | No persistent payment/order workflow |
| Customer auth | UI only | No documented production identity backend |
| Admin auth | Production-hardened baseline | Single environment-backed admin, scrypt + TOTP, signed cookie |
| Admin dashboard | Content navigation complete | Dashboard figures remain presentation data; blog/gallery CRUD use persistent admin navigation and list-first tables |
| SEO | Baseline implemented | Metadata, structured data, robots, sitemap, manifest |
| Documentation | Active | Must evolve with every change |
| Automated quality | Healthy baseline | Full ESLint and TypeScript checks pass; admin auth has focused coverage |

## Current priorities

1. Add persistent product/inventory storage.
2. Build functional admin Orders and Products modules.
3. Replace dashboard presentation figures with server data.
4. Add shared deployment/WAF login throttling and database-backed admin lifecycle when hosting requirements are chosen.
5. Define persistent customer, cart, checkout, and payment architecture.

## Change log

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
- Main files/areas: `src/components/admin/AdminLoginForm.tsx` and hydration troubleshooting guidance.
- Data/API/security impact: no API or session changes; remembered admin email remains browser-local and passwords are not persisted.
- Verification and exact result: `npx eslint src/components/admin/AdminLoginForm.tsx` passed; `npx tsc --noEmit` passed.
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
- Areas: `src/app/admin/dashboard/page.tsx`, `src/components/admin/AdminLogoutButton.tsx`.
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
