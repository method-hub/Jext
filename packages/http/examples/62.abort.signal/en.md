# Cancel a request

[Русская версия](ru.md)

`GET /counter` answers after 100 ms; an `AbortController` cancels the request after 20 ms, as when the user leaves the
page. Every tab returns `'cancelled'` once it sees the abort.

<!-- @variants -->

## What differs

- **jext** takes the signal in `.signal()`. The abort comes back as `HttpError` with status `0` and the `AbortError` in
  `cause`; it also stops the retries and the waits between them.
- **fetch** and **ky** reject with the `AbortError` itself.
- **XMLHttpRequest** takes no signal: the signal calls `xhr.abort()`, and `onabort` runs.
- **axios** takes `signal` and throws `CanceledError`, which `axios.isCancel()` recognises.
- **ofetch** wraps the `AbortError` into a `FetchError` and does not repeat an aborted request.
