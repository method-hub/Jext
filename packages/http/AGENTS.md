# AGENTS.md — packages/http

Read the root `AGENTS.md` first. This file adds what is specific to `@metapraxis/jext-http`.

## What is inside

`index.ts` exports a ready client `http`, `HttpError`, `ValidationError` and the `Result`, `ServerEvent`, `Format`,
`Formats`, `StandardSchema`, `StandardIssue`, `InferOutput`, `Http`, `ClientOptions`, `Retry`, `RetryOptions`,
`Progress`, `ProgressListener`, `StreamRequest`, `StreamOptions`, `Reconnect`, `ReconnectOptions`, `Hooks`,
`Outgoing`, `BeforeRequest`, `AfterResponse` types and the request types `HttpRequest`, `BodyRequest`,
`RequestOptions`, `BodyRequestOptions`, `SendOptions`, `Query`, `QueryValue`, `Payload`, `Failure`, `Sender`,
`Streamer`, `StreamSettings`, `StandardProps`, `StandardResult`, `StandardTypes`. `http.send(url, init)`
calls `fetch` and hands the `Response` to `Root`, a Chain of Responsibility over the decoders in `src/Parsers`: the first decoder
whose `parse()` returns `true` decodes the response with `wrap()`, otherwise the result is an `ArrayBuffer`.
The order in `Bootstrap` is the priority. `http.get/post/put/patch/delete/head(url, options)` return a lazy,
immutable request object (`src/Request/FluentRequest.ts`) that calls `send()` when awaited (ADR 0005). `send()` never throws: it returns `{ data, error }`, with an
`HttpError` for an error status, a missing response or an undecodable body (ADR 0004). `.as(format)` makes
`Http` decode a 2xx response with `Picker` (one decoder per format, built in `Bootstrap` from the chain's
instances) instead of the chain; `.schema()` validates the decoded data through Standard Schema
(`src/Contract/StandardSchema.ts`, no library imported) and returns `ValidationError` on issues (ADR 0006).
`http.extend()` returns a new `Http` with shared `baseUrl`, `headers`, `timeout` and `retry`, applied in `send()`;
`Delivery` (`src/Delivery/`) sends each attempt through an internal `Transport` (`src/Transport/`): `FetchTransport`, or
`XhrTransport` when the request has an upload listener, with a timeout per attempt and retries decided by
`RetryPolicy` (ADR 0007, ADR 0008). Progress listeners get `{ loaded, total?, percent? }`.
`http.sse()` returns an `EventStream` (`src/Request/EventStream.ts`); its `for await` calls `Http.stream()`, which
opens connections through `fetch`, reads them with `SseParser` and reconnects with `Reconnection`; errors are thrown
from the loop (ADR 0009). The hooks of a client run in `HookRunner` and identical GET/HEAD requests in flight are
joined by `Inflight` (`src/Delivery/`, ADR 0010).

`examples/` holds the lessons: one task with jext, `fetch`, `XMLHttpRequest`, axios, ky and ofetch against the lesson
server `examples/server.ts` (ADR 0011). axios, ky and ofetch are devDependencies for the lessons only.

Read `docs/en/ARCHITECTURE.md` before changing `src/`: class diagram, request flow, the order of the chain, the
table of decoders and their return types, and the steps for adding a parser. Decisions: `adr/`.

The only runtime dependency is `fast-xml-parser` (XmlParser).

## Rules

- JSDoc: the public API files are `index.ts`, `src/Http.ts`, `src/Error/*.ts`, `src/Contract/HttpRequest.ts` and
  `src/Contract/StreamRequest.ts`; their public members need `@example` (listed in `eslint.config.cjs`). The full
  descriptions of the chain methods live on the interfaces `HttpRequest`, `BodyRequest` and `StreamRequest`;
  `FluentRequest` and `EventStream` use `/** @inheritDoc */`, so a change to a chain method is described once, on
  the interface.
- The package is on the documentation site: `README.md` and `RUADME.md` (Russian; keep both in step) are
  `/api/http/`, the JSDoc of `index.ts` is the API reference. A type that a public signature uses must be exported
  from `index.ts`, or `npm run docs:build` fails.
- A new or reordered parser updates the table and diagrams in `docs/{en,ru}/ARCHITECTURE.md`; a changed return
  type also needs an ADR in `adr/`. A parser that should be reachable through `.as()` also gets a key in
  `Formats` (`src/Contract/Format.ts`) and an entry in the `Picker` built by `Bootstrap`.
- Call `fetch` and `XMLHttpRequest` only inside `src/Transport/` (and `fetch` in `Http.open()` for one connection of
  `http.sse()`), and never mutate the settings of an `Http`:
  `extend()` returns a new one. The transport is internal: no public option selects it (ADR 0008).
- XHR tests swap `globalThis.XMLHttpRequest` for a fake class declared in the test file and restore it in
  `afterEach`; jsdom's own XHR is used only in integration tests. A file that touches XHR, `DOMParser` or a lesson
  starts with `// @vitest-environment jsdom-with-fetch`; the rest run in plain Node.
- Retry waits are tested with `vi.useFakeTimers()` and `retry: { delay: 0 }`; timeouts with a short real timeout
  and a `fetch` mock that rejects when its signal aborts (fake timers do not drive `AbortSignal.timeout`).
- Stream tests build the body with a `ReadableStream` whose `pull` gives one chunk and then calls
  `controller.error()` to simulate a drop (`error()` in `start` would discard queued chunks); reconnect waits use
  `reconnect({ delay: 0 })`. Dedupe tests delay the `fetch` mock with `setTimeout` so the requests overlap.
- Tests for schemas use inline Standard Schema objects (`{ '~standard': { version: 1, vendor: 'test', validate } }`),
  never a schema library.
- Unit tests call a parser's `parse()` / `wrap()` on a real `Response`, no `fetch`. Feature tests
  (`Bootstrap.<case>.test.ts`) check the chain with `fetch` mocked by `vi.spyOn` inside each test.
- Lessons: the six variants return one value, the same for every tool; set a non-default option (`retry: 0`,
  `responseType`…) when a tool needs it for that and explain it in `en.md` / `ru.md`. A variant imports only its tool
  and `API` from `../api` and declares its own types. Every variant handles a failure explicitly and alike: an error
  status becomes `Error('<status> <statusText>')` (axios, ky and ofetch catch their own error type in `run()`). The test starts `createLessonServer` on port 0, mocks
  `examples/api` with a getter and runs `it.each` over the six variants; form lessons give the XMLHttpRequest and
  axios variants `jsdomBodies`. Steps: `docs/en/ARCHITECTURE.md` › Lessons › Adding a lesson.
- Integration tests (`Http.<case>.test.ts`) start their own `node:http` server and serve `__fixtures__`. They never
  reach the internet.
