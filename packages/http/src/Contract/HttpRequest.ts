import type { Result } from '@Http/Contract/Result';
import type { Query } from '@Http/Contract/Query';
import type { Payload } from '@Http/Contract/Payload';
import type { Format, Formats } from '@Http/Contract/Format';
import type { InferOutput, StandardSchema } from '@Http/Contract/StandardSchema';
import type { Retry } from '@Http/Contract/RetryOptions';
import type { ProgressListener } from '@Http/Contract/Progress';

/**
 * @summary A request that is sent when it is awaited; every method returns a new request.
 *
 * @description Nothing is sent until the request is awaited, and awaiting it again does not send it again. A chain
 * method leaves the request it was called on as it was, so a prepared request can be reused.
 *
 * @template T - The type of the decoded body of a successful response.
 * @template E - The type of the decoded body of an error response.
 *
 * @example
 * const { data, error } = await http.get<User[]>('/api/users').query({ page: 2 }).timeout(5000);
 */
export interface HttpRequest<T, E = unknown> extends PromiseLike<Result<T, E>> {
    /**
     * @summary Adds headers; a header set again replaces the earlier value.
     *
     * @param headers - The headers to add, in any form `new Headers()` accepts.
     * @returns A new request with the headers.
     *
     * @example
     * await http.get('/api/me').headers({ Authorization: `Bearer ${token}` });
     */
    headers(headers: HeadersInit): HttpRequest<T, E>;

    /**
     * @summary Adds query parameters; a key set again replaces the earlier value.
     *
     * @description An array value repeats the key (`tags=a&tags=b`); `null` and `undefined` are left out.
     *
     * @param query - The parameters to add.
     * @returns A new request with the parameters.
     *
     * @example
     * await http.get('/api/users').query({ page: 2, tags: ['a', 'b'] }); // /api/users?page=2&tags=a&tags=b
     */
    query(query: Query): HttpRequest<T, E>;

    /**
     * @summary Sets the `AbortSignal` that cancels the request, its retries and their waits.
     *
     * @param signal - The signal; once it aborts, the request ends with an `HttpError` with status `0`.
     * @returns A new request with the signal.
     *
     * @example
     * const controller = new AbortController();
     * const pending = http.get('/api/search').query({ q }).signal(controller.signal);
     * controller.abort();
     */
    signal(signal: AbortSignal): HttpRequest<T, E>;

    /**
     * @summary Lets the request outlive the page, e.g. analytics sent on `pagehide`.
     *
     * @param enabled - `false` turns it off again. Default: `true`.
     * @returns A new request with the setting.
     *
     * @example
     * addEventListener('pagehide', () => void http.post('/api/stats').body(stats).keepalive());
     */
    keepalive(enabled?: boolean): HttpRequest<T, E>;

    /**
     * @summary Limits the time one attempt may take; the request then ends with an `HttpError` with status `0`.
     *
     * @description Each attempt gets the full time again when `.retry()` repeats it. `0` turns off the timeout set
     * by `http.extend()`.
     *
     * @param ms - The time in milliseconds.
     * @returns A new request with the timeout.
     *
     * @example
     * const { error } = await http.get('/api/report').timeout(5000); // error.status is 0 after 5 s
     */
    timeout(ms: number): HttpRequest<T, E>;

    /**
     * @summary Repeats the request on a network error or a 408, 429, 500, 502, 503, 504 response.
     *
     * @description Only GET, HEAD, PUT, DELETE and OPTIONS are repeated by default, with a wait of 300 ms doubled
     * each time, or as long as `Retry-After` says. A number is the count of repeats; an object also sets the
     * methods, statuses and the first wait. `0` turns off the retries set by `http.extend()`.
     *
     * @param retry - The number of repeats or the full options.
     * @returns A new request with the retries.
     *
     * @example
     * await http.get('/api/users').retry(2);
     * await http.get('/api/users').retry({ limit: 3, statuses: [503], delay: 1000 });
     */
    retry(retry: Retry): HttpRequest<T, E>;

    /**
     * @summary Lets an identical GET or HEAD request that is already in flight answer this one too.
     *
     * @description Requests are identical when the method, the URL and the headers are. Each caller gets its own
     * copy of the response. A caller's signal stops only its own wait; the shared request is aborted when every
     * caller has stopped. `false` turns off the dedupe set by `http.extend()`.
     *
     * @param enabled - `false` turns it off. Default: `true`.
     * @returns A new request with the setting.
     *
     * @example
     * const [a, b] = await Promise.all([http.get('/api/me').dedupe(), http.get('/api/me').dedupe()]); // one fetch
     */
    dedupe(enabled?: boolean): HttpRequest<T, E>;

    /**
     * @summary Calls `listener` while the body of the response is received.
     *
     * @description `total` and `percent` come from `Content-Length`; without it, or for a compressed body, only
     * `loaded` is given. A retried request reports each attempt from zero.
     *
     * @param listener - Receives `{ loaded, total?, percent? }`.
     * @returns A new request with the listener.
     *
     * @example
     * await http.get('/files/video.mp4').as('blob').onDownloadProgress(({ percent }) => (bar.value = percent ?? 0));
     */
    onDownloadProgress(listener: ProgressListener): HttpRequest<T, E>;

    /**
     * @summary Decodes a 2xx body as `format` instead of detecting it from Content-Type.
     *
     * @description The data type follows the format (`'csv'` gives `string[][]`); `json`, `ndjson` and `xml` keep
     * the type given to the request. An error body is still detected from Content-Type.
     *
     * @param format - The name of the format: `'json'`, `'csv'`, `'blob'` and so on.
     * @returns A new request whose data has the type of the format.
     *
     * @example
     * const { data: rows } = await http.get('/report').as('csv'); // string[][], even if sent as text/plain
     */
    as<F extends Format>(format: F): HttpRequest<Formats<T>[F], E>;

    /**
     * @summary Validates the decoded data with a Standard Schema; the data type is the schema's output.
     *
     * @description A mismatch resolves with a `ValidationError` that lists the issues. Works with any library
     * that implements Standard Schema v1 (Zod, Valibot, ArkType…), without depending on one.
     *
     * @param schema - The schema.
     * @returns A new request whose data has the output type of the schema.
     *
     * @example
     * const { data: user, error } = await http.get('/api/users/1').schema(User); // error.issues on a mismatch
     */
    schema<S extends StandardSchema>(schema: S): HttpRequest<InferOutput<S>, E>;
}

/**
 * @summary A request with a body: only `post`, `put` and `patch` return it.
 *
 * @description The chain methods are those of `HttpRequest`, plus `body()` and `onUploadProgress()`; each returns
 * a `BodyRequest`, so they can be called in any order.
 *
 * @template T - The type of the decoded body of a successful response.
 * @template E - The type of the decoded body of an error response.
 *
 * @example
 * const { data } = await http.post<User>('/api/users').body({ name: 'Alice' });
 */
export interface BodyRequest<T, E = unknown> extends HttpRequest<T, E> {
    /** @inheritDoc */
    headers(headers: HeadersInit): BodyRequest<T, E>;

    /** @inheritDoc */
    query(query: Query): BodyRequest<T, E>;

    /** @inheritDoc */
    signal(signal: AbortSignal): BodyRequest<T, E>;

    /** @inheritDoc */
    keepalive(enabled?: boolean): BodyRequest<T, E>;

    /** @inheritDoc */
    timeout(ms: number): BodyRequest<T, E>;

    /** @inheritDoc */
    retry(retry: Retry): BodyRequest<T, E>;

    /** @inheritDoc */
    dedupe(enabled?: boolean): BodyRequest<T, E>;

    /** @inheritDoc */
    onDownloadProgress(listener: ProgressListener): BodyRequest<T, E>;

    /**
     * @summary Calls `listener` while the body of the request is sent.
     *
     * @description The request then goes through `XMLHttpRequest`, because `fetch` cannot report upload progress.
     * XHR reads the response whole, cannot send a `ReadableStream` and ignores `keepalive`. In Node there is no XHR:
     * the request goes through `fetch` and the listener is not called.
     *
     * @param listener - Receives `{ loaded, total?, percent? }`.
     * @returns A new request with the listener.
     *
     * @example
     * await http.post('/api/upload').body(formData).onUploadProgress(({ percent }) => (bar.value = percent ?? 0));
     */
    onUploadProgress(listener: ProgressListener): BodyRequest<T, E>;

    /** @inheritDoc */
    as<F extends Format>(format: F): BodyRequest<Formats<T>[F], E>;

    /** @inheritDoc */
    schema<S extends StandardSchema>(schema: S): BodyRequest<InferOutput<S>, E>;

    /**
     * @summary Sets the body; its type decides the encoding and the Content-Type.
     *
     * @description `FormData`, `URLSearchParams`, `Blob`, `ArrayBuffer`, typed arrays, streams and strings are sent
     * as they are; any other object, array, number or boolean is sent as JSON with
     * `Content-Type: application/json`. A Content-Type set with `.headers()` wins.
     *
     * @param body - The body.
     * @returns A new request with the body.
     *
     * @example
     * await http.post('/api/users').body({ name: 'Alice' }); // JSON
     * await http.post('/api/avatar').body(formData); // multipart/form-data
     */
    body(body: Payload): BodyRequest<T, E>;
}
