# Send a header

[Русская версия](ru.md)

`GET /me` answers with the signed-in user only when the request carries `Authorization: Bearer secret-token`; without
it the server answers 401. Every tab adds the header to this one request.

<!-- @variants -->

## What differs

- **jext** adds headers with `.headers()`, and every call returns a new request, so a prepared request can be reused
  with other headers. For a header on every request of an API, a client made with `http.extend({ headers })` is the
  better fit.
- **fetch**, **axios**, **ky** and **ofetch** take a `headers` object in the options.
- **XMLHttpRequest** needs `setRequestHeader()` for each header, after `open()` and before `send()`.
- A custom header makes the browser send a CORS preflight (`OPTIONS`) first; the lesson server answers it.
