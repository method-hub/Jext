import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';
import type { ServerEvent } from '@Http/Contract/ServerEvent';

describe('Http.sse should yield the events of the stream', () => {
    let fetch: MockInstance;

    beforeEach(() => {
        fetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response('id: 1\ndata: a\n\nevent: done\ndata: b\n\n', {
                headers: { 'Content-Type': 'text/event-stream' },
            })
        );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the server sends two events and ends the stream', async () => {
        const http = new Http(new Root<string>().add(new TextParser()));
        const received: ServerEvent[] = [];

        for await (const event of http.sse('https://api.example.com/events')) {
            received.push(event);
        }

        expect(received).toEqual([
            { event: 'message', data: 'a', id: '1', retry: null },
            { event: 'done', data: 'b', id: '1', retry: null },
        ]);
        expect(fetch).toHaveBeenCalledTimes(1);
    });
});
