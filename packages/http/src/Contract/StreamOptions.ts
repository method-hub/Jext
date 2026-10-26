import type { Query } from '@Http/Contract/Query';
import type { Payload } from '@Http/Contract/Payload';
import type { Reconnect } from '@Http/Contract/Reconnect';

/**
 * @summary Options of `http.sse()`, named exactly like the chain methods of `StreamRequest`.
 */
export interface StreamOptions {
    /** Same as `.method()`; `POST` when a body is given and no method is. Default: `GET`. */
    method?: 'GET' | 'POST';
    /** Same as `.headers()`: the headers of every connection, over the headers of the client. */
    headers?: HeadersInit;
    /** Same as `.query()`: query parameters added to the URL. */
    query?: Query;
    /** Same as `.body()`: the body of a POST stream; an object is sent as JSON. */
    body?: Payload;
    /** Same as `.signal()`: closes the stream and stops reconnecting. */
    signal?: AbortSignal;
    /** Same as `.reconnect()`: how a dropped connection is opened again; `0` turns reconnects off. */
    reconnect?: Reconnect;
    /** Same as `.json()`; the type is not inferred from the options object, use `.json<T>()` for that. */
    json?: boolean;
}
