# Заменить пользователя через PUT

[English version](en.md)

`PUT /users/2` заменяет пользователя целиком: в теле все поля, а сервер отвечает сохранённым пользователем.

<!-- @variants -->

## В чём разница

- Запрос такой же, как `POST` с JSON, меняется только метод: `http.put()` в jext, `axios.put()`, `ky.put()`,
  `method: 'PUT'` в fetch, XMLHttpRequest и ofetch.
- **jext**, **axios**, **ky** (`json`) и **ofetch** сериализуют объект; **fetch** и **XMLHttpRequest** требуют
  `JSON.stringify()` и заголовок.
- `PUT` идемпотентен: два одинаковых запроса дают тот же результат. Поэтому повторы (`.retry()` в jext, повтор по
  умолчанию в ky) охватывают `PUT` и не трогают `POST`.
