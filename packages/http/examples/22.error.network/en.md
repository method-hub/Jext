# Notice a broken connection

[Русская версия](ru.md)

`GET /drop` closes the connection without answering, as a server that crashed or a network that went down. There is
no status, so every tab returns `0`.

<!-- @variants -->

## What differs

- **jext** returns `HttpError` with `status` `0`; `error.cause` holds the rejection of `fetch`.
- **fetch** rejects only in this case (and on abort): any answer, even 500, resolves.
- **XMLHttpRequest** calls `onerror`, and `xhr.status` is `0`.
- **axios** throws `AxiosError` without `response` (`code` is `ERR_NETWORK`).
- **ky** throws `NetworkError`; **ofetch** throws `FetchError` without `response`. Both would repeat the request
  first, so the lesson sets `retry: 0`.
