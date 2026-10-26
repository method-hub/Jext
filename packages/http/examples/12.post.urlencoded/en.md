# Log in with a URL-encoded form

[Русская версия](ru.md)

`POST /login` takes `application/x-www-form-urlencoded` with `username` and `password` and answers with a token. Every
tab sends the same `URLSearchParams`.

<!-- @variants -->

## What differs

- **jext**, **fetch**, **ky** and **ofetch** pass `URLSearchParams` to `fetch`, which encodes it and sets the
  `Content-Type`.
- **axios** recognizes `URLSearchParams`, serializes it and sets the same header.
- The **XMLHttpRequest** tab sets the header and sends the string itself. `send()` accepts `URLSearchParams` in modern
  browsers, but the explicit form works everywhere, including older browsers and jsdom.
