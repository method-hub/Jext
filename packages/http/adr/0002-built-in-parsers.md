# 0002. http: built-in parsers, their order and return types

- Status: accepted
- Date: 2026-10-23

## Context

The client picks a parser by Content-Type. Several common responses had no parser or the wrong one: 204 with a
JSON type threw on `response.json()`, images fell through to an `ArrayBuffer`, CSV and NDJSON came back as raw
strings, URL-encoded bodies as `FormData`, and SSE was read to the end as text. `JsonParser` also tried
`JSON.parse` on every body, so `text/plain` with the body `42` became a number.

## Decision

Six parsers are added and the chain is fixed in this order: Empty, Json, Xml, UrlEncoded, FormData, Dom, Binary,
Blob, Ndjson, Csv, Sse, Media, Text, then the `ArrayBuffer` fallback.

- `EmptyParser` is first, so no parser reads a body that does not exist. It returns `null`.
- `BlobParser` (attachments) stays after the formats that were there before it and before the new ones, so a
  downloaded CSV or image is still a `Blob`, as it was.
- New return types: NDJSON → array, CSV/TSV → `string[][]`, URL-encoded → `URLSearchParams`, SSE →
  `AsyncIterable<ServerEvent>`, media → `Blob`. The CSV, NDJSON and URL-encoded results replace what was returned
  before (a string, a string and `FormData`).
- `JsonParser` sniffs the body only when Content-Type is missing. A declared type is trusted.
- `Decoder.parse()` may return `boolean` or `Promise<boolean>`: parsers that only look at headers are synchronous.

The chain itself is described in [0001](0001-parser-chain.md).

Custom parsers passed to `Bootstrap.init()` were considered and postponed.

## Consequences

Callers of CSV, NDJSON and URL-encoded endpoints get structured data and must update their types. A server that
sends JSON as `text/plain` now gets a string. SSE works while the stream is open. The order is part of the
behaviour: a new parser needs a deliberate place in it (`docs/en/ARCHITECTURE.md`, section Adding a parser).

## Alternatives considered

- Keep CSV and NDJSON as strings and leave parsing to the caller: the client exists to remove that step.
- `FormData` for URL-encoded bodies: it works, but `URLSearchParams` is the native type for that format and keeps
  repeated keys and order with a simpler API.
- Read SSE into an array of events: it would wait for the stream to close, which for SSE may never happen.
