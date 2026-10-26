# Check the response with valibot

[Русская версия](ru.md)

The same user as in the zod lesson, checked by a valibot schema. Every tab returns the checked user.

<!-- @variants -->

## What differs

- **jext** and **ky** take the valibot schema as it is, because valibot implements Standard Schema too: the code is the
  same as with zod.
- **fetch**, **XMLHttpRequest**, **axios** and **ofetch** call `v.parse(User, data)`, which throws a `ValiError`.
