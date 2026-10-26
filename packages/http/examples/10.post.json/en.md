# Create a user with JSON

[Русская версия](ru.md)

`POST /users` takes a JSON body and answers 201 with the created user, who gets id 5. Every tab sends the same object.

<!-- @variants -->

## What differs

- **jext** serializes a plain object in `.body()` and sets `Content-Type: application/json` itself.
- **fetch** and **XMLHttpRequest** send strings: `JSON.stringify()` and the `Content-Type` header are your job. Without
  the header the server receives `text/plain`.
- **axios** serializes objects by default; the body is the second argument of `axios.post()`.
- **ky** has a separate `json` option for it.
- **ofetch** serializes a plain object in `body` and sets the header.
