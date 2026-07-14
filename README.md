# Airline Said No

An OpenAI Build Week project that gives travellers an explainable second
opinion on airline compensation and reimbursement refusals.

## Requirements

- Node.js 22.x
- npm

## Local development

1. Copy `.env.example` to `.env.local`.
2. Add the required server-side credentials.
3. Install dependencies with `npm install`.
4. Start the development server with `npm run dev`.

The application is available at `http://localhost:3000`.

## Scripts

- `npm run dev` starts the local development server.
- `npm run build` creates a production build.
- `npm run start` serves the production build.
- `npm test` runs the component and validation test suite once.
- `npm run test:watch` runs tests in watch mode.
- `npm run lint` runs ESLint with zero warnings allowed.
- `npm run typecheck` runs strict TypeScript checks.
- `npm run format` formats supported files with Prettier.
- `npm run format:check` checks formatting without changing files.
- `npm run check` runs formatting, linting, and type checks.

## Source structure

- `src/app` contains App Router routes, layouts, and global styles.
- `src/components/mascot` contains the reusable Captain WorthATry asset.
- `src/components/ui` contains reusable, product-agnostic interface primitives.
- `src/config` contains typed application and environment configuration.
- `src/features` contains product features with their logic, styles, and tests.
- `src/styles` contains shared semantic design tokens.

Additional folders should be introduced with the feature that needs them rather
than as empty placeholders.

## Environment variables

Environment variables are read through `src/config/env.ts`. Private variables
must only be imported by server-side modules. The committed `.env.example`
documents required keys without containing secrets.

- `OPENAI_API_KEY` is required and must remain server-only.
- `OPENAI_MODEL` is optional and defaults to the approved `gpt-5.6` alias.

## Vercel deployment readiness

The Next.js application and Node.js API routes are Vercel-compatible. Uploads
are limited to 4 MB, intentionally below Vercel Functions' 4.5 MB request-body
limit to leave room for multipart overhead. Files remain request-scoped and are
sent directly to the analysis route without a storage service.

No `vercel.json` file is required. Vercel detects the Next.js framework,
package scripts and Node.js API routes without additional configuration. The
repository pins Vercel builds and functions to Node.js 22.x through
`package.json`.

Prepare and deploy with:

```powershell
npm.cmd ci
npm.cmd run check
npm.cmd test
npm.cmd run build

npx.cmd vercel link
npx.cmd vercel env add OPENAI_API_KEY production
npx.cmd vercel env add OPENAI_MODEL production
npx.cmd vercel pull --yes --environment=production
npx.cmd vercel build --prod
npx.cmd vercel deploy --prebuilt --prod
```

The `vercel env add` commands prompt for each value without placing it in shell
history. Use `gpt-5.6` for `OPENAI_MODEL`, or omit that variable to use the
application default. Do not place either variable in a `NEXT_PUBLIC_` variable.
