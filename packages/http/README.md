# @metapraxis/jext-http

[Русская версия](RUADME.md)

HTTP client that fetches a resource and returns it already parsed by Content-Type: JSON, XML, HTML, forms, CSV,
NDJSON, Server-Sent Events, media and binary data.

```ts
import { http } from '@metapraxis/jext-http';

const { data: user, error } = await http.send<{ id: number; name: string }>('/api/users/1');

if (error) {
    console.log(error.status, error.data); // 404 and the decoded error body; 0 when there was no response
} else {
    console.log(user.name);
}
```

`send()` never throws: every outcome is `{ data, error }`.

```ts
await http.post('/api/users').body({ name: 'Alice' }); // JSON with Content-Type: application/json
await http.get('/api/users').query({ page: 2, tags: ['a', 'b'] }).headers({ Authorization: `Bearer ${token}` });
await http.get('/api/users', { query: { page: 2 } }); // the same settings as an options object
```

The format comes from Content-Type unless you choose it, and any Standard Schema (Zod, Valibot, ArkType…) checks
the data and gives it a type:

```ts
const { data: rows } = await http.get('/report').as('csv'); // string[][], even if sent as text/plain
const { data: user, error } = await http.get('/api/users/1').schema(User); // typed by the schema
// error instanceof ValidationError → error.issues lists what did not match
```

A client for one API, with a timeout per attempt and retries for transient failures:

```ts
const api = http.extend({ baseUrl: 'https://api.example.com/v2', headers: { Authorization: `Bearer ${token}` } });

await api.get('/users').timeout(5000).retry(2); // GET …/v2/users; repeats a 503 or a dropped connection
```

Progress of an upload (through `XMLHttpRequest`, in every browser) and of a download:

```ts
await http.post('/api/files').body(file).onUploadProgress(({ loaded, total, percent }) => render(percent));
await http.get('/api/report.csv').onDownloadProgress(({ loaded }) => show(loaded)); // no Content-Length: no total
```

Server-Sent Events with reconnects, also as a POST with a token, which `EventSource` cannot do:

```ts
const chat = http.sse('/api/chat').headers({ Authorization: `Bearer ${token}` }).body({ prompt }).json<Delta>();

for await (const { data } of chat) {
    render(data.text); // data is a string without .json()
}

for await (const event of http.sse('/api/feed').reconnect()) console.log(event.data); // Last-Event-ID on reconnect
```

Hooks around every request of a client, and one network request for identical requests sent at the same moment:

```ts
const sign: BeforeRequest = async ({ url, init }) => {
    const headers = new Headers(init.headers);
    headers.set('Authorization', `Bearer ${await auth.token()}`);
    return { url, init: { ...init, headers } };
};
const api = http.extend({ dedupe: true, hooks: { beforeRequest: [sign] } });

await Promise.all([api.get('/me'), api.get('/me')]); // one request, two results
```

- How it works and what each content type returns: [docs/en/ARCHITECTURE.md](docs/en/ARCHITECTURE.md)
  ([по-русски](docs/ru/ARCHITECTURE.md))
- Lessons, each next to fetch, XMLHttpRequest, axios, ky and ofetch: [examples/](examples/README.md)
- Decisions: [adr/](adr/README.md)
- Changes: [CHANGELOG.md](CHANGELOG.md)
