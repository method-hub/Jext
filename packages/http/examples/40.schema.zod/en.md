# Check the response with zod

[Русская версия](ru.md)

`GET /users/1` returns a user; a zod schema checks it and gives its type. Every tab returns the checked user.

<!-- @variants -->

## What differs

- **jext** takes any [Standard Schema](https://standardschema.dev) (zod, valibot, ArkType…) in `.schema()`: `data` gets
  the type of the schema, and a mismatch is a `ValidationError` in `error`, not a throw.
- **ky** also takes a Standard Schema in `.json(schema)` and throws `SchemaValidationError` on a mismatch.
- **fetch**, **XMLHttpRequest**, **axios** and **ofetch** know nothing about schemas: the lesson calls `User.parse()` on
  the data, which throws a `ZodError`.
