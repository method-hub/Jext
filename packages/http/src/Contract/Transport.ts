/**
 * @summary What sends one attempt of a request and resolves with its `Response`: `fetch` or `XMLHttpRequest`.
 *
 * @description Internal: `Delivery` picks the transport for each request. A transport resolves with the response
 * whatever its status and rejects only when there is no response (a network error, an abort, a timeout).
 */
export interface Transport {
    /**
     * @summary Sends one attempt of the request.
     *
     * @param url - The resource URL or a `Request`.
     * @param init - The settings of the request; its signal aborts the attempt.
     * @returns The response, whatever its status.
     */
    send(url: string | Request, init: RequestInit): Promise<Response>;
}
