# Прочитать JSON, присланный как текст

[English version](en.md)

`GET /settings` присылает JSON с неверным `Content-Type: text/plain`. Каждая вкладка возвращает разобранные настройки.

<!-- @variants -->

## В чём разница

- **jext** выбирает формат по Content-Type и здесь вернул бы строку; `.as('json')` задаёт формат явно. Остальные форматы
  работают так же: `.as('csv')`, `.as('blob')`, `.as('text')`…
- **fetch** и **ky** разбирают через `.json()` при любом Content-Type.
- **XMLHttpRequest** разбирает при `responseType = 'json'`.
- **axios** по умолчанию пробует `JSON.parse` на любом текстовом ответе, поэтому получает объект без настроек.
- **ofetch** читает `text/plain` как строку, ему нужен `responseType: 'json'`.
