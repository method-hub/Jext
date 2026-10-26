# 0006. http: `.as(format)` picks the decoder, `.schema()` validates through Standard Schema

- Status: accepted
- Date: 2026-10-24

## Context

The format of a response comes from its Content-Type. Servers often get it wrong: JSON as `text/plain`, CSV as
`application/octet-stream`, a file that should stay a `Blob`. The caller has no way to say "I know what this is".
The type of `data` is only the word of the developer (`http.get<User>()`): nothing checks it at runtime, so a
changed API fails far from the request.

## Decision

- `.as(format)` on `HttpRequest` and `BodyRequest` (and `as` in the options object) chooses the decoder by name:
  `json`, `ndjson`, `xml`, `html`, `text`, `csv`, `formData`, `urlencoded`, `blob`, `arrayBuffer`, `sse`.
  `Formats<T>` maps each name to the type of `data`; `json`, `ndjson` and `xml` keep the `T` of the request.
- `Picker` holds one decoder per format, the same instances as the chain. A response without a body still gives
  `null` (the empty decoder goes first), so `.as('json')` on a 204 is not an error. `.as()` changes only the
  decoding of a 2xx response; an error body is still detected by Content-Type.
- `.schema(schema)` (and `schema` in the options object) accepts any Standard Schema v1 object (Zod, Valibot,
  ArkType…). The decoded data goes to `schema['~standard'].validate()`. `{ value }` becomes `data`; `{ issues }`
  becomes a `ValidationError` (an `HttpError` with `issues` and `value`); a throwing `validate` becomes an
  `HttpError` with the error in `cause`. The type of `data` is inferred from the schema (`InferOutput`).
- The Standard Schema types are copied into `src/Contract/StandardSchema.ts`, as the specification suggests.
- `send(url, init, decoding?)` gets a third argument `{ format, schema }`; the request object fills it.

## Consequences

Wrong Content-Types are fixed at the call site, and the type of `data` follows the format. With a schema, the type
is checked at runtime and needs no `<>`. No new dependency. `Http` built without a `Picker` returns an
`HttpError` for `.as()`. Validation runs after decoding, so `.as()` and `.schema()` combine.

## Alternatives considered

- A content-type override header or `init.responseType`: not typed, mixes request and response settings.
- Depending on Zod: forces one library on every user and adds a runtime dependency.
- Throwing on validation failure: breaks the `{ data, error }` contract of ADR 0004.
- Reordering the chain per request instead of `Picker`: harder to reason about, and a format could still be
  taken by an earlier decoder.
