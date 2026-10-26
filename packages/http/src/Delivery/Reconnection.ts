import type { Reconnect } from '@Http/Contract/Reconnect';
import type { ServerEvent } from '@Http/Contract/ServerEvent';

const DELAY = 1000;

/**
 * @summary The reconnect state of one stream of `http.sse()`: the last event id, the wait and the count of
 * reconnects in a row.
 *
 * @description `seen()` is called for every event: it keeps the id for `Last-Event-ID`, takes the wait from the
 * `retry:` field and resets the count. `wait()` counts a reconnect and sleeps before it.
 */
export default class Reconnection {
    private readonly retries: number;
    private delay: number;
    private id = '';
    private failures = 0;

    constructor(reconnect: Reconnect | undefined) {
        const options = typeof reconnect === 'number' ? { retries: reconnect } : (reconnect ?? { retries: 0 });

        this.retries = Math.max(0, options.retries ?? Infinity);
        this.delay = options.delay ?? DELAY;
    }

    /**
     * @summary Remembers what an event says about reconnecting and resets the count of reconnects in a row.
     *
     * @param event - The event just received.
     */
    public seen(event: ServerEvent<unknown>): void {
        // A new connection starts a new parser, whose events have no id until the server sends one again
        this.id = event.id === '' ? this.id : event.id;
        this.delay = event.retry ?? this.delay;
        this.failures = 0;
    }

    /**
     * @summary The headers of the next connection: `Last-Event-ID` added when the server has sent an id.
     *
     * @param headers - The headers of the stream.
     * @returns The headers of the next connection.
     */
    public headers(headers: HeadersInit | undefined): Headers {
        const next = new Headers(headers);

        if (this.id !== '') {
            next.set('Last-Event-ID', this.id);
        }

        return next;
    }

    /**
     * @summary Whether one more reconnect is allowed.
     *
     * @returns `true` while the count of reconnects in a row is under the limit.
     */
    public allows(): boolean {
        return this.failures < this.retries;
    }

    /**
     * @summary Counts a reconnect and waits before it; resolves with `false` when the signal aborts the wait.
     *
     * @param signal - The caller's signal, `null` when there is none.
     * @returns `true` after the wait, `false` when the signal aborted it.
     */
    public wait(signal: AbortSignal | null): Promise<boolean> {
        this.failures += 1;

        return new Promise<boolean>((resolve) => {
            if (signal?.aborted) {
                resolve(false);
                return;
            }

            const abort = (): void => {
                clearTimeout(timer);
                resolve(false);
            };
            const timer = setTimeout(() => {
                signal?.removeEventListener('abort', abort);
                resolve(true);
            }, this.delay);

            signal?.addEventListener('abort', abort, { once: true });
        });
    }
}
