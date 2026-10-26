# Уроки

[English version](README.md)

Каждый урок решает одну задачу шестью инструментами: jext, `fetch`, `XMLHttpRequest`, axios, ky и ofetch. Все они
обращаются к одному серверу уроков и возвращают одно и то же значение, это проверяет feature-тест каждого урока,
поэтому сравнение остаётся честным. На сайте документации уроки находятся в `/ru/api/http/guide/`, шесть вариантов
показаны вкладками.

Каждый вариант явно и одинаково обрабатывает сбой: статус ошибки превращается в `Error` со строкой статуса
(`404 Not Found`), а ошибка без ответа (сеть, таймаут) пробрасывается как есть. jext возвращает ошибку в `error`, и
вкладка её бросает (в уроках о потоках `HttpError` бросает сам `for await`); fetch и XMLHttpRequest проверяют статус; axios, ky и ofetch ловят свой тип ошибки (`AxiosError`,
`HTTPError`, `FetchError`). Уроки группы «Ошибки» разбирают каждый сбой подробнее.

## Основы

- [Получить список пользователей](01.get.json/ru.md)
- [Отфильтровать параметрами запроса](02.get.query/ru.md)
- [Отправить заголовок](03.get.headers/ru.md)
- [Прочитать простой текст](04.get.text/ru.md)
- [Прочитать HTML-страницу](05.get.html/ru.md)
- [Проверить, что ресурс существует](06.head.exists/ru.md)

## Тело запроса

- [Создать пользователя через JSON](10.post.json/ru.md)
- [Отправить форму как multipart](11.post.form-data/ru.md)
- [Войти через URL-encoded форму](12.post.urlencoded/ru.md)
- [Загрузить файл](13.post.file/ru.md)
- [Заменить пользователя через PUT](14.put.json/ru.md)
- [Изменить одно поле через PATCH](15.patch.json/ru.md)
- [Удалить пользователя](16.delete.by-id/ru.md)

## Ошибки

- [Прочитать тело ошибки 404](20.error.not-found/ru.md)
- [Обработать ошибку сервера](21.error.server/ru.md)
- [Заметить обрыв соединения](22.error.network/ru.md)
- [Не ждать медленный сервер](23.error.timeout/ru.md)
- [Заметить битое JSON-тело](24.error.invalid-json/ru.md)

## Форматы

- [Прочитать таблицу CSV](30.format.csv/ru.md)
- [Прочитать XML](31.format.xml/ru.md)
- [Прочитать строки NDJSON](32.format.ndjson/ru.md)
- [Скачать картинку как Blob](33.format.blob/ru.md)
- [Скачать файл-вложение](34.format.attachment/ru.md)
- [Прочитать JSON, присланный как текст](35.format.as/ru.md)

## Схемы

- [Проверить ответ схемой zod](40.schema.zod/ru.md)
- [Проверить ответ схемой valibot](41.schema.valibot/ru.md)
- [Узнать, что не совпало со схемой](42.schema.mismatch/ru.md)

## Клиент

- [Задать базовый адрес один раз](50.client.base-url/ru.md)
- [Отправлять токен с каждым запросом](51.client.auth/ru.md)
- [Обновить просроченный токен](52.client.hooks.refresh-token/ru.md)
- [Собрать клиент поверх другого](53.client.extend.nested/ru.md)

## Надёжность

- [Повторить запрос после ошибки сервера](60.retry.server-error/ru.md)
- [Подождать столько, сколько просит Retry-After](61.retry.retry-after/ru.md)
- [Отменить запрос](62.abort.signal/ru.md)
- [Один запрос вместо одинаковых](63.dedupe.parallel/ru.md)

## Прогресс

- [Показать прогресс загрузки на сервер](70.progress.upload/ru.md)
- [Показать прогресс скачивания](71.progress.download/ru.md)

## Потоки

- [Прочитать Server-Sent Events](80.sse.read/ru.md)
- [Продолжить поток после обрыва](81.sse.reconnect/ru.md)
- [Получить ответ на POST потоком](82.sse.post/ru.md)

## Как запустить уроки

```sh
npm run examples:serve -w @metapraxis/jext-http   # сервер уроков на http://localhost:4000
```

Сервер раздаёт `__fixtures__/` и ничего не меняет: `POST`, `PUT`, `PATCH` и `DELETE` отвечают так, будто изменили
пользователей. Его единственное состояние это счётчики попыток для уроков о надёжности, по пути и параметру `key`,
поэтому каждый запуск отправляет новый ключ. Каждый вариант это модуль с `export default async function run()`; вызывай его со страницы или из
песочницы с бандлером, пока сервер работает. `npm run tests:feature` прогоняет все варианты против сервера
(`packages/http/tests/Feature/Examples/`).
