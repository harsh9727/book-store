# Errors and How to Solve Them

## Diagnostic order

1. Reproduce and capture the exact command, route, status, and message.
2. Run the narrowest relevant check.
3. Check environment configuration without printing secrets.
4. Identify code, cache, dependency, or OS-permission origin.
5. Apply the smallest fix, rerun the check, and update this file plus `PROGRESS.md`.

## Admin login says “not configured”

**Symptom:** `POST /api/admin/login` returns HTTP 503.

**Cause:** `ADMIN_EMAIL`, `ADMIN_PASSWORD`, or `ADMIN_SESSION_SECRET` is empty/missing.

**Solution:** Configure all three locally/deployed, use a unique password and 32+ character random secret, then restart Next.js. Never print or document the values.

## Correct admin details are rejected

**Symptom:** Login returns HTTP 401.

**Likely causes:** Stale environment values, password case mismatch, or different deployment configuration.

**Solution:** Confirm variable presence without displaying values, restart, and retry. Email is normalized to lowercase; password is case-sensitive.

## Admin redirects back to login

**Likely causes:** Cookie blocked, session expired, signing secret changed, hostname changed, or inconsistent production HTTPS settings.

**Solution:** Check browser storage for `gtbs_admin_session`, verify hostname/HTTPS, then log in again. Changing the session secret invalidates every session by design.

## Full ESLint fails

**Symptom:** `npm run lint` exits non-zero while newly changed admin files pass.

**Known causes observed 2026-08-30:** synchronous `setState` in effects, reading refs during Swiper renders, explicit `any`, unescaped JSX apostrophes, unused imports, and raw `<img>`.

**Affected areas:** `allproducts/page.tsx`, blogs/gallery pages, `SearchBar.tsx`, several home carousel components, and isolated typing/JSX issues.

**Solution:** Fix by category and rerun full lint. During scoped work run focused ESLint too, but never report a focused pass as a full repository pass.

## Build ends with `spawn EPERM`

**Symptom:** `npm run build` compiles, then cannot start the TypeScript worker on Windows.

**Cause:** OS or sandbox child-process permission denial; it may be environmental.

**Solution:**

1. Run `npx tsc --noEmit` independently.
2. Close stale Node processes and retry from a normal permitted terminal.
3. Check antivirus/endpoint child-process restrictions.
4. Clear only the workspace `.next` directory when safe, then retry.
5. Do not claim a successful production build until exit code 0.

**Observed 2026-08-30:** Bundle compilation and direct TypeScript validation succeeded; worker spawn was denied afterward.

## External images fail

**Symptom:** `next/image` says a hostname is not configured.

**Cause:** Host absent from `images.remotePatterns`.

**Solution:** Prefer local assets. Otherwise add the narrowest trusted host/protocol rule, restart, and document the dependency/security impact.

## Contact form does not send

**Likely causes:** Missing/incorrect `NEXT_PUBLIC_EMAILJS_*` configuration, origin restrictions, template mismatch, quota, or provider availability.

**Solution:** Verify the three variables, template field names, allowed origins, and quota, then restart. These values are browser-visible; do not substitute private secrets.

## Stale UI after changes

Restart for environment changes. For stale generated output, stop the process and remove only the workspace `.next` directory, then restart. Never recursively delete a broad directory or workspace root.
