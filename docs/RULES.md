# Project Rules

## Workflow

1. Inspect affected routes, components, types, and patterns before editing.
2. Keep changes scoped and preserve unrelated work.
3. Prefer reusable components when behavior repeats.
4. Validate in proportion to risk: focused lint, TypeScript, tests when present, and production build for release-sensitive work.
5. Update documentation before declaring completion.

## Mandatory documentation

Every development change must add a `PROGRESS.md` entry containing:

- ISO date
- Outcome
- Main files or areas
- Checks run and exact outcomes
- Known limitations or next step

Update every topic document whose facts changed. New errors and resolutions belong in `TROUBLESHOOTING.md`.

## Product rules

- Public routes use storefront chrome; admin routes do not.
- Indian storefront prices use rupees and Indian formatting unless source data requires otherwise.
- Static or browser-local features must be labeled mock, demo, or local in documentation.
- Placeholder actions must not be described as complete functionality.
- Dynamic routes must handle unknown IDs safely, normally through Next.js not-found behavior.

## UI rules

- Build mobile-first and verify tablet/desktop behavior.
- Avoid widths that cause viewport overflow.
- Tables must scroll or transform on small screens.
- Controls need focus/hover states, accessible names, and sufficient touch targets.
- Prefer `next/image` for content images.
- Preserve the GTBS language: Inter body, Fraunces display, orange accent, restrained neutrals.

## Data and API rules

- Validate untrusted input at route boundaries.
- Return consistent JSON errors and appropriate status codes.
- Keep server secrets and crypto out of Client Components.
- Do not mutate imported domain data.
- Introduce typed service/repository functions when persistence is added.
- Admin state-changing requests require same-origin verification and the `X-GTBS-Admin-Request` marker.
- Production admin auth must fail closed when the password hash, MFA secret, HTTPS origin, or strong session secret is missing.
- Never weaken or bypass login throttling for UI convenience; distributed deployments add a shared host/WAF limit.

## Git and files

- Never commit `.env`, generated output, credentials, or tokens.
- Do not overwrite unrelated user work.
- Avoid destructive Git/filesystem actions without authorization.
- Keep `.next/` and TypeScript build output out of source changes.
