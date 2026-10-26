# Send a form as multipart

[Русская версия](ru.md)

`POST /feedback` takes `multipart/form-data` and answers with the fields it received. Every tab sends the same
`FormData` with two text fields.

<!-- @variants -->

## What differs

- Here all six tools behave the same: `FormData` is passed as the body as it is, and the browser writes
  `Content-Type: multipart/form-data` with the boundary between the parts.
- Do not set that header yourself in any of them: a hand-written `Content-Type` has no boundary, and the server cannot
  split the parts.
- **jext** takes the form in `.body()`, **fetch**, **ky** and **ofetch** in `body`, **axios** as the second argument,
  **XMLHttpRequest** in `send()`.
