# 0007. http: `extend()` makes a new client, `.timeout()` limits each attempt, `.retry()` repeats idempotent requests

- Status: accepted
- Date: 2026-10-24

## Context

Every call repeats the base URL and the token, and one forgotten header gives a 401. `fetch` has no timeout:
a hung server keeps the request open forever. A 503 or a dropped connection is usually gone a moment later, but
the caller has to write the loop, the backoff and the `Retry-After` parsing by hand.

## Decision

- `http.extend({ baseUrl, headers, timeout, retry })` returns a **new** `Http` with the same decoders. The client it
  is called on does not change (no global defaults as in `axios.defaults`). Headers are merged, a header set again
  wins; `baseUrl`, `timeout` and `retry` replace the earlier value. Extending an extended client keeps its settings.
- The settings apply in `send()`, so the request object and the low-level `send()` behave the same. `baseUrl` is
  prefixed to a relative string URL with exactly one slash (`BaseUrl`); an absolute URL and a `Request` object are
  used as they are. Client headers go under the headers of the request.
- `.timeout(ms)` / `timeout`: each attempt gets `AbortSignal.timeout(ms)`, combined with the caller's signal by
  `AbortSignal.any`. A timeout returns `HttpError` with status `0`, the message `The request timed out after N ms`
  and the `TimeoutError` in `cause`. `0` turns off the timeout of the client.
- `.retry(n | RetryOptions)` / `retry`: repeats a network error or a 408, 429, 500, 502, 503, 504 response, only for
  GET, HEAD, PUT, DELETE and OPTIONS, at most `limit` times. The wait is 300 ms doubled each time, or as long as
  `Retry-After` says (seconds or a date). A timeout or an abort is never repeated, and the caller's signal cancels the
  wait. `methods`, `statuses` and `delay` can be changed. `0` turns off the retries of the client.
- `Delivery` (the attempts) and `RetryPolicy` (the decisions) live in `src/Delivery/`. `send()` gets
  `{ timeout, retry }` in its third argument, `SendOptions`, next to `{ format, schema }`.

## Consequences

One place for the base URL and the token. A prepared client is safe to share: nothing can change it. Hung requests
end, and transient failures recover without code at the call site. A POST is never sent twice by accident, unless
the caller adds it to `methods`. A body that can be read only once (a `ReadableStream`) cannot be repeated. The
timeout covers one attempt, not the waits between attempts. `AbortSignal.any` needs Chrome 116, Firefox 124,
Safari 17.4 or Node 20.3.

## Alternatives considered

- Mutable defaults (`http.defaults.headers = …`): a change in one module silently changes requests in another.
- One timeout for all attempts together: a slow first attempt would leave no time for the repeat.
- Retrying every method: a repeated POST can charge a card twice.
- Retrying timeouts: a request that hangs once will most likely hang again, and the caller would wait limit × timeout.
