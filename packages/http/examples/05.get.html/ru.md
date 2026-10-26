# Прочитать HTML-страницу

[English version](en.md)

`GET /about.html` отвечает с `Content-Type: text/html`. Каждая вкладка находит `<h1>` страницы и возвращает его
текст, `Lesson server`.

<!-- @variants -->

## В чём разница

- **jext** превращает `text/html` в `Document` через браузерный `DOMParser`, так что по `data` можно сразу искать.
- **XMLHttpRequest** умеет то же с `responseType = 'document'`.
- **fetch**, **axios**, **ky** и **ofetch** отдают текст; страницу разбирают через `DOMParser` вручную.
- `DOMParser` есть только в браузере. В Node любой вкладке нужна реализация DOM, например jsdom.
