import type { Query } from '@Http/Contract/Query';
import type { Payload } from '@Http/Contract/Payload';
import type { Format } from '@Http/Contract/Format';
import type { StandardSchema } from '@Http/Contract/StandardSchema';
import type { Retry } from '@Http/Contract/RetryOptions';
import type { ProgressListener } from '@Http/Contract/Progress';

/**
 * @summary Options of any request, named exactly like the chain methods of `HttpRequest`.
 */
export interface RequestOptions {
    /** Same as `.headers()`: the headers of this request, over the headers of the client. */
    headers?: HeadersInit;
    /** Same as `.query()`: query parameters added to the URL. */
    query?: Query;
    /** Same as `.signal()`: aborts the request, its retries and their waits. */
    signal?: AbortSignal;
    /** Same as `.keepalive()`: lets the request outlive the page, like `fetch(url, { keepalive: true })`. */
    keepalive?: boolean;
    /** Same as `.timeout()`: the time one attempt may take, in ms; `0` turns off the timeout of the client. */
    timeout?: number;
    /** Same as `.retry()`: how failed attempts are repeated; `0` turns off the retries of the client. */
    retry?: Retry;
    /** Same as `.dedupe()`: share the response with an identical request in flight; `false` turns it off. */
    dedupe?: boolean;
    /** Same as `.onDownloadProgress()`: called while the body of the response is received. */
    onDownloadProgress?: ProgressListener;
    /** Same as `.as()`; the type is not inferred from the options object, use `.as()` for that. */
    as?: Format;
    /** Same as `.schema()`; the type is not inferred from the options object, use `.schema()` for that. */
    schema?: StandardSchema;
}

/**
 * @summary Options of a request that carries a body (`post`, `put`, `patch`).
 */
export interface BodyRequestOptions extends RequestOptions {
    /** Same as `.body()`: the body of the request; an object is sent as JSON. */
    body?: Payload;
    /** Same as `.onUploadProgress()`: called while the body is sent; the request goes through `XMLHttpRequest`. */
    onUploadProgress?: ProgressListener;
}
