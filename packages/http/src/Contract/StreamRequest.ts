import type { Query } from '@Http/Contract/Query';
import type { Payload } from '@Http/Contract/Payload';
import type { Reconnect } from '@Http/Contract/Reconnect';
import type { ServerEvent } from '@Http/Contract/ServerEvent';

/**
 * @summary A stream of server events: `http.sse()` returns it and `for await` opens it.
 *
 * @description Every `for await` opens its own connection; `break` or the signal closes it. There is no `as()`,
 * `schema()`, `retry()`, `timeout()` or progress: a stream is read as events while it lasts.
 *
 * @template T - The type of `data` of each event: a string, or the type given to `.json()`.
 *
 * @example
 * for await (const { event, data } of http.sse('/api/events')) {
 *     console.log(event, data);
 * }
 */
export interface StreamRequest<T = string> extends AsyncIterable<ServerEvent<T>> {
    /**
     * @summary Sets the method; without it a stream is a GET, or a POST when it has a body.
     *
     * @param method - `'GET'` or `'POST'`.
     * @returns A new stream with the method.
     *
     * @example
     * http.sse('/api/chat').method('POST').body({ prompt });
     */
    method(method: 'GET' | 'POST'): StreamRequest<T>;

    /**
     * @summary Adds headers to every connection; a header set again replaces the earlier value.
     *
     * @param headers - The headers to add, in any form `new Headers()` accepts.
     * @returns A new stream with the headers.
     *
     * @example
     * http.sse('/api/events').headers({ Authorization: `Bearer ${token}` });
     */
    headers(headers: HeadersInit): StreamRequest<T>;

    /**
     * @summary Adds query parameters; a key set again replaces the earlier value.
     *
     * @param query - The parameters to add.
     * @returns A new stream with the parameters.
     *
     * @example
     * http.sse('/api/events').query({ channel: 'news' }); // /api/events?channel=news
     */
    query(query: Query): StreamRequest<T>;

    /**
     * @summary Sets the body, encoded as for `post()`; the stream becomes a POST unless `.method()` says otherwise.
     *
     * @param body - The body; an object is sent as JSON.
     * @returns A new stream with the body.
     *
     * @example
     * for await (const { data } of http.sse('/api/chat').body({ prompt: 'Hi' })) output.append(data);
     */
    body(body: Payload): StreamRequest<T>;

    /**
     * @summary Sets the `AbortSignal` that closes the stream; the `for await` then ends without an error.
     *
     * @param signal - The signal.
     * @returns A new stream with the signal.
     *
     * @example
     * const controller = new AbortController();
     * setTimeout(() => controller.abort(), 60_000);
     * for await (const event of http.sse('/api/events').signal(controller.signal)) console.log(event.data);
     */
    signal(signal: AbortSignal): StreamRequest<T>;

    /**
     * @summary Opens the connection again when it drops, sending `Last-Event-ID` with the last id received.
     *
     * @description A number is the count of reconnects in a row (an event received resets it); without an argument
     * there is no limit, as in `EventSource`. The wait is 1000 ms, or the `retry:` field of the server. The end of
     * the stream, an error status and an abort are not reconnected. `0` turns reconnects off.
     *
     * @param reconnect - The number of reconnects in a row or the options. Default: no limit.
     * @returns A new stream with the setting.
     *
     * @example
     * http.sse('/api/events').reconnect(5);
     * http.sse('/api/events').reconnect({ retries: 5, delay: 2000 });
     */
    reconnect(reconnect?: Reconnect): StreamRequest<T>;

    /**
     * @summary Parses `data` of every event as JSON; data that is not JSON ends the stream with an `HttpError`.
     *
     * @returns A new stream whose events carry `data` of type `U`.
     *
     * @example
     * for await (const { data } of http.sse('/api/prices').json<{ price: number }>()) chart.push(data.price);
     */
    json<U = unknown>(): StreamRequest<U>;
}
