# 0009. http: `http.sse()` returns a stream object read with `for await`, reconnects on a drop, `data` is a string

- Status: accepted
- Date: 2026-10-24

## Context

`send()` already decodes `text/event-stream` into `AsyncIterable<ServerEvent>`, but it opens one connection and
cannot reconnect. `EventSource` reconnects, but it sends only GET, without a body and without custom headers, so it
cannot call an API that needs `Authorization` or a POSTed prompt (LLM APIs). A stream has no single result: events
come one by one while it lasts. Many streams send JSON in `data`, some do not (OpenAI ends with `data: [DONE]`).

## Decision

- `http.sse(url, options?)` returns `StreamRequest<T = string>`, an `AsyncIterable<ServerEvent<T>>`. Like the request
  object (ADR 0005) it is lazy and immutable: `for await` opens a connection, every loop opens its own, every chain
  method returns a new object. The options object has the same names as the chain.
- Its own interface (ISP): `method('GET' | 'POST')`, `headers()`, `query()`, `body()`, `signal()`, `reconnect()`,
  `json()`. No `as()`, `schema()`, `retry()`, `timeout()` or progress. A body makes the stream a POST unless
  `.method()` says otherwise; a GET with a body fails before connecting.
- Built on `fetch` through `Http`, so `baseUrl`, `headers` and `hooks` of a client apply. `Accept:
  text/event-stream` is sent unless the caller sets `Accept`.
- `data` is a string by default; `.json<T>()` parses each event, and data that is not JSON ends the stream with an
  `HttpError`. `ServerEvent` becomes generic: `ServerEvent<T = string>`.
- `.reconnect(n | { retries, delay })` reconnects only after a drop or a network error, with `Last-Event-ID` set to
  the last id received. The wait is 1000 ms or the last `retry:` field. `n` counts reconnects in a row and an event
  resets it; no argument means no limit, like `EventSource`. The end of the stream and a 204 end the loop; an error
  status, a response that is not `text/event-stream` and a failed hook throw without reconnecting.
- Errors are thrown from the loop as `HttpError`: a `for await` has no result to return. `send()` still never
  throws (ADR 0004). An abort through the signal and `break` close the connection and end the loop without an error.

## Consequences

One API covers GET feeds and POST streams with tokens, with reconnects. A loop needs `try/catch` instead of
`if (error)`. Reconnecting a POST sends the body again, so a `ReadableStream` body cannot be reconnected. The
`retry:` field takes effect with the next event that has data. `.json()` cannot read a stream that mixes JSON
with plain markers such as `[DONE]`: such a stream is read as strings.

## Alternatives considered

- `EventSource`: no POST, no body, no headers.
- `const { data, error } = await http.sse(url)`, then a loop: two steps for every stream, and errors in the middle
  of the stream would still have to be thrown.
- Parsing `data` as JSON when it parses: the type of `data` would depend on the content of each event.
- Reconnecting when the stream ends normally, like `EventSource`: an LLM stream ends when the answer is done, and
  a reconnect would POST the prompt again.
