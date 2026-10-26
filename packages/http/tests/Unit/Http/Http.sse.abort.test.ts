import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';

describe('Http.sse should end the loop without an error', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockImplementation((_url, init) => {
            const body = new ReadableStream<Uint8Array>({
                start(controller) {
                    controller.enqueue(new TextEncoder().encode('data: a\n\n'));
                    init?.signal?.addEventListener('abort', () => controller.error(init.signal?.reason));
                },
            });

            return Promise.resolve(new Response(body, { headers: { 'Content-Type': 'text/event-stream' } }));
        });
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the signal aborts while the stream is open, even with reconnect', async () => {
        const http = new Http(new Root<string>().add(new TextParser()));
        const controller = new AbortController();
        const received: string[] = [];

        for await (const event of http.sse('https://api.example.com/events').signal(controller.signal).reconnect()) {
            received.push(event.data);
            controller.abort();
        }

        expect(received).toEqual(['a']);
    });
});
