/**
 * @summary A shared request: its response, the controller that aborts it and how many callers wait for it.
 */
interface Entry {
    /** The response of the shared request. */
    response: Promise<Response>;
    /** Aborts the shared request when every caller has left. */
    controller: AbortController;
    /** How many callers wait for the response. */
    waiting: number;
}

/**
 * @summary Lets identical requests sent while one is in flight share its response.
 *
 * @description The first caller starts the request, later callers with the same key join it. Every caller gets
 * its own `response.clone()`, because a body can be read only once. The entry is removed when the response
 * arrives, so this is not a cache: the next request goes to the network again. The shared request has its own
 * `AbortController`: a caller's signal stops only that caller's wait, and the request is aborted when every caller
 * has stopped waiting.
 */
export default class Inflight {
    private readonly entries = new Map<string, Entry>();

    /**
     * @summary The key of a request: its method, URL and headers (names are lowercased and sorted by `Headers`).
     *
     * @param url - The URL of the request.
     * @param init - The settings of the request.
     * @returns The key.
     */
    public static key(url: string, init: RequestInit): string {
        const headers = JSON.stringify([...new Headers(init.headers)]);

        return `${(init.method ?? 'GET').toUpperCase()} ${url} ${headers}`;
    }

    /**
     * @summary Joins the request in flight with this key, or starts it with `start`, and resolves with a copy of
     * its response.
     *
     * @param key - The key from `Inflight.key()`.
     * @param signal - The caller's signal; it stops only this caller's wait.
     * @param start - Sends the request with the signal of the entry.
     * @returns A copy of the shared response.
     */
    public send(
        key: string,
        signal: AbortSignal | null,
        start: (abort: AbortSignal) => Promise<Response>
    ): Promise<Response> {
        if (signal?.aborted) {
            return Promise.reject(Inflight.reason(signal));
        }

        const entry = this.entries.get(key) ?? this.open(key, start);
        entry.waiting += 1;

        return this.wait(key, entry, signal);
    }

    /**
     * @summary Starts the shared request and removes its entry once it settles.
     *
     * @param key - The key of the request.
     * @param start - Sends the request with the signal of the entry.
     * @returns The new entry.
     */
    private open(key: string, start: (abort: AbortSignal) => Promise<Response>): Entry {
        const controller = new AbortController();
        const entry: Entry = { response: start(controller.signal), controller, waiting: 0 };

        void entry.response.then(
            () => this.close(key, entry),
            () => this.close(key, entry)
        );
        this.entries.set(key, entry);

        return entry;
    }

    /**
     * @summary Waits for the shared response; a caller who aborts leaves, and the last one to leave aborts the request.
     *
     * @param key - The key of the request.
     * @param entry - The shared request.
     * @param signal - The caller's signal.
     * @returns A copy of the response.
     */
    private wait(key: string, entry: Entry, signal: AbortSignal | null): Promise<Response> {
        return new Promise<Response>((resolve, reject) => {
            const leave = (): void => {
                entry.waiting -= 1;
                reject(Inflight.reason(signal));

                if (entry.waiting === 0) {
                    this.close(key, entry);
                    entry.controller.abort(Inflight.reason(signal));
                }
            };

            signal?.addEventListener('abort', leave, { once: true });
            entry.response.then(
                (response) => {
                    signal?.removeEventListener('abort', leave);
                    resolve(response.clone());
                },
                // The rejection of the transport: an Error, maybe from another realm
                (error: Error) => {
                    signal?.removeEventListener('abort', leave);
                    reject(error);
                }
            );
        });
    }

    /**
     * @summary Removes the entry, unless a newer request with the same key has replaced it.
     *
     * @param key - The key of the request.
     * @param entry - The entry to remove.
     */
    private close(key: string, entry: Entry): void {
        if (this.entries.get(key) === entry) {
            this.entries.delete(key);
        }
    }

    /**
     * @summary The error an aborted wait rejects with: the reason of the signal, or an `AbortError`.
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
