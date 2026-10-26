# AGENTS.md — packages/collection

Read the root `AGENTS.md` first. This file adds what is specific to `@metapraxis/jext-collection`.

## What is inside

`collection(value)` (`index.ts`) wraps a value and returns a typed object for chaining. Each value type has
the same five-layer ladder in `src/<Type>/`:

| Layer           | File               | Holds                                                 |
| --------------- | ------------------ | ----------------------------------------------------- |
| `Value`         | `src/Value.ts`     | The wrapped value, `get()` / `value`                  |
| `Pipeline<T,W>` | `src/Pipeline.ts`  | `tap`, `when`, `unless`, `alt`, `cond` for every type |
| `<T>Pipeline`   | `<T>Pipeline.ts`   | `transform`, `up`, `chain`; abstract `wrap()`         |
| `<T>Root`       | `<T>Root.ts`       | Conversions to other types (`toString`, `toArray`, …) |
| `<T>Prototype`  | `<T>Prototype.ts`  | Wrappers over native prototype methods (`map`, …)     |
| `<T>Extensions` | `<T>Extensions.ts` | Jext methods; the class `collection()` returns        |

Pure functions behind the methods live in `src/<Type>/extensions/<name>.ts` and are re-exported from
`extensions/index.ts`. A method in `<T>Extensions` copies the value, calls the function and wraps the result.

Diagrams and the method return table: `docs/en/ARCHITECTURE.md` (RU: `docs/ru/ARCHITECTURE.md`).

Only `<T>Extensions` is concrete: it implements `self()` (returns `this`) and `wrap(value)` (a new wrapper), so the
layers below never import their own Extensions at runtime ([ADR 0002](adr/0002-pipeline-callbacks-receive-the-wrapper.md)).

Wired into `collection()`: Array, String, Number, Object, Set, Map. Other types (Bigint, Date, Json, RegExp, Symbol,
WeakMap, WeakSet, Math) were removed and come back only after discussion.

## Rules

- A method returns one of: a new instance of the same wrapper, `this` (only `tap` and the no-match branch of
  conditionals), another wrapper, or a raw value. Keep the return table in `docs/` in sync.
- Never mutate `this.value`; copy first. Exactly one layer copies: a function in `extensions/` that already builds a
  new value is not wrapped in another copy.
- Conditions receive the raw value, steps (`when`, `unless`, `alt`, `cond`, `chain`) receive the wrapper. A step
  returns the same wrapper type; only `chain`, `up` and `<T>Root` conversions change the type.
- A lower layer imports its own `<T>Extensions` with `import type` only. Wrappers of other types are runtime
  imports, which form a cycle across types: start loading from `index.ts` or a `<T>Extensions` file, never from an
  abstract layer (`tests/Feature/Imports` guards this).
- `Map` has no `get` wrapper: it would clash with `Value.get()`.
- Public API is every ladder class plus `index.ts`, `Value.ts` and `Pipeline.ts`: each needs JSDoc with `@example`
  (`eslint.config.cjs`).

## Adding a method to an existing type

1. Write a pure function in `src/<Type>/extensions/<name>.ts` and export it from `extensions/index.ts`.
2. Add the method to `<Type>Extensions`: copy the value, call the function, return a new wrapper or a raw value.
3. Unit-test the function in `tests/Unit/<Type>/Extensions/Units/<name>/<name>.<case>.test.ts` and the method in
   `tests/Unit/<Type>/Extensions/Facade/<Type>Extensions.<name>/`, one scenario per file, with negative cases and a
   check that the original value is not mutated.
4. Add the method to the return table in `docs/{en,ru}/ARCHITECTURE.md` and to the README tables.
5. When a flagship library has the same function, add a case to `tests/Performance` (`npm run tests:performance`).

## Adding a value type

1. Create the ladder in `src/<Type>/`: `<Type>Pipeline`, `<Type>Root`, `<Type>Prototype`, `<Type>Extensions`
   (copy the Set folder as a small template). `<Type>Extensions` implements `self()` and `wrap()`.
2. Add an overload and a type guard branch to `index.ts`; guards live in `src/types.ts`. The order of type
   checks in `collection()` is a decision: record it in `packages/collection/adr/`.
3. Unit tests per layer, a Feature test for `collection()` with the new type and an
   `Imports.<Type>Extensions.first` test.
4. Update the diagrams.

## Diagrams

The Mermaid blocks and the method return table in `docs/en/ARCHITECTURE.md` and `docs/ru/ARCHITECTURE.md` must
match the code: class and method names exactly as in `src/`. Update them whenever the class ladder or a return
type changes.
