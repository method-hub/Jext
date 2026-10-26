# @metapraxis/jext-collection

[English version](README.md)

`collection(value)` оборачивает массив, строку, число, объект, `Set` или `Map` в типизированный неизменяемый объект
для цепочек. Каждый метод возвращает новую обёртку (или обычное значение), исходное значение не меняется.

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

Условия (`when`, `unless`, `alt`, `cond`) получают сырое значение, шаги получают обёртку, поэтому в шаге доступен
любой метод типа ([ADR 0002](adr/0002-pipeline-callbacks-receive-the-wrapper.md)):

```ts
collection(15)
    .cond([
        [(value) => value > 100, (self) => self.clamp(0, 100)],
        [(value) => value < 0, (self) => self.clamp(0, 100)],
    ])
    .get(); // 15
```

Преобразования переводят значение в другую обёртку или выводят его из цепочки:

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

Чистые функции, на которых построены методы, можно импортировать отдельно: `import { unique, chunk } from
'@Collection/Array/extensions'`.

| Тип      | Свои методы (`<T>Extensions`, `<T>Prototype`) | Преобразования (`<T>Root`)                               |
| -------- | --------------------------------------------- | -------------------------------------------------------- |
| `Array`  | `after`, `extract`, `map`, `filter`           | `toString`, `toJson`, `toXML`, `toObject`, `toSet`       |
| `Number` | `clamp`, `inRange`, `toFixed`, `toPrecision`  | `toString`, `toJson`, `toBoolean`, `toArray`, `toObject` |
| `String` | `capitalize`, `palindrome`, `trim`, `split`   | `toString`, `toJson`, `toXML`, `toNumber`, `toArray`     |
| `Object` | `pick`, `omit`, `keys`, `entries`             | `toString`, `toJson`, `toXML`, `toArray`, `toMap`        |
| `Set`    | `map`, `filter`, `add`, `has`                 | `toString`, `toJson`, `toXML`, `toArray`                 |
| `Map`    | `mapValues`, `filter`, `has`, `set`           | `toString`, `toJson`, `toXML`, `toObject`, `toArray`     |

У каждого типа также есть `transform`, `up`, `chain`, `tap`, `when`, `unless`, `alt` и `cond`.

- Как это устроено и что возвращает каждый метод: [docs/ru/ARCHITECTURE.md](docs/ru/ARCHITECTURE.md)
- Решения: [adr/](adr/README.md)
- Изменения: [CHANGELOG.md](CHANGELOG.md)
