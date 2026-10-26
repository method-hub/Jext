# Read an XML document

[Русская версия](ru.md)

`GET /books.xml` sends a catalog of two books as `application/xml`. Every tab returns the titles.

<!-- @variants -->

## What differs

- **jext** turns XML into a plain object with fast-xml-parser: `data.catalog.book` is an array of `{ title, year }`,
  numbers are numbers. A tag that occurs once is an object, not an array of one, and attributes are left out.
- **fetch**, **axios**, **ky** and **ofetch** read the body as text and pass it to `DOMParser`, then query the document
  with CSS selectors.
- **XMLHttpRequest** builds the document itself with `responseType = 'document'`.
