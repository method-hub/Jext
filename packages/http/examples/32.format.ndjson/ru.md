# Прочитать строки NDJSON

[English version](en.md)

`GET /events.ndjson` присылает по одному JSON-объекту на строку как `application/x-ndjson`. Каждая вкладка возвращает
объекты массивом.

<!-- @variants -->

## В чём разница

- **jext** разбирает `application/x-ndjson` (и `application/jsonl`) построчно и пропускает пустые строки.
- **fetch**, **XMLHttpRequest**, **axios**, **ky** и **ofetch** читают тело как текст, делят его по переносам строк и
  вызывают `JSON.parse` для каждой строки.
- **ofetch** нужен `responseType: 'text'`: текстом он считает только JSON и текстовые типы, а любой другой, включая
  `x-ndjson`, возвращает как `Blob`.
