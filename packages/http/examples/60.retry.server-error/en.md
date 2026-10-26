# Retry a server error

[Русская версия](ru.md)

`GET /flaky` answers 503 twice and succeeds on the third attempt. The server counts attempts per `key`, so every tab
sends its own key and returns the number of the attempt that succeeded.

<!-- @variants -->

## What differs

- **jext** repeats with `.retry({ limit, delay })` (or `.retry(2)`): GET, HEAD, PUT, DELETE and OPTIONS, statuses 408,
  429, 500, 502, 503 and 504 and dropped connections, never a timeout or an abort. The delay doubles: 300 ms, 600 ms… by
  default. Nothing is repeated unless asked.
- **ky** repeats by default: 2 times, the same methods plus TRACE and QUERY, also on 413, with a delay of 0.3 s doubled
  each time. The lesson shortens the delay to 100 ms.
- **ofetch** repeats a GET once by default without a pause, and POST, PUT, PATCH and DELETE never; `retry` and
  `retryDelay` change that. Its statuses also include 409 and 425.
- **axios** has no retries (the axios-retry package adds them), so they are written by hand, as with **fetch** and
  **XMLHttpRequest**. The hand-written versions here repeat only statuses, not a dropped connection.
