# Read an HTML page

[Русская версия](ru.md)

`GET /about.html` answers with `Content-Type: text/html`. Every tab finds the `<h1>` of the page and returns its text,
`Lesson server`.

<!-- @variants -->

## What differs

- **jext** turns `text/html` into a `Document` with the browser's `DOMParser`, so `data` can be queried right away.
- **XMLHttpRequest** can do the same with `responseType = 'document'`.
- **fetch**, **axios**, **ky** and **ofetch** give the text; the page is parsed with `DOMParser` by hand.
- `DOMParser` belongs to the browser. In Node every tab needs a DOM implementation such as jsdom.
