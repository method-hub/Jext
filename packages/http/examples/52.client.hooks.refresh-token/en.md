# Renew an expired token

[Русская версия](ru.md)

The client starts with an expired token. On a 401 it logs in again through `POST /login`, keeps the new token and
repeats the request. Every tab returns the name from `GET /me`.

<!-- @variants -->

## What differs

- **jext** signs every request in a `beforeRequest` hook; an `afterResponse` hook sees the 401, gets a new token and
  returns the response of the repeated request.
- **axios** does the same with a request interceptor and a response interceptor; a `retried` flag on the config stops an
  endless loop.
- **ky** repeats the request from `afterResponse` by returning `ky.retry({ request })` with the new header.
- **ofetch** retries a 401 with `retry: 1` and `retryStatusCodes: [401]`; `onResponseError` renews the token before the
  retry and `onRequest` signs it.
- **fetch** and **XMLHttpRequest** check the status in `api()` and send the request again themselves.
