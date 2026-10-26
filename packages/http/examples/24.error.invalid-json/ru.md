# Заметить битое JSON-тело

[English version](en.md)

`GET /broken.json` говорит `Content-Type: application/json`, но тело обрезано посередине. Каждая вкладка возвращает
`true`, когда замечает, что тело не валидный JSON.

<!-- @variants -->

## В чём разница

- **jext** возвращает `HttpError` со статусом ответа (`200`) и `SyntaxError` в `cause`; `data` равен `null`, так что
  битые данные никогда не выглядят настоящими.
- **fetch** и **ky**: `.json()` бросает `SyntaxError`.
- **XMLHttpRequest** с `responseType = 'json'` молча отдаёт `null`, то же значение, что и тело, которое буквально
  `null`.
- **axios** по умолчанию молча возвращает битый текст строкой. Исключение (`ERR_BAD_RESPONSE`) он бросает только с
  `responseType: 'json'` и `transitional: { silentJSONParsing: false }`.
- **ofetch** по умолчанию разбирает через `destr`, который возвращает битый текст строкой; урок передаёт
  `parseResponse: JSON.parse`, чтобы он бросил исключение.
