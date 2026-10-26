# See what did not match the schema

[Русская версия](ru.md)

The schema expects an `age` the server never sends. Every tab returns the messages of the issues.

<!-- @variants -->

## What differs

- **jext** returns `ValidationError` in `error`: `issues` lists every problem with its path, `value` holds the data that
  failed. The request itself succeeded, so `data` is `null`.
- **ky** throws `SchemaValidationError` with the same `issues`.
- **fetch**, **XMLHttpRequest**, **axios** and **ofetch** call `User.safeParse()`, which returns the issues instead of
  throwing.
