# Download an image as a Blob

[Русская версия](ru.md)

`GET /logo.png` sends a 70-byte PNG. Every tab returns the type and the size of the file it got.

<!-- @variants -->

## What differs

- **jext** returns a `Blob` for images, audio, video and other binary types without being asked.
- **fetch** and **ky** call `.blob()`.
- **XMLHttpRequest** and **axios** set `responseType: 'blob'`; without it XMLHttpRequest gives a string and axios tries
  to read the bytes as text.
- **ofetch** returns a `Blob` for an image too; the lesson passes `responseType: 'blob'` to keep the type exact.
