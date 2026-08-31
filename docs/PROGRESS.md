# Project Progress

## Status

| Area | Status | Notes |
| --- | --- | --- |
| Public storefront | In progress | Main pages exist; data is local/static |
| Product catalog | Prototype | Typed data and product detail UI |
| Cart/wishlist | Prototype | Client-side; no documented backend |
| Checkout/payments | UI only | No persistent payment/order workflow |
| Customer auth | UI only | No documented production identity backend |
| Admin auth | Production-hardened baseline | Single environment-backed admin, scrypt + TOTP, signed cookie |
| Admin dashboard | First layout complete | Responsive; figures/actions are presentation data |
| SEO | Baseline implemented | Metadata, structured data, robots, sitemap, manifest |
| Documentation | Active | Must evolve with every change |
| Automated quality | Needs work | TypeScript passes; full lint has existing failures |

## Current priorities

1. Add persistent product/inventory storage.
2. Build functional admin Orders and Products modules.
3. Replace dashboard presentation figures with server data.
4. Resolve repository-wide lint failures.
5. Add shared deployment/WAF login throttling and database-backed admin lifecycle when hosting requirements are chosen.
6. Define persistent customer, cart, checkout, and payment architecture.

## Change log

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
