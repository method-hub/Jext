import type { Chain } from '@Http/Contract/Chain';
import type { Result } from '@Http/Contract/Result';
import type { Sender } from '@Http/Contract/Sender';
import type { BodyRequest, HttpRequest } from '@Http/Contract/HttpRequest';
import type { BodyRequestOptions, RequestOptions } from '@Http/Contract/RequestOptions';
import type { Decoding } from '@Http/Contract/Decoding';
import type { SendOptions } from '@Http/Contract/SendOptions';
import type { ClientOptions } from '@Http/Contract/ClientOptions';
import type { Format } from '@Http/Contract/Format';
import type { StandardSchema } from '@Http/Contract/StandardSchema';
import type { Outgoing } from '@Http/Contract/Hooks';
import type { ServerEvent } from '@Http/Contract/ServerEvent';
import type { StreamOptions } from '@Http/Contract/StreamOptions';
import type { StreamRequest } from '@Http/Contract/StreamRequest';
import type { StreamSettings, Streamer } from '@Http/Contract/Streamer';
import HttpError from '@Http/Error/HttpError';
import ValidationError from '@Http/Error/ValidationError';
import type Picker from '@Http/Root/Picker';
import FluentRequest from '@Http/Request/FluentRequest';
import EventStream from '@Http/Request/EventStream';
import BaseUrl from '@Http/Request/BaseUrl';
import Delivery from '@Http/Delivery/Delivery';
import RetryPolicy from '@Http/Delivery/RetryPolicy';
import HookRunner from '@Http/Delivery/HookRunner';
import Inflight from '@Http/Delivery/Inflight';
import Reconnection from '@Http/Delivery/Reconnection';
import SseParser from '@Http/Parsers/SseParser';

/**
 * @summary One stream of `http.sse()` while it is read: where it goes, how and its reconnect state.
 */
interface Listening {
    /** The URL of the stream with its query parameters. */
    url: string;
    /** The request; its signal closes the stream. */
    init: RequestInit;
    /** Whether `data` of every event is parsed as JSON. */
    json: boolean;
    /** The reconnect state: how many attempts are left and the last event id. */
    reconnection: Reconnection;
}

/**
 * @summary Facade for executing HTTP requests with automatic response type detection.
 *
 * @description Delegates response parsing to a chain of parsers
 * configured by `Bootstrap`. The appropriate parser is selected
 * automatically based on the Content-Type and Content-Disposition headers.
 * Nothing is thrown: every outcome is returned as `{ data, error }`.
 * `get`, `post` and the other method helpers return a request object that is sent when awaited.
 * `extend()` returns a new client with shared settings (`baseUrl`, `headers`, `timeout`, `retry`, `dedupe`,
 * `hooks`). `sse()` returns a stream of server events read with `for await`.
 *
 * @example
 * import { http } from '@metapraxis/jext-http';
 *
 * const { data: users, error } = await http.get<User[]>('/api/users');
 * if (error) console.log(error.status, error.data);
 */
export default class Http implements Sender, Streamer {
    private readonly parsers: Chain<unknown>;
    private readonly picker: Picker | null;
    private readonly defaults: Readonly<ClientOptions>;
    private readonly hooks: HookRunner;
    private readonly inflight = new Inflight();

    constructor(parsers: Chain<unknown>, picker: Picker | null = null, defaults: ClientOptions = {}) {
        this.parsers = parsers;
        this.picker = picker;
        this.defaults = defaults;
        this.hooks = new HookRunner(defaults.hooks);
    }

    /**
     * @summary Returns a new client whose requests share these settings; this client does not change.
     *
     * @description `headers` are merged with the headers of this client, a header set again replaces the old value.
     * `hooks` run after the hooks of this client. `baseUrl`, `timeout`, `retry` and `dedupe` replace the values of
     * this client. The new client uses the same decoders and does not share requests in flight with this one.
     *
     * @param options - The settings to add.
     * @returns A new client.
     *
     * @example
     * const api = http.extend({ baseUrl: 'https://api.example.com/v2', headers: { Authorization: 'Bearer …' } });
     * const { data } = await api.get<User[]>('/users'); // GET https://api.example.com/v2/users
     */
    public extend(options: ClientOptions): Http {
        const headers = new Headers(this.defaults.headers);
        new Headers(options.headers).forEach((value, name) => headers.set(name, value));
        const hooks = this.hooks.concat(options.hooks);

        return new Http(this.parsers, this.picker, { ...this.defaults, ...options, headers, hooks });
    }

    /**
     * @summary Prepares a stream of server events (`text/event-stream`); `for await` opens it.
     *
     * @description The stream goes through `fetch`, so it can be a POST with a body and carry any header. `data`
     * is a string; `.json<T>()` parses it. `baseUrl`, `headers` and `hooks` of the client apply, `timeout`, `retry`
     * and `dedupe` do not.
     *
     * @param url - The URL of the stream.
     * @param options - The same settings as the chain methods of the stream.
     * @returns A stream that opens a connection on `for await`.
     *
     * @example
     * for await (const { data } of http.sse('/api/news').reconnect()) feed.prepend(data);
     */
    public sse(url: string | URL, options: StreamOptions = {}): StreamRequest {
        return new EventStream(this, String(url), options);
    }

    /**
     * @summary Prepares a GET request; it is sent when awaited.
     *
     * @param url - The resource URL; relative URLs get the `baseUrl` of the client.
     * @param options - The same settings as the chain methods.
     * @returns A request that is sent when awaited.
     *
     * @example
     * const { data: users } = await http.get<User[]>('/api/users').query({ page: 2 });
     */
    public get<T, E = unknown>(url: string | URL, options: RequestOptions = {}): HttpRequest<T, E> {
        return this.request<T, E>('GET', url, options);
    }

    /**
     * @summary Prepares a HEAD request; it is sent when awaited.
     *
     * @param url - The resource URL; relative URLs get the `baseUrl` of the client.
     * @param options - The same settings as the chain methods.
     * @returns A request that is sent when awaited; its data is `null`.
     *
     * @example
     * const { error } = await http.head('/files/report.pdf'); // error.status is 404 when the file is missing
     */
    public head<T = null, E = unknown>(url: string | URL, options: RequestOptions = {}): HttpRequest<T, E> {
        return this.request<T, E>('HEAD', url, options);
    }

    /**
     * @summary Prepares a DELETE request; it is sent when awaited.
     *
     * @param url - The resource URL; relative URLs get the `baseUrl` of the client.
     * @param options - The same settings as the chain methods.
     * @returns A request that is sent when awaited.
     *
     * @example
     * const { error } = await http.delete('/api/users/1');
     */
    public delete<T, E = unknown>(url: string | URL, options: RequestOptions = {}): HttpRequest<T, E> {
        return this.request<T, E>('DELETE', url, options);
    }

    /**
     * @summary Prepares a POST request with an optional body; it is sent when awaited.
     *
     * @param url - The resource URL; relative URLs get the `baseUrl` of the client.
     * @param options - The same settings as the chain methods, `body` included.
     * @returns A request with a body that is sent when awaited.
     *
     * @example
     * const { data: user } = await http.post<User>('/api/users').body({ name: 'Alice' });
     */
    public post<T, E = unknown>(url: string | URL, options: BodyRequestOptions = {}): BodyRequest<T, E> {
        return this.request<T, E>('POST', url, options);
    }

    /**
     * @summary Prepares a PUT request with an optional body; it is sent when awaited.
     *
     * @param url - The resource URL; relative URLs get the `baseUrl` of the client.
     * @param options - The same settings as the chain methods, `body` included.
     * @returns A request with a body that is sent when awaited.
     *
     * @example
     * await http.put<User>('/api/users/1').body({ name: 'Alice', role: 'admin' });
     */
    public put<T, E = unknown>(url: string | URL, options: BodyRequestOptions = {}): BodyRequest<T, E> {
        return this.request<T, E>('PUT', url, options);
    }

    /**
     * @summary Prepares a PATCH request with an optional body; it is sent when awaited.
     *
     * @param url - The resource URL; relative URLs get the `baseUrl` of the client.
     * @param options - The same settings as the chain methods, `body` included.
     * @returns A request with a body that is sent when awaited.
     *
     * @example
     * await http.patch<User>('/api/users/1').body({ role: 'admin' });
     */
    public patch<T, E = unknown>(url: string | URL, options: BodyRequestOptions = {}): BodyRequest<T, E> {
        return this.request<T, E>('PATCH', url, options);
    }

    /**
     * @summary Executes the request and passes the Response to the parser chain.
     *
     * @description A 2xx response gives `{ data, error: null }`. An error status, a request without a response
     * and a body that cannot be decoded give `{ data: null, error }` with an `HttpError`;
     * for an error status its body is decoded by the same chain into `error.data`.
     *
     * `decoding.format` replaces Content-Type detection for a 2xx body, `decoding.schema` validates the decoded data
     * and turns a mismatch into a `ValidationError`.
     *
     * `options.onUploadProgress` and `options.onDownloadProgress` hear the progress of the bodies.
     * `options.timeout` limits each attempt and `options.retry` repeats failed ones; both fall back to the settings
     * given to `extend()`, as do `baseUrl` (for a relative string URL) and `headers` (under the headers of `init`).
     *
     * @param url - The resource URL, or a `Request` (sent as it is, without `baseUrl` and the client headers).
     * @param init - Method, headers, body and the other settings of `fetch`.
     * @param options - A format, a schema, a timeout, retries, dedupe and progress listeners.
     * @returns The decoded data or the error.
     *
     * @example
     * const { data, error } = await http.send<User>('/api/users/1');
     * const { data: rows } = await http.send('/report', {}, { format: 'csv', timeout: 5000 });
     */
    public async send<T, E = unknown>(
        url: string | URL | Request,
        init: RequestInit = {},
        options: SendOptions = {}
    ): Promise<Result<T, E>> {
        const timeout = options.timeout ?? this.defaults.timeout ?? 0;
        const { retry = this.defaults.retry, dedupe = this.defaults.dedupe } = options;
        let response: Response;

        try {
            response = await this.deliver(url, init, { ...options, timeout, retry, dedupe });
        } catch (cause: unknown) {
            if (cause instanceof HttpError) {
                return { data: null, error: cause as HttpError<E> };
            }

            const failure = { status: 0, response: null, data: null, cause };
            return { data: null, error: new HttpError<E>(Http.unanswered(cause, timeout), failure) };
        }

        if (!response.ok) {
            const message = `${response.status} ${response.statusText}`.trim();
            const data = await this.errorBody<E>(response);
            return { data: null, error: new HttpError<E>(message, { status: response.status, response, data }) };
        }

        return this.success<T, E>(response, options);
    }

    /**
     * @summary Opens a stream of server events and yields its events, reconnecting while `settings` allow.
     *
     * @description What `for await` over `http.sse()` runs. Each connection goes through the `beforeRequest` and
     * `afterResponse` hooks and gets `Last-Event-ID` once the server has sent an id. A 204 or the end of the stream
     * ends the loop, and so does an abort, without an error. An error status, a response that is not
     * `text/event-stream`, data that is not JSON after `.json()`, a failed hook, and a drop that may not be
     * reconnected throw an `HttpError`.
     *
     * @param url - The resource URL.
     * @param init - The request; its signal closes the stream.
     * @param settings - How to reconnect and whether `data` is JSON.
     * @returns The events, one connection after another.
     *
     * @example
     * for await (const event of http.stream('/api/events', { method: 'GET' }, { reconnect: 3 })) console.log(event);
     */
    public async *stream<T = string>(
        url: string,
        init: RequestInit,
        settings: StreamSettings = {}
    ): AsyncGenerator<ServerEvent<T>, void, undefined> {
        const reconnection = new Reconnection(settings.reconnect);
        const stream = { url, init, json: settings.json === true, reconnection };
        let open = true;

        while (open) {
            open = yield* this.connection<T>(stream);
            open = open && (await reconnection.wait(init.signal ?? null));
        }
    }

    /**
     * @summary Reads one connection; returns `true` when it dropped and may be opened again.
     *
     * @param stream - The stream being read.
     * @returns `true` when the connection dropped and may be opened again, `false` when the stream ended.
     */
    private async *connection<T>(stream: Listening): AsyncGenerator<ServerEvent<T>, boolean, undefined> {
        const { init, reconnection } = stream;
        const caller = init.signal ?? null;
        const controller = new AbortController();
        const signal = caller ? AbortSignal.any([caller, controller.signal]) : controller.signal;
        let response: Response | null = null;

        try {
            response = await this.open(stream.url, { ...init, headers: reconnection.headers(init.headers), signal });
            const events: Iterable<ServerEvent> | AsyncIterable<ServerEvent> =
                response === null ? [] : await new SseParser().wrap(response);

            for await (const event of events) {
                reconnection.seen(event);
                yield Http.event<T>(event, stream.json, response);
            }

            return false;
        } catch (cause: unknown) {
            if (caller?.aborted) {
                return false;
            }

            if (cause instanceof HttpError || !reconnection.allows()) {
                throw Http.interrupted(cause, response);
            }

            return true;
        } finally {
            // Closes the connection when the loop ends early: break, return or a thrown error
            controller.abort();
        }
    }

    /**
     * @summary Sends one connection of a stream; resolves with its response, or `null` for a 204.
     *
     * @param url - The URL of the stream.
     * @param init - The request of this connection, with `Last-Event-ID` and its own signal.
     * @returns The response, or `null` for a 204.
     */
    private async open(url: string, init: RequestInit): Promise<Response | null> {
        const request = await this.hooks.request(this.prepare(url, init));
        const response = await this.hooks.response(await fetch(request.url, request.init), request);

        if (response.status === 204) {
            return null;
        }

        if (!response.ok) {
            const message = `${response.status} ${response.statusText}`.trim();
            const data = await this.errorBody<unknown>(response);
            throw new HttpError(message, { status: response.status, response, data });
        }

        if (!(response.headers.get('Content-Type') ?? '').toLowerCase().startsWith('text/event-stream')) {
            await response.body?.cancel();
            throw new HttpError('The response is not an event stream', {
                status: response.status,
                response,
                data: null,
            });
        }

        return response;
    }

    /**
     * @summary Parses `data` of the event as JSON when the stream asked for it.
     *
     * @param event - The event as the parser gave it.
     * @param json - Whether to parse `data`.
     * @param response - The response of the connection, for the error.
     * @returns The event with `data` parsed or as it was.
     */
    private static event<T>(event: ServerEvent, json: boolean, response: Response): ServerEvent<T> {
        if (!json) {
            return event as unknown as ServerEvent<T>;
        }

        try {
            return { ...event, data: JSON.parse(event.data) as T };
        } catch (cause: unknown) {
            const failure = { status: response.status, response, data: null, cause };
            throw new HttpError('The event data could not be decoded', failure);
        }
    }

    /**
     * @summary Turns what stopped a connection into the error the `for await` throws.
     *
     * @param cause - What was thrown.
     * @param response - The response of the connection, `null` when none arrived.
     * @returns The `HttpError` to throw.
     */
    private static interrupted(cause: unknown, response: Response | null): HttpError {
        if (cause instanceof HttpError) {
            return cause;
        }

        return response === null
            ? new HttpError('The request got no response', { status: 0, response: null, data: null, cause })
            : new HttpError('The event stream was interrupted', {
                  status: response.status,
                  response,
                  data: null,
                  cause,
              });
    }

    /**
     * @summary Applies the client to a request: the hooks, the shared request in flight, the transport.
     *
     * @param url - The resource URL or a `Request`.
     * @param init - The settings of the request.
     * @param options - The delivery options: timeout, retries, dedupe, progress.
     * @returns The response after the `afterResponse` hooks.
     */
    private async deliver(url: string | URL | Request, init: RequestInit, options: SendOptions): Promise<Response> {
        const request = await this.hooks.request(this.prepare(url, init));
        const response = await this.transmit(request, options);

        return this.hooks.response(response, request);
    }

    /**
     * @summary The request with `baseUrl` and the headers of the client; a `Request` object stays as it is.
     *
     * @param url - The resource URL or a `Request`.
     * @param init - The settings of the request.
     * @returns The request as hooks see it.
     */
    private prepare(url: string | URL | Request, init: RequestInit): Outgoing {
        if (url instanceof Request) {
            return { url, init };
        }

        const target = BaseUrl.resolve(this.defaults.baseUrl, String(url));

        if (!this.defaults.headers) {
            return { url: target, init };
        }

        const headers = new Headers(this.defaults.headers);
        new Headers(init.headers).forEach((value, name) => headers.set(name, value));

        return { url: target, init: { ...init, headers } };
    }

    /**
     * @summary Sends the request through `Delivery`, or joins an identical one in flight when it may share it.
     *
     * @param request - The request after the `beforeRequest` hooks.
     * @param options - The delivery options.
     * @returns The response.
     */
    private transmit({ url, init }: Outgoing, options: SendOptions): Promise<Response> {
        if (!Http.shareable(url, init, options)) {
            return Delivery.send(url, init, options);
        }

        return this.inflight.send(Inflight.key(url, init), init.signal ?? null, (signal) =>
            Delivery.send(url, { ...init, signal }, options)
        );
    }

    /**
     * @summary Whether a request may share an identical one in flight: a GET or HEAD string URL without progress.
     *
     * @param url - The URL or a `Request`.
     * @param init - The settings of the request.
     * @param options - The delivery options.
     * @returns `true` when the request may be shared.
     */
    private static shareable(url: string | Request, init: RequestInit, options: SendOptions): url is string {
        const method = (init.method ?? 'GET').toUpperCase();

        return (
            options.dedupe === true &&
            typeof url === 'string' &&
            (method === 'GET' || method === 'HEAD') &&
            !options.onUploadProgress &&
            !options.onDownloadProgress
        );
    }

    /**
     * @summary The message of the error for a request that got no response.
     *
     * @param cause - What the transport rejected with.
     * @param timeout - The timeout of one attempt in ms.
     * @returns The message.
     */
    private static unanswered(cause: unknown, timeout: number): string {
        return RetryPolicy.errorName(cause) === 'TimeoutError'
            ? `The request timed out after ${timeout} ms`
            : 'The request got no response';
    }

    /**
     * @summary Creates the request object of a method helper.
     *
     * @param method - The HTTP method.
     * @param url - The resource URL.
     * @param options - The settings of the request.
     * @returns The request object.
     */
    private request<T, E>(method: string, url: string | URL, options: BodyRequestOptions): FluentRequest<T, E> {
        return new FluentRequest<T, E>(this, { method, url: String(url), options });
    }

    /**
     * @summary Decodes a 2xx response, with the chosen format or by Content-Type, then validates it with the schema.
     *
     * @param response - The 2xx response.
     * @param decoding - The format and the schema.
     * @returns The data, or an `HttpError` when the body cannot be decoded.
     */
    private async success<T, E>(response: Response, { format, schema }: Decoding): Promise<Result<T, E>> {
        let data: unknown;

        try {
            data = format ? await this.pick(response, format) : await this.decode<unknown>(response);
        } catch (cause: unknown) {
            const failure = { status: response.status, response, data: null, cause };
            return { data: null, error: new HttpError<E>('The response body could not be decoded', failure) };
        }

        return schema ? this.validate<T, E>(data, schema, response) : { data: data as T, error: null };
    }

    /**
     * @summary Validates the decoded data with the schema.
     *
     * @param data - The decoded data.
     * @param schema - The schema given to `.schema()`.
     * @param response - The response, for the error.
     * @returns The validated data, a `ValidationError` with the issues, or an `HttpError` when the schema throws.
     */
    private async validate<T, E>(data: unknown, schema: StandardSchema, response: Response): Promise<Result<T, E>> {
        const failure = { status: response.status, response, data: null };

        try {
            const outcome = await schema['~standard'].validate(data);

            if ('value' in outcome && !outcome.issues) {
                return { data: outcome.value as T, error: null };
            }

            return { data: null, error: new ValidationError<E>(outcome.issues, data, failure) };
        } catch (cause: unknown) {
            return {
                data: null,
                error: new HttpError<E>('The schema could not validate the response', { ...failure, cause }),
            };
        }
    }

    /**
     * @summary Decodes the response with the decoder of `format`.
     *
     * @param response - The response.
     * @param format - The format given to `.as()`.
     * @returns The decoded body.
     * @throws {TypeError} When `Http` was created without a `Picker`.
     */
    private pick(response: Response, format: Format): Promise<unknown> {
        if (!this.picker) {
            throw new TypeError(`No decoders for formats were given to Http, so .as('${format}') cannot be used`);
        }

        return this.picker.decode(response, format);
    }

    /**
     * @summary Decodes the body of an error response with the chain.
     *
     * @param response - The error response.
     * @returns The decoded body, `null` when it cannot be decoded.
     */
    private async errorBody<D>(response: Response): Promise<D | null> {
        try {
            return await this.decode<D>(response);
        } catch {
            return null;
        }
    }

    /**
     * @summary Decodes the response with the parser chain.
     *
     * @param response - The response.
     * @returns The decoded body.
     */
    private decode<D>(response: Response): Promise<D> {
        return this.parsers.decode(response) as Promise<D>;
    }
}
