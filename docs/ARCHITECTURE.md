# Architecture

## High-level structure

```text
Browser
  ├─ Public App Router pages
  │    ├─ shared site chrome
  │    ├─ feature components
  │    └─ local catalog/content data
  └─ Admin pages
       ├─ login → POST /api/admin/login
       ├─ signed HttpOnly session cookie
       └─ protected server-rendered dashboard
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
