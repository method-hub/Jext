import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';

describe('Http.sse should connect again', () => {
    let fetch: MockInstance;

    beforeEach(() => {
        fetch = vi
            .spyOn(globalThis, 'fetch')
            .mockRejectedValueOnce(new TypeError('Failed to fetch'))
            .mockResolvedValueOnce(new Response('data: a\n\n', { headers: { 'Content-Type': 'text/event-stream' } }));
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the first connection cannot be made', async () => {
        const http = new Http(new Root<string>().add(new TextParser()));
        const received: string[] = [];

        for await (const event of http.sse('https://api.example.com/events').reconnect({ delay: 0 })) {
            received.push(event.data);
        }

        expect(received).toEqual(['a']);
        expect(fetch).toHaveBeenCalledTimes(2);
    });
});
