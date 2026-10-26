# 0004. http: `send()` returns `{ data, error }` and never throws

- Status: accepted
- Date: 2026-10-23

## Context

`fetch` rejects only when no response arrives. A 404 or 500 resolves like a 200, and `send()` never looked at the
status, so an error body came back as data: `send<User>()` could return `{ message: 'User not found' }` typed as
`User`, and the caller had no status to check. A body that could not be decoded and a network failure were thrown,
so the caller had to handle two channels: the return value and `catch`.

## Decision

`send<T, E = unknown>()` returns `Promise<Result<T, E>>`, where
`Result<T, E> = { data: T; error: null } | { data: null; error: HttpError<E> }`. It never rejects.

- 2xx: the body goes through the chain, `{ data, error: null }`.
- Any other status: the body goes through the same chain into `error.data` (`null` if it cannot be decoded);
  `error.status` and `error.response` describe the response, the message is `"<status> <statusText>"`.
- No response (network, CORS, abort): `error.status` is `0`, `error.response` is `null`, `error.cause` is the
  rejection of `fetch`.
- A 2xx body that cannot be read or decoded: `error.status` is the response status, `error.cause` is the error.

`HttpError<E>` extends `Error` (`name` is `HttpError`), so it can still be thrown or logged by the caller.

## Consequences

Every caller changes from `const user = await http.send()` to `const { data, error } = await http.send()`. With
`strictNullChecks` TypeScript does not let `data` be used as `T` until `error` is checked. The error body is typed
by the second generic and already decoded. The repository itself compiles with `strict: false`, so this narrowing
is not checked in our own tests. Later stages (`.as()`, `.schema()`, `retry`) build on this result.

## Alternatives considered

- Throw `HttpError` on 4xx/5xx (axios, ky): a forgotten `catch` loses the error, and the caught value is `unknown`.
- Keep returning the body for any status: errors stay invisible to the caller.
- Separate `NetworkError` / `DecodeError` classes: one class with `status` and `cause` covers the cases without a
  hierarchy; it can be split later without changing `Result`.
