# @metapraxis/jext-collection

[Русская версия](RUADME.md)

`collection(value)` wraps an array, string, number, object, `Set` or `Map` into a typed, immutable, chainable
object. Every method returns a new wrapper (or a plain value), the original value is never changed.

```ts
import collection from '@metapraxis/jext-collection';

collection(['b', 'a', 'c'])
    .after('a', 'x') // ['b', 'a', 'x', 'c']
    .filter((letter) => letter !== 'c')
    .when(
        (letters) => letters.length > 2,
        (self) => self.map((letter) => letter.toUpperCase())
    )
    .get(); // ['B', 'A', 'X']
```

Conditions (`when`, `unless`, `alt`, `cond`) receive the raw value, steps receive the wrapper, so a step can call
any method of the type ([ADR 0002](adr/0002-pipeline-callbacks-receive-the-wrapper.md)):

```ts
collection(15)
    .cond([
        [(value) => value > 100, (self) => self.clamp(0, 100)],
        [(value) => value < 0, (self) => self.clamp(0, 100)],
    ])
    .get(); // 15
```

Conversions move a value to another wrapper or out of the chain:

```ts
collection([1, 2, 2, 3]).toSet().get(); // Set {1, 2, 3}
collection({ id: 1, name: 'Ann', password: 'x' }).omit(['password']).toJson(); // '{"id":1,"name":"Ann"}'
collection('hello').capitalize().toArray().get(); // ['H', 'e', 'l', 'l', 'o']
collection(new Map([['a', 1]]))
    .mapValues((value) => value * 10)
    .toObject()
    .get(); // { a: 10 }
collection(['a', 'b']).toXML(); // '<items><item>a</item><item>b</item></items>'
```

The pure functions behind the methods can be imported on their own: `import { unique, chunk } from
'@Collection/Array/extensions'`.

| Type     | Own methods (`<T>Extensions`, `<T>Prototype`) | Conversions (`<T>Root`)                                  |
| -------- | --------------------------------------------- | -------------------------------------------------------- |
| `Array`  | `after`, `extract`, `map`, `filter`           | `toString`, `toJson`, `toXML`, `toObject`, `toSet`       |
| `Number` | `clamp`, `inRange`, `toFixed`, `toPrecision`  | `toString`, `toJson`, `toBoolean`, `toArray`, `toObject` |
| `String` | `capitalize`, `palindrome`, `trim`, `split`   | `toString`, `toJson`, `toXML`, `toNumber`, `toArray`     |
| `Object` | `pick`, `omit`, `keys`, `entries`             | `toString`, `toJson`, `toXML`, `toArray`, `toMap`        |
| `Set`    | `map`, `filter`, `add`, `has`                 | `toString`, `toJson`, `toXML`, `toArray`                 |
| `Map`    | `mapValues`, `filter`, `has`, `set`           | `toString`, `toJson`, `toXML`, `toObject`, `toArray`     |

Every type also has `transform`, `up`, `chain`, `tap`, `when`, `unless`, `alt` and `cond`.

- How it works and what each method returns: [docs/en/ARCHITECTURE.md](docs/en/ARCHITECTURE.md)
- Decisions: [adr/](adr/README.md)
- Changes: [CHANGELOG.md](CHANGELOG.md)
