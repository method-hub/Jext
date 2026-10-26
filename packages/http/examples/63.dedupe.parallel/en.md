# Send one request for identical ones

[Русская версия](ru.md)

Three parts of a page ask for `GET /counter` at the same moment. The server counts the requests it got, so every tab
returns `[1, 1, 1]`: one request, three answers. Without sharing it would be 1, 2 and 3.

<!-- @variants -->

## What differs

- **jext** shares an identical GET or HEAD that is still in flight with `.dedupe()` or `http.extend({ dedupe: true })`.
  Each caller gets its own copy of the response; it is not a cache, the next request goes to the network. One caller's
  abort stops only its wait.
- **fetch**, **XMLHttpRequest**, **axios**, **ky** and **ofetch** have nothing like it: a `Map` of promises by URL does
  the job by hand.
