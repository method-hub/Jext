import type { StreamRequest } from '@Http/Contract/StreamRequest';
import type { StreamOptions } from '@Http/Contract/StreamOptions';
import type { Streamer } from '@Http/Contract/Streamer';
import type { ServerEvent } from '@Http/Contract/ServerEvent';
import type { Payload } from '@Http/Contract/Payload';
import type { Query } from '@Http/Contract/Query';
import type { Reconnect } from '@Http/Contract/Reconnect';
import HttpError from '@Http/Error/HttpError';
import Encoder from '@Http/Request/Encoder';
import QueryString from '@Http/Request/QueryString';

/**
 * @summary The stream object returned by `http.sse()`: an async iterable of server events.
 *
 * @description Nothing is sent until `for await` starts; every `for await` opens its own connection, so a prepared
 * stream can be read again. Every chain method returns a new stream and leaves this one as it was. The request goes
 * through `fetch`, not `EventSource`, so it can be a POST with a body and carry any header.
 *
 * @template T - The type of `data` of each event: a string, or the type given to `.json()`.
 */
export default class EventStream<T = string> implements StreamRequest<T> {
    private readonly streamer: Streamer;
    private readonly url: string;
    private readonly options: StreamOptions;

    constructor(streamer: Streamer, url: string, options: StreamOptions = {}) {
        this.streamer = streamer;
        this.url = url;
        this.options = options;
    }

    /** @inheritDoc */
    public method(method: 'GET' | 'POST'): EventStream<T> {
        return this.with({ method });
    }

    /** @inheritDoc */
    public headers(headers: HeadersInit): EventStream<T> {
        const merged = new Headers(this.options.headers);
        new Headers(headers).forEach((value, name) => merged.set(name, value));

        return this.with({ headers: merged });
    }

    /** @inheritDoc */
    public query(query: Query): EventStream<T> {
        return this.with({ query: { ...this.options.query, ...query } });
    }

    /** @inheritDoc */
    public body(body: Payload): EventStream<T> {
        return this.with({ body });
    }

    /** @inheritDoc */
    public signal(signal: AbortSignal): EventStream<T> {
        return this.with({ signal });
    }

    /** @inheritDoc */
    public reconnect(reconnect: Reconnect = {}): EventStream<T> {
        return this.with({ reconnect });
    }

    /** @inheritDoc */
    public json<U = unknown>(): EventStream<U> {
        return this.with<U>({ json: true });
    }

    /**
     * @summary Opens the connection; this is what `for await` calls.
     *
     * @description A stream that cannot be built (a body that cannot be serialized to JSON, a body on a GET)
     * throws an `HttpError` with status `0` from the first `next()`.
     *
     * @returns The iterator of the events of one connection.
     */
    public [Symbol.asyncIterator](): AsyncIterator<ServerEvent<T>> {
        let init: RequestInit;

        try {
            init = this.init();
        } catch (cause: unknown) {
            return EventStream.failed<T>(cause);
        }

        const { reconnect, json } = this.options;
        return this.streamer.stream<T>(this.target(), init, { reconnect, json })[Symbol.asyncIterator]();
    }

    /**
     * @summary Copies this stream with some options replaced; this stream does not change.
     *
     * @param options - The options to set.
     * @returns The new stream.
     */
    private with<U = T>(options: StreamOptions): EventStream<U> {
        return new EventStream<U>(this.streamer, this.url, { ...this.options, ...options });
    }

    /**
     * @summary Appends the query parameters to the URL.
     *
     * @returns The URL to open.
     */
    private target(): string {
        return this.options.query ? QueryString.append(this.url, this.options.query) : this.url;
    }

    /**
     * @summary Builds the `RequestInit`: method, headers with `Accept: text/event-stream`, the encoded body, signal.
     *
     * @returns The settings for `fetch`.
     * @throws {TypeError} When a GET stream has a body.
     */
    private init(): RequestInit {
        const { options } = this;
        const headers = new Headers(options.headers);
        const { body, contentType } = Encoder.encode(options.body ?? null);
        const method = options.method ?? (body === null ? 'GET' : 'POST');

        if (method === 'GET' && body !== null) {
            throw new TypeError('A GET stream cannot have a body');
        }

        if (contentType && !headers.has('Content-Type')) {
            headers.set('Content-Type', contentType);
        }

        if (!headers.has('Accept')) {
            headers.set('Accept', 'text/event-stream');
        }

        return { method, headers, body, signal: options.signal ?? null };
    }

    /**
     * @summary An iterator whose first `next()` rejects with an `HttpError` with status `0`.
     *
     * @param cause - Why the stream could not be built.
     * @returns The failing iterator.
     */
    private static failed<U>(cause: unknown): AsyncIterator<ServerEvent<U>> {
        const error = new HttpError('The request could not be built', { status: 0, response: null, data: null, cause });

        return { next: () => Promise.reject(error) };
    }
}
