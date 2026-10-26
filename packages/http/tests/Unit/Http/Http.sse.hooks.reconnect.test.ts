import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
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

describe('Http.sse should run the beforeRequest hook for every connection', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch')
            .mockResolvedValueOnce(
                new Response(dropping('data: a\n\n'), { headers: { 'Content-Type': 'text/event-stream' } })
            )
            .mockResolvedValueOnce(new Response('data: b\n\n', { headers: { 'Content-Type': 'text/event-stream' } }));
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the stream reconnects once', async () => {
        const hook = vi.fn();
        const http = new Http(new Root<string>().add(new TextParser())).extend({ hooks: { beforeRequest: [hook] } });

        for await (const event of http.sse('https://api.example.com/events').reconnect({ delay: 0 })) {
            void event;
        }

        expect(hook).toHaveBeenCalledTimes(2);
    });
});
