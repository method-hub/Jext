# Read plain text

[Русская версия](ru.md)

`GET /robots.txt` answers with `Content-Type: text/plain`. Every tab returns the text as a string.

<!-- @variants -->

## What differs

- **jext** sees `text/plain` and gives a string without any option.
- **fetch** and **ky** need `.text()`; **XMLHttpRequest** has the text in `responseText`.
- **axios** tries `JSON.parse` on every string response unless `responseType: 'text'` is set: a text that happens to
  be valid JSON, such as `42`, would turn into a number.
- **ofetch** picks the text reader from `Content-Type` as well; `responseType: 'text'` only makes it explicit.
