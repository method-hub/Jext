import type { Failure } from '@Http/Contract/Failure';

/**
 * @summary The error of a request that did not produce data.
 *
 * @description Returned in `Result.error`; only the `for await` of `http.sse()` throws it, because a stream has no
 * result to return. It covers four cases:
 * an error status (4xx, 5xx) with the decoded error body in `data`,
 * a request that got no response (`status` is `0`, `cause` holds the rejection of `fetch`),
 * a successful response whose body could not be read or decoded (`cause` holds that error),
 * and a hook that failed (`cause` holds its error).
 *
 * @template E - The type of the decoded error body.
 *
 * @example
 * const { error } = await http.get('/api/users/42');
 * if (error) {
 *     console.log(error.status, error.message, error.data); // 404 '404 Not Found' { message: 'User not found' }
 * }
 */
export default class HttpError<E = unknown> extends Error {
    /** HTTP status of the response, `0` when no response arrived (network error, timeout, abort). */
    public readonly status: number;
    /** The response, `null` when no response arrived. Its body has already been read. */
    public readonly response: Response | null;
    /** The error response body decoded by the parser chain, `null` when there is none or it could not be read. */
    public readonly data: E | null;
    /** The original error: the rejection of `fetch`, the error thrown while decoding, or the error of a hook. */
    public readonly cause: unknown;

    constructor(message: string, failure: Failure<E>) {
        super(message);
        this.name = 'HttpError';
        this.status = failure.status;
        this.response = failure.response;
        this.data = failure.data;
        this.cause = failure.cause;
    }
}
