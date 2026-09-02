# Architecture

## High-level structure

```text
Browser
  ├─ Public App Router pages
  │    ├─ shared site chrome
  │    ├─ feature components
  │    ├─ catalog/content seed data
  │    └─ file-backed product/category/blog/gallery repository
  └─ Admin pages
       ├─ login → POST /api/admin/login
       ├─ signed HttpOnly session cookie
       ├─ protected dashboard/content workspaces
       └─ CRUD/upload APIs → filesystem + UploadThing
```

## Directory responsibilities

| Path | Responsibility |
| --- | --- |
| `src/app/` | Routes, layouts, metadata, pages, and route handlers |
| `src/components/` | Reusable UI organized by feature |
| `src/contexts/` | Cross-tree client providers |
| `src/data/` | Typed first-run/backward-compatible seeds and remaining static content |
| `src/lib/` | Utilities, SEO, constants, and auth |
| `src/types/` | Shared domain types |
| `public/images/` | Static image assets |
| `storage/content.json` | Ignored runtime product/category/blog/gallery metadata, created on first mutation |
| `docs/` | Maintained project knowledge |

## Rendering boundaries

- Pages are Server Components by default.
- Use `"use client"` only for state, effects, events, storage, or client navigation.
- The root layout loads fonts, metadata, structured data, and `SiteChrome`.
- `SiteChrome` removes public header/footer controls for `/admin` routes and mounts `LanguageProvider` only around the public branch.
- The language provider loads Google Translate only after Gujarati is selected; English storefront browsing does not initialize the translation integration.
- Local `pnpm dev` uses Next.js Webpack mode to avoid the observed native Windows Turbopack cache-memory crash. `experimental.webpackMemoryOptimizations` reduces peak Webpack usage and `preloadEntriesOnStart: false` avoids front-loading every route module on a memory-constrained workstation. Production builds retain the default bundler; `pnpm dev:turbopack` is an explicit diagnostic command rather than the stable local path. `agentRules: false` prevents Next dev from rewriting the repository-owned `AGENTS.md`; project instructions remain maintained manually.

## Storefront data flow

Product and Category records flow through `contentRepository.ts`. The home catalog sections and Category cards read it in Server Components; `/allproducts` hydrates its interactive filters from the no-store `/api/content/catalog` endpoint; Product detail metadata/rendering and sitemap resolve the same repository records. Product IDs are normalized slugs and form dynamic routes. Cart and wishlist still render static empty states with no state or persistence layer. The catalog repository is dynamic but remains a single-instance filesystem implementation rather than a production database.

Catalog, blog, and gallery filter/search handlers reset pagination within the same user event, avoiding state-mirroring effects. Home carousels retain Swiper instances in refs and access them only from navigation event handlers.

## Catalog and editorial content flow

1. `src/data/products.ts` and `src/data/categories.ts` provide the initial catalog when `storage/content.json` is absent or has no initialized catalog marker and both catalog arrays are absent/empty. A populated legacy catalog is retained. Once `catalogInitialized: true` is persisted, its arrays—including intentional empty arrays—are authoritative.
2. Product create/update verifies that the referenced Category exists inside the serialized mutation. The Product form may first open an Add category modal and create a missing Category through the normal Category POST endpoint, then inserts and selects the returned record locally. This Category mutation is independent, so cancelling the Product does not roll it back. Category slug edits rewrite assigned Product category slugs in the same atomic write; delete refuses a Category that still owns Products.
3. Product and Category route handlers apply admin authorization, origin/marker verification, a 64 KiB request limit, and strict Zod validation. Product drafts accept one Price and an optional allow-listed collection Badge; Original price and arbitrary badge text are legacy-at-rest fields and are rejected on new mutations. The repository parses again at the persistence boundary and serializes all content mutations through one in-process queue.
4. Product primary images use the shared server-mediated upload path. Managed keys allow best-effort cleanup on replacement/deletion; extra Product image URLs are validated local/HTTPS references but are not provider-managed by the current form.
5. Home New Releases, Best Sellers, Trending, and Accessories sections derive membership from the controlled Product Badge, while legacy matching remains supported and Accessories also includes the accessories Category. The same Accessories collection rule is used by the all-products filter and its View All link. All sections share one interactive carousel component; empty collections render an explicit empty state rather than former placeholder Products.

The existing editorial flow shares the same store:

1. `src/data/blogs.ts` remains committed editorial seed data; `src/data/galleries.ts` is intentionally empty so gallery data is admin-managed only.
2. `contentRepository.ts` reads `storage/content.json` when present and validates the complete document with Zod; invalid persisted data fails instead of being silently replaced.
3. Admin create/update/delete requests require the signed admin session, matching Origin/fetch metadata, and `X-GTBS-Admin-Request: 1`.
4. Mutations are serialized in-process and written through a uniquely named temporary file followed by an atomic rename.
5. Public list APIs are no-store; detail pages, the home blog section, and sitemap read through the repository.
6. Images upload through the server-only UploadThing SDK. The browser never receives `UPLOADTHING_TOKEN`.
7. Managed UploadThing keys are stored beside URLs. Replaced or deleted managed images are deleted best-effort from UploadThing; legacy/local/external seed images have no managed key and are never deleted remotely.
8. Blog Article content is edited as Tiptap JSON. Draft validation bounds the JSON and allow-lists its nodes, marks, attribute primitives, and link protocols. The repository also derives plain-text sections for summaries and backward compatibility. Public detail pages render the validated tree through explicit React element mappings; legacy records without `richContent` continue through the section renderer.
9. Blog mutations include required English and Gujarati authored text while retaining one shared slug, date, banner, and avatar. The repository derives each language summary and compatibility sections independently. The stored Gujarati block remains optional at rest so pre-feature records continue to load. Blog create/update JSON is capped at 256 KiB for the two bounded rich-text documents; other content JSON retains the 128 KiB default.
10. Storefront Blog client boundaries read `LanguageContext` and select the stored Gujarati block reactively for cards, filters/search, detail content, breadcrumbs, and related articles. Authored Gujarati nodes are excluded from machine retranslation; legacy posts without the block remain eligible for the existing Google Translate fallback.
11. Gallery mutations keep slug, date, cover, and photos shared while requiring separate English and Gujarati title, category, location, description, and optional organizer values. Subtitle is omitted from new mutation drafts but remains optional in stored records so legacy JSON continues to validate.
12. Storefront Gallery client boundaries select the stored Gujarati block reactively for filters/search, album cards, detail text, breadcrumbs, organizer credit, and related albums. Authored Gujarati text is excluded from machine retranslation; legacy albums without the block retain the Google Translate fallback.

On the public Gallery detail route, `GalleryLightbox` progressively exposes photos in batches of 8. The responsive grid uses 1 column on mobile, 2 on tablet, and 4 on desktop. Click and Left/Right keyboard navigation are bounded to the currently visible slice so undisclosed photos do not open before View more is selected; Escape closes the viewer. The document keyboard listener exists only while the lightbox is open and is removed on close/unmount.

Gallery detail links, canonical metadata, structured data, and sitemap entries use the stored slug. `getGallery` continues to resolve either an ID or slug, allowing an incoming numeric URL to find the record and redirect to the canonical `/gallery/[slug]` address.

The Overview, Products, Categories, Blog, and Gallery admin pages render through the shared `AdminContentShell`, which provides one consistent desktop sidebar, top header, and horizontally scrollable route bar on smaller screens. Overview renders its dashboard content directly; management routes provide headings/descriptions in the shared header. Product, Blog, and Gallery index routes use list-first tables and protected standalone add/edit pages. Categories intentionally use a separate inline CRUD workspace beside their list because the authored domain has only name and slug. Category draft validation rejects description input; the stored Category schema keeps its optional legacy field so existing content files continue to validate, but the admin list/form and home Category cards do not render it. The admin layout owns a persistent Sonner toaster; destructive actions use the shared confirmation modal, and the protected API remains the source of persistence.

Admin UI components are grouped by domain beneath `src/components/admin/`: Product, Category, Blog, Gallery, and login controls live in their matching feature folders. Cross-domain components such as `AdminContentShell` and `ConfirmDeleteModal` remain at the admin root. Route modules import these components through the `@/components/admin/...` alias, so folder organization does not affect the public or protected route structure.

Image controls keep field-specific client validation state: Product primary image, Blog banner, Gallery cover, and Gallery extra photos each render their own validation message adjacent to the input. Cross-field, upload-provider, and API mutation failures remain general form errors and toasts.

The Blog editors are focused Client Components inside the existing admin form. English and Gujarati each have independent Tiptap state, disable immediate server rendering to avoid Next.js hydration mismatches, report JSON changes to the form, and wrap their 40-pixel toolbar controls on narrow screens. The form checks both articles for non-empty, bounded content before uploading images or calling the mutation API.

Gallery extra-photo selections are stored as pending `File` objects plus browser object URLs. The form appends valid selection rounds, renders pending thumbnails beside retained provider images, and revokes every temporary URL when removed or unmounted. Submission sends only the underlying files to the existing upload client; a local preview does not imply that UploadThing has completed.

Because those pending thumbnails use browser `blob:` URLs, the admin-only CSP permits `blob:` in `img-src`. No other CSP directive accepts blob resources.

The repository is intentionally a typed boundary, so it can later be replaced with a database implementation. The current file store is safe only for a single writable persistent Node instance; it does not coordinate multiple processes or replicas.

## Admin authentication

1. Login posts email, password, optional TOTP code, and remember-me to `/api/admin/login` with a same-origin marker header.
2. Login/logout reject an absent or mismatched Origin, cross-site fetch metadata, or absent marker header.
3. The login route caps request size, validates a strict Zod schema, checks process-local client/account throttles, and returns generic credential failures.
4. Production configuration fails closed unless it has a valid scrypt password hash, a 32+ character session secret, and TOTP MFA enabled with a valid Base32 secret.
5. Password verification uses scrypt; identifiers, HMAC signatures, and TOTP codes use timing-safe comparison where applicable.
6. The session payload contains audience, normalized identity, issue/expiry times, a random ID, and a rotation version, then receives an HMAC-SHA256 signature.
7. The token is stored in an HttpOnly, SameSite Strict, high-priority cookie. Production uses a Secure `__Host-` cookie.
8. Protected pages verify the signature, identity, audience, timestamps, maximum lifetime, and version server-side before rendering.
9. Logout passes the same-origin check and expires the cookie. Incrementing `ADMIN_SESSION_VERSION` invalidates all existing sessions.

Default sessions last 8 hours; remember-me sessions last 7 days.

The in-memory rate-limit store is bounded and suitable as an application-layer control for a single process. It is not shared across replicas and resets on restart, so production hosting must add a shared WAF/gateway/store limit for distributed deployments. `ADMIN_TRUST_PROXY` must only be enabled when the deployment proxy overwrites forwarded client-IP headers.

## Decisions

### ADR-001: Next.js App Router

- **Status:** Accepted
- **Reason:** Server rendering, route handlers, metadata, and nested layouts in one app.

### ADR-002: Typed seeds for first-run catalog hydration

- **Status:** Superseded for catalog runtime reads; retained for seeds
- **Reason:** Existing Product/Category data must survive the transition to dynamic administration without forcing a one-off migration command.
- **Consequence:** Missing legacy catalog keys hydrate from committed seeds, while persisted arrays become authoritative. Orders, analytics, and carts remain non-persistent.

### ADR-003: Environment-backed single admin

- **Status:** Temporary
- **Reason:** Protects the first admin area without a database.
- **Consequence:** No roles, reset tokens, per-session revocation list, or audit log. Production credentials are nevertheless hashed and MFA-protected.

### ADR-004: Documentation in definition of done

- **Status:** Accepted
- **Reason:** Behavior and decisions must remain discoverable.
- **Consequence:** Every change updates progress and affected topic documents.

### ADR-005: Fail-closed production admin configuration

- **Status:** Accepted
- **Reason:** Plaintext deployment passwords, missing MFA, short signing secrets, and insecure cookies are not acceptable for the administration boundary.
- **Consequence:** Existing deployments must run `npm run admin:setup`, install the TOTP secret in an authenticator, configure HTTPS/canonical URL, and replace the legacy `ADMIN_PASSWORD` before production login becomes available.

### ADR-006: File-backed catalog and content repository

- **Status:** Temporary
- **Reason:** Delivers dynamic Product/Category/Blog/Gallery CRUD without introducing an unselected database platform.
- **Consequence:** Hosting must provide a writable persistent filesystem and one application instance. A shared database adapter is required before serverless or horizontally scaled deployment.

### ADR-007: Server-mediated UploadThing images

- **Status:** Accepted
- **Reason:** Keeps the provider token server-only and centralizes authentication, type, signature, count, and size enforcement.
- **Consequence:** Blog banners, gallery covers, and gallery photos accept only JPG, PNG, or WebP files up to 500 KiB each; gallery extra photos are capped at 12.
