# Continue a stream after a drop

[Русская версия](ru.md)

`GET /ticker` sends event `1` and breaks the connection. A reconnect with `Last-Event-ID: 1` gets events `2` and `3`,
and the stream ends. Every tab returns the data of all three events.

<!-- @variants -->

## What differs

- **jext** reconnects with `.reconnect({ retries, delay })` (or `.reconnect()` without a limit): it waits, sends
  `Last-Event-ID` with the last id and takes the wait from `retry:` when the server sends one. The end of the stream
  ends the loop; `retries` counts drops in a row.
- **fetch**, **XMLHttpRequest**, **axios**, **ky** and **ofetch** have no reconnects: the lesson keeps the events, opens
  the stream again after a drop and sends `Last-Event-ID` itself.
- `EventSource` of a browser reconnects by itself and sends `Last-Event-ID`, but it reconnects after a normal end too,
  and it is limited to a GET without its own headers.
