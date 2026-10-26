# 0010. http: client hooks around every request, `dedupe` shares identical GET and HEAD requests in flight

- Status: accepted
- Date: 2026-10-24

## Context

Apps add a fresh token to every request, log responses, or repeat a request after refreshing an expired token.
Doing it at every call is repetitive, and `extend({ headers })` only takes fixed values. Separately, several
components often ask for the same resource at the same moment (a user profile on page load), sending identical
requests.

## Decision

- `extend({ hooks: { beforeRequest, afterResponse } })`: arrays of functions, run in order. `beforeRequest` gets
  `Outgoing { url, init }` after `baseUrl` and the client headers and may return a new one (sync or async);
  `afterResponse` gets the last response after retries and the request, and may return another response. Returning
  nothing keeps the value. `extend()` adds new hooks after the hooks of the client it extends.
- `beforeRequest` runs once per request, not per retry, and once per connection of `http.sse()`, so a token is fresh
  after a reconnect. A hook that throws ends `send()` with an `HttpError` (`A beforeRequest hook failed`, status `0`,
  or `An afterResponse hook failed` with the response); `http.sse()` throws it.
- `.dedupe()` on a request and `extend({ dedupe: true })` on a client: while an identical request is in flight, a
  new one joins it. Identical means the same method, URL and headers, after the hooks. Only GET and HEAD with a
  string URL and no progress listener are shared. Each caller gets `response.clone()`, so they decode it on their
  own (`.as()`, `.schema()`, `afterResponse`). The entry is removed when the response arrives: this is not a cache.
- The shared request has its own `AbortController`. A caller's signal stops only that caller's wait; the request
  is aborted when every caller has stopped waiting. The first request's timeout and retries drive it.
- `.dedupe(false)` turns off the client setting for one request. `HookRunner` and `Inflight` live in
  `src/Delivery/`; each `Http` has its own `Inflight`, so clients made by `extend()` do not share requests.

## Consequences

Tokens, logging and refresh on 401 are written once per client. Identical requests on page load cost one round
trip. Joined callers do not apply their own timeout or retries. A hook that changes the URL or the headers also
changes the dedupe key. Hooks cannot be set on one request, only on a client.

## Alternatives considered

- Per-request hooks: more API for a need that `extend()` already covers.
- `beforeRetry` and `beforeError` hooks: no use case yet; can be added without breaking anything.
- A response cache with a lifetime: a different feature with invalidation rules; dedupe only joins requests in flight.
- Sharing POST requests: not idempotent, two POSTs mean two actions.
