# Handle a server error

[Русская версия](ru.md)

`GET /reports/daily` answers 500 with a plain text body. Every tab returns the status and the text.

<!-- @variants -->

## What differs

- **jext** decodes the error body by its `Content-Type` too, so `error.data` is the text. It does not repeat the
  request unless you ask for it with `.retry()`.
- **fetch** and **XMLHttpRequest** read the text with `.text()` and `responseText`.
- **axios** needs `responseType: 'text'` to keep the body a string.
- **ky** and **ofetch** repeat a failed `GET` on 500 by default: ky up to 2 more times with a growing delay, ofetch
  once. The lesson sets `retry: 0` to see the first answer; without it the user waits for every attempt.
