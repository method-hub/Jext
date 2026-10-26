# 0006. JSDoc on every member, checked by ESLint

- Status: accepted
- Date: 2026-10-24

## Context

The documentation site will build its API reference from the code, and editors already show JSDoc on hover. In
`packages/http` almost every member had `@summary`, but only 10 had `@param` and 3 had `@returns`, some used types in
braces that TypeScript already knows, and nothing stopped a new method from having no comment at all.

## Decision

Every class, interface, type alias and method gets JSDoc with `@summary`, `@param` for each parameter and `@returns`
(interface properties get a one-line description); types are never written in braces. The public API, what
`packages/<pkg>/index.ts` exports and the methods of the interfaces it returns, also gets `@example`. A member that
implements a documented interface member may use `@inheritDoc`. `eslint-plugin-jsdoc` (dev dependency) enforces it
in `eslint.config.cjs`; `jsdoc/require-example` runs only on the public API files listed there. The check covers
`packages/http`; `packages/collection` joins after its own redesign. The rules for people and agents:
`.github/docs/{en,ru}/ARCHITECTURE.md` › JSDoc and `AGENTS.md` › Code conventions.

## Consequences

The API reference and editor hints stay complete, because a missing comment fails `npm run lint` and the pre-commit
hook. Every change to a public method also changes its JSDoc. A new public API file must be added to the
`require-example` list by hand.

## Alternatives considered

- A written rule without a check: it was the rule before, and most methods had no `@param` or `@returns`.
- TypeDoc validation only: it runs only when the site is built and cannot require `@param` or `@example`.
- `@example` on every member: noise on internal classes that users never call.
