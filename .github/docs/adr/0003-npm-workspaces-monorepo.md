# 0003. Monorepo on npm workspaces

- Status: accepted
- Date: 2026-10-23

## Context

Packages share tooling (TypeScript, ESLint, Jest, Prettier) and depend on each other.

## Decision

One repository with npm workspaces `packages/*`, one lock file and root-level tooling configs. Packages are published as `@jext/<name>`; `packages/jext` aggregates them. Cross-package imports in source use path aliases (`@Collection/*`, `@Http/*`) declared in tsconfig, Jest, Vite and webpack.

## Consequences

One `npm ci`. Aliases must be kept in sync in four configs. Package versions must match what `packages/jext` depends on, or `npm install` fails.

## Alternatives considered

- pnpm / Turborepo / Nx: more tooling than the project needs today.
- Separate repositories: cross-package changes become multi-PR.
