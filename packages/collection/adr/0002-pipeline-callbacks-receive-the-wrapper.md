# 0002. collection: pipeline callbacks receive the wrapper

- Status: accepted
- Date: 2026-10-24

## Context

`when`, `unless` and `cond` returned `R | this`, where `R` was whatever the callback returned from the raw value.
After them TypeScript saw a union, so `collection(a).when(ok, (v) => v.sort()).map(...)` did not compile, and the
callback received the original array, so `v.sort()` changed the user's data. `cond` took conditions and cases as
two parallel arrays: one case less than conditions threw `TypeError`. `<T>Pipeline` imported the `<T>Extensions`
class that extends it, so importing `ArrayPipeline` first failed with "Class extends value undefined". `up` of
arrays required every callback to return an array, while `up` of numbers and strings accepted any result.

## Decision

`Pipeline<T, W>` gets a second type parameter: the wrapper of the type (`ArrayPipeline<T>` extends
`Pipeline<T[], ArrayExtensions<T>>`). `when`, `unless` and `alt` take a condition over the raw value and steps
`(self: W) => W` that receive the wrapper itself; they return `W`. `cond` takes `[condition, step]` pairs and an
optional `otherwise` step. `chain` passes the wrapper to its callback and returns what the callback returns. `up`
collects results of any type into `ArrayExtensions<R>` for every type.

Every `<T>Extensions` implements two protected methods: `self()` returns the instance typed as `W`, `wrap(value)`
creates a new wrapper of the same kind. Lower layers create wrappers only through them and import their own
`<T>Extensions` with `import type`.

## Consequences

- Chains keep their type and steps can use every method of the type. Values cannot be changed through the step,
  because the wrapper's methods copy.
- A step cannot change the type of the value: `when` on `ArrayExtensions<number>` must return
  `ArrayExtensions<number>`. A step that changes the type goes into `chain`, which allows `ArrayExtensions<R>`.
- Conditions receive the raw value and must not change it; it is not copied, to keep conditions free.
- A type no longer imports itself in a cycle. Types still import each other for conversions (`ArrayRoot.toSet()`
  creates `SetExtensions`, `SetRoot.toArray()` creates `ArrayExtensions`), so a module must be entered through
  `index.ts` or a `<T>Extensions` file; importing an abstract layer such as `SetRoot` first still fails.
  `tests/Feature/Imports` checks every `<T>Extensions` as the first import.
- Breaking for existing callers of `when`, `unless`, `alt`, `cond` and array `up`; the package is at 0.0.1.

## Alternatives considered

- Keep `R | this`: the chain breaks after every conditional.
- Pass a copy of the raw value: one copy per call, and the chain still breaks.
- A registry of wrapper constructors to break the cross-type imports: more code and casts for a case that only
  internal code can reach.
