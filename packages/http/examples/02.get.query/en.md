# Filter with query parameters

[Русская версия](ru.md)

`GET /users?role=admin&limit=10` returns only the admins. Every tab sends the same two parameters, one of them a
number.

<!-- @variants -->

## What differs

- **jext** takes an object in `.query()`: numbers, booleans and arrays are allowed, and the values are encoded for
  you. The same object can go into the options: `http.get(url, { query })`.
- **fetch** and **XMLHttpRequest** have no option for it: you build the string with `URLSearchParams`, which takes only
  strings, so the number goes through `String()`.
- **axios** calls the option `params`, **ky** calls it `searchParams`, **ofetch** calls it `query`. All three accept
  numbers.
