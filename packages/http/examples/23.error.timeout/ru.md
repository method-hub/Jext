# Не ждать медленный сервер

[English version](en.md)

`GET /slow` отвечает через секунду; каждая вкладка ждёт 200 мс и возвращает `true`, когда перестала ждать.

<!-- @variants -->

## В чём разница

- **jext** ограничивает каждую попытку через `.timeout(ms)` и возвращает `HttpError` со статусом `0`, сообщением
  `The request timed out after 200 ms` и `TimeoutError` в `cause`.
- У **fetch** нет опции таймаута: `AbortSignal.timeout(ms)` отменяет запрос, и промис отклоняется с `TimeoutError`.
- У **XMLHttpRequest** есть `xhr.timeout` и колбэк `ontimeout`.
- У **axios** есть `timeout`, он бросает `AxiosError` с `code` `ECONNABORTED`.
- У **ky** есть `timeout`, по умолчанию 10 секунд, он бросает `TimeoutError`.
- У **ofetch** есть `timeout`, он бросает `FetchError` с `TimeoutError` в `cause`; ещё он один раз повторил бы
  запрос, поэтому урок ставит `retry: 0` (ky тоже, чтобы была одна попытка).
