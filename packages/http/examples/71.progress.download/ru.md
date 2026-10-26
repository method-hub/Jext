# Показать прогресс скачивания

[English version](en.md)

`GET /download` присылает 256 КиБ с `Content-Length`. Каждая вкладка возвращает полученный размер и последний процент, о
котором сообщил прогресс.

<!-- @variants -->

## В чём разница

- У **jext** есть `.onDownloadProgress()` с `{ loaded, total, percent }`; percent от 0 до 100, а без `Content-Length`
  известен только `loaded`.
- **XMLHttpRequest** сообщает через `onprogress`, **axios** через `onDownloadProgress` (`progress` это доля от 0 до 1),
  **ky** через `onDownloadProgress` (`percent` это доля от 0 до 1).
- **fetch** ни о чём не сообщает, но его тело это поток: урок читает его по кускам и считает байты относительно
  `Content-Length`.
- У **ofetch** нет опции прогресса: `ofetch.raw` с `responseType: 'stream'` даёт поток и заголовки, чтобы считать так
  же.
