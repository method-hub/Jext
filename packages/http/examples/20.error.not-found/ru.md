# Прочитать тело ошибки 404

[English version](en.md)

`GET /users/42` отвечает 404 с JSON-телом `{ "message": "User 42 not found" }`. Каждая вкладка возвращает статус и
сообщение, то есть то, что интерфейс покажет пользователю.

<!-- @variants -->

## В чём разница

- **jext** возвращает ошибку значением: `error.status` и `error.data`, тело ошибки, разобранное по `Content-Type` и
  типизированное вторым параметром, `http.get<User, { message: string }>()`. Без `try`/`catch`.
- **fetch** и **XMLHttpRequest** считают 404 обычным ответом: статус проверяешь и тело читаешь сам.
- **axios** бросает `AxiosError`; разобранное тело лежит в `error.response.data`, а `axios.isAxiosError()` сужает
  тип.
- **ky** бросает `HTTPError` и уже прочитал тело в `error.data`; `error.response.json()` больше не работает.
- **ofetch** бросает `FetchError` с разобранным телом в `error.data`.
