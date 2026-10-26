# Read NDJSON lines

[Русская версия](ru.md)

`GET /events.ndjson` sends one JSON object per line as `application/x-ndjson`. Every tab returns the objects as an
array.

<!-- @variants -->

## What differs

- **jext** parses `application/x-ndjson` (and `application/jsonl`) line by line and skips empty lines.
- **fetch**, **XMLHttpRequest**, **axios**, **ky** and **ofetch** read the body as text, split it by line breaks and
  call `JSON.parse` for each line.
- **ofetch** needs `responseType: 'text'`: it treats only JSON and text types as text and returns any other type,
  `x-ndjson` included, as a `Blob`.
