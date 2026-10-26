/**
 * @summary A single event received from a `text/event-stream` response.
 *
 * @template T - The type of `data`: a string, or what `.json()` of `http.sse()` parses it into.
 */
export interface ServerEvent<T = string> {
    /** Event type from the `event:` field, `message` when the field is absent. */
    event: string;
    /** Every `data:` line of the event joined with `\n`; parsed as JSON after `.json()` of `http.sse()`. */
    data: T;
    /** The last `id:` seen in the stream, empty when the server never sent one. */
    id: string;
    /** Reconnection time in milliseconds from the last `retry:` field, `null` when absent. */
    retry: number | null;
}
