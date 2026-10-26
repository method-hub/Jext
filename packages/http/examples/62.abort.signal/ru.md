# Отменить запрос

[English version](en.md)

`GET /counter` отвечает через 100 мс; `AbortController` отменяет запрос через 20 мс, как при уходе пользователя со
страницы. Каждая вкладка возвращает `'cancelled'`, когда видит отмену.

<!-- @variants -->

## В чём разница

- **jext** принимает сигнал в `.signal()`. Отмена возвращается как `HttpError` со статусом `0` и `AbortError` в `cause`;
  она же останавливает повторы и паузы между ними.
- **fetch** и **ky** отклоняются с самим `AbortError`.
- **XMLHttpRequest** не принимает сигнал: сигнал вызывает `xhr.abort()`, и срабатывает `onabort`.
- **axios** принимает `signal` и бросает `CanceledError`, который узнаёт `axios.isCancel()`.
- **ofetch** заворачивает `AbortError` в `FetchError` и не повторяет отменённый запрос.
