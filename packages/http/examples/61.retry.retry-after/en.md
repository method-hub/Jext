# Wait as long as Retry-After asks

[Русская версия](ru.md)

`GET /busy` answers the first attempt with 429 and `Retry-After: 1`, the next one with success. Every tab returns the
number of the attempt and how many seconds it took.

<!-- @variants -->

## What differs

- **jext** reads `Retry-After` (seconds or an HTTP date) of any repeated response and waits that long instead of its own
  delay.
- **ky** does it by itself for 413, 429 and 503 (`afterStatusCodes`) and caps the wait with `maxRetryAfter`.
- **ofetch** repeats a 429 but ignores the header: `retryDelay` as a function reads it from the response.
- **fetch**, **XMLHttpRequest** and **axios** read the header and wait by hand.
