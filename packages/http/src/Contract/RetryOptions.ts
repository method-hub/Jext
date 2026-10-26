/**
 * @summary How a failed request is repeated: `.retry(2)` or `.retry({ limit: 2, statuses: [503] })`.
 *
 * @description A request is repeated only for an allowed method and only when the response has an allowed status
 * or no response came at all (a network error). A timeout or an abort is never repeated.
 */
export interface RetryOptions {
    /** How many times to repeat the request after the first attempt; `0` turns retries off. */
    limit: number;
    /** The methods that may be repeated. Default: GET, HEAD, PUT, DELETE, OPTIONS (POST and PATCH are not idempotent). */
    methods?: ReadonlyArray<string>;
    /** The statuses that are repeated. Default: 408, 429, 500, 502, 503, 504. */
    statuses?: ReadonlyArray<number>;
    /** The wait before the first repeat in ms, doubled before each next one. Default: 300. `Retry-After` wins. */
    delay?: number;
}

/**
 * @summary What `.retry()` and the `retry` option accept: a number of repeats or the full options.
 */
export type Retry = number | RetryOptions;
