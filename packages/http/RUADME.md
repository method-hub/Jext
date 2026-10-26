# @metapraxis/jext-http

[English version](README.md)

HTTP-клиент, который загружает ресурс и возвращает его уже разобранным по Content-Type: JSON, XML, HTML, формы, CSV,
NDJSON, Server-Sent Events, медиа и бинарные данные.

```ts
import { http } from '@metapraxis/jext-http';

const { data: user, error } = await http.send<{ id: number; name: string }>('/api/users/1');

if (error) {
    console.log(error.status, error.data); // 404 и разобранное тело ошибки; 0, если ответа не было
} else {
    console.log(user.name);
}
```

`send()` никогда не бросает исключение: любой исход приходит как `{ data, error }`.

```ts
await http.post('/api/users').body({ name: 'Alice' }); // JSON с Content-Type: application/json
await http.get('/api/users').query({ page: 2, tags: ['a', 'b'] }).headers({ Authorization: `Bearer ${token}` });
await http.get('/api/users', { query: { page: 2 } }); // те же настройки объектом опций
```

Формат берётся из Content-Type, если вы не выбрали его сами, а любая Standard Schema (Zod, Valibot, ArkType…)
проверяет данные и даёт им тип:

```ts
const { data: rows } = await http.get('/report').as('csv'); // string[][], даже если пришёл как text/plain
const { data: user, error } = await http.get('/api/users/1').schema(User); // тип берётся из схемы
// error instanceof ValidationError → в error.issues перечислено, что не совпало
```

Клиент для одного API, с таймаутом на попытку и повторами при временных сбоях:

```ts
const api = http.extend({ baseUrl: 'https://api.example.com/v2', headers: { Authorization: `Bearer ${token}` } });

await api.get('/users').timeout(5000).retry(2); // GET …/v2/users; повторяет 503 и оборванное соединение
```

Прогресс загрузки на сервер (через `XMLHttpRequest`, в любом браузере) и скачивания:

```ts
await http.post('/api/files').body(file).onUploadProgress(({ loaded, total, percent }) => render(percent));
await http.get('/api/report.csv').onDownloadProgress(({ loaded }) => show(loaded)); // без Content-Length нет total
```

Server-Sent Events с переподключением, в том числе POST с токеном, чего не умеет `EventSource`:

```ts
const chat = http.sse('/api/chat').headers({ Authorization: `Bearer ${token}` }).body({ prompt }).json<Delta>();

for await (const { data } of chat) {
    render(data.text); // без .json() data это строка
}

for await (const event of http.sse('/api/feed').reconnect()) console.log(event.data); // Last-Event-ID при переподключении
```

Хуки вокруг каждого запроса клиента и один сетевой запрос на одинаковые запросы, отправленные одновременно:

```ts
const sign: BeforeRequest = async ({ url, init }) => {
    const headers = new Headers(init.headers);
    headers.set('Authorization', `Bearer ${await auth.token()}`);
    return { url, init: { ...init, headers } };
};
const api = http.extend({ dedupe: true, hooks: { beforeRequest: [sign] } });

await Promise.all([api.get('/me'), api.get('/me')]); // один запрос, два результата
```

- Как это работает и что возвращает каждый тип содержимого: [docs/ru/ARCHITECTURE.md](docs/ru/ARCHITECTURE.md)
  ([in English](docs/en/ARCHITECTURE.md))
- Уроки, каждый рядом с fetch, XMLHttpRequest, axios, ky и ofetch: [examples/](examples/RUADME.md)
- Решения: [adr/](adr/README.md)
- Изменения: [CHANGELOG.md](CHANGELOG.md)
