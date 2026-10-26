# Изменить одно поле через PATCH

[English version](en.md)

`PATCH /users/2` отправляет только изменённые поля, здесь `role`, а сервер отвечает обновлённым пользователем
целиком.

<!-- @variants -->

## В чём разница

- От `PUT` отличаются только метод и тело: `http.patch()`, `axios.patch()`, `ky.patch()`, `method: 'PATCH'`.
- В отличие от `GET` и `POST`, `PATCH` со страницы другого источника всегда требует CORS-preflight, и сервер должен
  указать `PATCH` в `Access-Control-Allow-Methods`. В fetch и XMLHttpRequest метод надо писать заглавными: браузер сам
  поднимает регистр у `get`, `post`, `put` и `delete`, а `patch` отправляет как есть.
