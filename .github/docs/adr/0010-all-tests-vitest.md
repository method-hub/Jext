# 0010. All tests on Vitest, in Node unless a file asks for jsdom

- Status: accepted
- Date: 2026-10-26

## Context

ADR 0005 ran unit, integration, feature and performance tests on Jest; ADR 0009 put browser tests on Vitest and left
the rest on Jest for now. Two runners meant two configs for the aliases, two mocking APIs (`jest.*` and `vi.*`),
`ts-jest` with `transformIgnorePatterns` for ky and ofetch (ES modules only), and an extra Jest config in every
package. Every Jest test ran in jsdom, although most of them need only the Fetch API that Node has.

## Decision

Every test type runs on Vitest. The root `vitest.config.ts` has one project per type (`unit`, `integration`,
`feature`, `performance`) and holds the aliases; `vitest.browser.config.ts` imports them. Test files import
`describe`, `it`, `expect` and `vi` from `'vitest'`; there are no globals. Tests run in plain Node. A file that needs
the DOM or XHR starts with `// @vitest-environment jsdom-with-fetch`, which an alias in `vitest.config.ts` points at
`tests/support/jsdom-with-fetch.ts` (jsdom with Node's Fetch API). Test types, locations and naming stay as in ADR
0005.

## Consequences

One runner, one mocking API, one place for the aliases of tests (four places in total instead of five). No transform
settings: Vite compiles TypeScript and ES modules. The 51 files that need jsdom carry the docblock; forgetting it fails
the test with `DOMParser is not defined` or `XMLHttpRequest is not defined`, so it cannot pass silently. The suite of
728 files takes about 80 seconds, against about four minutes with jsdom for every file. `jest`, `ts-jest`,
`@types/jest` and `jest-environment-jsdom` are removed.

## Alternatives considered

- Stay on Jest: keeps two runners next to the browser tests and the ES module transform settings.
- Vitest with jsdom for every file: no docblocks, but three times slower.
- A separate Vitest project for jsdom files chosen by glob: the list of files would live away from the tests, and the
  project names would no longer match the test types.
