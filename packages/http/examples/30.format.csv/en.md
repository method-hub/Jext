# Read a CSV table

[Русская версия](ru.md)

`GET /report.csv` sends a table as `text/csv`; one cell holds a comma inside quotes. Every tab returns the rows as
arrays of strings, the header row first.

<!-- @variants -->

## What differs

- **jext** turns `text/csv` into `string[][]` by itself, following RFC 4180: quoted cells may hold the delimiter, line
  breaks and doubled quotes. `text/tab-separated-values` is split by tabs.
- **fetch**, **XMLHttpRequest**, **axios**, **ky** and **ofetch** have no CSV reader: they read the body as text and the
  lesson parses it with a small regular expression, which does not handle a line break inside quotes.
- **axios** and **ofetch** are asked for text with `responseType: 'text'`; ofetch would otherwise read `text/csv` as
  text anyway, axios would try JSON first.
