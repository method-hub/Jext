/**
 * @summary A request as hooks see it: the URL (or the `Request` given to `send()`) and its `RequestInit`.
 */
export interface Outgoing {
    /** The URL after `baseUrl` and the query were applied, or the `Request` given to `send()`. */
    readonly url: string | Request;
    /** Method, headers, body and the other settings of the request. */
    readonly init: RequestInit;
}

/**
 * @summary Called before a request is sent; returns a changed request, or nothing to keep it as it is.
 */
export type BeforeRequest = (request: Outgoing) => Outgoing | undefined | Promise<Outgoing | undefined>;

/**
 * @summary Called with the response before it is decoded; returns another response, or nothing to keep it.
 */
export type AfterResponse = (
    response: Response,
    request: Outgoing
) => Response | undefined | Promise<Response | undefined>;

/**
 * @summary Functions a client calls around every request: `http.extend({ hooks: { beforeRequest: [sign] } })`.
 *
 * @description Hooks run in the order given, each one gets what the one before returned. `beforeRequest` runs
 * once per request (not per retry) and once per connection of `http.sse()`; `afterResponse` gets the last response
 * after retries. A hook that throws ends the request with an `HttpError`.
 */
export interface Hooks {
    /** Called before the request is sent, for example to add a header with a fresh token. */
    beforeRequest?: ReadonlyArray<BeforeRequest>;
    /** Called with the response before it is decoded, for example to log it or to replace it. */
    afterResponse?: ReadonlyArray<AfterResponse>;
}
