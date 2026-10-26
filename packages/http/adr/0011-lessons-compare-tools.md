# 0011. Lessons compare jext with five tools against a lesson server

- Status: accepted
- Date: 2026-10-24

## Context

People choose an HTTP client by comparing it with what they already use. A comparison written by hand goes stale
and tends to flatter its author: an example for axios or ky that nobody runs may be wrong, or may hide a default
that changes the result (silent JSON parsing, automatic retries). The documentation site shows `examples/` as
`/api/http/guide/`, and the lessons should hold up when someone runs them.

## Decision

Each lesson is a folder `examples/NN.<subject>.<case>/` with six variants of one task, `jext.ts`, `fetch.ts`,
`xhr.ts`, `axios.ts`, `ky.ts`, `ofetch.ts`, each `export default async function run()`, plus `en.md` and `ru.md`
with the `<!-- @variants -->` line where the site puts the six variants as tabs. All variants talk to
`examples/server.ts`, a `node:http` server over `examples/__fixtures__` (separate from the fixtures of the tests),
started by `npm run examples:serve` on port 4000 and by the tests on a free port. One feature test per lesson,
`tests/Feature/Examples/Examples.<subject>.<case>.test.ts`, runs the six variants and expects the same value from
each. When a tool needs a non-default option to give that value (`retry: 0`, `responseType`), the variant sets it
and the lesson text says why. axios, ky and ofetch are exact-pinned devDependencies of `@jext/http`; they never
reach the published package.

## Consequences

A comparison cannot drift: a new version of a tool that changes behaviour fails the test of its lesson. A change
to a public method of jext must update the lessons that use it. Every lesson costs six variants and two texts.
jsdom's `XMLHttpRequest` accepts only jsdom's own `FormData`, `Blob` and `URLSearchParams`, so the form lessons
give those to the XMLHttpRequest and axios variants (`jsdomBodies` from the test environment).

## Alternatives considered

- Code samples in markdown without running them: they go stale and nobody notices.
- Each variant checked against a snapshot of its own output: proves that a variant runs, not that the tools agree.
- A separate private workspace for the lessons and their libraries: one more package to install and configure for
  files that belong to http.
- The test fixtures for the lessons: technical edge cases (`data.bin`, a one-field JSON) make poor lessons, and
  lessons would block changes to tests.
