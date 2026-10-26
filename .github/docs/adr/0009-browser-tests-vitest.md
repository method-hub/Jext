# 0009. Browser tests on Vitest Browser Mode with Playwright

- Status: accepted; "the other test types stay on Jest" superseded by [0010](0010-all-tests-vitest.md)
- Date: 2026-10-26

## Context

ADR 0005 put browser tests on Puppeteer and the webpack dev server. That setup never had a test, and webpack was
removed when Vite became the only bundler. Some behaviour of http exists only in a real browser: upload progress
through `XMLHttpRequest`, streams, the UMD file loaded with a `<script>` tag. jsdom cannot show it.

## Decision

Browser tests run on Vitest Browser Mode with the Playwright provider (`vitest.browser.config.ts`), in Chromium,
Firefox and WebKit. The code under test runs inside the browser, served by Vite with the same aliases as the builds.
Requests go to `/__test/echo`, a route the Vite server answers itself (`tests/support/browser-server.ts`), because a
browser cannot start a `node:http` server. Locations and naming stay as in ADR 0005. The other test types stay on
Jest for now.

## Consequences

Two test runners until the other types move to Vitest: browser tests import from `'vitest'`, the rest use Jest
globals. CI installs the three browsers (`npx playwright install --with-deps`). `tests:browser` builds the packages
first, so the UMD test checks the files npm publishes. The browser test server is shared by all browser tests, an
exception to self-contained files that the browser forces.

## Alternatives considered

- `@playwright/test`: drives pages from Node, so library code would have to be bundled into a page for each test.
- Puppeteer with jest-puppeteer: Chromium only and needs a separate dev server.
- Keep everything in jsdom: cannot show real XHR upload events, streams or the UMD file in a browser.
