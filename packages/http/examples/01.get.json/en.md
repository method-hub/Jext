# Get a list of users

[Русская версия](ru.md)

The lesson server answers `GET /users` with a JSON array of four users. Every tab asks for that list and returns it
unchanged; the feature test checks that all six return the same array.

<!-- @variants -->

## What differs

- **jext** decodes the body by its `Content-Type`, so `data` is already the array. A failed request does not throw: it
  comes back in `error`, and the tab throws it, as every tab turns a failure into an error.
- **fetch** resolves even for 404 or 500, so you check `response.ok` yourself, then call `.json()`, which is typed as
  `any`.
- **XMLHttpRequest** works with callbacks: the lesson wraps it in a `Promise`, asks for `responseType = 'json'`, checks
  the status in `onload` and handles a broken connection in `onerror`.
- **axios** parses JSON by default and throws for any status outside 2xx; the body is in `data`.
- **ky** throws `HTTPError` for a non-2xx status; `.json<T>()` reads and types the body.
- **ofetch** throws `FetchError` for a non-2xx status and returns the parsed body directly.
- **axios**, **ky** and **ofetch** throw on their own, so their tabs catch the error and turn it into the same status
  line as the others; without the `try` the code would only look shorter.
