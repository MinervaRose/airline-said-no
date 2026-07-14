# Airline Said No

An OpenAI Build Week project that gives travellers an explainable second
opinion on airline compensation and reimbursement refusals.

## Requirements

- Node.js 22 or later
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
