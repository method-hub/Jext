import type { ServerEvent } from '@Http/Contract/ServerEvent';
import type { Reconnect } from '@Http/Contract/Reconnect';

/**
 * @summary How a stream of server events is read: whether to reconnect and whether `data` is JSON.
 */
export interface StreamSettings {
    /** How a dropped connection is opened again; `0` turns reconnects off. */
    reconnect?: Reconnect;
    /** Parse `data` of every event as JSON. */
    json?: boolean;
}

/**
 * @summary Whatever opens a stream of server events: `Http` in production, a stub in tests.
 */
export interface Streamer {
    /**
     * @summary Opens a stream of server events and yields them one by one.
     *
     * @param url - The resource URL.
     * @param init - The request; its signal closes the stream.
     * @param settings - How to reconnect and whether `data` is JSON.
     * @returns The events of the stream, read with `for await`.
     */
    stream<T = string>(url: string, init: RequestInit, settings?: StreamSettings): AsyncIterable<ServerEvent<T>>;
}
