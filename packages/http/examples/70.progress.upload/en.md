# Show upload progress

[Русская версия](ru.md)

`POST /upload` receives 64 KiB and answers with the number of bytes. A tab returns the answer and whether its progress
listener ran; a tool that cannot report an upload returns `null`, and its tab says what to use instead.

<!-- @variants -->

## What differs

- **jext** sends the request through `XMLHttpRequest` when `.onUploadProgress()` is set, the only browser API that
  reports an upload. It gets `{ loaded, total, percent }` and reports 100% when the response arrives, if the browser did
  not.
- **XMLHttpRequest** reports through `xhr.upload.onprogress`; **axios** uses it in a browser for its `onUploadProgress`.
- **fetch** reports no upload: a request body can be streamed only in Chromium and only over HTTP/2.
- **ky** has `onUploadProgress` built on such a stream: over HTTP/1.1 in Chromium the upload fails, elsewhere the
  listener is silently ignored.
- **ofetch** has no progress option.
