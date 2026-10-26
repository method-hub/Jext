# Lessons

[Русская версия](RUADME.md)

Every lesson solves one task with six tools: jext, `fetch`, `XMLHttpRequest`, axios, ky and ofetch. They all talk to
the same lesson server and return the same value, which a feature test checks for each lesson, so the comparison
stays honest. On the documentation site the lessons are `/api/http/guide/`, with the six variants as tabs.

Every variant handles a failure explicitly and in the same way: an error status becomes an `Error` with the status
line (`404 Not Found`), and an error without a response (the network, a timeout) is thrown as it is. jext returns the
error in `error` and the tab throws it (in the stream lessons its `for await` throws `HttpError` itself); fetch and XMLHttpRequest check the status; axios, ky and ofetch catch their
own error type (`AxiosError`, `HTTPError`, `FetchError`). The lessons of the Errors group look at each failure closer.

## Basics

- [Get a list of users](01.get.json/en.md)
- [Filter with query parameters](02.get.query/en.md)
- [Send a header](03.get.headers/en.md)
- [Read plain text](04.get.text/en.md)
- [Read an HTML page](05.get.html/en.md)
- [Check that a resource exists](06.head.exists/en.md)

## Request body

- [Create a user with JSON](10.post.json/en.md)
- [Send a form as multipart](11.post.form-data/en.md)
- [Log in with a URL-encoded form](12.post.urlencoded/en.md)
- [Upload a file](13.post.file/en.md)
- [Replace a user with PUT](14.put.json/en.md)
- [Change one field with PATCH](15.patch.json/en.md)
- [Delete a user](16.delete.by-id/en.md)

## Errors

- [Read the error body of a 404](20.error.not-found/en.md)
- [Handle a server error](21.error.server/en.md)
- [Notice a broken connection](22.error.network/en.md)
- [Give up on a slow server](23.error.timeout/en.md)
- [Notice a broken JSON body](24.error.invalid-json/en.md)

## Formats

- [Read a CSV table](30.format.csv/en.md)
- [Read an XML document](31.format.xml/en.md)
- [Read NDJSON lines](32.format.ndjson/en.md)
- [Download an image as a Blob](33.format.blob/en.md)
- [Download a file attachment](34.format.attachment/en.md)
- [Read JSON sent as plain text](35.format.as/en.md)

## Schemas

- [Check the response with zod](40.schema.zod/en.md)
- [Check the response with valibot](41.schema.valibot/en.md)
- [See what did not match the schema](42.schema.mismatch/en.md)

## Client

- [Set the base URL once](50.client.base-url/en.md)
- [Send a token with every request](51.client.auth/en.md)
- [Renew an expired token](52.client.hooks.refresh-token/en.md)
- [Build a client on top of another](53.client.extend.nested/en.md)

## Reliability

- [Retry a server error](60.retry.server-error/en.md)
- [Wait as long as Retry-After asks](61.retry.retry-after/en.md)
- [Cancel a request](62.abort.signal/en.md)
- [Send one request for identical ones](63.dedupe.parallel/en.md)

## Progress

- [Show upload progress](70.progress.upload/en.md)
- [Show download progress](71.progress.download/en.md)

## Streams

- [Read Server-Sent Events](80.sse.read/en.md)
- [Continue a stream after a drop](81.sse.reconnect/en.md)
- [Stream the reply to a POST](82.sse.post/en.md)

## Running the lessons

```sh
npm run examples:serve -w @metapraxis/jext-http   # the lesson server on http://localhost:4000
```

The server serves `__fixtures__/` and changes nothing: `POST`, `PUT`, `PATCH` and `DELETE` answer as if they changed
the users. Its only state are attempt counters for the reliability lessons, kept per path and `key` parameter, so each
run sends a new key. Every variant is a module with `export default async function run()`; call it from a page or a bundler
playground while the server runs. `npm run tests:feature` runs all variants against the server
(`packages/http/tests/Feature/Examples/`).
