# GTBS Book Store

Responsive e-commerce storefront and administration workspace for Gujarat Tract Book Store, built with Next.js, React, TypeScript, and Tailwind CSS.

## Start locally

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env` and configure required values before using integrations or admin login. Never commit real environment values.

For production admin credentials, run `npm run admin:setup` in a private interactive terminal, save the generated values in the deployment secret manager, and enroll the generated URI in an authenticator app. Production rejects plaintext `ADMIN_PASSWORD`.

## Quality checks

```bash
npx tsc --noEmit
npm run test:admin-auth
npm run lint
npm run build
```

The repository currently has known lint debt; see troubleshooting for details.

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
