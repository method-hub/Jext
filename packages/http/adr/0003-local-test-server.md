# 0003. http: integration tests run against a local server

- Status: accepted
- Date: 2026-10-23

## Context

Integration tests must exercise the real `fetch` and network stack (sockets, chunked bodies, headers as a server
sends them), not a mocked `Response`. The client handles more than a dozen content types, including streams.

## Decision

Each integration test file starts a `node:http` server on `127.0.0.1` with port `0` in `beforeAll` and closes it in
`afterAll`. The server answers each route with a file from `tests/Integration/__fixtures__` and the headers listed
in the test file. Streaming formats (SSE) are written in small chunks. Tests never reach the internet.

## Consequences

Tests are fast, deterministic, run offline and in the pre-push hook. Any content type, status or malformed header
can be served. The server code (about 20 lines) repeats in every file, because test files are self-contained.
Quirks of real third-party APIs are not covered.

## Alternatives considered

- A public service (httpbin.org, postman-echo): depends on the network and the service, is rate limited, and cannot
  serve every content type the client handles (no multipart responses, no custom types).
- Live requests behind an environment flag (`JEXT_LIVE=1`): rarely run, so they rot; dropped.
- One shared server in `globalSetup`: the port has to travel through an environment variable, and files are no
  longer self-contained.
