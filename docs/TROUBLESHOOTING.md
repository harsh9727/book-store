# Errors and How to Solve Them

## Diagnostic order

1. Reproduce and capture the exact command, route, status, and message.
2. Run the narrowest relevant check.
3. Check environment configuration without printing secrets.
4. Identify code, cache, dependency, or OS-permission origin.
5. Apply the smallest fix, rerun the check, and update this file plus `PROGRESS.md`.

## Homepage shows fake Magazines that are not in Admin Products

**Symptom:** the homepage displays Faith & Life Magazine, Christian Living Digest, or The Good News Monthly even though those Products do not exist in the admin catalog.

**Cause resolved 2026-09-05:** `Magazines.tsx` rendered a three-item static fallback whenever no dynamic Magazine Products were found; homepage selection also accepted title/badge guesses instead of only the Category relationship.

**Solution:** the static records and cover fallback were removed. The homepage now selects only Products assigned to the `magazines` Category; when no matching Product exists, it keeps the section visible and renders the standard dashed empty-collection panel.

**Prevention:** create the `magazines` Category through Admin Categories when it is missing, then assign Magazine Products to it; do not add hardcoded Product fallbacks or title/badge matching to the homepage section.

## Header Cart badge returns after leaving the Cart page

**Symptom:** the orange Cart count remains visible, or reappears on another page, even after the shopper has opened `/cart` and reviewed the current items.

**Cause resolved 2026-09-05:** the header rendered the badge whenever Cart quantity was greater than zero, so it represented total stored items rather than an unread Cart update.

**Solution:** Add to Cart now sets a separate browser-local unread marker. Opening `/cart` acknowledges that marker without removing any Cart line, so the badge stays hidden on later navigation until another Product is added.

**Prevention:** keep Cart contents and notification acknowledgement as separate state; changing badge visibility must never clear or mutate the shopper's Cart.

## Broken navigation links return 404 (e.g., /books/* or /magazines/*)

**Symptom:** Clicking category links in Header or Magazine cards on the homepage returns a 404 Not Found page.

**Cause:** Legacy template anchor tags pointed to static placeholder paths like `/books/bibles` or `/magazines/faith-life` that did not exist in the App Router.

**Solution:** Route category and collection links through the dynamic catalog query routes: `/allproducts?category=${slug}` and `/allproducts`. Connect dynamic homepage sections (e.g. Magazines) to `getProducts()` filtered by category/badge.

**Prevention:** Always verify link destinations against the active `src/app` route tree and use dynamic catalog filters rather than hardcoding static mock paths.

## Buy Now opens WhatsApp without quantity or Product details

**Symptom:** a Product action opens a generic WhatsApp enquiry that omits the selected quantity, variants, price, or Product link.

**Cause resolved 2026-09-05:** Product cards, Product detail, and the former Checkout surface constructed separate message formats.

**Solution:** all sale actions now use `src/lib/whatsappOrder.ts`. Product Buy Now includes one selected Product; Cart includes every selected line and the aggregate total. Both flows include the greeting, quantity, price, variant details when present, and absolute Product links.

**Prevention:** add or change WhatsApp order fields only in the shared builder, then browser-test both one-Product and multi-Product flows.

## Removed shopper utility URL is requested

**Symptom:** an old bookmark requests `/checkout`, `/wishlist`, `/login`, `/register`, or `/profile` even though those pages are no longer part of the storefront scope.

**Resolved 2026-09-05:** the route implementations were removed. Next.js redirects Checkout to Cart and the Wishlist/customer URLs to All Products, so visitors re-enter the supported Product → WhatsApp flow without a 404.

## Product, Blog, or Gallery lists stay on skeletons and feel slow

**Symptom:** The route shell appears, but actual cards wait for hydration and a later `/api/content/catalog`, `/api/content/blogs`, or `/api/content/galleries` request. Repeated dynamic requests also reread and revalidate the same content JSON.

**Cause resolved 2026-09-03:** the three index pages were entirely client-rendered for data loading even though the content repository is server-local. This created a server HTML → JavaScript hydration → API request → render waterfall. Repository getters also performed duplicate filesystem reads and whole-document Zod parsing for concurrent or repeated calls.

**Solution:** route-level Server Components now load and serialize the initial arrays into focused interactive Client Components. The repository deduplicates its initial read and retains the validated snapshot until a successful mutation atomically publishes its replacement. The below-the-fold Magazine image no longer receives eager priority over visible content.

**Prevention:** prefer server-provided initial data for server-owned sources, keep filter/search interaction at a narrow client boundary, and reserve `priority` for above-the-fold images that affect LCP. In development, first visits still include route compilation time; compare warm requests or a completed production build when evaluating runtime performance.

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

**Observed 2026-09-02:** both admin-auth and content test commands hit `spawn EPERM` while starting their Node test workers in the restricted Windows sandbox. The same commands passed in the permitted environment (7/7 admin-auth and 14/14 content tests); repository-wide ESLint and standalone TypeScript also passed in the sandbox.

**Observed 2026-09-02 (dynamic catalog):** the restricted content suite and production build again hit the same child-process denial. Permitted reruns passed 16/16 content tests and completed the production build with TypeScript, 33/33 static pages, and exit code 0.

## Development server crashes with `Fatal process out of memory: Zone`

**Symptom:** `pnpm dev` starts successfully, compiles routes such as `/product/[id]` and `/admin/categories`, then the Node/Next process terminates with exit code `3765269347` and a native `Fatal process out of memory: Zone` message.

**Cause observed 2026-09-02:** the Turbopack filesystem cache had grown to about 1,186.64 MiB in `.next`; `.next/dev` accounted for about 1,000.82 MiB and included individual SST cache files of about 243.50 MiB and 145.26 MiB. On this Windows machine that cache coincided with the previously observed paging-file/native-memory pressure. This is a bundler-process crash, not a Product/Category API response failure.

**Resolved:** the default `pnpm dev` script now runs `next dev --webpack`, which is an officially supported Next.js fallback. Stop every server for this workspace, remove only `D:\react-projects\E-com\e-com\.next`, then restart with `pnpm dev`. The directory is generated and will be recreated. `pnpm dev:turbopack` remains available only for deliberate reproduction/tracing.

**Prevention:** do not run Webpack and Turbopack development servers concurrently against the same output directory. If `.next/dev/cache/turbopack` grows abnormally and the crash returns, stop the server and clear only this workspace's `.next`; also keep the Windows system-managed paging file enabled. Do not delete the repository root, `storage/`, or source directories.

**Next 16 note:** development startup can auto-append a managed block to `AGENTS.md`. This repository sets `agentRules: false` because `AGENTS.md` is an existing project-owned working agreement. Keep that configuration unless automatic rule generation is intentionally adopted and reviewed.

## React says a component has not mounted yet, followed by `Array buffer allocation failed`

**Symptom:** the terminal forwards `Can't perform a React state update on a component that hasn't mounted yet`, then reports `RangeError: Array buffer allocation failed`, unhandled rejections, and a layout `ChunkLoadError` timeout. The overlay may highlight `<LanguageProvider>` in `RootLayout` even though that JSX line contains no state update.

**Cause observed 2026-09-02:** Windows commit usage was about 14,858.8 MiB against a 15,712.6 MiB limit while the Next child held about 1,279.3 MiB private memory. Native allocation failed while compiling/serving the layout chunk; the browser router's asynchronous failed-chunk recovery then produced the React development warning. The highlighted provider was the failed layout boundary, not proof of a render-time setter.

**Resolved:** `experimental.webpackMemoryOptimizations: true` and `experimental.preloadEntriesOnStart: false` reduce development memory pressure. `LanguageProvider` now wraps only public `SiteChrome`, so admin routes do not mount its external-store subscription or Google Translate effects; its delayed public translation callback is deactivated and cleared during cleanup. Stop all stale dev servers and restart `pnpm dev` after this configuration change.

**If it returns:** close memory-heavy browser tabs, VS Code windows, Adobe/Creative Cloud processes, or other development servers and keep a system-managed/larger Windows paging file. Then stop Next, clear only this repository's generated `.next`, and restart. A React `useEffect` rewrite cannot repair an OS-level array-buffer allocation failure by itself.

## Product detail reports duplicate React child keys

**Symptom:** opening `/product/[id]` shows `Encountered two children with the same key` and names a repeated Product feature line.

**Cause:** the highlights list previously used the feature text itself as its React key. Repeated feature values therefore produced identical sibling keys.

**Resolved 2026-09-03:** each rendered feature occurrence now has a unique text-and-position key, so previously stored duplicates render without a React warning. Product create/edit also removes exact duplicate feature lines before submission.

**Prevention:** do not use editable, non-unique display text alone as a React list key. Use a persisted item ID where the data model provides one, or add a deterministic occurrence discriminator for ordered scalar lists.

## Next.js reports missing smooth-scroll behavior metadata

**Symptom:** route navigation logs `Detected scroll-behavior: smooth on the <html> element` and asks for `data-scroll-behavior="smooth"`.

**Cause:** global CSS intentionally applies `scroll-behavior: smooth` to the HTML element, but the root layout did not declare that behavior for Next.js route-transition scroll management.

**Resolved 2026-09-03:** the root `<html>` element now includes `data-scroll-behavior="smooth"`. Smooth scrolling remains available normally, while Next.js can disable it temporarily when restoring scroll position during navigation.

**Prevention:** when applying smooth scrolling to the document root, keep the matching `data-scroll-behavior="smooth"` attribute on the root App Router layout.

## VS Code reports missing aliases in a moved admin file

**Symptom:** the Problems panel groups `Cannot find module` and follow-on implicit-`any` diagnostics under a former flat path such as `src/components/admin/AdminBlogForm.tsx`, even though the component was moved to `src/components/admin/blog/AdminBlogForm.tsx`.

**Cause:** VS Code retained the deleted file as an open editor buffer. Because that orphaned buffer is no longer part of the configured TypeScript project, its `@/` aliases can appear unresolved; the implicit-`any` messages are cascading diagnostics. The repository compiler does not report these errors.

**Solution:** close the tab for the deleted flat-path file, open the component from its new feature folder, and run **TypeScript: Restart TS Server** from the Command Palette. Use **Developer: Reload Window** if the deleted path still remains in Problems.

**Prevention:** after moving open TypeScript files, reopen them from the Explorer at the new path before continuing edits.

**Observed 2026-09-02:** the old file was absent on disk, the new Blog form imported `@/components/admin/blog/AdminRichTextEditor`, no stale source import remained, and `npx tsc --noEmit --pretty false` exited successfully with no diagnostics.

## Turbopack build fails with paging-file error 1455

**Symptom:** `npm run build` stops while restoring the `.next/cache/turbopack` database and reports that it cannot memory-map an SST cache file because the paging file is too small (`os error 1455`).

**Cause:** Windows cannot provide enough committed virtual memory for the cached Turbopack data. This is an environment/resource failure, not a TypeScript or ESLint diagnostic from the application.

**Solution:** close memory-heavy processes or increase the Windows paging-file allocation, then rerun the build. If the cache itself remains inconsistent after resources are available, stop all Next.js processes, remove only this workspace's `.next` directory, and rerun `npm run build` so the cache is regenerated.

**Prevention:** keep the system-managed paging file enabled and avoid running concurrent memory-heavy builds. Do not claim a successful production build unless the command exits with code 0.

**Observed 2026-09-01:** after unused-file/dependency cleanup, production compilation succeeded in 4.1 seconds before the same TypeScript-worker denial. Full lint, generated route types, standalone TypeScript, and the direct 7/7 admin-auth suite passed.

## Turbopack build exits with Windows code `3221225725`

**Symptom:** `pnpm build` stops during `Creating an optimized production build` without a source diagnostic and exits with decimal code `3221225725` (`0xC00000FD`).

**Cause:** the native Windows bundler process exhausted its stack or crashed transiently. Because no TypeScript/module diagnostic is emitted, this exit alone does not identify an application-code error.

**Solution:** rerun focused ESLint and `pnpm exec tsc --noEmit`, then make one clean build retry after the failed process has ended. If the exit repeats, stop other Next.js processes, inspect available memory/paging resources, and clear only this workspace's `.next` cache when safe. Do not claim build success without a later exit code 0.

**Observed 2026-09-03:** the first permitted Team-module build exited with `3221225725` during native compilation. An unchanged immediate retry compiled in 7.2 seconds, completed TypeScript in 16.6 seconds, generated 35/35 static pages, listed the Team pages/APIs, and exited 0; the failure was transient.

## Build cannot fetch configured Google Fonts

**Symptom:** `npm run build` reports `next/font` failures for Fraunces and Inter because it cannot connect to `fonts.googleapis.com`.

**Cause:** the build environment has restricted or unavailable outbound network access. The application source and TypeScript compilation may still be valid, but `next/font/google` downloads the configured font assets during production compilation.

**Solution:** run the build in the approved deployment or workstation environment with outbound HTTPS access to Google Fonts, or make a separately reviewed change to self-host the fonts with `next/font/local`. Do not disable TLS verification.

**Observed 2026-09-01:** the restricted build failed only at the existing Google Font fetches; the permitted `npm run build` rerun compiled, type-checked, generated all pages, and exited 0.

**Observed 2026-09-03:** the first Webpack verification build reached the existing Fraunces/Inter download and failed with `UNABLE_TO_VERIFY_LEAF_SIGNATURE`. A retry with `NODE_USE_SYSTEM_CA=1` preserved TLS verification, compiled successfully, completed TypeScript, generated 30/30 static pages, emitted the full route manifest, and exited 0.

## pnpm registry reports `UNABLE_TO_VERIFY_LEAF_SIGNATURE`

**Symptom:** a dependency install retries registry metadata requests and then fails with `ERR_PNPM_META_FETCH_FAIL` plus `UNABLE_TO_VERIFY_LEAF_SIGNATURE`, even though TLS verification is enabled.

**Cause:** Node's bundled CA set does not include a certificate chain that the Windows machine already trusts in its system certificate store.

**Resolved 2026-09-01:** on Node 22, run the scoped dependency command with `NODE_USE_SYSTEM_CA=1` (PowerShell: `$env:NODE_USE_SYSTEM_CA='1'`) so Node adds the operating system's trusted CA store while keeping TLS verification enabled. The Tiptap install then completed and pnpm's lockfile supply-chain policy check passed.

**Prevention:** keep `strict-ssl` enabled. Configure the organization/root certificate through the system store or an approved `NODE_EXTRA_CA_CERTS` file; never solve this by disabling certificate verification.

## `pnpm list` cannot open its SQLite database

**Symptom:** `pnpm list` reports `ERR_SQLITE_ERROR: unable to open database file` in a restricted workspace shell even though installed packages resolve during lint and TypeScript checks.

**Cause:** pnpm's package-list diagnostic opens its store index outside the writable workspace, and the restricted shell cannot access that database. This does not by itself indicate a corrupt application lockfile or missing dependency.

**Resolved 2026-09-01:** rerun the read-only `pnpm list ... --depth 0` command in a permitted terminal. It confirmed the three installed Tiptap packages at 3.30.5. Do not edit or delete the store database manually.

## TypeScript references deleted App Router routes

**Symptom:** `npx tsc --noEmit` reports missing page or route modules under `.next/types/validator.ts`, even though those routes are absent from `src/app/`.

**Cause:** `.next` contains stale generated route types from an earlier source tree.

**Solution:** Run `npx next typegen`, then rerun `npx tsc --noEmit`. If generation itself remains stale, stop the development server and remove only the workspace `.next` directory before regenerating; never delete a broader directory.

**Observed 2026-08-31:** stale `/admin/cms` generated references caused the failure; `npx next typegen` refreshed the route graph and TypeScript then passed.

## Node strip-only tests reject a TypeScript parameter property

**Symptom:** a `node --experimental-strip-types` test fails with `ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX` and points to a constructor parameter such as `readonly status`.

**Cause:** Node's strip-only TypeScript loader removes erasable types but does not transform parameter properties because they require emitted JavaScript assignments.

**Resolved 2026-09-01:** declare the class property normally and assign it inside the constructor. This preserves runtime behavior and lets the focused Node test runner import the module without a transpilation step.

**Prevention:** files imported directly by the repository's strip-only test scripts must use erasable TypeScript syntax; avoid enums, namespaces, and constructor parameter properties in that import graph.

## Node strip-only tests cannot resolve an `@/` alias from a newly imported module

**Symptom:** `pnpm test:content` fails before running tests with `ERR_MODULE_NOT_FOUND: Cannot find package '@/data'`, after a test directly imports a repository module that itself uses Next.js path aliases.

**Cause:** Node's direct `--experimental-strip-types` runner strips TypeScript syntax but does not apply the Next.js bundler's `@/` resolution to the newly exposed import graph.

**Resolved 2026-09-02:** moved the catalog initialization predicate into dependency-free `src/lib/catalogMigration.ts` and imported that helper by a relative path from the test. The repository continues to consume it through the normal `@/lib/...` application alias, while the focused suite passed 17/17.

**Prevention:** keep utilities tested by the direct Node runner dependency-free or ensure every dependency in that test import graph uses Node-resolvable specifiers. Do not pull a route/repository graph into a unit test only to reach one pure predicate.

## TypeScript rejects a legacy catalog record passed to the migration helper

**Symptom:** `npx tsc --noEmit` reports `TS2345` because `Record<string, unknown>` is not assignable to a type requiring `catalogInitialized`, `products`, and `categories` properties.

**Cause:** legacy JSON is deliberately allowed to omit all three catalog keys, but the first helper signature used `Pick<Record<...>>`, which incorrectly made every selected key required.

**Resolved 2026-09-02:** the predicate now accepts a `Partial<Record<...>>` for those three known keys and continues narrowing each array at runtime. TypeScript and focused ESLint passed afterward.

**Prevention:** migration helpers must model the oldest accepted persisted shape, including absent keys; validate/narrow unknown JSON inside the helper instead of asserting the current schema prematurely.

## External images fail

**Symptom:** `next/image` says a hostname is not configured.

**Cause:** Host absent from `images.remotePatterns`.

**Solution:** Prefer local assets. Otherwise add the narrowest trusted host/protocol rule, restart, and document the dependency/security impact.

**Windows runtime variant observed 2026-09-05:** the configured UploadThing asset returned HTTP 200 directly, but `/_next/image` returned HTTP 500 because the local Node process did not inherit the trusted system CA chain. Start the local production server with PowerShell `$env:NODE_OPTIONS='--use-system-ca'; pnpm start`, or configure the approved CA through `NODE_EXTRA_CA_CERTS`. With the system CA enabled, the same optimized image returned HTTP 200. Do not disable TLS verification; production hosts must provide a valid trusted CA configuration.

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

**Gallery preview behavior:** a valid extra photo appears immediately with a `New` badge before submission. This confirms local selection only; UploadThing upload begins after Create/Update is pressed. If no preview appears, first resolve the inline size/type/count error.

## Gallery pending preview shows a broken image

**Symptom:** the pending card and `New` badge appear, but the selected image is replaced by its alt text.

**Cause:** the browser received an admin Content Security Policy whose `img-src` directive did not allow the local `blob:` URL used for the pre-upload preview.

**Resolved 2026-09-01:** the admin-only `img-src` directive now permits `blob:`. Restart the Next.js server after pulling the configuration change, then hard-refresh the admin form so the response contains the updated CSP header.

## Gallery lightbox arrow keys do nothing

**Symptom:** the lightbox arrow buttons work, but pressing the keyboard Left Arrow, Right Arrow, or Escape has no effect.

**Cause:** the viewer implemented pointer handlers but did not register a keyboard listener while open.

**Resolved 2026-09-01:** the lightbox now registers a temporary document keydown listener while open. Left/Right navigate only currently revealed photos, Escape closes the viewer, and cleanup removes the listener on close.

## Gallery detail URL shows a numeric ID

**Symptom:** a detail page opens at an address such as `/gallery/1` instead of a readable title-based URL.

**Cause:** Gallery cards and related links previously interpolated the record ID even though every album already has a validated slug.

**Resolved 2026-09-01:** all generated Gallery links and SEO outputs use the stored slug. Existing numeric URLs redirect to the canonical slug URL; restart/refresh the application if an old client bundle still generates numeric links.

## Blog/gallery changes disappear after deployment

**Symptom:** content resets to committed seed data after restart/redeploy or differs between instances.

**Cause:** `storage/content.json` is absent, ephemeral, read-only, or not shared. The current repository is designed for one writable persistent Node instance.

**Solution:** mount persistent writable storage for a single instance. Before using serverless or multiple replicas, replace `contentRepository.ts` with a shared database implementation and migrate the JSON document.

## Orphan content temporary files remain in storage

**Symptom:** ignored files named `storage/content-<uuid>.tmp` remain beside `storage/content.json` after an interrupted or failed content mutation.

**Cause:** content mutations write a unique temporary document before atomically renaming it. Older failure paths could leave that file behind, and a hard process termination can prevent all in-process cleanup from running.

**Resolved 2026-09-03:** failed writes and renames now make a best-effort removal of their own temporary path before rethrowing the original persistence error. Two verified stale local temp files were removed during repository cleanup; the active `storage/content.json` was not changed.

**Prevention:** do not broadly delete the `storage` directory. Confirm that no content mutation is active, preserve `content.json`, and remove only stale files matching the unique `content-<uuid>.tmp` naming convention. Production still requires persistent writable storage on one application instance.

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

## Production build cannot download Google fonts

**Symptom:** `next build` fails while resolving a `next/font/google` family even though application code compiled locally.

**Cause resolved 2026-09-05:** the root layout made the build depend on an external Google Fonts request, which is unavailable in restricted/offline deployment builders.

**Solution:** the storefront now uses local system sans/serif font stacks in `globals.css`; the root layout no longer imports remote font loaders. This removes the font request from the critical path and lets an offline builder compile the layout.

**Prevention:** if custom typography returns, self-host reviewed font files and preload only the required subsets/weights.

## Seed Product images return 404

**Symptom:** a first-run catalog card requests a missing file under `/images/products/` and renders broken alt text.

**Cause resolved 2026-09-05:** five seed records referenced cover files that were not committed to `public/images`.

**Solution:** missing seed covers now use the committed code-native `book-placeholder.svg`. The site-integrity suite checks literal public image references before release.

**Prevention:** run `pnpm test:site` whenever static asset paths or internal links change.

## Catalog heading is absent from initial HTML

**Symptom:** `/allproducts` looks correct after hydration but its first response has no `<h1>`, weakening non-JavaScript accessibility and SEO inspection.

**Cause resolved 2026-09-05:** `useSearchParams` lived below a Suspense boundary whose route fallback was the only initial server output.

**Solution:** the route Server Component now awaits `searchParams` and passes normalized initial filter values to the interactive catalog component. The heading and catalog content are rendered in the response.

**Prevention:** keep URL parsing in the Server Component when the same values define initial server-rendered content.

## Dependency audit cannot reach the registry on Windows

**Symptom:** `pnpm audit --prod` retries the npm advisory endpoint with TLS or connection errors in the restricted shell.

**Cause:** the environment either blocks registry network access or Node does not inherit the organization/system CA chain.

**Resolved 2026-09-05:** run the audit from a permitted terminal with Node's system CA enabled, for example PowerShell `$env:NODE_OPTIONS='--use-system-ca'; pnpm audit --prod`. Keep TLS verification enabled. The verified run reported no known vulnerabilities.

**Prevention:** give the CI audit explicit registry access and the approved CA configuration; never use `strict-ssl=false` or `NODE_TLS_REJECT_UNAUTHORIZED=0`.

## Node test scripts hit `spawn EPERM`

**Symptom:** a package test command starts Node's test runner but Windows denies its isolated child process.

**Cause:** the restricted environment blocks the default per-file test subprocess, matching the build-worker limitation documented above.

**Workaround verified 2026-09-05:** run the same TypeScript tests in one process with `node --experimental-strip-types --test --experimental-test-isolation=none tests/admin-auth.test.ts tests/content-management.test.ts tests/site-integrity.test.ts`. This passed all 32 tests; still keep the normal package scripts for unrestricted CI.

## pnpm reports an unexpected store location

**Symptom:** a dependency command reports `ERR_PNPM_UNEXPECTED_STORE` because `node_modules` is linked to a different pnpm store.

**Cause:** the active pnpm configuration selects a workspace-local store while the existing installation was linked from another known store location.

**Resolved 2026-09-01:** the cleanup reused the existing `D:\.pnpm-store\v11` location explicitly to update the manifest, lockfile, and installed graph. The failed first attempt's generated workspace `.pnpm-store/` cache was removed afterward.

**Prevention:** keep pnpm version/store configuration consistent for the workspace. If dependencies were intentionally moved to a different store, run a normal `pnpm install` instead of manually editing files inside `node_modules` or the store.
