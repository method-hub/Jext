# 0001. http: responses are decoded by a Chain of Responsibility

- Status: accepted
- Date: 2026-10-23

## Context

`http.send()` must turn a `Response` into the right value without the caller naming the format. The format is
known only from the response: Content-Type, Content-Disposition, status, sometimes the body itself. New formats
keep appearing, and each one has its own rule for "is this mine".

## Decision

Each format is a `Decoder` with two methods: `parse(data)` answers whether it handles this response, `wrap(response)`
decodes it. `Root` implements `Chain<T>`: it keeps decoders in insertion order, asks each one in turn and hands the
response to the first that accepts it; if none does, the result is an `ArrayBuffer`. `Bootstrap` builds the chain in
priority order, `Http` is the facade that calls `fetch` and the chain.

This is a Chain of Responsibility in its list form: the chain object iterates the handlers instead of each handler
holding a link to the next one. It is not a Composite: `Root` does not implement `Decoder`, chains are not nested,
and only one decoder handles a response.

## Consequences

A new format is one class and one line in `Bootstrap`; nothing else changes. Each decoder is tested alone on a real
`Response`. The order is behaviour and lives in one place, so a new decoder needs a deliberate position. Two
decoders registered with the same class name replace each other, because `Hub` keys them by `constructor.name`.

## Alternatives considered

- `switch` on Content-Type in one function: grows with every format and mixes unrelated rules.
- A map from Content-Type to function: cannot express rules based on status, Content-Disposition or the body.
- A Builder where the caller picks the format (`Http.get(url).json()`): removed; the client exists so the caller
  does not have to.
- A real Composite (`Root` implements `Decoder`, chains nested): no use case yet; can be added without breaking the
  current API.
