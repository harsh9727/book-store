# Code Standards

## TypeScript

- Keep strict mode passing.
- Prefer domain types over `any`; use `unknown` with narrowing.
- Use `import type` for type-only imports.
- Put shared domain models in `src/types/`.
- Prefer immutable transforms to mutating shared values.
- Use the `@/` alias for imports rooted at `src/`.

## React and Next.js

- Use Server Components by default.
- Add `"use client"` at the smallest interactive boundary.
- Keep route metadata in pages/layouts or shared SEO helpers.
- Use route handlers for server HTTP behavior.
- Keep persistence behind typed repository functions; do not read or write runtime content files from pages/components.
- Do not synchronously mirror state in effects; derive or initialize it when possible.
- Never access `ref.current` during render.
- Reset filtered pagination in the filter/search event handler instead of calling a state setter from an effect.
- Store imperative carousel instances in refs and access them only in callbacks or event handlers.
- Prefer semantic HTML over generic containers.

## Components

- Components use PascalCase; hooks start with `use`; utilities use camelCase.
- Feature components live in their domain; generic primitives live in `ui` or `common`.
- Pages focus on composition, loading, authorization, and route concerns.
- Extract repeated/stateful dashboard behavior before adding more admin modules.
- Avoid abstractions that do not clarify reuse, domain, or server/client boundaries.

## Styling

- Prefer Tailwind utilities and existing visual conventions.
- Start mobile-first, then add responsive enhancements.
- Use arbitrary values sparingly.
- Maintain keyboard focus, contrast, and 40–44px touch targets.
- Specify image dimensions to prevent layout shift.

## Forms and accessibility

- Inputs need labels or accessible names.
- Associate clear validation errors with fields.
- Buttons declare `type`.
- Icon-only controls require `aria-label`.
- Use `aria-current` for active navigation and semantic async status text.

## Errors

- Never expose stack traces, credentials, or internal config to users.
- Make user errors actionable.
- Do not log passwords, session cookies, or private form content.
- Invalid input returns controlled 4xx; missing server config returns 5xx/503.
- Authentication failures use generic messages; rate-limit responses include `Retry-After` without revealing whether an account exists.

## Authentication

- Parse admin route bodies with strict schemas and cap body size before expensive credential work.
- Validate image MIME type, byte size, and file signature server-side before provider upload; client checks are usability only.
- Keep password hashing, MFA verification, session signing, request-origin checks, and throttling in server-only utilities.
- Admin mutation fetches include `X-GTBS-Admin-Request: 1`; route handlers also validate Origin and fetch-site metadata.
- Production cookies are Secure, HttpOnly, SameSite Strict, high priority, host-only, and scoped to `/`.
- Add auth regression coverage to `tests/admin-auth.test.ts` whenever an authentication invariant changes.

## Verification

For changed files:

```bash
npx eslint path/to/changed-file.tsx
npx tsc --noEmit
npm run test:admin-auth
```

For releases or routing/config changes:

```bash
npm run lint
npm run build
```

If full checks fail because of existing debt or an environment limitation, run focused checks and record both outcomes in `PROGRESS.md` and `TROUBLESHOOTING.md`. A focused pass is not a repository-wide pass.
