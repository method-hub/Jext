# 0005. Test types and where they live

- Status: accepted; the Browser runner superseded by [0009](0009-browser-tests-vitest.md), the Jest runner by
  [0010](0010-all-tests-vitest.md)
- Date: 2026-10-23

## Context

Tests were split between the root `tests/Unit` and package folders, and package-level tests were not picked up by any Jest config.

## Decision

Five test types, each with its own root Jest config extending `jest.config.cjs`:

| Type | Meaning | Location |
| --- | --- | --- |
| Unit | One function or class, everything else stubbed | `packages/<pkg>/tests/Unit` only |
| Integration | A package against an outside system, simulated locally (fixtures, local servers). Tests never reach the internet | `packages/<pkg>/tests/Integration` |
| Feature | Parts working together: a package's modules, or whole packages (http → collection) | `packages/<pkg>/tests/Feature`, `tests/Feature` |
| Browser | Real browser via Puppeteer and the webpack dev server | `packages/<pkg>/tests/Browser`, `tests/Browser` |
| Performance | Timings logged for comparison, never a CI gate | `packages/<pkg>/tests/Performance/*.perf.test.ts` |

Tests run in jsdom with the Node Fetch API copied in (`tests/support/jsdom-with-fetch.cjs`).

Test files are named `<Subject>.<case>.test.ts`, one file per scenario (one per class for unit tests), and each
file is self-contained: it builds its own objects and mocks, with no shared test helpers.

## Consequences

Each package owns its tests; the root keeps only cross-package scenarios. `pre-push` runs unit, integration and feature tests.

## Alternatives considered

- Shared helpers in `tests/support`: less repetition, but a reader has to open another file to see the setup.
- One test per file: slower runs (an environment per file) and no table-driven `it.each`.

- Benchmark library (tinybench) for performance: can be added later; Jest timing is enough while there are few such tests.
