# Build a client on top of another

[Русская версия](ru.md)

A client for the app sends `X-App`; an admin client made from it adds `Authorization`. Every tab returns both headers as
`GET /echo/headers` saw them.

<!-- @variants -->

## What differs

- **jext** and **ky** call `extend()` on the first client: headers are merged and hooks are added after the hooks of the
  first client.
- **axios** has `create()` on an instance too: it merges the new settings into the settings of that instance.
  Interceptors are not copied.
- **ofetch** has `create()` on a client, but it replaces the `headers` object instead of merging it, so the lesson
  spreads the first headers by hand.
- **fetch** and **XMLHttpRequest** have no clients, so there is nothing to extend: a function builds the headers of both
  levels.
