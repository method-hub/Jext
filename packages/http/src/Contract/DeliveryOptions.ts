import type { Retry } from '@Http/Contract/RetryOptions';

/**
 * @summary How a request travels: how long one attempt may take, how failed attempts are repeated and whether
 * identical requests in flight share one.
 */
export interface DeliveryOptions {
    /** The time one attempt may take, in ms; `0` turns the timeout off. */
    timeout?: number;
    /** How many times, and when, a failed request is repeated; `0` turns retries off. */
    retry?: Retry;
    /** Identical GET and HEAD requests sent while one is in flight share its response; `false` turns it off. */
    dedupe?: boolean;
}
