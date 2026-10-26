import type { BodyRequest } from '@Http/Contract/HttpRequest';
import type { BodyRequestOptions } from '@Http/Contract/RequestOptions';
import type { Payload } from '@Http/Contract/Payload';
import type { Query } from '@Http/Contract/Query';
import type { Result } from '@Http/Contract/Result';
import type { Sender } from '@Http/Contract/Sender';
import type { Format, Formats } from '@Http/Contract/Format';
import type { InferOutput, StandardSchema } from '@Http/Contract/StandardSchema';
import type { Retry } from '@Http/Contract/RetryOptions';
import type { ProgressListener } from '@Http/Contract/Progress';
import HttpError from '@Http/Error/HttpError';
import Encoder from '@Http/Request/Encoder';
import QueryString from '@Http/Request/QueryString';

/**
 * @summary What a request is: its method, URL and options.
 */
interface Target {
    /** The HTTP method in upper case. */
    method: string;
    /** The URL without the query parameters of `options`. */
    url: string;
    /** Everything set with the chain methods or the options object. */
    options: BodyRequestOptions;
}

/**
 * @summary The request object returned by `http.get()`, `http.post()` and the other method helpers.
 *
 * @description Nothing is sent until the request is awaited; the result is remembered, so awaiting it again does
 * not send it again. Every chain method returns a new request and leaves this one as it was, so a prepared
 * request can be reused. `Http` hands it out as `HttpRequest` or `BodyRequest`, which hide `body()` where a
 * request has no body.
 *
 * @template T - The type of the decoded body of a successful response.
 * @template E - The type of the decoded body of an error response.
 */
export default class FluentRequest<T, E = unknown> implements BodyRequest<T, E> {
    private readonly sender: Sender;
    private readonly target: Target;
    private pending: Promise<Result<T, E>> | null = null;

    constructor(sender: Sender, target: Target) {
        this.sender = sender;
        this.target = target;
    }

    /** @inheritDoc */
    public headers(headers: HeadersInit): FluentRequest<T, E> {
        const merged = new Headers(this.target.options.headers);
        new Headers(headers).forEach((value, name) => merged.set(name, value));

        return this.with({ headers: merged });
    }

    /** @inheritDoc */
    public query(query: Query): FluentRequest<T, E> {
        return this.with({ query: { ...this.target.options.query, ...query } });
    }

    /** @inheritDoc */
    public body(body: Payload): FluentRequest<T, E> {
        return this.with({ body });
    }

    /** @inheritDoc */
    public signal(signal: AbortSignal): FluentRequest<T, E> {
        return this.with({ signal });
    }

    /** @inheritDoc */
    public keepalive(enabled = true): FluentRequest<T, E> {
        return this.with({ keepalive: enabled });
    }

    /** @inheritDoc */
    public timeout(ms: number): FluentRequest<T, E> {
        return this.with({ timeout: ms });
    }

    /** @inheritDoc */
    public retry(retry: Retry): FluentRequest<T, E> {
        return this.with({ retry });
    }

    /** @inheritDoc */
    public dedupe(enabled = true): FluentRequest<T, E> {
        return this.with({ dedupe: enabled });
    }

    /** @inheritDoc */
    public onUploadProgress(listener: ProgressListener): FluentRequest<T, E> {
        return this.with({ onUploadProgress: listener });
    }

    /** @inheritDoc */
    public onDownloadProgress(listener: ProgressListener): FluentRequest<T, E> {
        return this.with({ onDownloadProgress: listener });
    }

    /** @inheritDoc */
    public as<F extends Format>(format: F): FluentRequest<Formats<T>[F], E> {
        return this.with<Formats<T>[F]>({ as: format });
    }

    /** @inheritDoc */
    public schema<S extends StandardSchema>(schema: S): FluentRequest<InferOutput<S>, E> {
        return this.with<InferOutput<S>>({ schema });
    }

    /**
     * @summary Sends the request once and resolves with its `Result`; this is what `await` calls.
     *
     * @description The first call builds the URL and `RequestInit` and hands them to the sender; the promise is
     * kept in `pending`, so later calls reuse it. A request that cannot be built (a body that cannot be
     * serialized to JSON) resolves with an `HttpError` with status `0` instead of rejecting.
     *
     * @param onFulfilled - Called with the result.
     * @param onRejected - Called if the sender rejects, which `Http` never does.
     * @returns The promise of what the callbacks return.
     */
    public then<F = Result<T, E>, R = never>(
        onFulfilled?: ((result: Result<T, E>) => F | PromiseLike<F>) | null,
        onRejected?: ((reason: unknown) => R | PromiseLike<R>) | null
    ): Promise<F | R> {
        this.pending = this.pending ?? this.dispatch();

        return this.pending.then(onFulfilled, onRejected);
    }

    /**
     * @summary Builds the URL and `RequestInit` and hands them to the sender with the decoding and delivery options.
     *
     * @returns The result of the sender, or an `HttpError` with status `0` when the request cannot be built.
     */
    private dispatch(): Promise<Result<T, E>> {
        try {
            const {
                as: format,
                schema,
                timeout,
                retry,
                dedupe,
                onUploadProgress,
                onDownloadProgress,
            } = this.target.options;
            const options = { format, schema, timeout, retry, dedupe, onUploadProgress, onDownloadProgress };

            return this.sender.send<T, E>(this.url(), this.init(), options);
        } catch (cause: unknown) {
            const failure = { status: 0, response: null, data: null, cause };
            return Promise.resolve({ data: null, error: new HttpError<E>('The request could not be built', failure) });
        }
    }

    /**
     * @summary Copies this request with some options replaced; this request does not change.
     *
     * @param options - The options to set.
     * @returns The new request.
     */
    private with<U = T>(options: BodyRequestOptions): FluentRequest<U, E> {
        const { method, url } = this.target;

        return new FluentRequest<U, E>(this.sender, { method, url, options: { ...this.target.options, ...options } });
    }

    /**
     * @summary Appends the query parameters to the URL.
     *
     * @returns The URL to send.
     */
    private url(): string {
        const { url, options } = this.target;

        return options.query ? QueryString.append(url, options.query) : url;
    }

    /**
     * @summary Builds the `RequestInit`: method, headers, the encoded body with its Content-Type, signal, keepalive.
     *
     * @returns The settings for `fetch`.
     */
    private init(): RequestInit {
        const { method, options } = this.target;
        const headers = new Headers(options.headers);
        const { body, contentType } = Encoder.encode(options.body ?? null);

        if (contentType && !headers.has('Content-Type')) {
            headers.set('Content-Type', contentType);
        }

        return { method, headers, body, signal: options.signal ?? null, keepalive: options.keepalive ?? false };
    }
}
