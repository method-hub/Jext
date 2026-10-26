# @metapraxis/jext-collection

## First public release

`collection(value)` wraps an array, string, number, object, `Set` or `Map` into a typed, immutable, chainable
object.

- Six types with the same ladder of classes: `<T>Root` (conversions), `<T>Prototype` (native methods), `<T>Pipeline`
  (`transform`, `up`, `chain`, `tap`, `when`, `unless`, `alt`, `cond`) and `<T>Extensions` (own methods).
- Own methods: `ArrayExtensions` (`after`, `extract`, `map`, `filter`), `NumberExtensions` (`clamp`, `inRange`),
  `StringExtensions` (`capitalize`, `palindrome`), `ObjectExtensions` (`pick`, `omit`), `SetExtensions` (`map`,
  `filter`, `add`, `has`), `MapExtensions` (`mapValues`, `filter`, `has`, `set`).
- Native methods: `toFixed`, `toPrecision`, `trim`, `split`, `keys`, `entries` and others on `<T>Prototype`.
- Conversions on every `<T>Root`: `toString`, `toJson`, `toXML` (escaped, no dependencies) and moves between types
  (`toSet`, `toObject`, `toArray`, `toMap`, `toNumber`, `toBoolean`).
- Pipeline steps receive the wrapper, so a step can call any method of the type (ADR 0002).
- The pure functions behind the methods can be imported on their own (`@Collection/Array/extensions`).
- Performance tests against lodash, es-toolkit, remeda and ramda up to 1,000,000 elements.
- JSDoc with `@example` on every public method.
