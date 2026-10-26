import type { Result } from '@Http/Contract/Result';
import type { SendOptions } from '@Http/Contract/SendOptions';

/**
 * @summary Whatever sends a prepared request and returns its result: `Http` in production, a stub in tests.
 */
export interface Sender {
    /**
     * @summary Sends the request and returns its decoded result; never throws.
     *
     * @param url - The resource URL.
     * @param init - Method, headers, body and the other settings of the request.
     * @param options - A format, a schema, a timeout, retries and progress listeners.
     * @returns The decoded data or the error.
     */
    send<T, E = unknown>(url: string, init: RequestInit, options?: SendOptions): Promise<Result<T, E>>;
}
