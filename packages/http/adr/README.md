# @metapraxis/jext-http: decision records

Decisions that affect only `@metapraxis/jext-http`. Repository-wide decisions: [.github/docs/adr](../../../.github/docs/adr/README.md).

| No. | Decision | Status |
| --- | --- | --- |
| [0001](0001-parser-chain.md) | Responses are decoded by a Chain of Responsibility | accepted |
| [0002](0002-built-in-parsers.md) | Built-in parsers, their order and return types | accepted |
| [0003](0003-local-test-server.md) | Integration tests run against a local server | accepted |
| [0004](0004-result-instead-of-exceptions.md) | `send()` returns `{ data, error }` and never throws | accepted |
| [0005](0005-request-object.md) | Method helpers return a lazy, immutable request object | accepted |
| [0006](0006-format-and-schema.md) | `.as(format)` picks the decoder, `.schema()` validates through Standard Schema | accepted |
| [0007](0007-extend-timeout-retry.md) | `extend()` makes a new client, `.timeout()` limits each attempt, `.retry()` repeats idempotent requests | accepted |
| [0008](0008-transport-and-progress.md) | Transports behind one interface, XHR for upload progress, progress without a known size | accepted |
| [0009](0009-server-events.md) | `http.sse()` returns a stream object read with `for await`, reconnects on a drop, `data` is a string | accepted |
| [0010](0010-hooks-and-dedupe.md) | Client hooks around every request, `dedupe` shares identical GET and HEAD requests in flight | accepted |
| [0011](0011-lessons-compare-tools.md) | Lessons compare jext with fetch, XMLHttpRequest, axios, ky and ofetch against a lesson server | accepted |
