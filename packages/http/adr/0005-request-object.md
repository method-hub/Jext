# 0005. http: method helpers return a lazy, immutable request object

- Status: accepted
- Date: 2026-10-23

## Context

`send(url, init)` takes a raw `RequestInit`. Every POST repeats `method`, `JSON.stringify` and the Content-Type
header, and every query string is glued by hand. Typical bugs: a missing Content-Type, `[object Object]` as the
body, a value with `&` breaking the URL. Later stages (`.as()`, `.schema()`, `timeout`, `retry`, progress) need a
place to attach per-request settings.

## Decision

`http.get/head/delete(url, options?)` return `HttpRequest<T, E>`, and `http.post/put/patch(url, options?)` return
`BodyRequest<T, E>`, which adds `body()`. Both are implemented by `FluentRequest`.

- Chain methods: `headers()`, `query()`, `signal()`, `keepalive()`, and `body()` on `BodyRequest`. The options
  object uses the same names (`{ headers, query, signal, keepalive, body }`), so both forms build the same request.
- `body()` picks the encoding from the value: `FormData`, `URLSearchParams`, `Blob`, buffers, streams and strings go
  as they are and `fetch` sets the type; any other value becomes JSON with `application/json`, unless the caller
  set Content-Type.
- `query()` encodes values, drops `null` and `undefined`, repeats the key for arrays, and keeps existing
  parameters and the `#fragment`.
- The request is sent when awaited (it implements `then`), and only once: awaiting it again returns the same
  result. Every chain method returns a new request, so a prepared request can be reused.
- `send(url, init)` stays as the low-level call; the request object calls it.

## Consequences

Common requests become one line and cannot get the JSON encoding wrong. `get(url).body()` does not compile.
`FluentRequest` depends only on the `Sender` interface, so it is tested with a stub. New per-request settings in
later stages become chain methods plus options of the same name.

## Alternatives considered

- Options object only (`http.post(url, { json })`): less discoverable, and later options would grow one object.
- A mutable builder that `send()`s explicitly: a shared prepared request could be changed by another caller, and
  a forgotten `send()` sends nothing.
- `contentTypeJson()` and similar methods: two steps that can disagree with the body; the value already tells
  the type.
