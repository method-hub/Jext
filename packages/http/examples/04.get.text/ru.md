# Прочитать простой текст

[English version](en.md)

`GET /robots.txt` отвечает с `Content-Type: text/plain`. Каждая вкладка возвращает текст строкой.

<!-- @variants -->

## В чём разница

- **jext** видит `text/plain` и отдаёт строку без всяких опций.
- **fetch** и **ky** требуют `.text()`; у **XMLHttpRequest** текст лежит в `responseText`.
- **axios** пробует `JSON.parse` на любом строковом ответе, если не задан `responseType: 'text'`: текст, который
  случайно оказался валидным JSON, например `42`, превратится в число.
- **ofetch** тоже выбирает чтение текста по `Content-Type`; `responseType: 'text'` просто делает это явным.
