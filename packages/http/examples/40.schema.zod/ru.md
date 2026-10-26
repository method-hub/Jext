# Проверить ответ схемой zod

[English version](en.md)

`GET /users/1` возвращает пользователя; схема zod проверяет его и даёт тип. Каждая вкладка возвращает проверенного
пользователя.

<!-- @variants -->

## В чём разница

- **jext** принимает в `.schema()` любую [Standard Schema](https://standardschema.dev) (zod, valibot, ArkType…): `data`
  получает тип схемы, а несовпадение приходит как `ValidationError` в `error`, без исключения.
- **ky** тоже принимает Standard Schema в `.json(schema)` и при несовпадении бросает `SchemaValidationError`.
- **fetch**, **XMLHttpRequest**, **axios** и **ofetch** ничего не знают о схемах: урок вызывает `User.parse()` на
  данных, и тот бросает `ZodError`.
