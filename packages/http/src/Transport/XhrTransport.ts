import type { Transport } from '@Http/Contract/Transport';
import type { ProgressListener } from '@Http/Contract/Progress';
import Meter from '@Http/Transport/Meter';

/**
 * @summary Statuses whose response must not have a body: `new Response()` rejects one for them.
 */
const EMPTY = [101, 204, 205, 304];

/**
 * @summary Sends a request with `XMLHttpRequest`, the only browser API that reports upload progress.
 *
 * @description Used only when the request has an upload listener. The response is read whole as an
 * `ArrayBuffer` and wrapped into a real `Response`, so the decoders, `.as()` and `.schema()` work as with `fetch`.
 * When the response arrives the upload is over, so a body of known size reports `100%` then if the browser did not
 * (some environments fire no upload events for small bodies).
 * XHR cannot send a `ReadableStream` body or use `keepalive`, and the response has no `url`.
 */
export default class XhrTransport implements Transport {
    private readonly upload: ProgressListener;
    private readonly download: ProgressListener | null;
    private sent = 0;

    constructor(upload: ProgressListener, download: ProgressListener | null = null) {
        this.upload = upload;
        this.download = download;
    }

    /**
     * @summary Sends the request and resolves with its response, or rejects like `fetch` would.
     *
     * @param url - The resource URL or a `Request` (only its URL is used).
     * @param init - The settings of the request; its signal aborts the XHR.
     * @returns The response, whatever its status.
     */
    public send(url: string | Request, init: RequestInit): Promise<Response> {
        this.sent = 0;

        return new Promise<Response>((resolve, reject) => {
            const { signal } = init;

            if (signal?.aborted) {
                reject(XhrTransport.reason(signal));
                return;
            }

            const xhr = this.open(url instanceof Request ? url.url : url, init);
            const abort = (): void => xhr.abort();

            xhr.onload = (): void => {
                this.finish(init.body ?? null);
                resolve(XhrTransport.response(xhr));
            };
            xhr.onerror = (): void => reject(new TypeError('Network request failed'));
            xhr.onabort = (): void => reject(XhrTransport.reason(signal ?? null));
            xhr.onloadend = (): void => signal?.removeEventListener('abort', abort);
            signal?.addEventListener('abort', abort, { once: true });

            xhr.send(init.body as XMLHttpRequestBodyInit | null);
        });
    }

    /**
     * @summary Creates the XHR: method, URL, headers, credentials and the progress listeners.
     *
     * @param url - The resource URL.
     * @param init - The settings of the request.
     * @returns The opened XHR, ready to send.
     * @throws {TypeError} When the body is a `ReadableStream`.
     */
    private open(url: string, init: RequestInit): XMLHttpRequest {
        if (init.body instanceof ReadableStream) {
            throw new TypeError('XMLHttpRequest cannot send a ReadableStream body');
        }

        const xhr = new XMLHttpRequest();
        xhr.open(init.method ?? 'GET', url);
        xhr.responseType = 'arraybuffer';
        xhr.withCredentials = init.credentials === 'include';
        new Headers(init.headers).forEach((value, name) => xhr.setRequestHeader(name, value));

        const size = XhrTransport.bodySize(init.body ?? null);
        xhr.upload.onprogress = (event): void => {
            this.sent = event.loaded;
            this.upload(Meter.of(event.loaded, event.lengthComputable ? event.total : size));
        };

        if (this.download) {
            const { download } = this;
            xhr.onprogress = (event): void => download(Meter.of(event.loaded, XhrTransport.size(event)));
        }

        return xhr;
    }

    /**
     * @summary Reports the upload as complete when the browser did not report its last bytes.
     *
     * @param body - The body of the request.
     */
    private finish(body: BodyInit | null): void {
        const size = XhrTransport.bodySize(body);

        if (size !== null && this.sent < size) {
            this.sent = size;
            this.upload(Meter.of(size, size));
        }
    }

    /**
     * @summary The size of a request body in bytes, or `null` for a body whose size only XHR knows (`FormData`).
     *
     * @param body - The body of the request.
     * @returns The size in bytes, `0` without a body, `null` when it is not known.
     */
    private static bodySize(body: BodyInit | null): number | null {
        if (body === null) {
            return 0;
        }

        if (typeof body === 'string' || body instanceof URLSearchParams) {
            return new TextEncoder().encode(String(body)).byteLength;
        }

        if (body instanceof Blob) {
            return body.size;
        }

        return body instanceof ArrayBuffer || ArrayBuffer.isView(body) ? body.byteLength : null;
    }

    /**
     * @summary The size of a download from the progress event.
     *
     * @param event - The progress event of the XHR.
     * @returns The size in bytes, `null` when it is not known.
     */
    private static size(event: ProgressEvent): number | null {
        return event.lengthComputable ? event.total : null;
    }

    /**
     * @summary Wraps what the XHR received into a `Response`.
     *
     * @param xhr - The finished XHR.
     * @returns The response with the status, the headers and the body.
     */
    private static response(xhr: XMLHttpRequest): Response {
        const headers = new Headers();

        xhr.getAllResponseHeaders()
            .trim()
            .split(/[\r\n]+/)
            .forEach((line) => {
                const colon = line.indexOf(':');

                if (colon > 0) {
                    headers.append(line.slice(0, colon).trim(), line.slice(colon + 1).trim());
                }
            });

        const body = EMPTY.includes(xhr.status) ? null : new Uint8Array(xhr.response as ArrayBuffer);

        return new Response(body, { status: xhr.status, statusText: xhr.statusText, headers });
    }

    /**
     * @summary The error an aborted request rejects with: the reason of the signal, or an `AbortError`.
     *
     * @param signal - The aborted signal.
     * @returns The error.
     */
    private static reason(signal: AbortSignal | null): Error {
        const reason: unknown = signal?.reason;

        // Not instanceof Error: a reason made by AbortSignal.timeout() may come from another realm
        return typeof reason === 'object' && reason !== null
            ? (reason as Error)
            : new DOMException('The operation was aborted', 'AbortError');
    }
}
