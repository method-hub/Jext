# Change one field with PATCH

[Русская версия](ru.md)

`PATCH /users/2` sends only the fields that change, here `role`, and the server answers with the whole updated user.

<!-- @variants -->

## What differs

- Only the method and the body differ from `PUT`: `http.patch()`, `axios.patch()`, `ky.patch()`, `method: 'PATCH'`.
- Unlike `GET` and `POST`, `PATCH` from a page on another origin always needs a CORS preflight, and the server must
  list `PATCH` in `Access-Control-Allow-Methods`. With fetch and XMLHttpRequest the method must be written in capitals:
  the browser upper-cases `get`, `post`, `put` and `delete` itself, but sends `patch` as it is.
