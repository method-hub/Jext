# 0001. collection: one wrapper ladder per type, immutable values

- Status: accepted
- Date: 2026-10-23

## Context

`collection(value)` must offer type-specific methods with exact TypeScript types while sharing conditional helpers across types.

## Decision

Each type gets the ladder `Value → Pipeline → <T>Pipeline → <T>Root → <T>Prototype → <T>Extensions`. `collection()` picks the `<T>Extensions` class by runtime type checks. Every method works on a copy and returns either a new wrapper of the same type, `this` (only `tap` and unmatched conditionals), a wrapper of another type, or a raw value. The diagrams in `packages/collection/docs` are the reference.

## Consequences

Return types are predictable and typed per call. Adding a type means four files plus a branch in `collection()`. Classes import each other in a cycle (`<T>Pipeline` returns `<T>Extensions`), which bundlers handle but must not be broken by eager top-level code.

## Alternatives considered

- Patch native prototypes: global side effects.
- One generic wrapper for all types: loses per-type method typing.
