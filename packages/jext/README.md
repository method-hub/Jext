# @metapraxis/jext

[Русский](https://github.com/method-hub/Jext/blob/main/packages/jext/RUADME.md)

Jext in one package: everything [`@metapraxis/jext-http`](https://www.npmjs.com/package/@metapraxis/jext-http) exports and `collection` from
[`@metapraxis/jext-collection`](https://www.npmjs.com/package/@metapraxis/jext-collection). The two packages are its dependencies and are installed
with it; install one of them alone if you need only that part.

```sh
npm install @metapraxis/jext
```

```ts
import { collection, http } from '@metapraxis/jext';

const user = await http.send<{ id: number; tags: string[] }>('/api/user');
const tags = collection(user.tags);
```

A browser without a bundler loads the UMD build `dist/index.umd.js` with one `<script>` tag (unpkg, jsdelivr). It
contains both packages and gives the global `Jext`: `Jext.collection(...)`, `Jext.http.get(...)`.

License: MIT.
