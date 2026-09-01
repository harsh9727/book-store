# Architecture

## High-level structure

```text
Browser
  ├─ Public App Router pages
  │    ├─ shared site chrome
  │    ├─ feature components
  │    ├─ local catalog/seed data
  │    └─ file-backed blog/gallery repository
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
| `src/data/` | Static typed catalog/content |
| `src/lib/` | Utilities, SEO, constants, and auth |
| `src/types/` | Shared domain types |
| `public/images/` | Static image assets |
| `storage/content.json` | Ignored runtime blog/gallery metadata, created on first mutation |
| `docs/` | Maintained project knowledge |

## Rendering boundaries

- Pages are Server Components by default.
- Use `"use client"` only for state, effects, events, storage, or client navigation.
- The root layout loads fonts, metadata, structured data, language context, and `SiteChrome`.
- `SiteChrome` removes public header/footer controls for `/admin` routes.
- The language provider loads Google Translate only after Gujarati is selected; English storefront browsing does not initialize the translation integration.

## Storefront data flow

Typed objects in `src/data/` feed pages and components. Product IDs form dynamic routes. Cart and wishlist routes currently render static empty states and have no state or persistence layer. No production database/repository layer exists yet. When one is added, introduce a typed service/repository boundary rather than importing database clients throughout UI code.

Catalog, blog, and gallery filter/search handlers reset pagination within the same user event, avoiding state-mirroring effects. Home carousels retain Swiper instances in refs and access them only from navigation event handlers.

## Blog and gallery content flow

1. `src/data/blogs.ts` remains the only committed content seed; `src/data/galleries.ts` is intentionally empty so gallery data is admin-managed only.
2. `contentRepository.ts` reads `storage/content.json` when present and validates the complete document with Zod; invalid persisted data fails instead of being silently replaced.
3. Admin create/update/delete requests require the signed admin session, matching Origin/fetch metadata, and `X-GTBS-Admin-Request: 1`.
4. Mutations are serialized in-process and written through a uniquely named temporary file followed by an atomic rename.
5. Public list APIs are no-store; detail pages, the home blog section, and sitemap read through the repository.
6. Images upload through the server-only UploadThing SDK. The browser never receives `UPLOADTHING_TOKEN`.
7. Managed UploadThing keys are stored beside URLs. Replaced or deleted managed images are deleted best-effort from UploadThing; legacy/local/external seed images have no managed key and are never deleted remotely.

On the public Gallery detail route, `GalleryLightbox` progressively exposes photos in batches of 8. The responsive grid uses 1 column on mobile, 2 on tablet, and 4 on desktop. Click and Left/Right keyboard navigation are bounded to the currently visible slice so undisclosed photos do not open before View more is selected; Escape closes the viewer. The document keyboard listener exists only while the lightbox is open and is removed on close/unmount.

Gallery detail links, canonical metadata, structured data, and sitemap entries use the stored slug. `getGallery` continues to resolve either an ID or slug, allowing an incoming numeric URL to find the record and redirect to the canonical `/gallery/[slug]` address.

The Blog and Gallery admin pages render through the shared `AdminContentShell`, which keeps dashboard-style navigation visible on desktop and a compact admin route bar on smaller screens. Admin navigation exposes only implemented destinations: Overview, Blogs, and Gallery. Their index routes render list-only tables and perform search, category filtering, and 8-row pagination client-side over the server-loaded collection; search/filter events reset the page directly instead of synchronizing it through an effect. Add links to `/admin/blogs/add` or `/admin/galleries/add`; row Edit links to the matching `/admin/.../[id]/edit` route. Those protected server pages load reusable client form components, edit pages fetch the identified record before rendering, and successful saves return to the related list. The admin layout owns a persistent Sonner toaster; create/update/delete outcomes publish there. Delete buttons first populate a shared client confirmation modal and call the protected endpoint only after explicit confirmation. The protected API remains the source of persistence.

Image controls keep field-specific client validation state: Blog banner, Gallery cover, and Gallery extra photos each render their own validation message adjacent to the input. Cross-field, upload-provider, and API mutation failures remain general form errors and toasts.

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

### ADR-002: Static typed data for prototyping

- **Status:** Temporary
- **Reason:** Enables UI development before backend selection.
- **Consequence:** Orders, inventory, analytics, and carts are not production-persistent.

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

### ADR-006: File-backed content repository

- **Status:** Temporary
- **Reason:** Delivers dynamic blog/gallery CRUD without introducing an unselected database platform.
- **Consequence:** Hosting must provide a writable persistent filesystem and one application instance. A shared database adapter is required before serverless or horizontally scaled deployment.

### ADR-007: Server-mediated UploadThing images

- **Status:** Accepted
- **Reason:** Keeps the provider token server-only and centralizes authentication, type, signature, count, and size enforcement.
- **Consequence:** Blog banners, gallery covers, and gallery photos accept only JPG, PNG, or WebP files up to 500 KiB each; gallery extra photos are capped at 12.
