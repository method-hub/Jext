# Войти через URL-encoded форму

[English version](en.md)

`POST /login` принимает `application/x-www-form-urlencoded` с `username` и `password` и отвечает токеном. Каждая
вкладка отправляет один и тот же `URLSearchParams`.

<!-- @variants -->

## В чём разница

- **jext**, **fetch**, **ky** и **ofetch** передают `URLSearchParams` в `fetch`, который кодирует его и ставит
  `Content-Type`.
- **axios** узнаёт `URLSearchParams`, сериализует его и ставит тот же заголовок.
- Вкладка **XMLHttpRequest** ставит заголовок и отправляет строку сама. Современные браузеры принимают
  `URLSearchParams` в `send()`, но явная форма работает везде, включая старые браузеры и jsdom.
