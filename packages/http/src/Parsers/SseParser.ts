import type { Decoder } from '@Http/Contract/Decoder';
import type { Data } from '@Http/Contract/Data';
import type { ServerEvent } from '@Http/Contract/ServerEvent';

/**
 * @summary The event being built while its lines arrive.
 */
interface Draft {
    /** The `event:` field, empty until one arrives. */
    event: string;
    /** Every `data:` line of the event. */
    data: string[];
    /** The last `id:` of the stream; it outlives the event. */
    id: string;
    /** The last `retry:` of the stream in ms; it outlives the event. */
    retry: number | null;
}

/**
 * @summary Decoder for Server-Sent Events (`text/event-stream`).
 *
 * @description Returns an async iterable that reads the body as it arrives and yields one `ServerEvent`
 * per blank-line-terminated block, following the WHATWG event stream format. Iterate it with `for await`.
 */
export default class SseParser implements Decoder<AsyncIterable<ServerEvent>> {
    /**
     * @summary Accepts `text/event-stream`.
     *
     * @param data - The response with its Content-Type and Content-Disposition already read.
     * @returns `true` when this decoder handles the response.
     */
    public parse({ contentType }: Data): boolean {
        return contentType.startsWith('text/event-stream');
    }

    /**
     * @summary Starts reading the body as events; nothing is read until the iterable is iterated.
     *
     * @param response - The accepted response.
     * @returns The events of the stream, read with `for await`.
     */
    public wrap(response: Response): Promise<AsyncIterable<ServerEvent>> {
        return Promise.resolve(this.events(response.body));
    }

    /**
     * @summary Groups the lines into events: an empty line ends an event.
     *
     * @param body - The body of the response.
     * @returns The events of the stream.
     */
    private async *events(body: ReadableStream<Uint8Array> | null): AsyncGenerator<ServerEvent, void, undefined> {
        const draft: Draft = { event: '', data: [], id: '', retry: null };

        for await (const line of this.lines(body)) {
            if (line !== '') {
                this.apply(draft, line);
                continue;
            }

            const event = this.dispatch(draft);

            if (event) {
                yield event;
            }
        }
    }

    /**
     * @summary Reads the body as it arrives and yields its complete lines.
     *
     * @description Yields complete lines only. A line without a terminator at the end of the stream belongs to an
     * unfinished event, which the format says to discard, so it is never yielded.
     *
     * @param body - The body of the response, `null` when it has none.
     * @returns The lines without their terminators.
     */
    private async *lines(body: ReadableStream<Uint8Array> | null): AsyncGenerator<string, void, undefined> {
        if (body === null) {
            return;
        }

        const reader = body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let done = false;

        while (!done) {
            const chunk = await reader.read();

            ({ done } = chunk);
            // Until the stream ends, a trailing \r stays in the buffer: its \n may arrive in the next chunk.
            const breaks = done ? /\r\n|\r|\n/ : /\r\n|\r(?!$)|\n/;
            const lines = (buffer + decoder.decode(chunk.value, { stream: !done })).split(breaks);

            buffer = lines.pop();
            yield* lines;
        }
    }

    /**
     * @summary Applies one `field: value` line to the event being built; unknown fields are ignored.
     *
     * @param draft - The event being built.
     * @param line - A non-empty line of the stream.
     */
    private apply(draft: Draft, line: string): void {
        const colon = line.indexOf(':');
        const field = colon === -1 ? line : line.slice(0, colon);
        const value = colon === -1 ? '' : line.slice(colon + 1).replace(/^ /, '');

        if (field === 'event') {
            draft.event = value;
        } else if (field === 'data') {
            draft.data.push(value);
        } else if (field === 'id' && !value.includes('\0')) {
            draft.id = value;
        } else if (field === 'retry' && /^\d+$/.test(value)) {
            draft.retry = Number(value);
        }
    }

    /**
     * @summary Ends the event being built and resets its `event` and `data`.
     *
     * @param draft - The event being built.
     * @returns The event, or `null` when it has no `data:` line.
     */
    private dispatch(draft: Draft): ServerEvent | null {
        const event = {
            event: draft.event || 'message',
            data: draft.data.join('\n'),
            id: draft.id,
            retry: draft.retry,
        };
        const hasData = draft.data.length > 0;

        draft.event = '';
        draft.data = [];

        return hasData ? event : null;
    }
}
