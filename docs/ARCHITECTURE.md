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
| `src/components/ui/` | Low-level shared UI primitives |
| `src/contexts/` | Cross-tree client providers |
| `src/hooks/` | Reusable client behavior |
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

## Storefront data flow

Typed objects in `src/data/` feed pages and components. Product IDs form dynamic routes. Cart and wishlist hooks provide browser-side state. No production database/repository layer exists yet. When one is added, introduce a typed service/repository boundary rather than importing database clients throughout UI code.

## Admin authentication

1. Login posts email, password, and remember-me to `/api/admin/login`.
2. The route checks required environment configuration.
3. Credentials use timing-safe comparison.
4. Email and expiry are signed using HMAC-SHA256.
5. The token is stored in an HttpOnly, SameSite Strict cookie.
6. Protected pages verify it server-side and redirect invalid sessions.
7. Logout expires the cookie.

Default sessions last 8 hours; remember-me sessions last 30 days.

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
- **Consequence:** No roles, reset tokens, revocation list, or audit log.

### ADR-004: Documentation in definition of done

- **Status:** Accepted
- **Reason:** Behavior and decisions must remain discoverable.
- **Consequence:** Every change updates progress and affected topic documents.
