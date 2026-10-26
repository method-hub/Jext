# Read JSON sent as plain text

[Русская версия](ru.md)

`GET /settings` sends JSON with the wrong `Content-Type: text/plain`. Every tab returns the parsed settings.

<!-- @variants -->

## What differs

- **jext** picks the format by Content-Type and would return a string here; `.as('json')` forces the format. The other
  formats work the same way: `.as('csv')`, `.as('blob')`, `.as('text')`…
- **fetch** and **ky** parse with `.json()` whatever the Content-Type is.
- **XMLHttpRequest** parses with `responseType = 'json'`.
- **axios** tries `JSON.parse` on every text response by default, so it gets the object without settings.
- **ofetch** reads `text/plain` as a string and needs `responseType: 'json'`.
