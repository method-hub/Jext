# Read Server-Sent Events

[Русская версия](ru.md)

`GET /events` sends three events as `text/event-stream` and ends. Every tab returns the data of each event.

<!-- @variants -->

## What differs

- **jext** reads the stream with `for await` over `http.sse(url)`; each event is `{ event, data, id, retry }`, and the
  parser follows the specification: comments, `retry:`, CRLF and data of several lines.
- **fetch**, **ky** and **ofetch** give the body as a stream; the lesson reads it with a hand-written parser that knows
  only `id:` and `data:`.
- **axios** gives a stream in a browser only through its fetch adapter (`adapter: 'fetch'`, `responseType: 'stream'`).
- **XMLHttpRequest** has no stream: `responseText` grows while the response arrives, and each `onprogress` parses what
  is new. A browser also has `EventSource` for this, but only for a GET without headers of its own.
