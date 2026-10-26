# Send a token with every request

[Русская версия](ru.md)

`GET /me` answers only with the right `Authorization` header, `GET /echo/headers` shows what arrived. Every tab returns
the name of the user and the header the server saw.

<!-- @variants -->

## What differs

- **jext**, **axios**, **ky** and **ofetch** take `headers` when the client is created; a request can add or replace
  headers on top.
- **fetch** and **XMLHttpRequest** set the header in the `api()` function for every request.
