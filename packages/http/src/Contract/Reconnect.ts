/**
 * @summary How `http.sse()` reconnects after the connection drops: `.reconnect(3)` or `.reconnect({ delay: 500 })`.
 *
 * @description A connection is opened again only when it drops or cannot be made (a network error). The end of
 * the stream, an error status, an abort and a hook that fails are not reconnected.
 */
export interface ReconnectOptions {
    /** How many reconnects in a row are allowed; an event received resets the count. Default: no limit. */
    retries?: number;
    /** The wait before a reconnect in ms. Default: 1000. A `retry:` field from the server replaces it. */
    delay?: number;
}

/**
 * @summary What `.reconnect()` and the `reconnect` option accept: a number of reconnects in a row or the options.
 */
export type Reconnect = number | ReconnectOptions;
