# Проверить ответ схемой valibot

[English version](en.md)

Тот же пользователь, что в уроке про zod, но схема из valibot. Каждая вкладка возвращает проверенного пользователя.

<!-- @variants -->

## В чём разница

- **jext** и **ky** принимают схему valibot как есть, потому что valibot тоже реализует Standard Schema: код тот же, что
  с zod.
- **fetch**, **XMLHttpRequest**, **axios** и **ofetch** вызывают `v.parse(User, data)`, который бросает `ValiError`.
