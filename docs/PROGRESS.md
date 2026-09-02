# Project Progress

## Status

| Area | Status | Notes |
| --- | --- | --- |
| Public storefront | In progress | Main pages exist; catalog and editorial content are file-backed |
| Product catalog | Dynamic filesystem baseline | Admin CRUD, category relation, storefront feeds, and product detail UI |
| Cart/wishlist | Placeholder | Static empty-state routes; no state or persistence layer |
| Checkout/payments | UI only | No persistent payment/order workflow |
| Customer auth | UI only | No documented production identity backend |
| Admin auth | Production-hardened baseline | Single environment-backed admin, scrypt + TOTP, signed cookie |
| Admin dashboard | Catalog/content navigation complete | Dashboard figures remain presentation data; product/category/blog/gallery management is implemented |
| SEO | Baseline implemented | Metadata, structured data, robots, sitemap, manifest |
| Documentation | Active | Must evolve with every change |
| Automated quality | Healthy baseline | Full ESLint and TypeScript checks pass; admin auth has focused coverage |

## Current priorities

1. Replace single-instance filesystem content storage with a shared production database.
2. Build a functional admin Orders module.
3. Replace dashboard presentation figures with repository data.
4. Add shared deployment/WAF login throttling and database-backed admin lifecycle when hosting requirements are chosen.
5. Define persistent customer, cart, checkout, and payment architecture.

## Change log

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
