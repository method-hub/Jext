# Set the base URL once

[Русская версия](ru.md)

A client is created once with the address of the API, then requests use short paths. Every tab returns the names of
users 1 and 2.

<!-- @variants -->

## What differs

- **jext** creates a client with `http.extend({ baseUrl })`; the client has every method of `http`.
- **axios** has `axios.create({ baseURL })`, **ky** `ky.create({ baseUrl })`, **ofetch** `ofetch.create({ baseURL })`.
- **fetch** and **XMLHttpRequest** have no clients: a small `api()` function adds the address and checks the status.
