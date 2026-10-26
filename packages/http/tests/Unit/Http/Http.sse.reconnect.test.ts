import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';

/**
 * A body that gives one chunk and then fails, as a connection that drops.
 */
const dropping = (text: string): ReadableStream<Uint8Array> => {
    let pulls = 0;

    return new ReadableStream<Uint8Array>({
        pull(controller) {
            pulls += 1;

            if (pulls === 1) {
                controller.enqueue(new TextEncoder().encode(text));
            } else {
                controller.error(new TypeError('network error'));
            }
        },
    });
};

describe('Http.sse should reconnect with Last-Event-ID and go on with the events', () => {
    let fetch: MockInstance;

    beforeEach(() => {
        fetch = vi
            .spyOn(globalThis, 'fetch')
            .mockResolvedValueOnce(
                new Response(dropping('id: 1\ndata: a\n\n'), { headers: { 'Content-Type': 'text/event-stream' } })
            )
            .mockResolvedValueOnce(
                new Response('id: 2\ndata: b\n\n', { headers: { 'Content-Type': 'text/event-stream' } })
            );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the connection drops after the first event', async () => {
        const http = new Http(new Root<string>().add(new TextParser()));
        const received: string[] = [];

        for await (const event of http.sse('https://api.example.com/events').reconnect({ delay: 0 })) {
            received.push(event.data);
        }

        const [[, first], [, second]] = fetch.mock.calls as Array<[string, RequestInit]>;
        expect(received).toEqual(['a', 'b']);
        expect(new Headers(first.headers).has('Last-Event-ID')).toBe(false);
        expect(new Headers(second.headers).get('Last-Event-ID')).toBe('1');
    });
});
