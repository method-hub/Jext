# Stream the reply to a POST

[Русская версия](ru.md)

`POST /chat` takes `{ prompt }` and streams the reply in pieces of JSON, as chat APIs do. Every tab returns the whole
reply.

<!-- @variants -->

## What differs

- **jext**: `.body()` makes the stream a POST, `.headers()` can add a token, `.json<T>()` parses `data` of each event.
- **fetch**, **XMLHttpRequest**, **axios**, **ky** and **ofetch** send the POST as usual and read the stream as in the
  lesson on reading events, with `JSON.parse` for each event.
- `EventSource` cannot do this at all: it sends neither a body nor headers.
