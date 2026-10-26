# Notice a broken JSON body

[Русская версия](ru.md)

`GET /broken.json` says `Content-Type: application/json`, but the body is cut off in the middle. Every tab returns
`true` when it notices that the body is not valid JSON.

<!-- @variants -->

## What differs

- **jext** returns `HttpError` with the status of the response (`200`) and a `SyntaxError` in `cause`; `data` is
  `null`, so broken data never looks like real data.
- **fetch** and **ky**: `.json()` throws `SyntaxError`.
- **XMLHttpRequest** with `responseType = 'json'` silently gives `null`, the same value as a body that is literally
  `null`.
- **axios** by default silently returns the broken text as a string. It throws (`ERR_BAD_RESPONSE`) only with
  `responseType: 'json'` and `transitional: { silentJSONParsing: false }`.
- **ofetch** by default parses with `destr`, which returns the broken text as a string; the lesson passes
  `parseResponse: JSON.parse` to make it throw.
