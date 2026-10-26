import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';
import type { ServerEvent } from '@Http/Contract/ServerEvent';

describe('Http.sse should end the loop without events and without reconnecting', () => {
    let fetch: MockInstance;

    beforeEach(() => {
        fetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 204 }));
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the server answers 204', async () => {
        const http = new Http(new Root<string>().add(new TextParser()));
        const received: ServerEvent[] = [];

        for await (const event of http.sse('https://api.example.com/events').reconnect({ delay: 0 })) {
            received.push(event);
        }

        expect(received).toEqual([]);
        expect(fetch).toHaveBeenCalledTimes(1);
    });
});
