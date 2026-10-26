# Read the error body of a 404

[Русская версия](ru.md)

`GET /users/42` answers 404 with a JSON body `{ "message": "User 42 not found" }`. Every tab returns the status and the
message, the two things an interface shows to the user.

<!-- @variants -->

## What differs

- **jext** returns the error as a value: `error.status` and `error.data`, the error body decoded by its `Content-Type`
  and typed by the second generic, `http.get<User, { message: string }>()`. No `try`/`catch`.
- **fetch** and **XMLHttpRequest** treat 404 as a normal response: you check the status and read the body yourself.
- **axios** throws `AxiosError`; the parsed body is in `error.response.data`, and `axios.isAxiosError()` narrows the
  type.
- **ky** throws `HTTPError` and has already read the body into `error.data`; `error.response.json()` no longer works.
- **ofetch** throws `FetchError` with the parsed body in `error.data`.
