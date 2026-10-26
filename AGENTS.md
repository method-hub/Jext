# AGENTS.md

Single source of truth for AI agents working on Jext. `CLAUDE.md` and `GEMINI.md` only import this file, and
Cursor reads it natively. Edit instructions here, not in the pointer files. Package specifics live in
`packages/<pkg>/AGENTS.md`.

## Project

Jext is a TypeScript monorepo of strictly typed utilities, data structures and extensions for web development,
with no runtime dependencies unless an ADR allows one.

| Package               | Status     | What it is                                                                                     |
| --------------------- | ---------- | ---------------------------------------------------------------------------------------------- |
| `packages/collection` | active     | `collection(value)` wraps a value into a typed chainable object (Array, String, Number, Object, Set, Map) |
| `packages/http`       | active     | HTTP client: `http.send(url)` fetches and parses the response by Content-Type                   |
| `packages/jext`       | active     | Aggregator: `index.ts` re-exports `collection` and everything `http` exports                   |
| `website`             | tooling    | Documentation site (VitePress + TypeDoc) built from the packages; not published to npm         |

Published to npm as `@metapraxis/jext-collection`, `@metapraxis/jext-http` and `@metapraxis/jext` (ADR 0008).

## Goal

Every package exists to beat the best-known libraries of its kind on developer experience and on speed. Write code
that is fast and elegant at once, and prove both:

- A new or changed hot method gets a performance test against the competitors in `packages/<pkg>/tests/Performance`
  (collection: lodash, es-toolkit, remeda, ramda). It must be no slower than before and no slower than them; put the
  numbers in the pull request.
- The API must take less code and read more clearly than the alternatives for the same task. For http the lessons in
  `examples/` show it next to fetch, XMLHttpRequest, axios, ky and ofetch; a new behaviour worth showing gets a lesson.
- Do not trade one for the other silently: elegance that costs speed, or speed that costs a clear API, is a decision
  and gets an ADR with the numbers.

Human-facing docs are bilingual: `.github/docs/en/` and `.github/docs/ru/`. Start with
`.github/docs/en/ARCHITECTURE.md` for how the monorepo, aliases, tests and builds fit together.

## Commands

Run everything from the repository root. Node >= 22, npm >= 10.

| Command                     | What it does                                                                |
| --------------------------- | --------------------------------------------------------------------------- |
| `npm ci`                    | Install all workspaces                                                      |
| `npm run lint` / `lint:fix` | ESLint 9 (flat config `eslint.config.cjs`) over `packages/`                  |
| `npm run prettier` / `:fix` | Prettier check / write over `packages/**/*.ts`                              |
| `npm run tests:unit`        | Unit tests from `packages/*/tests/Unit`                                     |
| `npm run tests:integration` | Integration tests from `packages/*/tests/Integration`                       |
| `npm run tests:feature`     | Feature tests from `tests/Feature` and `packages/*/tests/Feature`           |
| `npm run tests:browser`     | Builds the packages, then Vitest in Chromium, Firefox, WebKit (`-- --project chromium` for one) |
| `npm run tests:performance` | Timing tests from `packages/*/tests/Performance` (not part of `tests`)      |
| `npm run tests`             | unit + integration + feature + browser in parallel                          |
| `npm run tests:guardian`    | unit + integration + feature (what the pre-push hook runs)                  |
| `npm test -w @metapraxis/jext-<pkg>`   | One package's unit + integration + feature tests                            |
| `npm run tests:http`        | The same for http from the root (`tests:collection` for collection)         |
| `npm run typecheck`         | `tsc --noEmit` over `packages/`: sources, tests, lessons, configs           |
| `npm run build` in a pkg    | `vite build` (`dist/index.mjs`, `index.cjs`, `types/`) + `vite build --mode umd` (`index.umd.js`, self-contained) |
| `npm run packages:build`    | Builds http, collection, then jext (the aggregator's types need theirs)     |
| `npm run pack:dry` / `publish:dry` | Builds and shows what npm would pack / publish; nothing is written  |
| `npm run changeset`         | Adds a release note to `.changeset/` (which packages, patch/minor/major)    |
| `npm run release:status`    | Lists pending changesets and the bumps they make                            |
| `npm run release`           | Build + `changeset publish`: **CI only** (`release.yml`), never run it locally |
| `npm run examples:serve -w @metapraxis/jext-http` | The lesson server of `packages/http/examples` on `localhost:4000`      |
| `npm run docs:check`        | Checks every site package has README, RUADME, en/ru docs, ADR index         |
| `npm run docs:build`        | check + TypeDoc reference + collect + VitePress build into `website/.vitepress/dist` |
| `npm run docs:dev`          | The same site with hot reload on `localhost:5173` for writing docs          |
| `npm run docs:preview`      | Serves the last `docs:build` on `localhost:4173`, exactly as it will be published |

Known problems in the code, do not "fix" the tooling to hide them: `.github/docs/en/ARCHITECTURE.md#known-problems`.

## Where things go

| What                                  | Where                                                              |
| ------------------------------------- | ------------------------------------------------------------------ |
| Source code                           | `packages/<pkg>/src`                                               |
| Unit tests (one module in isolation)  | `packages/<pkg>/tests/Unit` only, never in the root                |
| Integration tests (external systems)  | `packages/<pkg>/tests/Integration`, fixtures in `__fixtures__/`    |
| Feature tests, package level          | `packages/<pkg>/tests/Feature`: the package's modules together     |
| Feature tests, system level           | `tests/Feature`: packages together (http response → collection)    |
| Browser tests (Vitest + Playwright)   | `tests/Browser` and `packages/<pkg>/tests/Browser`                 |
| Performance tests                     | `packages/<pkg>/tests/Performance/*.perf.test.ts`                  |
| Shared test environment               | `tests/support` (jsdom with fetch, the browser test server; no test helpers) |
| Package readme (English / Russian)    | `packages/<pkg>/README.md` / `packages/<pkg>/RUADME.md` (the name is deliberate, never rename it) |
| Package architecture, diagrams        | `packages/<pkg>/docs/{en,ru}/ARCHITECTURE.md`                      |
| Package decisions (ADR)               | `packages/<pkg>/adr/NNNN-title.md`                                 |
| Lessons (one task, six tools)         | `packages/<pkg>/examples/NN.<subject>.<case>/{jext,fetch,xhr,axios,ky,ofetch}.ts`, `en.md`, `ru.md` |
| Lesson index, server, fixtures        | `packages/<pkg>/examples/{README.md,RUADME.md,server.ts}`, `examples/__fixtures__/` (not the test fixtures) |
| Lesson tests                          | `packages/<pkg>/tests/Feature/Examples/Examples.<subject>.<case>.test.ts` |
| Repository docs                       | `.github/docs/{en,ru}/`                                            |
| Contributing preview (GitHub tab)     | `CONTRIBUTING.md` in the root; full guides in `.github/docs/{en,ru}/CONTRIBUTING.md` |
| Repository decisions (ADR)            | `.github/docs/adr/NNNN-title.md`                                   |
| Changelog                             | `packages/<pkg>/CHANGELOG.md`, written by changesets on release    |
| Release notes for the next release    | `.changeset/*.md` (`npm run changeset`)                            |
| CI/CD workflows, release process      | `.github/workflows/`, `.github/docs/{en,ru}/RELEASING.md`          |
| Skills for using the Jext libraries   | `skills/` (reserved, empty for now; not instructions for this repo) |
| Cursor rules                          | `.cursor/rules/*.mdc`                                              |
| Documentation site (config, scripts)  | `website/`; pages are generated into `website/.content/`, never edit or commit them |

## Code conventions

- Import across a package through aliases: `@Collection/*`, `@Http/*`. They are defined in `tsconfig.json`
  (types), `vitest.config.ts` (every test type; `vitest.browser.config.ts` imports it), `packages/<pkg>/vite.config.ts`
  (its build) and `packages/jext/vite.config.ts` (the UMD file of the aggregator bundles every package from source).
  A new alias goes into all four.
- 4-space indent, single quotes, 120 columns (`.editorconfig`, `.prettierrc.cjs`). Config files use 2 spaces.
- JSDoc on every class, interface, type alias and method, public or internal: `@summary`, `@description` when
  useful, `@param` for each parameter, `@returns` unless it returns `void`, `@throws` for a deliberate throw. An
  interface property gets a one-line `/** … */`. No types in braces: the TypeScript signature is the type, and
  `.d.ts` carries it to JavaScript users too. A member that implements a documented interface member may use
  `/** @inheritDoc */` instead.
- Public API means everything exported from `packages/<pkg>/index.ts`, plus the methods of the interfaces it
  returns (for http: `http`, `Http`, `HttpError`, `ValidationError`, `HttpRequest`, `BodyRequest`,
  `StreamRequest`). Public API also needs `@example`: a short call of 1–5 lines that would compile. Internal
  classes (`Picker`, `Delivery`, parsers…) do not.
- `@deprecated <replacement>` before a public method is removed; `@since <version>` on public methods added after
  1.0.0.
- Changing a public method means updating its JSDoc and every example that uses it, in the same commit, including
  the lessons in `examples/` (variants and both texts). A new behaviour worth showing gets a new lesson with all six
  variants.
- `eslint-plugin-jsdoc` checks all of this in `eslint.config.cjs` (`jsdoc/require-example` only on the public API
  files listed there). It covers `packages/http` and `packages/collection` (for collection every ladder class is public
  API). A new public API file goes into that list.
- Values are immutable: methods copy (`[...this.value]`) and return a new wrapper, never mutate.
- One class per file, default export, file named after the class.
- Every class member has an explicit `public`, `protected` or `private` (ESLint
  `explicit-member-accessibility`; constructors have none). No `#private` fields. Keep `readonly` on fields that
  never change.
- No runtime dependencies. `fast-xml-parser` in http is the only exception (ADR 0004).
- Do not change public method names or return types without an ADR.

Before touching a package, read its `AGENTS.md` and `docs/en/ARCHITECTURE.md`.

## Tests

Types (ADR 0005): **unit** checks one function or class with everything else stubbed. **Integration** checks a
package against something outside the code: for http, real requests to a local `node:http` server started in the
test file, which serves `__fixtures__`. Tests never reach the internet. **Feature** checks parts working
together: inside a package its modules, in the root whole systems. **Browser** checks what only a real browser
shows (XHR upload progress, streams, the UMD file in a `<script>` tag), in Chromium, Firefox and WebKit.
**Performance** measures and logs timings and never gates CI.

- **Every change comes with tests in the same commit.** New behaviour gets new test files. An existing test is
  rewritten only when the API it covers changes or is modified; otherwise it stays as it is and new tests go next
  to it.
- Granular layout: a folder per subject, a file per scenario, one `it` per file:
  `tests/<Type>/<Subject>/<Subject>.<method>.<case>.test.ts` (`Unit/Parsers/JsonParser/JsonParser.parse.accept.test.ts`,
  `Feature/Bootstrap/Bootstrap.csv.test.ts`, `Integration/Http/Http.send.connection-dropped.test.ts`). `it.each`
  is fine for one scenario over several inputs.
- **A dot in a test file name means a scope.** Every segment between dots is one level, from the widest to the
  narrowest: subject, method, then each narrower case. A hyphen only joins the words of one segment.
  `Bootstrap.attachment.csv.test.ts` is subject `Bootstrap` › scope `attachment` › case `csv`, next to
  `Bootstrap.attachment.json.test.ts`; `Http.send.error.body.undecodable.test.ts` is `Http` › `send` › `error` ›
  `body` › `undecodable`. So `Bootstrap.attachment-csv` is wrong: `csv` is a narrower scope of `attachment`, not
  part of its name. `Http.send.connection-dropped` is right: one case named with two words. A lesson test is named
  after its folder without the number: `examples/20.error.not-found` → `Examples.error.not-found.test.ts`, one
  `it.each` over the six variants. Vitest only picks up names that end with `.test.ts`; performance
  tests end with `.perf.test.ts`.
- Names read as a sentence: `describe('<Subject>.<method> should <result>')` and `it('when <condition>')`, so the
  report says "JsonParser.parse should accept the response › when Content-Type is application/json". The expected
  result goes into `describe`, the condition into `it`.
- Every subject gets negative cases next to the positive ones: rejected input, thrown or rejected errors, a broken
  stream or connection, an empty value, a callback that must not run. Errors from another realm (fetch, jsdom) are
  checked by name: `rejects.toHaveProperty('name', 'SyntaxError')`, not `toThrow(SyntaxError)`.
- Arrange-Act-Assert: setup, a blank line, the one call under test, a blank line, the expectations.
  `expect(actual).toEqual(expected)`, never the other way round.
- Every test file is self-contained: no shared helpers or test modules. Build real objects (`new Response(...)`,
  `new FormData()`) in the file. Because a file holds one scenario, its setup may live in `beforeEach`: mock
  `fetch` there with `vi.spyOn(globalThis, 'fetch')` and restore it in `afterEach(() => vi.restoreAllMocks())`.
  Integration files start their `node:http` server in `beforeAll` and close it in `afterAll`.
- Every test type runs on Vitest (ADR 0010): import `describe`, `it`, `expect`, `vi` (and `type Mock`,
  `type MockInstance`) from `'vitest'`; there are no globals.
- Tests run in plain Node. A file that needs the DOM or XHR (`DOMParser`, `XMLHttpRequest`, the lessons) starts with
  `// @vitest-environment jsdom-with-fetch` and a blank line: jsdom with the Fetch API of Node
  (`tests/support/jsdom-with-fetch.ts`). Do not add it to a file that runs without it: jsdom makes a file
  several times slower.
- A browser cannot start a server, so browser tests send requests to `/__test/echo` on the same origin
  (`tests/support/browser-server.ts`: it answers with `{ method, path, headers, received }`, or with `?status=`,
  `?type=`, `?body=`). Write a browser test only for what jsdom cannot show; everything else stays a Node test.
- Declare types explicitly wherever the API takes a generic: `http.send<{ id: number }>(url)`,
  `new JsonParser<{ id: number }>()`, `new Root<string>()`.
- Import code through `@Collection/*` / `@Http/*`, like the source does.

## Documentation

- Human docs exist in English and Russian (`en/`, `ru/`) with the same sections in the same order; each file
  links to the other language at the top. Change both in the same commit. Agent files (`AGENTS.md`,
  `.cursor/rules/`, ADRs) are English only.
- Diagrams are Mermaid code blocks with class and method names exactly as in code, identical in both languages.
- The documentation site is built from these files, so the source is the only place to edit: `README.md` and
  generated JSDoc become `/api/<pkg>/`, `RUADME.md` becomes `/ru/api/<pkg>/`, `docs/{en,ru}/ARCHITECTURE.md` and
  `adr/` become `/dev/<pkg>/`, `.github/docs/` becomes the home page and `/dev/repo/`. Link between docs with
  relative paths to files (`../adr/README.md`); the site turns them into routes and fails the build on a dead one.
  The API reference and ADRs exist in English only. How it works: `.github/docs/en/ARCHITECTURE.md#documentation-site`.
- A package appears on the site when it is listed in `website/site.config.mjs` and has `index.ts`, `README.md`,
  `RUADME.md`, `docs/{en,ru}/ARCHITECTURE.md` and `adr/README.md`. `packages/collection` is not on the site yet.
- Lessons (`packages/<pkg>/examples/`) become `/api/<pkg>/guide/`: the line `<!-- @variants -->` of `en.md` /
  `ru.md` turns into six tabs. Every variant returns the same value, checked by the lesson's feature test; a claim
  about another tool in a lesson text must be checked against its documentation or source. How lessons work:
  `packages/http/docs/en/ARCHITECTURE.md#lessons-examples`.
- After a change to code or docs, `npm run docs:build` must pass: TypeDoc fails on an exported type that is not
  exported from `index.ts`, on a broken `{@link}` and on a public member without a comment.
- **If you change an architectural concept** (class hierarchy, the parser chain, how packages fit together,
  aliases, test layout, build), update the matching `ARCHITECTURE.md` in the same change, in both languages:
  `.github/docs/{en,ru}/ARCHITECTURE.md` for the repository, `packages/<pkg>/docs/{en,ru}/ARCHITECTURE.md` for a
  package.

## Decisions (ADR)

- Write an ADR only for a decision that changes the architecture or how the project is used: structure or
  patterns, package boundaries, public API or return types, a new dependency, a choice between real
  alternatives. Never for bug fixes, renames, refactors inside a module, lint fixes, new tests or doc edits.
- A decision that affects more than one package, the tooling or the process goes to `.github/docs/adr/`;
  anything else to `packages/<pkg>/adr/` (create the folder with its first ADR). Numbering starts at `0001` in
  each place.
- Copy `.github/docs/adr/0000-template.md`, keep it to one page, add the ADR to the index (`README.md`) of its
  folder. Accepted ADRs are not edited: a new ADR supersedes the old one, which gets `Superseded by …`.

## Commits and changes

- Conventional Commits, checked by commitlint. Types: `feat fix docs style refactor test chore ci perf`.
  Scopes: areas `main docs deps ci format git other`, packages `collection http jext`
  (`commitlint.config.cjs`; meanings in `.github/docs/en/CONTRIBUTING.md`). Agent files and `skills/` go under `docs`.
- Hooks (husky): `pre-commit` runs lint-staged (eslint --fix + prettier on staged `packages/**/*.ts`),
  `commit-msg` runs commitlint, `prepare-commit-msg` adds `Authored-by`, `pre-push` runs `tests:guardian`.

## Versions and releases

How it works step by step: `.github/docs/en/RELEASING.md`; the decision: `.github/docs/adr/0008-versioning-and-releases.md`.

- Every user-visible change comes with a changeset in the same pull request: `npm run changeset`, or write
  `.changeset/<short-name>.md` by hand (front matter `'@metapraxis/jext-http': patch`, then one line for the
  CHANGELOG). SemVer per package: `patch` for fixes, `minor` for new behaviour, `major` for a breaking change (while
  a package is `0.x`, a breaking change is `minor`). Internal changes (tests, docs, tooling) need none.
- Never edit `version` in a `package.json` or write a version section in a `CHANGELOG.md` by hand: the release pull
  request that `release.yml` opens does both, and `@metapraxis/jext` follows the packages it depends on.
- Never run `npm publish` or `npm run release` and never create release tags: publishing happens only in CI, in
  `method-hub/Jext`, with provenance, when a version is not on npm yet.
- A package publishes only `dist/`, README, CHANGELOG and LICENSE (`files` in its `package.json`). A new runtime
  dependency stays external in its `vite.config.ts` and needs an ADR (0004).

## Definition of done

1. `npm run prettier` and `npm run lint` show no new problems in the files you touched (JSDoc included).
2. `npm run tests:guardian` passes; new behaviour has new tests, and old tests changed only where their API changed.
3. `ARCHITECTURE.md` and diagrams are updated, a user-visible change has a changeset, human docs in both `en/` and `ru/`; an ADR exists if
   the change is a decision (see above).
4. `.aiignore`, `.cursorignore` and `.geminiignore` stay identical if you edit one of them.
5. `npm run docs:build` passes when you touched a package on the site, its docs or `website/`.
