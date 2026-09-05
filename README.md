# GTBS Book Store

Responsive e-commerce storefront and administration workspace for Gujarat Tract Book Store, built with Next.js, React, TypeScript, and Tailwind CSS.

Product sales are WhatsApp-assisted: Buy Now sends one Product with quantity/details/link, while the browser-local Cart sends multiple selected Products in one itemized message. Wishlist, Checkout, and customer-account pages are intentionally outside the storefront scope.

## Start locally

```bash
pnpm install
pnpm dev
```

Copy `.env.example` to `.env` and configure required values before using integrations or admin login. Never commit real environment values.

Blog and gallery image uploads require a server-only `UPLOADTHING_TOKEN`. Admin content metadata is persisted to `storage/content.json` on first mutation; the deployment filesystem must be writable and persistent.

For production admin credentials, run `npm run admin:setup` in a private interactive terminal, save the generated values in the deployment secret manager, and enroll the generated URI in an authenticator app. Production rejects plaintext `ADMIN_PASSWORD`.

## Quality checks

```bash
npx tsc --noEmit
pnpm test:admin-auth
pnpm test:content
pnpm test:site
pnpm lint
pnpm audit --prod
pnpm build
```

All repository lint, type, focused test, and production dependency audit checks currently pass. Windows sandbox environments may still block build/test child processes with `spawn EPERM`; see troubleshooting for the verified fallback checks.

## Documentation

Project knowledge is maintained in [`docs/README.md`](./docs/README.md):

- [Project overview](./docs/PROJECT_OVERVIEW.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [Project rules](./docs/RULES.md)
- [Code standards](./docs/CODE_STANDARDS.md)
- [Security](./docs/SECURITY.md)
- [Progress](./docs/PROGRESS.md)
- [Errors and solutions](./docs/TROUBLESHOOTING.md)

Every development change must update the relevant documentation. See [`AGENTS.md`](./AGENTS.md) for the repository working agreement.
