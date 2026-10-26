# 0008. http: transports behind one interface, XHR for upload progress, progress without a known size

- Status: accepted
- Date: 2026-10-24

## Context

A file upload needs a progress bar. `fetch` cannot report upload progress in Firefox and Safari: a streaming
request body works only in Chromium and only over HTTP/2. `XMLHttpRequest` reports `upload.onprogress` in every
browser. Download progress can be counted with `fetch` by reading the body stream. Many responses have no
`Content-Length` (chunked or compressed), so the total is often unknown.

## Decision

- An internal `Transport` interface: `send(url, init): Promise<Response>`. `FetchTransport` is the default;
  `XhrTransport` is used only when the request has an upload listener, `XMLHttpRequest` exists and the URL is not a
  `Request` object. `Delivery` picks the transport per request and keeps the timeout and retries for both.
- The transport stays internal for now: no `extend({ transport })`. Tests mock `fetch` and `XMLHttpRequest`. The
  interface can be made public later without breaking anything.
- `XhrTransport` reads the response as an `ArrayBuffer` and wraps it into a real `Response`, so the decoders,
  `.as()`, `.schema()` and `{ data, error }` do not change. A network error rejects with `TypeError`, an abort with
  the reason of the signal, like `fetch`.
- `.onUploadProgress(listener)` exists only on `BodyRequest`; `.onDownloadProgress(listener)` on every request; the
  options object has the same names. Both get `Progress { loaded, total?, percent? }`.
- Without a known size the listener is still called: `loaded` grows, `total` and `percent` are left out
  (`percent?: number`), like `ProgressEvent.lengthComputable = false`. A download size comes from `Content-Length`
  unless the body is compressed; an upload size from the XHR or from the body (string, `Blob`, buffer,
  `URLSearchParams`). When the response arrives, an upload of known size reports 100% if the environment did not.
- `percent` is a whole number from 0 to 100, rounded down.

## Consequences

Upload progress works in every browser with the same API. Requests without an upload listener behave exactly as
before. With XHR the response is read whole (no streaming, so no SSE), `keepalive` is ignored, a `ReadableStream`
body is rejected and the response has no `url`. In Node there is no XHR: the request goes through `fetch` and the
upload listener is not called. Counting a download wraps the body into a new `Response`, which also has no `url`.
A retried request reports each attempt from zero.

## Alternatives considered

- Streaming request body in `fetch`: Chromium only, HTTP/2 only.
- XHR for every request: loses streaming responses (SSE, NDJSON) and `keepalive`.
- Not calling the listener without `Content-Length`: a silent callback looks like a hung request.
- A public `transport` option now: hard to take back, and no real use case yet.
