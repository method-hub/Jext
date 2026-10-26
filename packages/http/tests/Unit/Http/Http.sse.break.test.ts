import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';

describe('Http.sse should abort the connection', () => {
    let fetch: MockInstance;

    beforeEach(() => {
        fetch = vi
            .spyOn(globalThis, 'fetch')
            .mockResolvedValue(
                new Response('data: a\n\ndata: b\n\n', { headers: { 'Content-Type': 'text/event-stream' } })
            );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the loop breaks after the first event', async () => {
        const http = new Http(new Root<string>().add(new TextParser()));
        const received: string[] = [];

        for await (const event of http.sse('https://api.example.com/events')) {
            received.push(event.data);
            break;
        }

        const [[, init]] = fetch.mock.calls as Array<[string, RequestInit]>;
        expect(received).toEqual(['a']);
        expect(init.signal?.aborted).toBe(true);
    });
});
