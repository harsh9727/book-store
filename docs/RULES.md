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
- Storefront language/Google Translate effects mount only for public routes; admin routes remain outside that provider and third-party script lifecycle.
- Indian storefront prices use rupees and Indian formatting unless source data requires otherwise.
- Static or browser-local features must be labeled mock, demo, or local in documentation.
- Placeholder actions must not be described as complete functionality.
- Dynamic routes must handle unknown IDs safely, normally through Next.js not-found behavior.
- Products must reference an existing Category slug. Renaming a Category slug updates assigned Products atomically; Categories with assigned Products cannot be deleted.
- Home catalog sections, all-products filtering, product detail routes, category cards, and sitemap entries read through the catalog repository rather than importing mutable runtime arrays.

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
- Catalog/blog/gallery/testimonial admin APIs also require a verified admin session and bounded, strict Zod payloads.
- Category create/update accepts only name and slug. Category descriptions must not appear in the admin form/list or home-page Category cards; the optional stored field exists only for legacy file compatibility.
- Product create/update accepts one Price and no Original price. Badge is optional but, when present, must be one of Best Sellers, New Releases, Trending Products, or Accessories.
- Product specifications must be arbitrary bounded name/value rows rather than fixed book fields. Product variants must be optional named groups with product-specific options; do not hardcode Size, Color, Format, or any other group as universally required.
- New Product mutations must reject legacy fixed Format/book-detail fields. Existing stored Products may read those fields only for backward-compatible display and edit migration.
- Product create/edit must not expose or submit Available for sale, Stock count, Rating, or Reviews count. Their optional persisted fields exist only for legacy catalog compatibility until a separate inventory/review workflow is designed.
- Product create/edit and storefront Product surfaces must not expose or submit Brand / creator or Brand / creator details. Legacy `author` and `authorBio` fields remain optional at rest only so old content files validate.
- The Product form may create a missing Category from an Add category modal only through the existing protected Category API; after success, the returned Category must be added to the selector and selected without requiring a page reload.
- Blog banners, Gallery covers/photos, and Product card/detail images accept JPG, PNG, or WebP only, with a 500 KiB maximum per image. A Product may have one card image and at most 6 extra detail images.
- Product detail-image selections must preview before save, support individual removal, and include the card image first on the public detail gallery. Managed images removed during update/delete receive best-effort provider cleanup.
- Product Core details must stack on mobile and use two columns from `sm` upward, pairing Slug/Category and Badge/Price without horizontal overflow.
- Product create/update pages must place an English/Gujarati content selector directly beside `Back to list`. Switching language must preserve unsaved values and swap Title, Specifications, Variants, Short description, Detailed overview, and Features; Slug, Category, Badge, Price, and images remain shared.
- Product mutations require separate English and Gujarati titles. Selecting Gujarati on the storefront must immediately use saved Gujarati Product text across cards, catalog title search, detail breadcrumbs, product information, variants, overview/features, specifications, and related cards. Authored Gujarati values must not be machine-translated again; legacy Products without the block retain translation fallback.
- A gallery can contain at most 12 extra photos; the cover image is separate from that limit.
- Blog and Gallery index routes must open on their list table, keep admin navigation visible, place Add above the table, and expose View, Edit, and Delete actions for each row. Add and Edit must use separate protected `/add` and `/[id]/edit` pages rather than inline forms.
- Blog and Gallery tables show at most 8 rows per page, support case-insensitive text search and category filtering, and reset to page 1 whenever either filter changes.
- Blog and Gallery create, update, delete, and mutation failures must display an admin toast. Destructive table actions must use the shared confirmation modal and must not call the API until the admin explicitly confirms.
- Blog Article content uses the Tiptap editor and persists only bounded, allow-listed rich-text JSON. Public formatting must render through explicit React components rather than unsanitized HTML, and legacy section-only posts must remain readable/editable.
- Blog create/update forms require separate authored English and Gujarati title, category, author name/role, and rich article content. Slug, date, banner, and avatar remain shared between languages.
- Blog create/update pages must place the shared English/Gujarati selector beside `Back to list` and display only the selected language card while preserving both languages' unsaved fields/editor state. Shared Slug, Date, Banner image, and Author avatar controls stay visible together in the Common fields card. Save validation must reveal the language containing missing required content.
- Gallery create/update pages must place the same selector beside `Back to list` and display only the selected language card while preserving both languages' unsaved values. Common Slug/Date and Gallery images remain visible; each language requires title, category, location, and description while organizer is optional. Save validation must reveal missing content in the appropriate language. Subtitle must not appear in or be accepted by Gallery CRUD.
- Selecting Gujarati must immediately use saved Gujarati Gallery content across list search/categories, album cards, detail pages, breadcrumbs, organizer credit, and related albums. Stored Gujarati text must not be machine-translated again; legacy records without Gujarati data retain the existing translation fallback.
- Gallery cover and extra-photo controls, their inline errors, and photo previews stay together in the Gallery images card.
- Selecting Gujarati must immediately use saved Gujarati Blog content across home cards, the Blog list/search/categories, detail pages, breadcrumbs, and related articles. Stored Gujarati text must not be machine-translated again; legacy records without Gujarati data retain the existing translation fallback.
- Testimonial admin must provide a searchable, eight-row paginated list with Add, Edit, and confirmation-based Delete actions. Add/Edit must use protected standalone routes and the shared language selector beside `Back to list`.
- Testimonial forms require separate English and Gujarati customer name, role, and testimonial text, plus one shared integer Rating from 1 through 5. Switching language must preserve unsaved values, and save validation must reveal missing content in the appropriate language.
- The homepage Testimonial carousel must read repository data, render each saved Rating, switch reactively to authored Gujarati content without retranslating it, and render no Testimonial section when the persisted list is empty.
- Client image type, size, and gallery-count validation messages must render below the file input that caused them, with accessible invalid-state attributes; do not place these field errors only in a form-level banner.
- Valid pending Gallery photos must show an immediate removable preview marked `New`. Repeated selections append until the combined retained-plus-pending count reaches 12; temporary preview URLs must be revoked when no longer used.
- Public Gallery detail pages display at most 8 photos initially in a responsive 1/2/4-column grid. View more reveals the next batch, and the lightbox must navigate only photos currently revealed to the visitor.
- While the public Gallery lightbox is open, Left Arrow and Right Arrow navigate the revealed photo set and Escape closes it; keyboard listeners must be removed whenever the viewer is closed.
- Public Gallery detail links and SEO URLs must use the stored title-derived slug. A resolvable non-canonical identifier must redirect to that slug URL; an unknown identifier returns not found.
- Admin sidebars expose only implemented destinations: Overview, Products, Categories, Blogs, Gallery, and Testimonials. Do not show placeholder navigation for unavailable modules.
- Persisted content mutations go through `contentRepository.ts`; UI and route handlers do not write the content file directly.
- Production admin auth must fail closed when the password hash, MFA secret, HTTPS origin, or strong session secret is missing.
- Never weaken or bypass login throttling for UI convenience; distributed deployments add a shared host/WAF limit.

## Git and files

- Never commit `.env`, generated output, credentials, or tokens.
- Do not overwrite unrelated user work.
- Avoid destructive Git/filesystem actions without authorization.
- Keep `.next/` and TypeScript build output out of source changes.
