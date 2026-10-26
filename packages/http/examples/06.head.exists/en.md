# Check that a resource exists

[Русская версия](ru.md)

`HEAD` asks for the headers of a resource without its body. The lesson checks two users: `/users/1` exists, `/users/99`
answers 404. Every tab returns `[true, false]`; any other error is rethrown.

<!-- @variants -->

## What differs

- **jext** does not throw for 404: the status is in `error.status`, so the check is one `if`.
- **fetch** and **XMLHttpRequest** never throw for a status either: you read `response.ok` or `xhr.status`.
- **axios** throws for 404, so the answer "does not exist" arrives as an exception that you catch and inspect.
- **ky** throws as well, unless `throwHttpErrors: false` is set; then it returns the `Response`.
- **ofetch** returns only the body by default; `ofetch.raw()` with `ignoreResponseError: true` gives the response and
  its status.
