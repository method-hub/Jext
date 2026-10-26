import type { Retry } from '@Http/Contract/RetryOptions';

const METHODS = ['GET', 'HEAD', 'PUT', 'DELETE', 'OPTIONS'];
const STATUSES = [408, 429, 500, 502, 503, 504];
const DELAY = 300;

/**
 * @summary Decides whether a failed attempt is repeated and how long to wait before the repeat.
 *
 * @description Built per request from `.retry()` and the method. Attempts are counted from 1: with `limit: 2`
 * attempts 1 and 2 may be repeated, attempt 3 is the last one.
 */
export default class RetryPolicy {
    private readonly limit: number;
    private readonly allowed: boolean;
    private readonly statuses: ReadonlyArray<number>;
    private readonly delay: number;

    constructor(retry: Retry | undefined, method: string) {
        const options = typeof retry === 'number' ? { limit: retry } : (retry ?? { limit: 0 });
        const methods = (options.methods ?? METHODS).map((name) => name.toUpperCase());

        this.limit = Math.max(0, options.limit);
        this.allowed = methods.includes(method.toUpperCase());
        this.statuses = options.statuses ?? STATUSES;
        this.delay = options.delay ?? DELAY;
    }

    /**
     * @summary Whether the response of attempt number `attempt` is repeated.
     *
     * @param attempt - The number of the attempt, from 1.
     * @param response - The response of the attempt.
     * @returns `true` when the attempt is repeated.
     */
    public retries(attempt: number, response: Response): boolean {
        return this.allows(attempt) && this.statuses.includes(response.status);
    }

    /**
     * @summary Whether attempt number `attempt`, which got no response, is repeated; a timeout or an abort is not.
     *
     * @param attempt - The number of the attempt, from 1.
     * @param error - What the transport rejected with.
     * @returns `true` when the attempt is repeated.
     */
    public recovers(attempt: number, error: unknown): boolean {
        const name = RetryPolicy.errorName(error);

        return this.allows(attempt) && name !== 'AbortError' && name !== 'TimeoutError';
    }

    /**
     * @summary The wait in ms before repeating attempt number `attempt`: `Retry-After` if the server sent it,
     * otherwise `delay` doubled for each earlier repeat.
     *
     * @param attempt - The number of the attempt, from 1.
     * @param response - The response of the attempt, `null` when it got none.
     * @returns The wait in ms.
     */
    public wait(attempt: number, response: Response | null): number {
        const after = RetryPolicy.after(response?.headers.get('retry-after') ?? null);

        const backoff = 2 ** (attempt - 1);

        return after ?? this.delay * backoff;
    }

    /**
     * @summary Whether the method may be repeated and the attempt is within the limit.
     *
     * @param attempt - The number of the attempt, from 1.
     * @returns `true` when one more attempt is allowed.
     */
    private allows(attempt: number): boolean {
        return this.allowed && attempt <= this.limit;
    }

    /**
     * @summary Reads `Retry-After`: a number of seconds or an HTTP date.
     *
     * @param header - The value of the header, `null` when it is absent.
     * @returns The wait in ms, `null` when the header is absent or invalid.
     */
    private static after(header: string | null): number | null {
        if (header === null || header.trim() === '') {
            return null;
        }

        const seconds = Number(header);

        if (!Number.isNaN(seconds)) {
            return Math.max(0, seconds * 1000);
        }

        const date = Date.parse(header);

        return Number.isNaN(date) ? null : Math.max(0, date - Date.now());
    }

    /**
     * @summary The `name` of an error from any realm: `instanceof` fails for a `DOMException` made by another one.
     *
     * @param error - Anything thrown or rejected.
     * @returns The name, empty when there is none.
     */
    public static errorName(error: unknown): string {
        const name: unknown = typeof error === 'object' && error !== null ? (error as { name?: unknown }).name : null;

        return typeof name === 'string' ? name : '';
    }
}
