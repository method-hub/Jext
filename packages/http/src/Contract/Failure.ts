/**
 * @summary What an `HttpError` knows about the failed request.
 */
export interface Failure<E> {
    /** HTTP status of the response, `0` when no response arrived (network error, abort). */
    status: number;
    /** The response, `null` when no response arrived. Its body has already been read. */
    response: Response | null;
    /** The error response body decoded by the parser chain, `null` when there is none or it could not be read. */
    data: E | null;
    /** The original error: the rejection of `fetch` or the error thrown while reading the body. */
    cause?: unknown;
}
