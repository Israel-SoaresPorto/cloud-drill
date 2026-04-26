# AGENTS.md

## Project Overview

CloudDrill is a web application for AWS Certified Cloud Practitioner (CLF-C02) exam practice.
The app runs 100% in the browser, using local JSON questions, a domain-based quiz flow, and a results screen with score tracking.

Main stack:
- React 19
- TypeScript (strict)
- Vite 7
- Tailwind CSS 4
- Zustand (state and persistence)
- React Router 7
- Vitest + Testing Library

## Setup and Basic Commands

Prerequisites:
- Node.js 20+
- pnpm

Install dependencies:
```bash
pnpm install
```

Development:
```bash
pnpm dev
```

Production build:
```bash
pnpm build
```

Preview build:
```bash
pnpm preview
```

Quality checks:
```bash
pnpm lint
pnpm typecheck
pnpm format
```

## Development Workflow

- Use `pnpm` as the package manager.
- Import alias `@/*` maps to `src/*`.
- Prefer absolute imports with `@/` for internal modules.
- Main routing is defined in `src/routes/app-router.tsx`.
- Keep shared components in `src/components/`.
- Keep business logic and utilities in `src/lib/`.
- Keep feature stores in `src/features/**/stores/`.

## Architecture (Quick Map)

- `src/components/`: shared UI (layout, base UI, dialogs, wrappers)
- `src/features/quiz/`: quiz flow components and store
- `src/features/result/`: result components and store
- `src/routes/`: route definitions
- `src/lib/`: domain functions (quiz, result, utilities)
- `src/types/`: typed contracts
- `src/data/`: local questions dataset
- `test/`: unit and component tests

## Testing

Run tests in watch mode:
```bash
pnpm test
```

Explicit watch mode:
```bash
pnpm test:watch
```

Single run (CI/local non-watch style):
```bash
pnpm vitest run
```

Coverage:
```bash
pnpm test:coverage
```

Run a specific test file:
```bash
pnpm vitest run test/components/layout/header.test.tsx
```

Important notes:
- Test environment: `jsdom`
- Global setup: `test/setup.ts`
- Test file pattern: `test/**/*.test.{ts,tsx}`

## Code Conventions

- TypeScript runs in `strict` mode.
- Avoid `any`; prefer explicit types and contracts in `src/types/`.
- Keep domain functions pure in `src/lib/` whenever possible.
- Follow ESLint rules before finishing any change.
- When behavior changes, add/update tests in the same functional area.

Naming conventions:
- React components: `kebab-case` for file names and `PascalCase` for exported symbols.
- Stores: `.store.ts` suffix.
- Tests: mirror `src/` structure under `test/` whenever it makes sense.

## Important Domain Contracts

- `QuizConfig` uses the `distribution` property (do not use typo variants).
- Current quiz passing rule: `score >= 70`.

## Pre-Delivery Checklist

Run at least:
```bash
pnpm lint
pnpm typecheck
pnpm vitest run
```

If there is relevant logic/UI change, also run:
```bash
pnpm test:coverage
```

## PR Guidelines for Agents

- Keep changes small and focused.
- Do not refactor unrelated files unless necessary.
- Update tests together with code changes.
- In the final summary, describe:
  - what changed
  - why it changed
  - how to validate locally

## Quick Troubleshooting

- If alias resolution fails, validate `@/*` in `tsconfig.app.json` and `vitest.config.ts`.
- If a test fails due to accessibility in custom radio inputs, prefer querying by role with visible name.
- If `pnpm test` stays in watch mode, use `pnpm vitest run` for a single execution.
