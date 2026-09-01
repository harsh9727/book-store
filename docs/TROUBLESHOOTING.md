# Errors and How to Solve Them

## Diagnostic order

1. Reproduce and capture the exact command, route, status, and message.
2. Run the narrowest relevant check.
3. Check environment configuration without printing secrets.
4. Identify code, cache, dependency, or OS-permission origin.
5. Apply the smallest fix, rerun the check, and update this file plus `PROGRESS.md`.

## Admin login says “not configured”

**Symptom:** `POST /api/admin/login` returns HTTP 503.

**Cause:** Required authentication configuration is missing or invalid. Production requires `ADMIN_EMAIL`, a generated `ADMIN_PASSWORD_HASH`, a 32+ character `ADMIN_SESSION_SECRET`, `ADMIN_REQUIRE_MFA=true`, and a valid Base32 `ADMIN_TOTP_SECRET`. Plaintext `ADMIN_PASSWORD` works only as a local-development migration fallback.

**Solution:** Run `npm run admin:setup` in an interactive private terminal, copy the generated values into local/deployment secret configuration, enroll the setup URI in an authenticator app, and restart Next.js. Never commit, screenshot, or paste the output into documentation.

## Correct admin details are rejected

**Symptom:** Login returns HTTP 401.

**Likely causes:** Stale environment values, password case mismatch, an incorrect/expired authenticator code, server clock drift, a legacy plaintext password deployed to production, or different deployment configuration.

**Solution:** Confirm variable presence without displaying values, synchronize server/authenticator clocks, restart, and retry. Email is normalized to lowercase; passwords are case-sensitive; TOTP codes rotate every 30 seconds.

## Admin request returns HTTP 403

**Symptom:** Login/logout returns `Request could not be verified.`

**Cause:** The request did not have the same Origin as `NEXT_PUBLIC_SITE_URL`, was marked cross-site, or omitted `X-GTBS-Admin-Request: 1`. This can also happen when browsing the development server through a hostname different from its canonical `localhost` URL.

**Solution:** Use the configured canonical HTTPS URL. Keep admin fetches same-origin and include the marker header. Do not disable the check; fix proxy Host/Origin forwarding instead.

## Admin login returns HTTP 429

**Symptom:** The generic sign-in error repeats and the response has `Retry-After`.

**Cause:** Five failed attempts for a client/account pair or ten client-wide failures triggered a 15-minute process-local lock.

**Solution:** Wait for `Retry-After`, then verify credentials and MFA. Investigate repeated failures in deployment telemetry without logging credentials. For distributed deployments, configure the shared host/WAF limiter consistently.

## Admin redirects back to login

**Likely causes:** Cookie blocked, session expired, signing secret changed, hostname changed, or inconsistent production HTTPS settings.

**Solution:** Check browser storage for `__Host-gtbs_admin_session` in production (`gtbs_admin_session` in development), verify hostname/HTTPS, then log in again. Changing the session secret, admin email, or `ADMIN_SESSION_VERSION` invalidates sessions by design.

## Admin login reports a hydration mismatch

**Symptom:** React reports that server-rendered attributes do not match client properties and points to the admin email input.

**Cause:** The remembered email previously participated in the input's rendered attributes through a browser-storage snapshot. Server rendering cannot read `localStorage`, so persisted browser state could diverge from the server HTML during hydration.

**Solution:** Render the email and remember-me inputs with stable empty/unchecked HTML, then copy any remembered email into their uncontrolled DOM refs after hydration. Keep browser-only storage out of server-visible initial attributes.

**Prevention:** Values from `localStorage`, locale APIs, extensions, time, or randomness must not alter the first client render unless the server receives and renders the same snapshot.

## Full ESLint fails

**Symptom:** `npm run lint` exits non-zero while newly changed admin files pass.

**Known causes observed 2026-08-30:** synchronous `setState` in effects, reading refs during Swiper renders, explicit `any`, unescaped JSX apostrophes, unused imports, and raw `<img>`.

**Affected areas:** `allproducts/page.tsx`, blogs/gallery pages, `SearchBar.tsx`, several home carousel components, and isolated typing/JSX issues.

**Solution:** Fix by category and rerun full lint. During scoped work run focused ESLint too, but never report a focused pass as a full repository pass.

**Observed 2026-08-31:** The production-auth change's focused ESLint passed, while repository-wide `npm run lint` still reported the pre-existing 28 errors and 14 warnings in the categories above.

**Resolved 2026-08-31:** filter/search handlers now reset pagination in the same user event instead of an effect, Swiper navigation moved ref access into event handlers, explicit `any` and unused code were removed, JSX text was escaped, and blog avatars moved to `next/image`. `npm run lint` now passes with 0 errors and 0 warnings.

**Prevention:** Keep the full lint command in every change validation. Do not reintroduce state-mirroring effects, render-time ref reads, raw content images, or untyped event values.

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

**Observed 2026-08-31:** Node's built-in test runner hit the same sandbox child-process denial. Running the focused suite in a permitted terminal passed; the production build also completed in the permitted environment. Treat an external pass as environment-specific evidence, not permission to bypass normal workstation controls.

**Observed 2026-09-01:** after unused-file/dependency cleanup, production compilation succeeded in 4.1 seconds before the same TypeScript-worker denial. Full lint, generated route types, standalone TypeScript, and the direct 7/7 admin-auth suite passed.

## TypeScript references deleted App Router routes

**Symptom:** `npx tsc --noEmit` reports missing page or route modules under `.next/types/validator.ts`, even though those routes are absent from `src/app/`.

**Cause:** `.next` contains stale generated route types from an earlier source tree.

**Solution:** Run `npx next typegen`, then rerun `npx tsc --noEmit`. If generation itself remains stale, stop the development server and remove only the workspace `.next` directory before regenerating; never delete a broader directory.

**Observed 2026-08-31:** stale `/admin/cms` generated references caused the failure; `npx next typegen` refreshed the route graph and TypeScript then passed.

## External images fail

**Symptom:** `next/image` says a hostname is not configured.

**Cause:** Host absent from `images.remotePatterns`.

**Solution:** Prefer local assets. Otherwise add the narrowest trusted host/protocol rule, restart, and document the dependency/security impact.

## Contact form does not send

**Likely causes:** Missing/incorrect `NEXT_PUBLIC_EMAILJS_*` configuration, origin restrictions, template mismatch, quota, or provider availability.

**Solution:** Verify the three variables, template field names, allowed origins, and quota, then restart. These values are browser-visible; do not substitute private secrets.

## Admin image upload says UploadThing is not configured

**Symptom:** the protected upload API returns HTTP 503.

**Cause:** `UPLOADTHING_TOKEN` is absent or empty in the server environment.

**Solution:** Create/copy the token from the UploadThing application into the deployment secret manager as `UPLOADTHING_TOKEN`, restart the server, and retry. Never use a `NEXT_PUBLIC_` prefix or paste the token into source/docs.

## Admin image is rejected before upload

**Symptom:** the form or API reports that an image is invalid or larger than 500 KB.

**Cause:** the file exceeds 500 KiB, is not JPG/PNG/WebP, has a mismatched binary signature, or a gallery selection exceeds 12 extra photos.

**Solution:** resize/compress and export the image as JPG, PNG, or WebP. For gallery albums, keep no more than 12 extra photos; the cover is uploaded separately.

**UI behavior:** client-side validation identifies the file and displays the message directly below the affected Blog banner, Gallery cover, or Gallery extra-photo input. General provider/API failures may still appear as a form error and toast.

## Blog/gallery changes disappear after deployment

**Symptom:** content resets to committed seed data after restart/redeploy or differs between instances.

**Cause:** `storage/content.json` is absent, ephemeral, read-only, or not shared. The current repository is designed for one writable persistent Node instance.

**Solution:** mount persistent writable storage for a single instance. Before using serverless or multiple replicas, replace `contentRepository.ts` with a shared database implementation and migrate the JSON document.

## Admin sidebar disappears on Blog or Gallery

**Symptom:** selecting Blog or Gallery appears to leave the dashboard shell, and the page opens directly on an editor instead of a content list.

**Cause:** the content routes previously used a separate top-navigation shell and rendered the editor beside content cards rather than using the dashboard navigation and a list-first CRUD flow.

**Resolved 2026-09-01:** both content routes now use the shared dashboard-style `AdminContentShell`. Desktop keeps a sticky sidebar, mobile keeps a compact admin route bar, and each index route defaults to a responsive table with Add, View, Edit, and Delete controls. Add and Edit navigate to dedicated protected form routes.

**Prevention:** route new admin content modules through the common admin shell, make the index route a list view, and place create/edit UI on dedicated protected routes reached only from explicit actions.

## pnpm blocks msgpackr-extract during UploadThing installation

**Symptom:** pnpm reports `ERR_PNPM_IGNORED_BUILDS` for `msgpackr-extract`.

**Cause:** an optional native optimization requested a build script under pnpm's supply-chain policy.

**Solution:** keep `msgpackr-extract: false` in `pnpm-workspace.yaml`; the JavaScript fallback is sufficient for this application. Re-run pnpm using the repository's established store.

## Stale UI after changes

Restart for environment changes. For stale generated output, stop the process and remove only the workspace `.next` directory, then restart. Never recursively delete a broad directory or workspace root.

## pnpm reports an unexpected store location

**Symptom:** a dependency command reports `ERR_PNPM_UNEXPECTED_STORE` because `node_modules` is linked to a different pnpm store.

**Cause:** the active pnpm configuration selects a workspace-local store while the existing installation was linked from another known store location.

**Resolved 2026-09-01:** the cleanup reused the existing `D:\.pnpm-store\v11` location explicitly to update the manifest, lockfile, and installed graph. The failed first attempt's generated workspace `.pnpm-store/` cache was removed afterward.

**Prevention:** keep pnpm version/store configuration consistent for the workspace. If dependencies were intentionally moved to a different store, run a normal `pnpm install` instead of manually editing files inside `node_modules` or the store.
