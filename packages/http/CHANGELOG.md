# @metapraxis/jext-http

## First public release

An HTTP client that returns the response already decoded by its Content-Type, as `{ data, error }`, and never throws.

- Requests: `http.get/head/delete/post/put/patch(url, options?)` return a request object that is sent when awaited,
  with `.headers()`, `.query()`, `.signal()`, `.keepalive()` and `.body()` (objects go as JSON); every setting can
  also be passed as an options object (`packages/http/adr/0005`). `http.send(url, init, options?)` stays for plain
  `fetch` arguments.
- Results: `{ data, error }`. 4xx/5xx, network errors, timeouts and undecodable bodies come back as `HttpError` with
  `status`, `response`, the decoded error body in `data` and `cause` (`packages/http/adr/0004`).
- Decoding by Content-Type: JSON, NDJSON, XML (`fast-xml-parser`), HTML, text, CSV/TSV (`string[][]`), `FormData`,
  `URLSearchParams`, media and PDF (`Blob`), binary, Server-Sent Events, and `null` for empty responses
  (`packages/http/adr/0002`). `.as(format)` picks the decoder instead, and the type of `data` follows it
  (`packages/http/adr/0006`).
- `.schema(schema)` validates the data with any Standard Schema v1 object (Zod, Valibot, ArkType…) and infers its
  type; a mismatch returns `ValidationError` with `issues` and `value`.
- Clients: `http.extend({ baseUrl, headers, timeout, retry, dedupe, hooks })` returns a new client; `beforeRequest`
  and `afterResponse` hooks run around every request (`packages/http/adr/0007`, `0010`).
- Reliability: `.timeout(ms)`, `.retry(n | { limit, methods, statuses, delay })` with `Retry-After`, and `.dedupe()`
  for identical GET and HEAD requests in flight.
- Progress: `.onUploadProgress()` (through `XMLHttpRequest`) and `.onDownloadProgress()` report
  `{ loaded, total?, percent? }` (`packages/http/adr/0008`).
- Streams: `http.sse(url, options?)` reads server events with `for await`, GET or POST, with
  `.reconnect()` and `Last-Event-ID`, `.json<T>()` for JSON data (`packages/http/adr/0009`).
- The request, option, result and error types are exported for annotations.
- 40 lessons solve the same task with jext, `fetch`, `XMLHttpRequest`, axios, ky and ofetch side by side
  (`/api/http/guide/` on the site), each checked by a test.
- JSDoc with `@example` on the public API.
