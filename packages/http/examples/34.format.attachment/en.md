# Download a file attachment

[Русская версия](ru.md)

`GET /export` sends a CSV report with `Content-Disposition: attachment`: a file to save, not a table to show. Every tab
returns the type and the size of the file.

<!-- @variants -->

## What differs

- **jext** reads `Content-Disposition`: an attachment stays a `Blob` even when its type is CSV or text, so the file can
  be saved as it came. JSON is still parsed.
- **fetch**, **XMLHttpRequest**, **axios** and **ky** ignore the header; the lesson asks each of them for a `Blob`.
- **ofetch** would read `text/csv` as a string, so it needs `responseType: 'blob'`.
