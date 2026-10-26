# Replace a user with PUT

[Русская версия](ru.md)

`PUT /users/2` replaces the whole user: the body carries every field, and the server answers with the stored user.

<!-- @variants -->

## What differs

- The request is the same as `POST` with JSON, only the method changes: `http.put()` in jext, `axios.put()`,
  `ky.put()`, `method: 'PUT'` in fetch, XMLHttpRequest and ofetch.
- **jext**, **axios**, **ky** (`json`) and **ofetch** serialize the object; **fetch** and **XMLHttpRequest** need
  `JSON.stringify()` and the header.
- `PUT` is idempotent: sending it twice leaves the same result. That is why retries (jext's `.retry()`, ky's default
  retry) cover `PUT` and leave `POST` out.
