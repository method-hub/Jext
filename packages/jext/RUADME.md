# @metapraxis/jext

[English](https://github.com/method-hub/Jext/blob/main/packages/jext/README.md)

Jext одним пакетом: всё, что экспортирует [`@metapraxis/jext-http`](https://www.npmjs.com/package/@metapraxis/jext-http), и `collection` из
[`@metapraxis/jext-collection`](https://www.npmjs.com/package/@metapraxis/jext-collection). Оба пакета — его зависимости и ставятся вместе с ним;
если нужна только одна часть, поставьте её пакет отдельно.

```sh
npm install @metapraxis/jext
```

```ts
import { collection, http } from '@metapraxis/jext';

const user = await http.send<{ id: number; tags: string[] }>('/api/user');
const tags = collection(user.tags);
```

Браузер без сборщика подключает UMD-сборку `dist/index.umd.js` одним тегом `<script>` (unpkg, jsdelivr). В ней оба
пакета, она даёт глобальный `Jext`: `Jext.collection(...)`, `Jext.http.get(...)`.

Лицензия: MIT.
