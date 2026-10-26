# Give up on a slow server

[Русская версия](ru.md)

`GET /slow` answers after one second; every tab waits 200 ms and returns `true` when it gave up.

<!-- @variants -->

## What differs

- **jext** limits each attempt with `.timeout(ms)` and returns `HttpError` with status `0`, the message
  `The request timed out after 200 ms` and a `TimeoutError` in `cause`.
- **fetch** has no timeout option: `AbortSignal.timeout(ms)` aborts the request and rejects with a `TimeoutError`.
- **XMLHttpRequest** has `xhr.timeout` and the `ontimeout` callback.
- **axios** has `timeout` and throws `AxiosError` with `code` `ECONNABORTED`.
- **ky** has `timeout`, 10 seconds by default, and throws `TimeoutError`.
- **ofetch** has `timeout` and throws `FetchError` with a `TimeoutError` in `cause`; it would also repeat the request
  once, so the lesson sets `retry: 0` (ky too, to keep one attempt).
