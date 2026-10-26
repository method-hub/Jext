# Upload a file

[Русская версия](ru.md)

`POST /files` takes a file in a multipart form and answers with its name, size and type. Every tab builds the same
`FormData` with a 12-byte text file named `hello.txt`.

<!-- @variants -->

## What differs

- The file is a `Blob` (or a `File` from `<input type="file">`) appended to `FormData` with a file name; the third
  argument of `append()` becomes the name the server sees.
- Sending works the same in every tool, as in the form lesson: the browser sets the multipart header.
- The difference is in what comes next: progress of a large upload. **XMLHttpRequest**, **axios** (it uses
  XMLHttpRequest in the browser) and **jext** (`.onUploadProgress()` switches the request to XMLHttpRequest) report it in
  every browser. **ky** has `onUploadProgress` too, but it needs streaming request bodies, which not every browser
  supports, and silently does nothing without them. **fetch** and **ofetch** do not report it.
