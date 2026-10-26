# Show download progress

[Русская версия](ru.md)

`GET /download` sends 256 KiB with `Content-Length`. Every tab returns the size it got and the last percent its progress
reported.

<!-- @variants -->

## What differs

- **jext** has `.onDownloadProgress()` with `{ loaded, total, percent }`; percent is 0–100, and without `Content-Length`
  only `loaded` is known.
- **XMLHttpRequest** reports through `onprogress`, **axios** through `onDownloadProgress` (`progress` is a share from 0
  to 1), **ky** through `onDownloadProgress` (`percent` is a share from 0 to 1).
- **fetch** reports nothing, but its body is a stream: the lesson reads it chunk by chunk and counts the bytes against
  `Content-Length`.
- **ofetch** has no progress option: `ofetch.raw` with `responseType: 'stream'` gives the stream and the headers to
  count the same way.
