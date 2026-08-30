# Security

This records implemented controls and known risks; it is not a formal security certification.

## Secrets

- Real values belong in local/deployment secret configuration, never source or Markdown.
- `.env.example` contains placeholders only.
- Production must not use example admin values.
- `ADMIN_SESSION_SECRET` should contain at least 32 random characters.
- `NEXT_PUBLIC_` variables are browser-visible and cannot contain secrets.
- Rotate a secret immediately if exposed in Git, logs, screenshots, chat, or docs.

## Implemented admin controls

- Credentials are validated server-side with timing-safe comparison.
- Sessions are HMAC-SHA256 signed and expiry-checked.
- The cookie is HttpOnly, SameSite Strict, scoped to `/`, and Secure under production HTTPS configuration.
- Logout expires the session cookie.
- Admin pages are no-index and excluded from public chrome.

## Known gaps before mature production use

- Replace the single environment account with database identities and one-way password hashing.
- Add rate limiting and progressive delay/lockout.
- Add CSRF review/protection to future state-changing admin endpoints.
- Add roles, session revocation/rotation, and audit logs.
- Implement short-lived, single-use password reset tokens; current recovery only prepares an email request.
- Validate request bodies with schemas rather than TypeScript casts.
- Add a Content Security Policy after auditing third-party scripts.
- Review EmailJS quotas, abuse protection, and allowed origins.
- Add dependency vulnerability scanning to CI.

## Authentication invariants

- Never authorize from client state or a remembered email.
- Every protected admin page and API verifies server-side authorization.
- Hidden UI is not authorization.
- Every future admin mutation performs its own authorization.
- Credentials never go in URLs, analytics, logs, or error responses.

## Input/output safety

- Treat forms, params, cookies, and third-party responses as untrusted.
- Validate and normalize at boundaries.
- Avoid `dangerouslySetInnerHTML` unless sanitized and reviewed.
- Restrict remote images through `next.config.ts`.
- Allow-list protocols/hosts before rendering arbitrary external URLs.

## Release checklist

- [ ] Production secrets are unique and stored in a secret manager.
- [ ] HTTPS is enforced and admin cookies are Secure.
- [ ] Example credentials fail.
- [ ] Protected pages/mutations reject missing, invalid, and expired sessions.
- [ ] Login abuse controls are active.
- [ ] Dependency/source scans have no unresolved high-severity findings.
- [ ] Errors reveal no secrets, stacks, or internal paths.
- [ ] Security changes are recorded in `PROGRESS.md`.
